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

export interface Category {
  idCategory: number
  name: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateCategoryDto { name: string }
export interface UpdateCategoryDto { name?: string }

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

export const SectionName = {
  home: 'Principal',
  aboutUs: 'Quem Somos',
  featuredCraft: 'Artesanato em Destaque',
  socialImpact: 'Impacto Social',
  identity: 'Identidade',
  cultureDimensions: 'Dimensões da Nossa Cultura',
  communityMoments: 'Momentos da Nossa Comunidade',
  crafts: 'Artesanato',
} as const

export type SectionName = (typeof SectionName)[keyof typeof SectionName]

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

export interface SectionCard {
  idCard: number
  title: string
  description: string
  icon: string
  sectionId: number
  createdAt?: string
  updatedAt?: string
}

export interface CardDto { title: string; description: string; icon: string }
export interface CreateCardDto { title: string; description: string; icon: string; sectionId: number }

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

export interface CreateFullSectionDto {
  section?: CreateSectionDto
  contents?: ContentDto[]
  cards?: CardDto[]
  stats?: StatsDto[]
  buttons?: ButtonDto[]
}

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
