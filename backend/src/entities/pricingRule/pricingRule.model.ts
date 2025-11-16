import { z } from 'zod';

// Create Pricing Rule Schema
export const CreatePricingRuleSchema = z.object({
  createdBy: z.string().optional(),
  clubId: z.string(),
  courtId: z.string().optional(),
  name: z.string(),
  dayOfWeek: z.number().int(), // 1=MONDAY, 2=TUESDAY, ..., 7=SUNDAY
  startTime: z.number().int(), // Minutes from midnight
  endTime: z.number().int(), // Minutes from midnight
  price: z.number().positive(),
  isActive: z.boolean().optional(),
});

export const UpdatePricingRuleSchema = z.object({
  courtId: z.string().optional(),
  name: z.string().optional(),
  dayOfWeek: z.number().int().optional(),
  startTime: z.number().int().optional(),
  endTime: z.number().int().optional(),
  price: z.number().positive().optional(),
  isActive: z.boolean().optional(),
});

export const PricingRuleResponseSchema = z.object({
  id: z.string(),
  clubId: z.string(),
  courtId: z.string().nullable(),
  name: z.string(),
  dayOfWeek: z.number(),
  startTime: z.number(),
  endTime: z.number(),
  price: z.number(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  club: z.object({
    id: z.string(),
    name: z.string(),
  }).optional(),
  court: z.object({
    id: z.string(),
    name: z.string(),
    sportType: z.string(),
  }).nullable().optional(),
});

// Types
export type CreatePricingRuleDto = z.infer<typeof CreatePricingRuleSchema> & Partial<{ price: any }>;
export type UpdatePricingRuleDto = z.infer<typeof UpdatePricingRuleSchema> & Partial<{ price: any }>;
export type PricingRuleResponseDto = z.infer<typeof PricingRuleResponseSchema>;
