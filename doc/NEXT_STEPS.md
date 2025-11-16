# Próximos Passos - Placar360 Frontend

## 📋 Estrutura Atual Explicada

### 1. **Componentes Base** (`src/components/`)
```
components/
├── Logo.tsx              # Componente do logotipo reutilizável
└── ProtectedRoute.tsx     # Wrapper para proteger rotas (requer login)
```

**Logo.tsx:**
- Componente simples que renderiza a imagem do logo
- Aceita props `size` (small, medium, large) e `className`
- Usado no Header e pode ser usado em qualquer lugar

**ProtectedRoute.tsx:**
- Verifica se o usuário está autenticado
- Redireciona para `/login` se não estiver logado
- Mostra loading enquanto verifica autenticação

---

### 2. **Navegação** (`src/navigation/`)
```
navigation/
└── Header.tsx            # Header principal da aplicação
```

**Header.tsx - Estrutura:**
- **Left Section:** Logo + nome "Placar360"
- **Center Section:** Menu de navegação (Torneios, Clubes, Agenda, Sobre)
- **Right Section:** 
  - Se não logado: Botão "Entrar"
  - Se logado: Ícone de notificações + Menu do usuário + Nome do usuário

**Features:**
- Responsivo (menu mobile com hamburger)
- Dropdowns para notificações e menu do usuário
- Click outside para fechar dropdowns
- Estados diferentes para usuário logado/não logado

---

### 3. **Páginas** (`src/pages/`)
```
pages/
├── Home.tsx             # Página inicial pública (nova!)
├── Login.tsx            # Página de login (existente - precisa adaptar)
├── Register.tsx         # Página de registro (existente - precisa adaptar)
├── Dashboard.tsx        # Dashboard do usuário (protegida)
├── UserAccount.tsx      # Conta do usuário (protegida)
└── Bookings.tsx         # Reservas (protegida)
```

**Home.tsx:**
- **Pública** - não requer login
- Seções:
  1. Hero Section (título + CTA buttons)
  2. Features Section (cards com funcionalidades)
  3. CTA Section (chamada para ação final)
  4. Footer

---

### 4. **Estrutura de Módulos** (`src/modules/`)
```
modules/
└── Club/
    ├── ClubPage.tsx          # Página principal do módulo
    └── components/
        ├── ClubHeader.tsx    # Header específico do módulo
        ├── ClubList.tsx      # Lista de clubes
        └── form/
            └── ClubFormTab.tsx  # Formulário de criação/edição
```

**Padrão Luthien:**
- Cada módulo tem sua própria pasta
- Páginas principais e componentes organizados por feature
- Facilita manutenção e escalabilidade

---

### 5. **Outras Pastas Importantes**

```
src/
├── contexts/
│   └── AuthContext.tsx       # Contexto de autenticação global
├── entities/
│   └── Club/                 # Schemas e services (padrão Luthien)
│       ├── Club.ts           # Tipo/Interface
│       ├── club.service.ts   # Service para API calls
│       └── clubSchema.ts     # Validação Zod
├── services/
│   └── api.ts                # Configuração do Axios
├── interfaces/               # Tipos compartilhados
├── utils/                    # Funções utilitárias
└── assets/                   # Imagens, logos, etc.
```

---

## 🎯 Próximos Passos (Priorizados)

### Fase 1: Autenticação (Alta Prioridade) ⚠️
**Objetivo:** Adaptar Login/Register seguindo padrão Luthien

- [ ] **1.1 Criar estrutura de Authentication**
  ```
  src/pages/Authentication/
  ├── components/
  │   ├── AuthenticatePage.tsx    # Wrapper principal (switch Login/Register)
  │   ├── Login.tsx               # Formulário de login
  │   └── Register.tsx           # Formulário de registro
  ├── auth.service.ts             # Service para chamadas de auth
  ├── Auth.ts                     # Tipos/interfaces
  └── authSchema.ts               # Schemas Zod para validação
  ```

- [ ] **1.2 Adaptar Login.tsx**
  - Usar react-hook-form + zod
  - Integrar com componentes do @packages/components
  - Melhorar UX (show/hide password, loading states)

- [ ] **1.3 Adaptar Register.tsx**
  - Mesmo padrão do Login
  - Validações de formulário
  - Feedback visual de erros

- [ ] **1.4 Criar AuthenticatePage.tsx**
  - Animação de transição entre Login/Register
  - Design moderno similar ao Luthien

---

### Fase 2: Rotas e Navegação (Alta Prioridade) 🧭
**Objetivo:** Organizar rotas seguindo padrão Luthien

- [ ] **2.1 Criar estrutura de rotas**
  ```
  src/navigation/
  ├── routes.tsx              # Configuração principal de rotas
  ├── RequirePermission.tsx   # Wrapper para permissões (futuro)
  └── sidebarItems.tsx        # Items para sidebar (quando necessário)
  ```

