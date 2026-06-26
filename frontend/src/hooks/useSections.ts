import { useState, useEffect, useCallback } from 'react'
import { sectionService } from '@/services/sectionService'
import { imageService } from '@/services/imageService'
import type {
  Section,
  SectionImage,
  CreateSectionDto,
  UpdateSectionDto,
  CreateFullSectionDto,
} from '@/types'

function mergeImages(sections: Section[], images: SectionImage[]): Section[] {
  const bySection = images.reduce<Record<number, SectionImage[]>>((acc, img) => {
    if (!acc[img.sectionId]) acc[img.sectionId] = []
    acc[img.sectionId].push(img)
    return acc
  }, {})
  return sections.map((s) => ({ ...s, images: bySection[s.idSection] ?? [] }))
}

export function useSections() {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [fullSections, allImages] = await Promise.all([
        sectionService.getAllFull(),
        imageService.getAll().catch(() => [] as SectionImage[]),
      ])
      setSections(mergeImages(fullSections, allImages))
    } catch {
      setError('Erro ao carregar seções.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const createSimple = async (dto: CreateSectionDto): Promise<Section> => {
    const created = await sectionService.create(dto)
    await fetchAll()
    return created
  }

  const createFull = async (
    dto: CreateFullSectionDto
  ): Promise<{ message: string; section: Section }> => {
    const result = await sectionService.createFull(dto)
    await fetchAll()
    return result
  }

  const updateSection = async (id: number, dto: UpdateSectionDto): Promise<Section> => {
    const updated = await sectionService.update(id, dto)
    await fetchAll()
    return updated
  }

  const deleteSection = (id: number): void => {
    setSections((prev) => prev.filter((s) => s.idSection !== id))
  }

  return { sections, loading, error, refetch: fetchAll, createSimple, createFull, updateSection, deleteSection }
}
