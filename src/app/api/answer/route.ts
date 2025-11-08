import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import { eq, and } from 'drizzle-orm'
import { users } from '../../../lib/schemas/user'
import { masterInstansiType } from '../../../lib/schemas/instansi'
import { simpanJawaban } from '../../../lib/survey-utils'
import { surveiCorpu } from '../../../lib/schemas/profile_surveys'
import { kompetensiGenerikNasional } from '../../../lib/schemas/profile_surveys'
import { strukturAsnCorpu } from '../../../lib/schemas/profile_surveys'
import { manajemenPengetahuan } from '../../../lib/schemas/profile_surveys'
import { forumPembelajaran } from '../../../lib/schemas/profile_surveys'
import { sistemPembelajaran } from '../../../lib/schemas/profile_surveys'
import { strategiPembelajaran } from '../../../lib/schemas/profile_surveys'
import { teknologiPembelajaran } from '../../../lib/schemas/profile_surveys'
import { integrasiSistem } from '../../../lib/schemas/profile_surveys'
import { evaluasiAsnCorpu } from '../../../lib/schemas/profile_surveys'

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

      // Ambil data user dan instansi
      const [userRow] = await db.select({
        userId: users.id,
        instansiId: users.instansiId,
        userFullName: users.fullName,
        nama_instansi: masterInstansiType.nama_instansi
      })
        .from(users)
        .leftJoin(masterInstansiType, eq(users.instansiId, masterInstansiType.id))
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
        fullName: userRow ? (userRow.nama_instansi || userRow.userFullName) : null,
        instansiId: userRow?.instansiId || null,
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

  // Ambil data user dan instansi
  const [userRow] = await db.select({ 
    userId: users.id,
    instansiId: users.instansiId,
    userFullName: users.fullName,
    nama_instansi: masterInstansiType.nama_instansi
  })
    .from(users)
    .leftJoin(masterInstansiType, eq(users.instansiId, masterInstansiType.id))
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
      fullName: userRow ? (userRow.nama_instansi || userRow.userFullName) : null,
      instansiId: userRow?.instansiId || null,
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