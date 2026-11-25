import { z } from 'zod'

export const createAdminUserSchema = z.object({
    name: z.string().trim().min(1).max(50),
    email: z.email(),
    password: z.string().trim().min(1).max(100),
    role_id: z.number().max(6),
    status: z.enum(['Active', 'Inactive'])
})