import { useState, useEffect } from 'react'
import { publicApi } from '@/lib/publicApi'
import type { Section, SectionImage, SectionButton } from '@/types'
import { getUploadUrl } from '@/services/api'

export interface PublicContentState {
  sections: Section[]
  loading: boolean
  getSection: (name: string) => Section | undefined
  getContent: (sectionName: string, type?: string) => string
  getStats: (sectionName: string) => Array<{ title: string; value: string }>
  getCards: (sectionName: string) => Array<{ title: string; description: string; icon: string }>
  getImages: (sectionName: string) => SectionImage[]
  getButtons: (sectionName: string) => SectionButton[]
  getFirstImage: (sectionName: string) => string
}

export function usePublicContent(): PublicContentState {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    publicApi
      .get<Section[]>('/full/section')
      .then((r) => setSections(r.data))
      .catch(() => setSections([]))
      .finally(() => setLoading(false))
  }, [])

  const getSection = (name: string): Section | undefined =>
    sections.find((s) => s.name === name)

  const getContent = (sectionName: string, type = 'P1'): string => {
    const section = getSection(sectionName)
    if (!section?.contents?.length) return ''
    return section.contents.find((c) => c.type === type)?.content ?? ''
  }

  const getStats = (sectionName: string) => {
    const section = getSection(sectionName)
    if (!section?.stats?.length) return []
    return section.stats.map((s) => ({ title: s.title, value: s.value }))
  }

  const getCards = (sectionName: string) => {
    const section = getSection(sectionName)
    if (!section?.cards?.length) return []
    return section.cards.map((c) => ({
      title: c.title,
      description: c.description,
      icon: c.icon,
    }))
  }

  const getImages = (sectionName: string): SectionImage[] => {
    const section = getSection(sectionName)
    if (!section?.images?.length) return []
    return section.images
  }

  const getButtons = (sectionName: string): SectionButton[] => {
    const section = getSection(sectionName)
    if (!section?.buttons?.length) return []
    return section.buttons
  }

  const getFirstImage = (sectionName: string): string => {
    const images = getImages(sectionName)
    if (!images.length) return ''
    return getUploadUrl(images[0].imageUrl)
  }

  return {
    sections,
    loading,
    getSection,
    getContent,
    getStats,
    getCards,
    getImages,
    getButtons,
    getFirstImage,
  }
}
