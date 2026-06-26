import { useState, useEffect } from 'react'
import { publicApi } from '@/lib/publicApi'
import type { Section, SectionImage, SectionCard, SectionContent, ContentType } from '@/types'
import { getUploadUrl } from '@/services/api'

export interface PublicContentState {
  sections: Section[]
  loading: boolean
  getSection:    (name: string) => Section | undefined
  getCards:      (sectionName: string) => SectionCard[]
  getImages:     (sectionName: string) => SectionImage[]
  getFirstImage: (sectionName: string) => string
  
  getContent:    (sectionName: string, type: ContentType) => string
  getContents:   (sectionName: string) => SectionContent[]
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

  const getCards = (sectionName: string): SectionCard[] =>
    getSection(sectionName)?.cards ?? []

  const getImages = (sectionName: string): SectionImage[] =>
    getSection(sectionName)?.images ?? []

  const getContents = (sectionName: string): SectionContent[] =>
    getSection(sectionName)?.contents ?? []

  const getFirstImage = (sectionName: string): string => {
    const images = getImages(sectionName)
    if (!images.length) return ''
    return getUploadUrl(images[0].imageUrl)
  }

  const getContent = (sectionName: string, type: ContentType): string => {
    const section = getSection(sectionName)
    const found = section?.contents?.find((c) => c.type === type)
    return found?.content ?? ''
  }

  return { sections, loading, getSection, getCards, getImages, getFirstImage, getContent, getContents }
}
