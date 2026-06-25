import { z } from 'zod'

// ── Login ─────────────────────────────────────────────────────────────────────

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

// ── Admin / Cadastro ──────────────────────────────────────────────────────────
// Espelha CreateAdminDto + PasswordValidator do backend.
//
// PasswordValidator.validatePasswordLevel() exige:
//   hasUppercase  → /[A-Z]/
//   hasLowercase  → /[a-z]/
//   hasNumber     → /\d/
//   hasSpecialChar→ /[@#$%&*°?]/
//   hasMinLength  → length >= 8
//
// Todos devem ser verdadeiros (Object.values(...).every(Boolean)).

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
    password: z
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .regex(/[A-Z]/, 'A senha deve possuir ao menos uma letra maiúscula')
      .regex(/[a-z]/, 'A senha deve possuir ao menos uma letra minúscula')
      .regex(/[0-9]/, 'A senha deve possuir ao menos um número')
      .regex(
        /[@#$%&*°?]/,
        'A senha deve possuir ao menos um caractere especial (@, #, $, %, &, *, °, ?)'
      ),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  })

export type CreateAdminFormData = z.infer<typeof createAdminSchema>

// ── Recuperação de Senha — Etapa 1 (solicitar código) ────────────────────────
// Endpoint: POST /admin/recover-password  →  { email }
// O backend gera um código de 6 dígitos, armazena no Redis (TTL 15 min) e
// dispara um e-mail com o código.

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .max(100, 'Email muito longo'),
})
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

// ── Recuperação de Senha — Etapa 2 (redefinir senha com código) ───────────────
// Endpoint: POST /admin/reset-password  →  { email, recoveryCode, newPassword }
// O backend:
//   1. Valida PasswordValidator (mesmo critério do cadastro)
//   2. Verifica o código no Redis  →  erro se inválido/expirado
//   3. Atualiza a senha (bcrypt) e invalida o código do cache
//
// Caracteres especiais aceitos pelo backend: @  #  $  %  &  *  °  ?

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
    newPassword: z
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .regex(/[A-Z]/, 'A senha deve possuir ao menos uma letra maiúscula')
      .regex(/[a-z]/, 'A senha deve possuir ao menos uma letra minúscula')
      .regex(/[0-9]/, 'A senha deve possuir ao menos um número')
      .regex(
        /[@#$%&*°?]/,
        'A senha deve possuir ao menos um caractere especial (@, #, $, %, &, *, °, ?)'
      ),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  })

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

// ── Product ───────────────────────────────────────────────────────────────────

export const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  description: z.string().min(1, 'Descrição é obrigatória').max(500),
  price: z.number().positive('Preço deve ser maior que zero'),
  size: z.string().max(20).optional().default(''),
  imageUrl: z.string().min(1, 'Imagem é obrigatória').url('URL da imagem inválida'),
  categoryId: z.number().int().positive('Selecione uma categoria'),
})
export type ProductFormData = z.infer<typeof productSchema>

// ── Category ──────────────────────────────────────────────────────────────────

export const categorySchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter ao menos 3 caracteres')
    .max(50),
})
export type CategoryFormData = z.infer<typeof categorySchema>

// ── Section ───────────────────────────────────────────────────────────────────

export const sectionSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200),
  subtitle: z.string().max(300).optional().default(''),
})
export type SectionFormData = z.infer<typeof sectionSchema>

// ── Product (formulário com upload de imagem) ──────────────────────────────────
// Variante do productSchema onde imageUrl não é validado como URL,
// pois o valor é resolvido após o upload — não existe no momento do submit do form.
// O campo imageUrl é gerenciado externamente pelo useImageUpload.

export const productUploadSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  description: z.string().min(1, 'Descrição é obrigatória').max(500),
  price: z.number().positive('Preço deve ser maior que zero'),
  size: z.string().max(20).default(''),
  categoryId: z.number().int().positive('Selecione uma categoria'),
})
export type ProductUploadFormData = z.infer<typeof productUploadSchema>
export type ProductUploadFormInput = z.input<typeof productUploadSchema>
