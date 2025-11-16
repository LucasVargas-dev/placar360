// UserClub Types - Flexible relationship between Users and Clubs
export enum UserClubRelationshipType {
  OWNER = '1',
  TEACHER = '2',
  STAFF = '3',
  MEMBER = '4'
}

export interface UserClub {
  id: string;
  userId: string;
  clubId: string;
  relationshipType: UserClubRelationshipType;
  // Teacher-specific fields (only applicable when relationshipType = TEACHER)
  specialties: string[];
  hourlyRate?: number;
  bio?: string;
  experience?: string;
  certifications?: string;
  // General fields
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  
  // Relations
  user?: UserResponseDto;
  club?: ClubResponseDto;
}

export interface CreateUserClubDto {
  userId: string;
  clubId: string;
  relationshipType: UserClubRelationshipType;
  // Teacher-specific fields (optional, only for TEACHER relationship)
  specialties?: string[];
  hourlyRate?: number;
  bio?: string;
  experience?: string;
  certifications?: string;
}

export interface UpdateUserClubDto {
  relationshipType?: UserClubRelationshipType;
  specialties?: string[];
  hourlyRate?: number;
  bio?: string;
  experience?: string;
  certifications?: string;
  isActive?: boolean;
}

export interface TeacherAvailability {
  teacherId: string; // User ID with Teacher relationship in UserClub
  clubId: string;
  availableSlots: {
    date: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }[];
}

// Helper types for different user-club relationships
export interface TeacherInfo {
  user: UserResponseDto;
  userClubs: UserClub[]; // Filter for TEACHER relationship
}

export interface ClubOwnerInfo {
  user: UserResponseDto;
  userClubs: UserClub[]; // Filter for OWNER relationship
}

export interface ClubStaffInfo {
  user: UserResponseDto;
  userClubs: UserClub[]; // Filter for STAFF relationship
}

// Import types from other modules
import { UserResponseDto } from '../../src/entities/user/user.model';
import { ClubResponseDto } from '../../src/entities/club/club.model';
