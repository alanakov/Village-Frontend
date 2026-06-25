// ─── Auth ─────────────────────────────────────────────────────────────────────

export type UserType = 'ADMIN'

export interface AuthUserResponse {
  idUser: number
  name: string
  email: string
  userType: UserType
}

export interface LoginResponse {
  message: string
  token: string
  user: AuthUserResponse
}

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

export interface CreateCategoryDto { name: string }
export interface UpdateCategoryDto { name?: string }

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

/**
 * Section name enum — must mirror exactly the SectionName enum in the backend.
 * Keys are English identifiers (internal use only).
 * Values are the strings persisted in the DB and exchanged with the API — do not change them.
 */
export enum SectionName {
  // Home
  home             = 'Principal',
  aboutUs          = 'Quem Somos',
  featuredCraft    = 'Artesanato em Destaque',
  socialImpact     = 'Impacto Social',
  // Nossa História
  identity         = 'Identidade',
  cultureDimensions= 'Dimensões da Nossa Cultura',
  communityMoments = 'Momentos da Nossa Comunidade',
  // Artesanato
  crafts           = 'Artesanato',
}

export interface Section {
  idSection: number
  name: SectionName
  title: string
  subtitle: string | null
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
  title?: string
  subtitle?: string
}

export interface UpdateSectionDto {
  title?: string
  subtitle?: string
}

// ─── Content ──────────────────────────────────────────────────────────────────

export type ContentType = 'P1' | 'P2' | 'P3' | 'P4' | 'P5'

export interface SectionContent {
  idContent: number
  type: ContentType
  content: string
  sectionId: number
  createdAt?: string
  updatedAt?: string
}

export interface ContentDto { type: ContentType; content: string }
export interface CreateContentDto { type: ContentType; content: string; sectionId: number }

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface SectionStat {
  idStat: number
  title: string
  value: string
  sectionId: number
  createdAt?: string
  updatedAt?: string
}

export interface StatsDto { title: string; value: string }
export interface CreateStatDto { title: string; value: string; sectionId: number }

// ─── Button ───────────────────────────────────────────────────────────────────

export interface SectionButton {
  idButton: number
  label: string
  link: string
  sectionId: number
  createdAt?: string
  updatedAt?: string
}

export interface ButtonDto { label: string; link: string }
export interface CreateButtonDto { label: string; link: string; sectionId: number }

// ─── Card ─────────────────────────────────────────────────────────────────────

export interface SectionCard {
  idCard: number
  title: string
  /** Subtitle / short description of the card */
  description: string
  icon: string
  sectionId: number
  createdAt?: string
  updatedAt?: string
}

export interface CardDto { title: string; description: string; icon: string }
export interface CreateCardDto { title: string; description: string; icon: string; sectionId: number }

// ─── Image ────────────────────────────────────────────────────────────────────

export interface SectionImage {
  idImage: number
  imageUrl: string
  altText: string
  sectionId: number
  createdAt?: string
  updatedAt?: string
}

export interface CreateImageDto { altText: string; sectionId: number }
export interface UpdateImageDto { altText?: string }

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

export interface InstitutionalContent {
  homeTitle: string
  homeSubtitle: string
  aboutText: string
  cultureText: string
  heroBanner: string
  whatsappNumber: string
}
