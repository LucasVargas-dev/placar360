-- Schema
CREATE DATABASE IF NOT EXISTS gripo2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gripo2;

-- USERS
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(120) NOT NULL,
  code VARCHAR(45),
  email VARCHAR(255) NOT NULL UNIQUE,
  cpf VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'player',
  phone VARCHAR(32),
  avatar_url TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- CLUBS
CREATE TABLE clubs (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  created_by CHAR(36),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255),
  address TEXT,
  phone VARCHAR(32),
  timezone VARCHAR(64) DEFAULT 'UTC',
  open_time TIME,
  close_time TIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_club_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ASSOCIATIVE: club_users (permissões por clube)
CREATE TABLE club_users (
  club_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'manager', -- owner, admin, manager, staff
  added_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (club_id, user_id),
  CONSTRAINT fk_club_users_club FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
  CONSTRAINT fk_club_users_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- COURTS (quadras)
CREATE TABLE courts (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  club_id CHAR(36) NOT NULL,
  name VARCHAR(120) NOT NULL,
  court_type VARCHAR(50),
  default_slot_minutes INT NOT NULL DEFAULT 60,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_court_club FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- TOURNAMENTS
CREATE TABLE tournaments (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  organizer_id CHAR(36),
  club_id CHAR(36),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(255),
  start_date DATE,
  end_date DATE,
  max_participants INT,
  entry_fee_amount DECIMAL(10,2),
  currency VARCHAR(8) DEFAULT 'BRL',
  status VARCHAR(32) NOT NULL DEFAULT 'draft',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tournament_organizer FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_tournament_club FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_tournaments_status ON tournaments(status);

-- TEAMS (duplas)
CREATE TABLE teams (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(200),
  created_by CHAR(36),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_team_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- TEAM_MEMBERS
CREATE TABLE team_members (
  team_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  role VARCHAR(32) DEFAULT 'player',
  PRIMARY KEY (team_id, user_id),
  CONSTRAINT fk_tm_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  CONSTRAINT fk_tm_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- REGISTRATIONS (inscrições)
CREATE TABLE registrations (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  tournament_id CHAR(36) NOT NULL,
  user_id CHAR(36),
  team_id CHAR(36),
  registered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
  payment_status VARCHAR(32) DEFAULT 'not_required',
  metadata JSON,
  CONSTRAINT fk_reg_tournament FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
  CONSTRAINT fk_reg_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_reg_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Para evitar duplicidades: índices únicos parciais não são triviais em MySQL,
-- a lógica de "único por (tournament,user) ou (tournament,team)" fica na aplicação.
CREATE INDEX idx_reg_tourn_user ON registrations(tournament_id, user_id);
CREATE INDEX idx_reg_tourn_team ON registrations(tournament_id, team_id);

-- MATCHES (partidas)
CREATE TABLE matches (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  tournament_id CHAR(36) NOT NULL,
  stage VARCHAR(64),
  round INT,
  match_number INT,
  team_a_id CHAR(36),
  team_b_id CHAR(36),
  scheduled_at DATETIME,
  estimated_duration_minutes INT DEFAULT 60,
  court_id CHAR(36),
  status VARCHAR(32) NOT NULL DEFAULT 'scheduled',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_match_tournament FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
  CONSTRAINT fk_match_team_a FOREIGN KEY (team_a_id) REFERENCES teams(id) ON DELETE SET NULL,
  CONSTRAINT fk_match_team_b FOREIGN KEY (team_b_id) REFERENCES teams(id) ON DELETE SET NULL,
  CONSTRAINT fk_match_court FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_matches_tournament_sched ON matches(tournament_id, scheduled_at);

-- MATCH_RESULTS
CREATE TABLE match_results (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  match_id CHAR(36) NOT NULL,
  winner_team_id CHAR(36),
  score_text VARCHAR(255),
  score_json JSON,
  reported_by CHAR(36),
  confirmed_by CHAR(36),
  confirmed_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_mr_match FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  CONSTRAINT fk_mr_winner FOREIGN KEY (winner_team_id) REFERENCES teams(id) ON DELETE SET NULL,
  CONSTRAINT fk_mr_reported_by FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_mr_confirmed_by FOREIGN KEY (confirmed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- RESERVATIONS (reservas avulsas)
CREATE TABLE reservations (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  court_id CHAR(36) NOT NULL,
  user_id CHAR(36),
  start_at DATETIME NOT NULL,
  end_at DATETIME NOT NULL,
  tournament_id CHAR(36),
  match_id CHAR(36),
  status VARCHAR(32) DEFAULT 'confirmed',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_res_court FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE,
  CONSTRAINT fk_res_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_res_tournament FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE SET NULL,
  CONSTRAINT fk_res_match FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_res_court_period ON reservations(court_id, start_at, end_at);

-- NOTIFICATIONS
CREATE TABLE notifications (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36),
  type VARCHAR(64),
  payload JSON,
  seen TINYINT(1) DEFAULT 0,
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notf_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
