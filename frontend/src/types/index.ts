// ─── Auth ─────────────────────────────────────────────────────────────────────

export type UserType = 'ADMIN'

/** Shape retornada pelo backend em login/profile */
export interface AuthUserResponse {
  idUser: number
  name: string
  email: string
  userType: UserType
}

/** POST /api/auth/login → { message, token, user } */
export interface LoginResponse {
  message: string
  token: string
  user: AuthUserResponse
}

/** GET /api/auth/profile → { message, user } */
export interface ProfileResponse {
  message: string
  user: AuthUserResponse
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthState {
  token: string | null
  user: AuthUserResponse | null
  isAuthenticated: boolean
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  idAdmin: number
  name: string
  email: string
  phone: string
  type: UserType
  createdAt?: string
  updatedAt?: string
}

export interface CreateAdminDto {
  name: string
  email: string
  password: string
  phone: string
}

export interface UpdateAdminDto {
  name?: string
  phone?: string
  email?: string
  currentPassword?: string
  newPassword?: string
}

// ─── Category ─────────────────────────────────────────────────────────────────

export interface Category {
  idCategory: number
  name: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateCategoryDto {
  name: string
}

export interface UpdateCategoryDto {
  name?: string
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
  idProduct: number
  name: string
  description: string
  price: number
  size: string | null
  imageUrl: string
  categoryId: number
  category?: Category
  createdAt?: string
  updatedAt?: string
}

export interface CreateProductDto {
  name: string
  description: string
  price: number
  size?: string
  imageUrl: string
  categoryId: number
}

export interface UpdateProductDto {
  name?: string
  description?: string
  price?: number
  size?: string
  imageUrl?: string
  categoryId?: number
}

// ─── Section ──────────────────────────────────────────────────────────────────

export const SectionName = {
  homePage: 'Página Inicial',
  aboutUs: 'Sobre Nós',
  socialImpact: 'Impacto Social',
  identity: 'Identidade',
  values: 'Valores',
  traditionalTechniques: 'Técnicas Tradicionais',
  preserve: 'Preserve',
  doubts: 'Dúvidas',
  aboutProducts: 'Sobre os Produtos',
  guarantee: 'Garantia',
} as const
export type SectionName = typeof SectionName[keyof typeof SectionName]

export interface Section {
  idSection: number
  name: SectionName
  title: string
  subtitle: string
  contents?: SectionContent[]
  cards?: SectionCard[]
  images?: SectionImage[]
  stats?: SectionStat[]
  buttons?: SectionButton[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateSectionDto {
  name: SectionName
  title: string
  subtitle: string
}

export interface UpdateSectionDto {
  name?: string
  title?: string
  subtitle?: string
}

// ─── Content ──────────────────────────────────────────────────────────────────

export const ContentType = {
  P1: 'P1',
  P2: 'P2',
  P3: 'P3',
  P4: 'P4',
  P5: 'P5',
} as const
export type ContentType = typeof ContentType[keyof typeof ContentType]

export interface SectionContent {
  idContent: number
  type: ContentType
  content: string
  sectionId: number
  createdAt?: string
  updatedAt?: string
}

export interface ContentDto {
  type: ContentType
  content: string
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface SectionStat {
  idStat: number
  title: string
  value: string
  sectionId: number
  createdAt?: string
  updatedAt?: string
}

export interface StatsDto {
  title: string
  value: string
}

// ─── Button ───────────────────────────────────────────────────────────────────

export interface SectionButton {
  idButton: number
  label: string
  link: string
  sectionId: number
  createdAt?: string
  updatedAt?: string
}

export interface ButtonDto {
  label: string
  link: string
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export interface SectionCard {
  idCard: number
  title: string
  description: string
  icon: string
  sectionId: number
  createdAt?: string
  updatedAt?: string
}

export interface CardDto {
  title: string
  description: string
  icon: string
}

// ─── Image ────────────────────────────────────────────────────────────────────

export interface SectionImage {
  idImage: number
  imageUrl: string
  altText: string
  sectionId: number
  createdAt?: string
  updatedAt?: string
}

export interface CreateImageDto {
  altText: string
  sectionId: number
}

export interface UpdateImageDto {
  altText?: string
}

// ─── Full Section ─────────────────────────────────────────────────────────────

export interface CreateFullSectionDto {
  section?: CreateSectionDto
  contents?: ContentDto[]
  cards?: CardDto[]
  stats?: StatsDto[]
  buttons?: ButtonDto[]
}

// ─── UI ───────────────────────────────────────────────────────────────────────

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface ApiError {
  message: string | string[]
  statusCode: number
  error?: string
}

// ─── Institutional (local CMS — sem endpoint no backend) ──────────────────────

export interface InstitutionalContent {
  homeTitle: string
  homeSubtitle: string
  aboutText: string
  cultureText: string
  heroBanner: string
  whatsappNumber: string
}
