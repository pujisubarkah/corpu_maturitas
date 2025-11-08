import { db } from './db'
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
} from './schemas/profile_surveys'
import { jawaban } from './schemas/jawaban'
import { and, eq } from 'drizzle-orm'

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

export async function simpanJawabanVerifikasi(data: {
  instansiId: number;
  tahun: number;
  jawaban?: Record<string, string | number>;
  bukti_dukung?: Record<string, string>;
  verification_answers?: Record<string, string | number>;
  is_verified?: boolean;
  verified_by?: string;
  isVerification?: boolean;
}) {
  try {
    if (data.isVerification) {
      // This is a verification update - update verification_answers and verification status
      const result = await db.update(jawaban)
        .set({
          verification_answers: data.verification_answers,
          is_verified: data.is_verified || false,
          verified_by: data.verified_by || null,
          verified_at: data.is_verified ? new Date() : null,
          updated_at: new Date()
        })
        .where(and(
          eq(jawaban.instansi_id, data.instansiId),
          eq(jawaban.tahun, data.tahun)
        ))
        .returning({ id: jawaban.id });

      if (result.length === 0) {
        // If no record exists, create a new one with both original answers and verification
        const insertResult = await db.insert(jawaban)
          .values({
            instansi_id: data.instansiId,
            tahun: data.tahun,
            jawaban: data.jawaban, // Original survey data
            bukti_dukung: data.bukti_dukung || null,
            verification_answers: data.verification_answers, // Edited answers
            is_verified: data.is_verified || false,
            verified_by: data.verified_by || null,
            verified_at: data.is_verified ? new Date() : null,
            created_at: new Date(),
            updated_at: new Date()
          })
          .returning({ id: jawaban.id });

        return {
          success: true,
          jawabanId: insertResult[0].id,
          message: 'Verifikasi jawaban berhasil disimpan (record baru dibuat)'
        };
      }

      return {
        success: true,
        jawabanId: result[0].id,
        message: 'Verifikasi jawaban berhasil disimpan'
      };
    } else {
      // This is initial user submission - insert or update jawaban
      const result = await db.insert(jawaban)
        .values({
          instansi_id: data.instansiId,
          tahun: data.tahun,
          jawaban: data.jawaban,
          bukti_dukung: data.bukti_dukung || null,
          verification_answers: null, // Clear any previous verification answers
          is_verified: false, // Reset verification status for new submission
          verified_by: null,
          verified_at: null,
          updated_at: new Date()
        })
        .onConflictDoUpdate({
          target: [jawaban.instansi_id, jawaban.tahun],
          set: {
            jawaban: data.jawaban,
            bukti_dukung: data.bukti_dukung || null,
            verification_answers: null, // Clear verification answers on new submission
            is_verified: false, // Reset verification status
            verified_by: null,
            verified_at: null,
            updated_at: new Date()
          }
        })
        .returning({ id: jawaban.id });

      return {
        success: true,
        jawabanId: result[0].id,
        message: 'Jawaban berhasil disimpan'
      };
    }

  } catch (error) {
    console.error('Error saving jawaban:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}