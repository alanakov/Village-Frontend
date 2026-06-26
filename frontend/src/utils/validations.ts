import { z } from 'zod'

const PASSWORD_RULES = z
  .string()
  .min(8, 'A senha deve ter no mínimo 8 caracteres')
  .regex(/[A-Z]/, 'A senha deve possuir ao menos uma letra maiúscula')
  .regex(/[a-z]/, 'A senha deve possuir ao menos uma letra minúscula')
  .regex(/[0-9]/, 'A senha deve possuir ao menos um número')
  .regex(
    /[@#$%&*°?]/,
    'A senha deve possuir ao menos um caractere especial (@, #, $, %, &, *, °, ?)'
  )

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .max(100, 'Email muito longo'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .max(64, 'Senha muito longa'),
})
export type LoginFormData = z.infer<typeof loginSchema>

export const createAdminSchema = z
  .object({
    name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
    email: z
      .string()
      .min(1, 'Email é obrigatório')
      .email('Email inválido')
      .max(100, 'Email muito longo'),
    phone: z
      .string()
      .min(1, 'Telefone é obrigatório')
      .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido. Use o formato (XX) XXXXX-XXXX'),
    password: PASSWORD_RULES,
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  })
export type CreateAdminFormData = z.infer<typeof createAdminSchema>

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .max(100, 'Email muito longo'),
})
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email é obrigatório')
      .email('Email inválido')
      .max(100, 'Email muito longo'),
    recoveryCode: z
      .string()
      .length(6, 'O código deve ter exatamente 6 dígitos')
      .regex(/^\d{6}$/, 'O código deve conter apenas números'),
    newPassword: PASSWORD_RULES,
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  })
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export const categorySchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter ao menos 3 caracteres')
    .max(50),
})
export type CategoryFormData = z.infer<typeof categorySchema>

export const productUploadSchema = z.object({
  name:        z.string().min(1, 'Nome é obrigatório').max(100),
  description: z.string().min(1, 'Descrição é obrigatória').max(500),
  price:       z.number().positive('Preço deve ser maior que zero'),
  size:        z.string().max(20).default(''),
  categoryId:  z.number().int().positive('Selecione uma categoria'),
})
export type ProductUploadFormData = z.infer<typeof productUploadSchema>
export type ProductUploadFormInput = z.input<typeof productUploadSchema>

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter ao menos 2 caracteres')
    .max(100, 'Nome muito longo'),
  phone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido. Use o formato (XX) XXXXX-XXXX'),
})
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