- [ ] **2.2 Criar rotas protegidas**
  - Dashboard
  - Account
  - Clubs (já existe, integrar)
  - Tournaments (criar)
  - Schedule/Agenda (criar)

- [ ] **2.3 Criar rotas públicas**
  - Home (✓ já criada)
  - About (criar)
  - Tournament listing público (criar)

---

### Fase 3: Módulos Principais (Alta Prioridade) 🏆
**Objetivo:** Criar módulos seguindo padrão Luthien

- [ ] **3.1 Módulo Tournament**
  ```
  src/modules/Tournament/
  ├── pages/
  │   ├── TournamentPage.tsx      # Listagem de torneios
  │   ├── TournamentDetailPage.tsx # Detalhes de um torneio
  │   └── CreateTournamentPage.tsx # Criar torneio
  ├── components/
  │   ├── TournamentList.tsx
  │   ├── TournamentCard.tsx
  │   ├── TournamentHeader.tsx
  │   └── forms/
  │       └── TournamentForm.tsx
  └── tournament.service.ts
  ```

- [ ] **3.2 Módulo Schedule/Agenda**
  ```
  src/modules/Schedule/
  ├── pages/
  │   └── SchedulePage.tsx        # Agenda do jogador
  ├── components/
  │   ├── ScheduleCalendar.tsx
  │   ├── GameCard.tsx
  │   └── ScheduleList.tsx
  └── schedule.service.ts
  ```

- [ ] **3.3 Melhorar Módulo Club**
  - Integrar com Header navigation
  - Adicionar mais funcionalidades

---

### Fase 4: Componentes Compartilhados (Média Prioridade) 🧩
**Objetivo:** Organizar componentes em packages seguindo Luthien

- [ ] **4.1 Verificar packages/components**
  - Já temos componentes no `packages/components/`
  - Validar se estão sendo usados corretamente
  - Criar novos componentes conforme necessário

- [ ] **4.2 Componentes essenciais para criar:**
  - TournamentCard
  - GameCard
  - NotificationBadge
  - UserAvatar
  - LoadingSpinner

---

### Fase 5: Integração e Melhorias (Média Prioridade) ✨
**Objetivo:** Melhorar UX e funcionalidades

- [ ] **5.1 Notificações**
  - Implementar sistema de notificações real
  - Integrar com backend
  - Badge de contagem não lidas

- [ ] **5.2 Dashboard**
  - Cards de estatísticas
  - Gráficos de participações
  - Próximos jogos
  - Torneios recentes

- [ ] **5.3 Responsividade**
  - Testar em mobile
  - Ajustar breakpoints
  - Melhorar menu mobile

---

### Fase 6: Features Avançadas (Baixa Prioridade) 🚀
**Objetivo:** Funcionalidades extras

- [ ] **6.1 Bracket/Chaveamento**
  - Visualização de chaves
  - Drag and drop para ajustes
  - Progresso visual

- [ ] **6.2 Exportação**
  - CSV de participantes
  - PDF de resultados
  - Compartilhamento social

- [ ] **6.3 Análises**
  - Estatísticas de torneios
  - Histórico de jogos
  - Rankings

---

## 📝 Checklist Rápido

### Urgente (Esta Semana)
- [ ] Adaptar Login/Register (Fase 1)
- [ ] Criar estrutura de rotas (Fase 2.1)
- [ ] Criar módulo Tournament básico (Fase 3.1)

### Importante (Próximas 2 Semanas)
- [ ] Módulo Schedule/Agenda (Fase 3.2)
- [ ] Dashboard melhorado (Fase 5.2)
- [ ] Sistema de notificações (Fase 5.1)

### Futuro
- [ ] Features avançadas (Fase 6)
- [ ] Otimizações e melhorias de performance

---

## 🎨 Padrões a Seguir (Baseado em Luthien)

1. **Estrutura de Arquivos:**
   - Módulos em `src/modules/`
   - Páginas públicas em `src/pages/`
   - Componentes compartilhados em `packages/components/`
   - Entities (tipos + services) em `src/entities/`

2. **Nomenclatura:**
   - Componentes: PascalCase (ex: `TournamentCard.tsx`)
   - Services: camelCase (ex: `tournament.service.ts`)
   - Types/Interfaces: PascalCase (ex: `Tournament.ts`)

3. **Validação:**
   - Usar Zod para schemas
   - react-hook-form para formulários
   - Validação no frontend E backend

4. **Estilização:**
   - Tailwind CSS para utilitários
   - Componentes reutilizáveis no packages/components
   - Design system consistente

---

## 💡 Dicas

- Sempre seguir o padrão Luthien quando possível
- Reutilizar componentes do `packages/components`
- Manter tipagem forte com TypeScript
- Testar responsividade desde o início
- Documentar componentes complexos

