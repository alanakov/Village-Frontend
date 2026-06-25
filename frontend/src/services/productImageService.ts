import api from './api'

export const productImageService = {
  /**
   * Faz upload de uma imagem de produto.
   * Chama POST /product/upload-image com multipart/form-data.
   * Devolve { imageUrl } — sem nenhum vínculo com seções.
   */
  async upload(file: File): Promise<{ imageUrl: string }> {
    const form = new FormData()
    form.append('file', file)

    const { data } = await api.post<{ imageUrl: string }>(
      '/product/upload-image',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )

    return data
  },
}
