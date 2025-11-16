import { z } from 'zod';

// Create Booking Schema
export const CreateBookingSchema = z.object({
  createdBy: z.string().optional(),
  courtId: z.string(),
  userId: z.string(),
  type: z.string(), // 1=REGULAR, 2=TOURNAMENT, 3=LESSON, 4=MAINTENANCE, 5=BLOCKED
  startTime: z.date(),
  endTime: z.date(),
  status: z.string(), // 1=PENDING, 2=CONFIRMED, 3=CANCELLED, 4=COMPLETED, 5=NO_SHOW
  totalAmount: z.number().optional(),
  recurringPattern: z.number().int().optional(), // 1=NONE, 2=DAILY, 3=WEEKLY, 4=MONTHLY
  recurringEndDate: z.date().optional(),
  blockoutReason: z.string().optional(),
  notes: z.string().optional(),
  tournamentId: z.string().optional(),
  teacherId: z.string().optional(),
});

export const UpdateBookingSchema = z.object({
  type: z.string().optional(),
  startTime: z.date().optional(),
  endTime: z.date().optional(),
  status: z.string().optional(),
  totalAmount: z.number().optional(),
  recurringPattern: z.number().int().optional(),
  recurringEndDate: z.date().optional(),
  blockoutReason: z.string().optional(),
  notes: z.string().optional(),
});

export const BookingResponseSchema = z.object({
  id: z.string(),
  courtId: z.string(),
  userId: z.string(),
  type: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  status: z.string(),
  totalAmount: z.number().nullable(),
  recurringPattern: z.number().nullable(),
  recurringEndDate: z.date().nullable(),
  blockoutReason: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  court: z.object({
    id: z.string(),
    name: z.string(),
    sportType: z.string(),
  }).optional(),
  user: z.object({
    id: z.string(),
    email: z.string(),
  }).optional(),
});

// Types
export type CreateBookingDto = z.infer<typeof CreateBookingSchema> & Partial<{ totalAmount: any }>;
export type UpdateBookingDto = z.infer<typeof UpdateBookingSchema> & Partial<{ totalAmount: any }>;
export type BookingResponseDto = z.infer<typeof BookingResponseSchema>;
