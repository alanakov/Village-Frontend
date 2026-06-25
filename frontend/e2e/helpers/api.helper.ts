import { request, APIRequestContext } from '@playwright/test'
import { API_URL } from '../playwright.config'
import { ADMIN_CREDENTIALS } from '../data/test-data'

/**
 * APIHelper provides direct HTTP access to the backend.
 *
 * Used in tests that need to:
 *  - Seed data before a test (create category/product via API)
 *  - Teardown data after a test (delete what the test created)
 *  - Validate API state without relying on the UI
 */
export class APIHelper {
  private ctx!: APIRequestContext
  private token: string | null = null

  async init(): Promise<void> {
    this.ctx = await request.newContext({ baseURL: API_URL })
  }

  async dispose(): Promise<void> {
    await this.ctx.dispose()
  }

  // ─── Auth ───────────────────────────────────────────────────────────────────

  async login(
    email    = ADMIN_CREDENTIALS.email,
    password = ADMIN_CREDENTIALS.password
  ): Promise<string> {
    const res = await this.ctx.post('auth/login', {
      data: { email, password },
    })

    if (!res.ok()) {
      throw new Error(`Login failed: ${res.status()} ${await res.text()}`)
    }

    const body = await res.json()
    this.token = body.token as string
    return this.token
  }

  private authHeaders() {
    if (!this.token) throw new Error('Not authenticated — call login() first')
    return { Authorization: `Bearer ${this.token}` }
  }

  // ─── Category ───────────────────────────────────────────────────────────────

  async createCategory(name: string): Promise<{ idCategory: number; name: string }> {
    const res = await this.ctx.post('category', {
      headers: this.authHeaders(),
      data: { name },
    })
    if (!res.ok()) throw new Error(`createCategory failed: ${res.status()} ${await res.text()}`)
    return res.json()
  }

  async deleteCategory(id: number): Promise<void> {
    await this.ctx.delete(`category/${id}`, { headers: this.authHeaders() })
  }

  async getCategories(): Promise<Array<{ idCategory: number; name: string }>> {
    const res = await this.ctx.get('category', { headers: this.authHeaders() })
    if (!res.ok()) throw new Error(`getCategories failed: ${res.status()}`)
    return res.json()
  }

  // ─── Product ────────────────────────────────────────────────────────────────

  async createProduct(data: {
    name:        string
    description: string
    price:       number
    size?:       string
    imageUrl:    string
    categoryId:  number
  }): Promise<{ idProduct: number } & typeof data> {
    const res = await this.ctx.post('product', {
      headers: this.authHeaders(),
      data,
    })
    if (!res.ok()) throw new Error(`createProduct failed: ${res.status()} ${await res.text()}`)
    return res.json()
  }

  async getProducts(): Promise<Array<{ idProduct: number; name: string; categoryId: number }>> {
    const res = await this.ctx.get('product', { headers: this.authHeaders() })
    if (!res.ok()) throw new Error(`getProducts failed: ${res.status()}`)
    return res.json()
  }

  async getProductById(id: number): Promise<Record<string, unknown>> {
    const res = await this.ctx.get(`product/${id}`, { headers: this.authHeaders() })
    if (!res.ok()) throw new Error(`getProductById failed: ${res.status()}`)
    return res.json()
  }

  async deleteProduct(id: number): Promise<void> {
    const res = await this.ctx.delete(`product/${id}`, { headers: this.authHeaders() })
    if (!res.ok()) throw new Error(`deleteProduct failed: ${res.status()}`)
  }

  // ─── Public (unauthenticated) ────────────────────────────────────────────────

  async getPublicProducts(): Promise<Array<Record<string, unknown>>> {
    const res = await this.ctx.get('product')
    if (!res.ok()) throw new Error(`getPublicProducts failed: ${res.status()}`)
    return res.json()
  }

  async getPublicCategories(): Promise<Array<Record<string, unknown>>> {
    const res = await this.ctx.get('category')
    if (!res.ok()) throw new Error(`getPublicCategories failed: ${res.status()}`)
    return res.json()
  }
}
