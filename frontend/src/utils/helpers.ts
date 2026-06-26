import { AxiosError } from 'axios'

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function buildWhatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

// Mapa de mensagens técnicas do backend → mensagens amigáveis para o usuário
const FRIENDLY_MESSAGES: Record<string, string> = {
  // Autenticação
  'Unauthorized': 'Sessão expirada. Faça login novamente.',
  'Invalid credentials': 'E-mail ou senha incorretos. Verifique e tente novamente.',
  'User not found': 'Nenhuma conta encontrada com este e-mail.',
  'Invalid token': 'Link inválido ou expirado. Solicite um novo.',
  'Token expired': 'O link de acesso expirou. Solicite um novo.',
  'Invalid or expired recovery code': 'O código informado é inválido ou expirou. Solicite um novo código de recuperação.',
  'Recovery code expired': 'O código de recuperação expirou. Solicite um novo.',

  // Produtos
  'Erro ao criar produto': 'Não foi possível salvar o produto. Verifique os dados e tente novamente.',
  'Erro ao atualizar o produto': 'Não foi possível atualizar o produto. Tente novamente.',
  'Produto não encontrado': 'Este produto não existe ou foi removido.',

  // Categorias
  'Esta categoria já está cadastrada!': 'Já existe uma categoria com este nome. Use um nome diferente.',
  'Esta categoria já existe': 'Já existe uma categoria com este nome. Use um nome diferente.',
  'Erro ao criar categoria': 'Não foi possível criar a categoria. Tente novamente.',
  'Erro ao atualizar a categoria': 'Não foi possível atualizar a categoria. Tente novamente.',
  'Categoria não encontrada': 'Esta categoria não existe ou foi removida.',
  'Categoria não encontrada!': 'Esta categoria não existe ou foi removida.',

  // Upload de imagem
  'File too large': 'O arquivo é muito grande. O tamanho máximo permitido é 5 MB.',
  'Only image files are allowed': 'Apenas imagens são aceitas (JPG, PNG, WEBP).',
  'Falha no upload da imagem.': 'Não foi possível enviar a imagem. Verifique sua conexão e tente novamente.',

  // Conteúdo / Seções
  'Section not found': 'Esta seção não existe ou foi removida.',
  'Content not found': 'Este conteúdo não foi encontrado.',
  'Card not found': 'Este card não foi encontrado.',
  'Image not found': 'Esta imagem não foi encontrada.',

  // Administrador / Convite
  'Admin already exists': 'Já existe um administrador cadastrado com este e-mail.',
  // Perfil
  'Você não tem permissão para editar este usuário': 'Você só pode editar o seu próprio perfil.',
  'O email não pode ser alterado': 'O e-mail não pode ser alterado.',
  'Erro ao atualizar administrador': 'Não foi possível salvar as alterações. Tente novamente.',
  'Administrador não encontrado!': 'Administrador não encontrado.',
  'Invalid invite token': 'O link de convite é inválido ou expirou. Solicite um novo convite.',
  'Invite token expired': 'O link de convite expirou. Solicite um novo convite ao administrador.',

  // Genérico
  'Internal server error': 'Ocorreu um erro interno. Tente novamente em instantes.',
  'Internal Server Error': 'Ocorreu um erro interno. Tente novamente em instantes.',
  'Network Error': 'Sem conexão com o servidor. Verifique sua internet e tente novamente.',
  'timeout of 15000ms exceeded': 'O servidor demorou demais para responder. Tente novamente.',
  'Request failed with status code 500': 'Ocorreu um erro interno no servidor. Tente novamente em instantes.',
  'Request failed with status code 404': 'O recurso solicitado não foi encontrado.',
  'Request failed with status code 403': 'Você não tem permissão para realizar esta ação.',
  'Request failed with status code 401': 'Sessão expirada. Faça login novamente.',
  'Request failed with status code 409': 'Já existe um registro com estes dados.',
}

function toFriendly(raw: string): string {
  if (FRIENDLY_MESSAGES[raw]) return FRIENDLY_MESSAGES[raw]
  // Tenta correspondência parcial para mensagens com variações
  for (const [key, friendly] of Object.entries(FRIENDLY_MESSAGES)) {
    if (raw.toLowerCase().includes(key.toLowerCase())) return friendly
  }
  return raw
}

export function getApiErrorMessage(err: unknown): string {
  if (err instanceof AxiosError) {
    const status = err.response?.status
    const data   = err.response?.data

    // Mensagem(s) vindas do backend
    const msg = data?.message
    if (Array.isArray(msg) && msg.length > 0) {
      return msg.map(toFriendly).join(' ')
    }
    if (typeof msg === 'string' && msg.trim()) {
      return toFriendly(msg)
    }

    // Fallback por código HTTP
    if (status === 401) return 'Sessão expirada. Faça login novamente.'
    if (status === 403) return 'Você não tem permissão para realizar esta ação.'
    if (status === 404) return 'O item solicitado não foi encontrado.'
    if (status === 409) return 'Já existe um registro com estes dados.'
    if (status === 413) return 'O arquivo enviado é muito grande. Tente com um arquivo menor.'
    if (status === 422) return 'Os dados informados são inválidos. Verifique o formulário.'
    if (status && status >= 500) return 'Ocorreu um erro interno. Tente novamente em instantes.'

    // Erros de rede sem response
    if (!err.response) return 'Sem conexão com o servidor. Verifique sua internet e tente novamente.'

    return toFriendly(err.message)
  }
  if (err instanceof Error) return toFriendly(err.message)
  return 'Ocorreu um erro inesperado. Tente novamente.'
}

export function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + '…' : text
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
