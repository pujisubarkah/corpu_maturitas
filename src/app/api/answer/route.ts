import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import {
  surveiCorpu,
  kompetensiGenerikNasional,
  strukturAsnCorpu,
  manajemenPengetahuan,
  forumPembelajaran,
  sistemPembelajaran,
  strategiPembelajaran,
  teknologiPembelajaran,
  integrasiSistem,
  evaluasiAsnCorpu
} from '../../../lib/schemas/profile_surveys'
import { eq, and } from 'drizzle-orm'
import { users } from '../../../lib/schemas/user'
import { masterInstansiType } from '../../../lib/schemas/instansi'

export async function simpanJawaban(data: {
  userId: number;
  tahun: number;
  p1?: number; p2?: number; p3?: number; p4?: number; p5?: number; p6?: number;
  p7?: number; p8?: number; p9?: number; p10?: number;
  p11?: number; p12?: number; p13?: number; p14?: number; p15?: number;
  p16?: number; p17?: number; p18?: number; p19?: number;
  p20?: number; p21?: number; p22?: number; p23?: number;
  p24?: number; p25?: number; p26?: number; p27?: number; p28?: number;
  p29?: string; p30?: string; p31?: string; p32?: string; p33?: string;
  p34?: number; p35?: number; p36?: number; p37?: number;
  p38?: number; p39?: number; p40?: number; p41?: number;
  buktiDukung?: {
    kompetensi?: string;
    struktur?: string;
    manajemen?: string;
    forum?: string;
    sistem?: string;
    strategi?: string;
    teknologi?: string;
    integrasi?: string;
    evaluasi?: string;
  };
}) {
  try {
    // 1️⃣ Buat atau update survei utama
    const [survei] = await db.insert(surveiCorpu)
      .values({
        userId: data.userId,
        tahun: data.tahun
      })
      .onConflictDoUpdate({
        target: [surveiCorpu.userId, surveiCorpu.tahun],
        set: { updatedAt: new Date() }
      })
      .returning({ id: surveiCorpu.id });

    const surveiId = survei.id;

    // 2️⃣ Simpan data ke masing-masing tabel kategori
    const promises = [];

    // Kompetensi Generik Nasional
    if (data.p1 !== undefined || data.p2 !== undefined || data.p3 !== undefined ||
        data.p4 !== undefined || data.p5 !== undefined || data.p6 !== undefined) {
      promises.push(
        db.insert(kompetensiGenerikNasional)
          .values({
            surveiId,
            p1: data.p1, p2: data.p2, p3: data.p3,
            p4: data.p4, p5: data.p5, p6: data.p6,
            buktiDukung: data.buktiDukung?.kompetensi || null
          })
          .onConflictDoUpdate({
            target: kompetensiGenerikNasional.surveiId,
            set: {
              p1: data.p1, p2: data.p2, p3: data.p3,
              p4: data.p4, p5: data.p5, p6: data.p6,
              buktiDukung: data.buktiDukung?.kompetensi || null,
              updatedAt: new Date()
            }
          })
      );
    }

    // Struktur ASN Corpu
    if (data.p7 !== undefined || data.p8 !== undefined || data.p9 !== undefined || data.p10 !== undefined) {
      promises.push(
        db.insert(strukturAsnCorpu)
          .values({
            surveiId,
            p7: data.p7, p8: data.p8, p9: data.p9, p10: data.p10,
            buktiDukung: data.buktiDukung?.struktur || null
          })
          .onConflictDoUpdate({
            target: strukturAsnCorpu.surveiId,
            set: {
              p7: data.p7, p8: data.p8, p9: data.p9, p10: data.p10,
              buktiDukung: data.buktiDukung?.struktur || null,
              updatedAt: new Date()
            }
          })
      );
    }

    // Manajemen Pengetahuan
    if (data.p11 !== undefined || data.p12 !== undefined || data.p13 !== undefined ||
        data.p14 !== undefined || data.p15 !== undefined) {
      promises.push(
        db.insert(manajemenPengetahuan)
          .values({
            surveiId,
            p11: data.p11, p12: data.p12, p13: data.p13, p14: data.p14, p15: data.p15,
            buktiDukung: data.buktiDukung?.manajemen || null
          })
          .onConflictDoUpdate({
            target: manajemenPengetahuan.surveiId,
            set: {
              p11: data.p11, p12: data.p12, p13: data.p13, p14: data.p14, p15: data.p15,
              buktiDukung: data.buktiDukung?.manajemen || null,
              updatedAt: new Date()
            }
          })
      );
    }

    // Forum Pembelajaran
    if (data.p16 !== undefined || data.p17 !== undefined || data.p18 !== undefined || data.p19 !== undefined) {
      promises.push(
        db.insert(forumPembelajaran)
          .values({
            surveiId,
            p16: data.p16, p17: data.p17, p18: data.p18, p19: data.p19,
            buktiDukung: data.buktiDukung?.forum || null
          })
          .onConflictDoUpdate({
            target: forumPembelajaran.surveiId,
            set: {
              p16: data.p16, p17: data.p17, p18: data.p18, p19: data.p19,
              buktiDukung: data.buktiDukung?.forum || null,
              updatedAt: new Date()
            }
          })
      );
    }

    // Sistem Pembelajaran
    if (data.p20 !== undefined || data.p21 !== undefined || data.p22 !== undefined || data.p23 !== undefined) {
      promises.push(
        db.insert(sistemPembelajaran)
          .values({
            surveiId,
            p20: data.p20, p21: data.p21, p22: data.p22, p23: data.p23,
            buktiDukung: data.buktiDukung?.sistem || null
          })
          .onConflictDoUpdate({
            target: sistemPembelajaran.surveiId,
            set: {
              p20: data.p20, p21: data.p21, p22: data.p22, p23: data.p23,
              buktiDukung: data.buktiDukung?.sistem || null,
              updatedAt: new Date()
            }
          })
      );
    }

    // Strategi Pembelajaran
    if (data.p24 !== undefined || data.p25 !== undefined || data.p26 !== undefined ||
        data.p27 !== undefined || data.p28 !== undefined) {
      promises.push(
        db.insert(strategiPembelajaran)
          .values({
            surveiId,
            p24: data.p24, p25: data.p25, p26: data.p26, p27: data.p27, p28: data.p28,
            buktiDukung: data.buktiDukung?.strategi || null
          })
          .onConflictDoUpdate({
            target: strategiPembelajaran.surveiId,
            set: {
              p24: data.p24, p25: data.p25, p26: data.p26, p27: data.p27, p28: data.p28,
              buktiDukung: data.buktiDukung?.strategi || null,
              updatedAt: new Date()
            }
          })
      );
    }

    // Teknologi Pembelajaran
    if (data.p29 !== undefined || data.p30 !== undefined || data.p31 !== undefined ||
        data.p32 !== undefined || data.p33 !== undefined) {
      promises.push(
        db.insert(teknologiPembelajaran)
          .values({
            surveiId,
            p29: data.p29, p30: data.p30, p31: data.p31, p32: data.p32, p33: data.p33,
            buktiDukung: data.buktiDukung?.teknologi || null
          })
          .onConflictDoUpdate({
            target: teknologiPembelajaran.surveiId,
            set: {
              p29: data.p29, p30: data.p30, p31: data.p31, p32: data.p32, p33: data.p33,
              buktiDukung: data.buktiDukung?.teknologi || null,
              updatedAt: new Date()
            }
          })
      );
    }

    // Integrasi Sistem
    if (data.p34 !== undefined || data.p35 !== undefined || data.p36 !== undefined || data.p37 !== undefined) {
      promises.push(
        db.insert(integrasiSistem)
          .values({
            surveiId,
            p34: data.p34, p35: data.p35, p36: data.p36, p37: data.p37,
            buktiDukung: data.buktiDukung?.integrasi || null
          })
          .onConflictDoUpdate({
            target: integrasiSistem.surveiId,
            set: {
              p34: data.p34, p35: data.p35, p36: data.p36, p37: data.p37,
              buktiDukung: data.buktiDukung?.integrasi || null,
              updatedAt: new Date()
            }
          })
      );
    }

    // Evaluasi ASN Corpu
    if (data.p38 !== undefined || data.p39 !== undefined || data.p40 !== undefined || data.p41 !== undefined) {
      promises.push(
        db.insert(evaluasiAsnCorpu)
          .values({
            surveiId,
            p38: data.p38, p39: data.p39, p40: data.p40, p41: data.p41,
            buktiDukung: data.buktiDukung?.evaluasi || null
          })
          .onConflictDoUpdate({
            target: evaluasiAsnCorpu.surveiId,
            set: {
              p38: data.p38, p39: data.p39, p40: data.p40, p41: data.p41,
              buktiDukung: data.buktiDukung?.evaluasi || null,
              updatedAt: new Date()
            }
          })
      );
    }

    // Execute all inserts/updates
    await Promise.all(promises);

    return { success: true, surveiId, message: 'Jawaban berhasil disimpan' };

  } catch (error) {
    console.error('Error saving jawaban:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// POST endpoint untuk API
export async function POST(request: Request) {
  try {
    const data = await request.json();

    const result = await simpanJawaban(data);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error('POST jawaban error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET endpoint untuk mendapatkan data survei
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const tahun = url.searchParams.get('tahun');
    const id = url.searchParams.get('id'); // surveiId

    // Jika ada parameter id, ambil data survei berdasarkan ID
    if (id) {
      const surveiId = parseInt(id);

      // Cari survei utama berdasarkan ID
      const surveiRecord = await db.select()
        .from(surveiCorpu)
        .where(eq(surveiCorpu.id, surveiId));

      if (surveiRecord.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'Data survei tidak ditemukan'
        }, { status: 404 });
      }

      // Ambil nama_instansi untuk survei ini
      const [instansiRow] = await db.select({
        nama_instansi: masterInstansiType.nama_instansi,
        userFullName: users.fullName
      })
        .from(masterInstansiType)
        .leftJoin(users, eq(users.instansiId, masterInstansiType.id))
        .where(eq(users.id, surveiRecord[0].userId))
        .limit(1);

      // Ambil data dari semua tabel kategori
      const [
        kompetensiData,
        strukturData,
        manajemenData,
        forumData,
        sistemData,
        strategiData,
        teknologiData,
        integrasiData,
        evaluasiData
      ] = await Promise.all([
        db.select().from(kompetensiGenerikNasional).where(eq(kompetensiGenerikNasional.surveiId, surveiId)),
        db.select().from(strukturAsnCorpu).where(eq(strukturAsnCorpu.surveiId, surveiId)),
        db.select().from(manajemenPengetahuan).where(eq(manajemenPengetahuan.surveiId, surveiId)),
        db.select().from(forumPembelajaran).where(eq(forumPembelajaran.surveiId, surveiId)),
        db.select().from(sistemPembelajaran).where(eq(sistemPembelajaran.surveiId, surveiId)),
        db.select().from(strategiPembelajaran).where(eq(strategiPembelajaran.surveiId, surveiId)),
        db.select().from(teknologiPembelajaran).where(eq(teknologiPembelajaran.surveiId, surveiId)),
        db.select().from(integrasiSistem).where(eq(integrasiSistem.surveiId, surveiId)),
        db.select().from(evaluasiAsnCorpu).where(eq(evaluasiAsnCorpu.surveiId, surveiId))
      ]);

      const result = {
        surveiId,
        userId: surveiRecord[0].userId,
        tahun: surveiRecord[0].tahun,
        fullName: instansiRow ? (instansiRow.nama_instansi || instansiRow.userFullName) : null,
        createdAt: surveiRecord[0].createdAt,
        updatedAt: surveiRecord[0].updatedAt,
        // Gabungkan semua data p1-p41
        ...(kompetensiData[0] && {
          p1: kompetensiData[0].p1, p2: kompetensiData[0].p2, p3: kompetensiData[0].p3,
          p4: kompetensiData[0].p4, p5: kompetensiData[0].p5, p6: kompetensiData[0].p6,
          buktiDukungKompetensi: kompetensiData[0].buktiDukung
        }),
        ...(strukturData[0] && {
          p7: strukturData[0].p7, p8: strukturData[0].p8, p9: strukturData[0].p9, p10: strukturData[0].p10,
          buktiDukungStruktur: strukturData[0].buktiDukung
        }),
        ...(manajemenData[0] && {
          p11: manajemenData[0].p11, p12: manajemenData[0].p12, p13: manajemenData[0].p13,
          p14: manajemenData[0].p14, p15: manajemenData[0].p15,
          buktiDukungManajemen: manajemenData[0].buktiDukung
        }),
        ...(forumData[0] && {
          p16: forumData[0].p16, p17: forumData[0].p17, p18: forumData[0].p18, p19: forumData[0].p19,
          buktiDukungForum: forumData[0].buktiDukung
        }),
        ...(sistemData[0] && {
          p20: sistemData[0].p20, p21: sistemData[0].p21, p22: sistemData[0].p22, p23: sistemData[0].p23,
          buktiDukungSistem: sistemData[0].buktiDukung
        }),
        ...(strategiData[0] && {
          p24: strategiData[0].p24, p25: strategiData[0].p25, p26: strategiData[0].p26,
          p27: strategiData[0].p27, p28: strategiData[0].p28,
          buktiDukungStrategi: strategiData[0].buktiDukung
        }),
        ...(teknologiData[0] && {
          p29: teknologiData[0].p29, p30: teknologiData[0].p30, p31: teknologiData[0].p31,
          p32: teknologiData[0].p32, p33: teknologiData[0].p33,
          buktiDukungTeknologi: teknologiData[0].buktiDukung
        }),
        ...(integrasiData[0] && {
          p34: integrasiData[0].p34, p35: integrasiData[0].p35, p36: integrasiData[0].p36, p37: integrasiData[0].p37,
          buktiDukungIntegrasi: integrasiData[0].buktiDukung
        }),
        ...(evaluasiData[0] && {
          p38: evaluasiData[0].p38, p39: evaluasiData[0].p39, p40: evaluasiData[0].p40, p41: evaluasiData[0].p41,
          buktiDukungEvaluasi: evaluasiData[0].buktiDukung
        })
      };

      return NextResponse.json({ success: true, data: result });
    }

    // Jika tidak ada parameter, kembalikan data semua survei dengan detail lengkap
    if (!userId || !tahun) {
      // Ambil semua survei
      const allSurveys = await db.select({
        surveiId: surveiCorpu.id,
        userId: surveiCorpu.userId,
        tahun: surveiCorpu.tahun,
        nama_instansi: masterInstansiType.nama_instansi,
        userFullName: users.fullName,
        createdAt: surveiCorpu.createdAt,
        updatedAt: surveiCorpu.updatedAt
      })
        .from(surveiCorpu)
        .leftJoin(users, eq(surveiCorpu.userId, users.id))
        .leftJoin(masterInstansiType, eq(users.instansiId, masterInstansiType.id))
        .orderBy(surveiCorpu.updatedAt);

      // Untuk setiap survei, ambil data lengkap dari semua tabel
      const surveysWithData = await Promise.all(
        allSurveys.map(async (survey) => {
          const surveiId = survey.surveiId;

          // Ambil data dari semua tabel kategori
          const [
            kompetensiData,
            strukturData,
            manajemenData,
            forumData,
            sistemData,
            strategiData,
            teknologiData,
            integrasiData,
            evaluasiData
          ] = await Promise.all([
            db.select().from(kompetensiGenerikNasional).where(eq(kompetensiGenerikNasional.surveiId, surveiId)),
            db.select().from(strukturAsnCorpu).where(eq(strukturAsnCorpu.surveiId, surveiId)),
            db.select().from(manajemenPengetahuan).where(eq(manajemenPengetahuan.surveiId, surveiId)),
            db.select().from(forumPembelajaran).where(eq(forumPembelajaran.surveiId, surveiId)),
            db.select().from(sistemPembelajaran).where(eq(sistemPembelajaran.surveiId, surveiId)),
            db.select().from(strategiPembelajaran).where(eq(strategiPembelajaran.surveiId, surveiId)),
            db.select().from(teknologiPembelajaran).where(eq(teknologiPembelajaran.surveiId, surveiId)),
            db.select().from(integrasiSistem).where(eq(integrasiSistem.surveiId, surveiId)),
            db.select().from(evaluasiAsnCorpu).where(eq(evaluasiAsnCorpu.surveiId, surveiId))
          ]);

          return {
            surveiId: survey.surveiId,
            userId: survey.userId,
            tahun: survey.tahun,
            fullName: survey.nama_instansi || survey.userFullName,
            createdAt: survey.createdAt,
            updatedAt: survey.updatedAt,
            // Gabungkan semua data p1-p41
            ...(kompetensiData[0] && {
              p1: kompetensiData[0].p1, p2: kompetensiData[0].p2, p3: kompetensiData[0].p3,
              p4: kompetensiData[0].p4, p5: kompetensiData[0].p5, p6: kompetensiData[0].p6,
              buktiDukungKompetensi: kompetensiData[0].buktiDukung
            }),
            ...(strukturData[0] && {
              p7: strukturData[0].p7, p8: strukturData[0].p8, p9: strukturData[0].p9, p10: strukturData[0].p10,
              buktiDukungStruktur: strukturData[0].buktiDukung
            }),
            ...(manajemenData[0] && {
              p11: manajemenData[0].p11, p12: manajemenData[0].p12, p13: manajemenData[0].p13,
              p14: manajemenData[0].p14, p15: manajemenData[0].p15,
              buktiDukungManajemen: manajemenData[0].buktiDukung
            }),
            ...(forumData[0] && {
              p16: forumData[0].p16, p17: forumData[0].p17, p18: forumData[0].p18, p19: forumData[0].p19,
              buktiDukungForum: forumData[0].buktiDukung
            }),
            ...(sistemData[0] && {
              p20: sistemData[0].p20, p21: sistemData[0].p21, p22: sistemData[0].p22, p23: sistemData[0].p23,
              buktiDukungSistem: sistemData[0].buktiDukung
            }),
            ...(strategiData[0] && {
              p24: strategiData[0].p24, p25: strategiData[0].p25, p26: strategiData[0].p26,
              p27: strategiData[0].p27, p28: strategiData[0].p28,
              buktiDukungStrategi: strategiData[0].buktiDukung
            }),
            ...(teknologiData[0] && {
              p29: teknologiData[0].p29, p30: teknologiData[0].p30, p31: teknologiData[0].p31,
              p32: teknologiData[0].p32, p33: teknologiData[0].p33,
              buktiDukungTeknologi: teknologiData[0].buktiDukung
            }),
            ...(integrasiData[0] && {
              p34: integrasiData[0].p34, p35: integrasiData[0].p35, p36: integrasiData[0].p36, p37: integrasiData[0].p37,
              buktiDukungIntegrasi: integrasiData[0].buktiDukung
            }),
            ...(evaluasiData[0] && {
              p38: evaluasiData[0].p38, p39: evaluasiData[0].p39, p40: evaluasiData[0].p40, p41: evaluasiData[0].p41,
              buktiDukungEvaluasi: evaluasiData[0].buktiDukung
            })
          };
        })
      );

      return NextResponse.json({
        success: true,
        data: surveysWithData,
        message: 'Data semua survei dengan detail lengkap'
      });
    }

    // Cari survei utama berdasarkan userId dan tahun
    const surveiRecord = await db.select()
      .from(surveiCorpu)
      .where(and(
        eq(surveiCorpu.userId, parseInt(userId)),
        eq(surveiCorpu.tahun, parseInt(tahun))
      ));

    if (surveiRecord.length === 0) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'Data survei tidak ditemukan'
      });
    }

    const surveiId = surveiRecord[0].id;

  // Ambil nama_instansi untuk survei ini
  const [instansiRow] = await db.select({ 
    nama_instansi: masterInstansiType.nama_instansi,
    userFullName: users.fullName 
  })
    .from(masterInstansiType)
    .leftJoin(users, eq(users.instansiId, masterInstansiType.id))
    .where(eq(users.id, surveiRecord[0].userId))
    .limit(1);

    // Ambil data dari semua tabel kategori
    const [
      kompetensiData,
      strukturData,
      manajemenData,
      forumData,
      sistemData,
      strategiData,
      teknologiData,
      integrasiData,
      evaluasiData
    ] = await Promise.all([
      db.select().from(kompetensiGenerikNasional).where(eq(kompetensiGenerikNasional.surveiId, surveiId)),
      db.select().from(strukturAsnCorpu).where(eq(strukturAsnCorpu.surveiId, surveiId)),
      db.select().from(manajemenPengetahuan).where(eq(manajemenPengetahuan.surveiId, surveiId)),
      db.select().from(forumPembelajaran).where(eq(forumPembelajaran.surveiId, surveiId)),
      db.select().from(sistemPembelajaran).where(eq(sistemPembelajaran.surveiId, surveiId)),
      db.select().from(strategiPembelajaran).where(eq(strategiPembelajaran.surveiId, surveiId)),
      db.select().from(teknologiPembelajaran).where(eq(teknologiPembelajaran.surveiId, surveiId)),
      db.select().from(integrasiSistem).where(eq(integrasiSistem.surveiId, surveiId)),
      db.select().from(evaluasiAsnCorpu).where(eq(evaluasiAsnCorpu.surveiId, surveiId))
    ]);

    const result = {
      surveiId,
      userId: parseInt(userId),
      tahun: parseInt(tahun),
      fullName: instansiRow ? (instansiRow.nama_instansi || instansiRow.userFullName) : null,
      createdAt: surveiRecord[0].createdAt,
      updatedAt: surveiRecord[0].updatedAt,
      // Gabungkan semua data p1-p41
      ...(kompetensiData[0] && {
        p1: kompetensiData[0].p1, p2: kompetensiData[0].p2, p3: kompetensiData[0].p3,
        p4: kompetensiData[0].p4, p5: kompetensiData[0].p5, p6: kompetensiData[0].p6,
        buktiDukungKompetensi: kompetensiData[0].buktiDukung
      }),
      ...(strukturData[0] && {
        p7: strukturData[0].p7, p8: strukturData[0].p8, p9: strukturData[0].p9, p10: strukturData[0].p10,
        buktiDukungStruktur: strukturData[0].buktiDukung
      }),
      ...(manajemenData[0] && {
        p11: manajemenData[0].p11, p12: manajemenData[0].p12, p13: manajemenData[0].p13,
        p14: manajemenData[0].p14, p15: manajemenData[0].p15,
        buktiDukungManajemen: manajemenData[0].buktiDukung
      }),
      ...(forumData[0] && {
        p16: forumData[0].p16, p17: forumData[0].p17, p18: forumData[0].p18, p19: forumData[0].p19,
        buktiDukungForum: forumData[0].buktiDukung
      }),
      ...(sistemData[0] && {
        p20: sistemData[0].p20, p21: sistemData[0].p21, p22: sistemData[0].p22, p23: sistemData[0].p23,
        buktiDukungSistem: sistemData[0].buktiDukung
      }),
      ...(strategiData[0] && {
        p24: strategiData[0].p24, p25: strategiData[0].p25, p26: strategiData[0].p26,
        p27: strategiData[0].p27, p28: strategiData[0].p28,
        buktiDukungStrategi: strategiData[0].buktiDukung
      }),
      ...(teknologiData[0] && {
        p29: teknologiData[0].p29, p30: teknologiData[0].p30, p31: teknologiData[0].p31,
        p32: teknologiData[0].p32, p33: teknologiData[0].p33,
        buktiDukungTeknologi: teknologiData[0].buktiDukung
      }),
      ...(integrasiData[0] && {
        p34: integrasiData[0].p34, p35: integrasiData[0].p35, p36: integrasiData[0].p36, p37: integrasiData[0].p37,
        buktiDukungIntegrasi: integrasiData[0].buktiDukung
      }),
      ...(evaluasiData[0] && {
        p38: evaluasiData[0].p38, p39: evaluasiData[0].p39, p40: evaluasiData[0].p40, p41: evaluasiData[0].p41,
        buktiDukungEvaluasi: evaluasiData[0].buktiDukung
      })
    };

    return NextResponse.json({ success: true, data: result });

  } catch (error) {
    console.error('GET jawaban error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}