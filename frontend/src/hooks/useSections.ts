import { useState, useEffect, useCallback } from 'react'
import { sectionService } from '@/services/sectionService'
import { imageService } from '@/services/imageService'
import type { Section, SectionImage, UpdateSectionDto } from '@/types'

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

  useEffect(() => { fetchAll() }, [fetchAll])

  const update = async (id: number, dto: UpdateSectionDto): Promise<Section> => {
    const updated = await sectionService.update(id, dto)
    setSections((prev) => prev.map((s) => (s.idSection === id ? { ...s, ...updated } : s)))
    return updated
  }

  return { sections, loading, error, refetch: fetchAll, update }
}
