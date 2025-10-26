import { db } from '../db'
import { masterInstansiType } from '../schemas/instansi'
import { eq, ilike } from 'drizzle-orm'

/**
 * Convert slug to instansi ID by looking up in database
 * @param slug - The slug string (e.g., "kementerian-keuangan")
 * @returns Promise<number | null> - The instansi ID or null if not found
 */
export async function slugToInstansiId(slug: string): Promise<number | null> {
  try {
    if (!slug || typeof slug !== 'string') {
      return null
    }

    // Convert slug to readable name
    // Replace dashes with spaces and capitalize words
    const namaInstansi = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')

    // Try exact match first
    let result = await db
      .select({ id: masterInstansiType.id })
      .from(masterInstansiType)
      .where(eq(masterInstansiType.nama_instansi, namaInstansi))
      .limit(1)

    if (result.length > 0) {
      return result[0].id
    }

    // Try case-insensitive match
    result = await db
      .select({ id: masterInstansiType.id })
      .from(masterInstansiType)
      .where(ilike(masterInstansiType.nama_instansi, namaInstansi))
      .limit(1)

    if (result.length > 0) {
      return result[0].id
    }

    // Try partial match (in case slug format is different)
    const searchPattern = `%${namaInstansi.replace(/\s+/g, '%')}%`
    result = await db
      .select({ id: masterInstansiType.id })
      .from(masterInstansiType)
      .where(ilike(masterInstansiType.nama_instansi, searchPattern))
      .limit(1)

    return result.length > 0 ? result[0].id : null
  } catch (error) {
    console.error('Error converting slug to instansi ID:', error)
    return null
  }
}

/**
 * Convert instansi ID to slug
 * @param instansiId - The instansi ID
 * @returns Promise<string | null> - The slug or null if not found
 */
export async function instansiIdToSlug(instansiId: number): Promise<string | null> {
  try {
    if (!instansiId || typeof instansiId !== 'number') {
      return null
    }

    const result = await db
      .select({ nama_instansi: masterInstansiType.nama_instansi })
      .from(masterInstansiType)
      .where(eq(masterInstansiType.id, instansiId))
      .limit(1)

    if (result.length === 0) {
      return null
    }

    // Convert nama_instansi to slug
    const namaInstansi = result[0].nama_instansi
    if (!namaInstansi) {
      return null
    }

    const slug = namaInstansi
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/-+/g, '-') // Replace multiple dashes with single dash
      .replace(/^-+|-+$/g, '') // Remove leading/trailing dashes

    return slug
  } catch (error) {
    console.error('Error converting instansi ID to slug:', error)
    return null
  }
}