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
	evaluasiAsnCorpu
} from '../../../lib/schemas/profile_surveys';
import { users } from '../../../lib/schemas/user';
import { masterInstansiType } from '../../../lib/schemas/instansi';
import { eq, inArray } from 'drizzle-orm';

// Helper: menentukan tingkat maturitas
function getMaturityLevel(score: number): string {
	if (score >= 0 && score <= 1000) return 'Initial';
	if (score >= 1001 && score <= 2000) return 'Intermediate (Low)';
	if (score >= 2001 && score <= 3000) return 'Intermediate (High)';
	if (score >= 3001 && score <= 3500) return 'Mature';
	if (score >= 3501) return 'Advanced';
	return 'Unknown';
}

export async function GET() {
			try {
				// Ambil semua survei + instansi + user
				const allSurveys = await db
					.select({
						surveiId: surveiCorpu.id,
						userId: surveiCorpu.userId,
						tahun: surveiCorpu.tahun,
						nama_instansi: masterInstansiType.nama_instansi,
						userFullName: users.fullName
					})
					.from(surveiCorpu)
					.leftJoin(users, eq(surveiCorpu.userId, users.id))
					.leftJoin(masterInstansiType, eq(users.instansiId, masterInstansiType.id));

				if (allSurveys.length === 0) {
					return NextResponse.json({
						success: true,
						data: {},
						message: 'Belum ada survei tersedia'
					});
				}

				const surveiIds = allSurveys.map((s) => s.surveiId);

				// Daftar kategori & pertanyaan
				const categories = [
					{ table: strukturAsnCorpu, questions: ['p7', 'p8', 'p9', 'p10'] },
					{ table: manajemenPengetahuan, questions: ['p11', 'p12', 'p13', 'p14', 'p15'] },
					{ table: forumPembelajaran, questions: ['p16', 'p17', 'p18', 'p19'] },
					{ table: sistemPembelajaran, questions: ['p20', 'p21', 'p22', 'p23'] },
					{ table: strategiPembelajaran, questions: ['p24', 'p25', 'p26', 'p27', 'p28'] },
					{ table: teknologiPembelajaran, questions: ['p29', 'p30', 'p31', 'p32', 'p33'] },
					{ table: integrasiSistem, questions: ['p34', 'p35', 'p36', 'p37'] },
					{ table: evaluasiAsnCorpu, questions: ['p38', 'p39', 'p40', 'p41'] }
				];

				// Ambil semua data kategori sekaligus
				const categoryData = await Promise.all(
					categories.map(async (cat) => {
						const data = await db
							.select()
							.from(cat.table)
							.where(inArray(cat.table.surveiId, surveiIds));
						return { table: cat.table, questions: cat.questions, data };
					})
				);

				// Buat map: surveiId -> totalScore
				const scoreMap = new Map<number, number>();

				// Hitung skor untuk setiap survei berdasarkan data kategori
				for (const cat of categoryData) {
									for (const record of cat.data as Array<{ surveiId: number; [key: string]: number | null }>) {
										let subtotal = 0;
										for (const q of cat.questions) {
											const value = record[q];
											if (typeof value === 'number' && !isNaN(value)) subtotal += value;
										}
										scoreMap.set(record.surveiId, (scoreMap.get(record.surveiId) ?? 0) + subtotal);
									}
				}

				// Ringkasan per tingkat maturitas
				type MaturitasKey = 'Initial' | 'Intermediate (Low)' | 'Intermediate (High)' | 'Mature' | 'Advanced';
				const summary: Record<MaturitasKey, number> = {
					Initial: 0,
					'Intermediate (Low)': 0,
					'Intermediate (High)': 0,
					Mature: 0,
					Advanced: 0
				};

				for (const [, score] of scoreMap.entries()) {
					const level = getMaturityLevel(score) as MaturitasKey;
					if (summary[level] !== undefined) summary[level]++;
				}

				return NextResponse.json({
					success: true,
					data: summary,
					message: 'Jumlah instansi berdasarkan tingkat maturitas'
				});
			} catch (error) {
				console.error('GET summary_maturitas error:', error);
				return NextResponse.json(
					{
						success: false,
						error: error instanceof Error ? error.message : 'Unknown error'
					},
					{ status: 500 }
				);
			}
}
