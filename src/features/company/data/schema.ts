// We're keeping a simple non-relational schema here.
import z from 'zod'

// IRL, you will have a schema for your data models.
export const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  owner_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type Company = z.infer<typeof companySchema>

export const companyFormCreateSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
})

export type CompanyCreateForm = z.infer<typeof companyFormCreateSchema>

// Nuevo: esquema para actualización (sólo campos editables)
export const companyFormUpdateSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  // incluye solo los campos que el usuario puede cambiar
})

export type CompanyUpdateForm = z.infer<typeof companyFormUpdateSchema>
