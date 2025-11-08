import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import {
  surveiCorpu,
  strukturAsnCorpu,
  manajemenPengetahuan,
  forumPembelajaran,
  sistemPembelajaran,
  strategiPembelajaran,
  teknologiPembelajaran,
  integrasiSistem,
  evaluasiAsnCorpu
} from '../../../lib/schemas/profile_surveys'
import { users } from '../../../lib/schemas/user'
import { masterInstansiType } from '../../../lib/schemas/instansi'
import { eq, and } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    const tahun = url.searchParams.get('tahun')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')

    // Define categories with their question ranges and max scores
    const categories = [
      {
        key: 'strukturAsn',
        name: 'Struktur ASN Corpu',
        table: strukturAsnCorpu,
        questions: ['p7', 'p8', 'p9', 'p10'],
        maxScore: 20
      },
      {
        key: 'manajemenPengetahuan',
        name: 'Manajemen Pengetahuan',
        table: manajemenPengetahuan,
        questions: ['p11', 'p12', 'p13', 'p14', 'p15'],
        maxScore: 25
      },
      {
        key: 'forumPembelajaran',
        name: 'Forum Pembelajaran',
        table: forumPembelajaran,
        questions: ['p16', 'p17', 'p18', 'p19'],
        maxScore: 20
      },
      {
        key: 'sistemPembelajaran',
        name: 'Sistem Pembelajaran',
        table: sistemPembelajaran,
        questions: ['p20', 'p21', 'p22', 'p23'],
        maxScore: 20
      },
      {
        key: 'strategiPembelajaran',
        name: 'Strategi Pembelajaran',
        table: strategiPembelajaran,
        questions: ['p24', 'p25', 'p26', 'p27', 'p28'],
        maxScore: 25
      },
      {
        key: 'teknologiPembelajaran',
        name: 'Teknologi Pembelajaran',
        table: teknologiPembelajaran,
        questions: ['p29', 'p30', 'p31', 'p32', 'p33'],
        maxScore: 25,
        isText: true
      },
      {
        key: 'integrasiSistem',
        name: 'Integrasi Sistem',
        table: integrasiSistem,
        questions: ['p34', 'p35', 'p36', 'p37'],
        maxScore: 20
      },
      {
        key: 'evaluasiAsn',
        name: 'Evaluasi ASN Corpu',
        table: evaluasiAsnCorpu,
        questions: ['p38', 'p39', 'p40', 'p41'],
        maxScore: 20
      }
    ]

    // If specific userId and tahun provided, get summary for that user
    if (userId && tahun) {
      const userIdNum = parseInt(userId)
      const tahunNum = parseInt(tahun)

      // Find the survey for this user and year
      const surveyRecord = await db.select()
        .from(surveiCorpu)
        .where(and(
          eq(surveiCorpu.userId, userIdNum),
          eq(surveiCorpu.tahun, tahunNum)
        ))

      if (surveyRecord.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'Data survei tidak ditemukan untuk user dan tahun tersebut'
        }, { status: 404 })
      }

      const surveiId = surveyRecord[0].id

      // Get user info
      const [userInfo] = await db.select({
        fullName: users.fullName,
        nama_instansi: masterInstansiType.nama_instansi
      })
        .from(users)
        .leftJoin(masterInstansiType, eq(users.instansiId, masterInstansiType.id))
        .where(eq(users.id, userIdNum))
        .limit(1)

      // Calculate scores for each category
      const categorySummaries = await Promise.all(
        categories.map(async (category) => {
          const categoryData = await db.select()
            .from(category.table)
            .where(eq(category.table.surveiId, surveiId))

          if (categoryData.length === 0) {
            return {
              category: category.name,
              score: 0
            }
          }

          const record = categoryData[0]
          let totalScore = 0

          // Calculate score based on question type
          if (category.isText) {
            // For text fields, count filled fields
            category.questions.forEach(question => {
              const value = (record as Record<string, unknown>)[question]
              if (value && typeof value === 'string' && value.trim() !== '') {
                totalScore += 5 // Max score per text question
              }
            })
          } else {
            // For numeric fields, sum the values (no range restriction)
            category.questions.forEach(question => {
              const value = (record as Record<string, unknown>)[question]
              if (typeof value === 'number' && !isNaN(value)) {
                totalScore += value
              }
            })
          }

          return {
            category: category.name,
            score: totalScore
          }
        })
      )

      const totalScore = categorySummaries.reduce((sum, cat) => sum + cat.score, 0)

      return NextResponse.json({
        success: true,
        data: {
          userId: userIdNum,
          tahun: tahunNum,
          fullName: userInfo?.nama_instansi || userInfo?.fullName || `User ${userIdNum}`,
          categories: categorySummaries,
          summary: {
            totalScore,
            categoryCount: categories.length
          }
        }
      })
    }

    // If no specific user/tahun, return summary for all users with pagination
    const offset = (page - 1) * limit

    // Get total count for pagination
    const totalCountResult = await db.$count(surveiCorpu)
    const totalCount = totalCountResult

    // Get paginated surveys
    const allSurveys = await db.select({
      surveiId: surveiCorpu.id,
      userId: surveiCorpu.userId,
      tahun: surveiCorpu.tahun,
      nama_instansi: masterInstansiType.nama_instansi,
      userFullName: users.fullName
    })
      .from(surveiCorpu)
      .leftJoin(users, eq(surveiCorpu.userId, users.id))
      .leftJoin(masterInstansiType, eq(users.instansiId, masterInstansiType.id))
      .orderBy(surveiCorpu.updatedAt)
      .limit(limit)
      .offset(offset)

    // Calculate summary for each survey
    const allSummaries = await Promise.all(
      allSurveys.map(async (survey) => {
        const surveiId = survey.surveiId

        // Calculate scores for each category
        const categorySummaries = await Promise.all(
          categories.map(async (category) => {
            const categoryData = await db.select()
              .from(category.table)
              .where(eq(category.table.surveiId, surveiId))

            if (categoryData.length === 0) {
              return {
                category: category.name,
                score: 0
              }
            }

            const record = categoryData[0]
            let totalScore = 0

            // Calculate score based on question type
            if (category.isText) {
              // For text fields, count filled fields
              category.questions.forEach(question => {
                const value = (record as Record<string, unknown>)[question]
                if (value && typeof value === 'string' && value.trim() !== '') {
                  totalScore += 5 // Max score per text question
                }
              })
            } else {
              // For numeric fields, sum the values (no range restriction)
              category.questions.forEach(question => {
                const value = (record as Record<string, unknown>)[question]
                if (typeof value === 'number' && !isNaN(value)) {
                  totalScore += value
                }
              })
            }

            return {
              category: category.name,
              score: totalScore
            }
          })
        )

        const totalScore = categorySummaries.reduce((sum, cat) => sum + cat.score, 0)

        return {
          surveiId: survey.surveiId,
          userId: survey.userId,
          tahun: survey.tahun,
          fullName: survey.nama_instansi || survey.userFullName || `User ${survey.userId}`,
          categories: categorySummaries,
          summary: {
            totalScore
          }
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: allSummaries,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      },
      message: 'Ringkasan kategori untuk semua survei'
    })

  } catch (error) {
    console.error('GET summary_kategori error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}