import { writeFileSync, mkdirSync, existsSync, unlinkSync } from 'fs'
import { join } from 'path'
import { MINIMAL_PNG_BASE64 } from '../data/test-data'

const FIXTURES_DIR = join(__dirname, '..', 'fixtures', 'images')

export function getTestImagePath(filename = 'test-product.png'): string {
  if (!existsSync(FIXTURES_DIR)) {
    mkdirSync(FIXTURES_DIR, { recursive: true })
  }

  const filePath = join(FIXTURES_DIR, filename)

  if (!existsSync(filePath)) {
    const buffer = Buffer.from(MINIMAL_PNG_BASE64, 'base64')
    writeFileSync(filePath, buffer)
  }

  return filePath
}

export function createUniqueTestImage(): string {
  if (!existsSync(FIXTURES_DIR)) {
    mkdirSync(FIXTURES_DIR, { recursive: true })
  }

  const filename = `test-${Date.now()}-${Math.random().toString(36).slice(2)}.png`
  const filePath = join(FIXTURES_DIR, filename)
  const buffer   = Buffer.from(MINIMAL_PNG_BASE64, 'base64')
  writeFileSync(filePath, buffer)
  return filePath
}

export function removeTestImage(path: string): void {
  try {
    if (existsSync(path)) unlinkSync(path)
  } catch {
  }
}
