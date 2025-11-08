import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import {
  surveiCorpu,
  strukturAsnCorpu,
  manajemenPengetahuan,
  forumPembelajaran,
  sistemPembelajaran,
  strategiPembelajaran,
  teknologiPembelajaran,
  integrasiSistem,
  evaluasiAsnCorpu,
} from '../../../lib/schemas/profile_surveys';
import { users } from '../../../lib/schemas/user';
import { masterInstansiType } from '../../../lib/schemas/instansi';
import { eq, and, count, sql } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userIdParam = url.searchParams.get('userId');
    const tahunParam = url.searchParams.get('tahun');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    // ✅ Filter: hanya survei yang punya data di semua tabel kategori (opsional)
    // atau biarkan LEFT JOIN agar tetap muncul meski ada yang kosong

    // 🔹 Filter berdasarkan tahun (jika ada)
    let whereClause = undefined;
    if (tahunParam) {
      const tahunNum = parseInt(tahunParam);
      whereClause = eq(surveiCorpu.tahun, tahunNum);
    }

    // 🔹 Jika userId + tahun spesifik → ambil 1 survei (tetap pakai JOIN)
    if (userIdParam && tahunParam) {
      const userIdNum = parseInt(userIdParam);
      const tahunNum = parseInt(tahunParam);

      const result = await db
        .select({
          surveiId: surveiCorpu.id,
          userId: surveiCorpu.userId,
          tahun: surveiCorpu.tahun,
          fullName: sql<string>`COALESCE(${masterInstansiType.nama_instansi}, ${users.fullName})`,
          // --- Skor per kategori ---
          strukturScore: sql<number>`COALESCE(
            ${strukturAsnCorpu.p7} + ${strukturAsnCorpu.p8} + ${strukturAsnCorpu.p9} + ${strukturAsnCorpu.p10},
            0
          )`,
          manajemenScore: sql<number>`COALESCE(
            ${manajemenPengetahuan.p11} + ${manajemenPengetahuan.p12} + 
            ${manajemenPengetahuan.p13} + ${manajemenPengetahuan.p14} + ${manajemenPengetahuan.p15},
            0
          )`,
          forumScore: sql<number>`COALESCE(
            ${forumPembelajaran.p16} + ${forumPembelajaran.p17} + ${forumPembelajaran.p18} + ${forumPembelajaran.p19},
            0
          )`,
          sistemScore: sql<number>`COALESCE(
            ${sistemPembelajaran.p20} + ${sistemPembelajaran.p21} + 
            ${sistemPembelajaran.p22} + ${sistemPembelajaran.p23},
            0
          )`,
          strategiScore: sql<number>`COALESCE(
            ${strategiPembelajaran.p24} + ${strategiPembelajaran.p25} + 
            ${strategiPembelajaran.p26} + ${strategiPembelajaran.p27} + ${strategiPembelajaran.p28},
            0
          )`,
          teknologiScore: sql<number>`COALESCE(
            ${teknologiPembelajaran.p29} + ${teknologiPembelajaran.p30} + 
            ${teknologiPembelajaran.p31} + ${teknologiPembelajaran.p32} + ${teknologiPembelajaran.p33},
            0
          )`,
          integrasiScore: sql<number>`COALESCE(
            ${integrasiSistem.p34} + ${integrasiSistem.p35} + ${integrasiSistem.p36} + ${integrasiSistem.p37},
            0
          )`,
          evaluasiScore: sql<number>`COALESCE(
            ${evaluasiAsnCorpu.p38} + ${evaluasiAsnCorpu.p39} + ${evaluasiAsnCorpu.p40} + ${evaluasiAsnCorpu.p41},
            0
          )`,
        })
        .from(surveiCorpu)
        .leftJoin(users, eq(surveiCorpu.userId, users.id))
        .leftJoin(masterInstansiType, eq(users.instansiId, masterInstansiType.id))
        .leftJoin(strukturAsnCorpu, eq(surveiCorpu.id, strukturAsnCorpu.surveiId))
        .leftJoin(manajemenPengetahuan, eq(surveiCorpu.id, manajemenPengetahuan.surveiId))
        .leftJoin(forumPembelajaran, eq(surveiCorpu.id, forumPembelajaran.surveiId))
        .leftJoin(sistemPembelajaran, eq(surveiCorpu.id, sistemPembelajaran.surveiId))
        .leftJoin(strategiPembelajaran, eq(surveiCorpu.id, strategiPembelajaran.surveiId))
        .leftJoin(teknologiPembelajaran, eq(surveiCorpu.id, teknologiPembelajaran.surveiId))
        .leftJoin(integrasiSistem, eq(surveiCorpu.id, integrasiSistem.surveiId))
        .leftJoin(evaluasiAsnCorpu, eq(surveiCorpu.id, evaluasiAsnCorpu.surveiId))
        .where(
          and(
            eq(surveiCorpu.userId, userIdNum),
            eq(surveiCorpu.tahun, tahunNum)
          )
        )
        .limit(1);

      if (result.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Data survei tidak ditemukan' },
          { status: 404 }
        );
      }

      const row = result[0];
      const categories = [
        { category: 'Struktur ASN Corpu', score: row.strukturScore },
        { category: 'Manajemen Pengetahuan', score: row.manajemenScore },
        { category: 'Forum Pembelajaran', score: row.forumScore },
        { category: 'Sistem Pembelajaran', score: row.sistemScore },
        { category: 'Strategi Pembelajaran', score: row.strategiScore },
        { category: 'Teknologi Pembelajaran', score: row.teknologiScore },
        { category: 'Integrasi Sistem', score: row.integrasiScore },
        { category: 'Evaluasi ASN Corpu', score: row.evaluasiScore },
      ];

      const totalScore = categories.reduce((sum, c) => sum + c.score, 0);

      return NextResponse.json({
        success: true,
        data: {
          userId: row.userId,
          tahun: row.tahun,
          fullName: row.fullName,
          categories,
          summary: { totalScore, categoryCount: categories.length },
        },
      });
    }

    // 🔹 Kasus: semua survei (dengan pagination & filter tahun)
    const offset = (page - 1) * limit;

    // Hitung total (dengan filter tahun)
    const countResult = await db
      .select({ total: count() })
      .from(surveiCorpu)
      .where(whereClause);
    const totalCount = Number(countResult[0].total);

    // Query utama: 1x JOIN semua tabel
    const surveys = await db
      .select({
        surveiId: surveiCorpu.id,
        userId: surveiCorpu.userId,
        tahun: surveiCorpu.tahun,
        fullName: sql<string>`COALESCE(${masterInstansiType.nama_instansi}, ${users.fullName})`,
        // --- Skor per kategori ---
        strukturScore: sql<number>`COALESCE(
          ${strukturAsnCorpu.p7} + ${strukturAsnCorpu.p8} + ${strukturAsnCorpu.p9} + ${strukturAsnCorpu.p10},
          0
        )`,
        manajemenScore: sql<number>`COALESCE(
          ${manajemenPengetahuan.p11} + ${manajemenPengetahuan.p12} + 
          ${manajemenPengetahuan.p13} + ${manajemenPengetahuan.p14} + ${manajemenPengetahuan.p15},
          0
        )`,
        forumScore: sql<number>`COALESCE(
          ${forumPembelajaran.p16} + ${forumPembelajaran.p17} + ${forumPembelajaran.p18} + ${forumPembelajaran.p19},
          0
        )`,
        sistemScore: sql<number>`COALESCE(
          ${sistemPembelajaran.p20} + ${sistemPembelajaran.p21} + 
          ${sistemPembelajaran.p22} + ${sistemPembelajaran.p23},
          0
        )`,
        strategiScore: sql<number>`COALESCE(
          ${strategiPembelajaran.p24} + ${strategiPembelajaran.p25} + 
          ${strategiPembelajaran.p26} + ${strategiPembelajaran.p27} + ${strategiPembelajaran.p28},
          0
        )`,
        teknologiScore: sql<number>`COALESCE(
          ${teknologiPembelajaran.p29} + ${teknologiPembelajaran.p30} + 
          ${teknologiPembelajaran.p31} + ${teknologiPembelajaran.p32} + ${teknologiPembelajaran.p33},
          0
        )`,
        integrasiScore: sql<number>`COALESCE(
          ${integrasiSistem.p34} + ${integrasiSistem.p35} + ${integrasiSistem.p36} + ${integrasiSistem.p37},
          0
        )`,
        evaluasiScore: sql<number>`COALESCE(
          ${evaluasiAsnCorpu.p38} + ${evaluasiAsnCorpu.p39} + ${evaluasiAsnCorpu.p40} + ${evaluasiAsnCorpu.p41},
          0
        )`,
        // Skor agregat
        totalScore: sql<number>`COALESCE(
          (${strukturAsnCorpu.p7} + ${strukturAsnCorpu.p8} + ${strukturAsnCorpu.p9} + ${strukturAsnCorpu.p10}) +
          (${manajemenPengetahuan.p11} + ${manajemenPengetahuan.p12} + ${manajemenPengetahuan.p13} + ${manajemenPengetahuan.p14} + ${manajemenPengetahuan.p15}) +
          (${forumPembelajaran.p16} + ${forumPembelajaran.p17} + ${forumPembelajaran.p18} + ${forumPembelajaran.p19}) +
          (${sistemPembelajaran.p20} + ${sistemPembelajaran.p21} + ${sistemPembelajaran.p22} + ${sistemPembelajaran.p23}) +
          (${strategiPembelajaran.p24} + ${strategiPembelajaran.p25} + ${strategiPembelajaran.p26} + ${strategiPembelajaran.p27} + ${strategiPembelajaran.p28}) +
          (${teknologiPembelajaran.p29} + ${teknologiPembelajaran.p30} + ${teknologiPembelajaran.p31} + ${teknologiPembelajaran.p32} + ${teknologiPembelajaran.p33}) +
          (${integrasiSistem.p34} + ${integrasiSistem.p35} + ${integrasiSistem.p36} + ${integrasiSistem.p37}) +
          (${evaluasiAsnCorpu.p38} + ${evaluasiAsnCorpu.p39} + ${evaluasiAsnCorpu.p40} + ${evaluasiAsnCorpu.p41}),
          0
        )`,
      })
      .from(surveiCorpu)
      .leftJoin(users, eq(surveiCorpu.userId, users.id))
      .leftJoin(masterInstansiType, eq(users.instansiId, masterInstansiType.id))
      .leftJoin(strukturAsnCorpu, eq(surveiCorpu.id, strukturAsnCorpu.surveiId))
      .leftJoin(manajemenPengetahuan, eq(surveiCorpu.id, manajemenPengetahuan.surveiId))
      .leftJoin(forumPembelajaran, eq(surveiCorpu.id, forumPembelajaran.surveiId))
      .leftJoin(sistemPembelajaran, eq(surveiCorpu.id, sistemPembelajaran.surveiId))
      .leftJoin(strategiPembelajaran, eq(surveiCorpu.id, strategiPembelajaran.surveiId))
      .leftJoin(teknologiPembelajaran, eq(surveiCorpu.id, teknologiPembelajaran.surveiId))
      .leftJoin(integrasiSistem, eq(surveiCorpu.id, integrasiSistem.surveiId))
      .leftJoin(evaluasiAsnCorpu, eq(surveiCorpu.id, evaluasiAsnCorpu.surveiId))
      .where(whereClause)
      .orderBy(surveiCorpu.updatedAt)
      .limit(limit)
      .offset(offset);

    // Format respons
    const allSummaries = surveys.map((row) => {
      const categories = [
        { category: 'Struktur ASN Corpu', score: row.strukturScore },
        { category: 'Manajemen Pengetahuan', score: row.manajemenScore },
        { category: 'Forum Pembelajaran', score: row.forumScore },
        { category: 'Sistem Pembelajaran', score: row.sistemScore },
        { category: 'Strategi Pembelajaran', score: row.strategiScore },
        { category: 'Teknologi Pembelajaran', score: row.teknologiScore },
        { category: 'Integrasi Sistem', score: row.integrasiScore },
        { category: 'Evaluasi ASN Corpu', score: row.evaluasiScore },
      ];

      return {
        surveiId: row.surveiId,
        userId: row.userId,
        tahun: row.tahun,
        fullName: row.fullName,
        categories,
        summary: { totalScore: row.totalScore },
      };
    });

    return NextResponse.json({
      success: true,
      data: allSummaries,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/summary_kategori error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}