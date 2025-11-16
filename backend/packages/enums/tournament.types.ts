// Tournament Types
export enum TournamentStatus {
  PLANNING = '1',
  REGISTRATION_OPEN = '2',
  REGISTRATION_CLOSED = '3',
  IN_PROGRESS = '4',
  COMPLETED = '5',
  CANCELLED = '6'
}

export enum ParticipantStatus {
  REGISTERED = '1',
  CONFIRMED = '2',
  PAID = '3',
  WITHDRAWN = '4',
  DISQUALIFIED = '5'
}

export interface Tournament {
  id: string;
  clubId: string;
  organizerId: string;
  name: string;
  description?: string;
  sportType: string;
  startDate: Date;
  endDate: Date;
  registrationStart: Date;
  registrationEnd: Date;
  maxParticipants?: number;
  entryFee?: number;
  status: TournamentStatus;
  rules?: string;
  prizes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  
  // Relations
  club?: ClubResponseDto;
  organizer?: UserResponseDto;
  bookings?: BookingResponseDto[];
  participants?: TournamentParticipant[];
}

export interface TournamentParticipant {
  id: string;
  tournamentId: string;
  userId: string;
  registeredAt: Date;
  status: ParticipantStatus;
  
  // Relations
  tournament?: Tournament;
  user?: UserResponseDto;
}

export interface CreateTournamentDto {
  clubId: string;
  organizerId: string;
  name: string;
  description?: string;
  sportType: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  registrationStart: string; // ISO date string
  registrationEnd: string; // ISO date string
  maxParticipants?: number;
  entryFee?: number;
  rules?: string;
  prizes?: string;
}

export interface UpdateTournamentDto {
  name?: string;
  description?: string;
  sportType?: string;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  registrationStart?: string; // ISO date string
  registrationEnd?: string; // ISO date string
  maxParticipants?: number;
  entryFee?: number;
  status?: TournamentStatus;
  rules?: string;
  prizes?: string;
  isActive?: boolean;
}

export interface RegisterParticipantDto {
  userId: string;
}

export interface UpdateParticipantStatusDto {
  status: ParticipantStatus;
}

// Import types from other modules
import { ClubResponseDto } from '../../src/entities/club/club.model';
import { UserResponseDto } from '../../src/entities/user/user.model';
import { BookingResponseDto } from '../../src/entities/booking/booking.model';
