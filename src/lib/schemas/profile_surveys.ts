import { pgTable, serial, bigint, integer, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

// ======================================
// 🧭 SURVEI CORPU (tabel utama)
// ======================================
export const surveiCorpu = pgTable("survei_corpu", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number" }).notNull(),
  tahun: integer("tahun").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  uniqueUserYear: uniqueIndex("unique_user_year").on(table.userId, table.tahun),
}));

// ======================================
// 1️⃣ Kompetensi Generik Nasional
// ======================================
export const kompetensiGenerikNasional = pgTable("kompetensi_generik_nasional", {
  surveiId: integer("survei_id")
    .primaryKey()
    .references(() => surveiCorpu.id, { onDelete: "cascade" }),
  p1: integer("p1"),
  p2: integer("p2"),
  p3: integer("p3"),
  p4: integer("p4"),
  p5: integer("p5"),
  p6: integer("p6"),
  buktiDukung: text("bukti_dukung"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ======================================
// 2️⃣ Struktur ASN Corpu
// ======================================
export const strukturAsnCorpu = pgTable("struktur_asn_corpu", {
  surveiId: integer("survei_id")
    .primaryKey()
    .references(() => surveiCorpu.id, { onDelete: "cascade" }),
  p7: integer("p7"),
  p8: integer("p8"),
  p9: integer("p9"),
  p10: integer("p10"),
  buktiDukung: text("bukti_dukung"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ======================================
// 3️⃣ Manajemen Pengetahuan
// ======================================
export const manajemenPengetahuan = pgTable("manajemen_pengetahuan", {
  surveiId: integer("survei_id")
    .primaryKey()
    .references(() => surveiCorpu.id, { onDelete: "cascade" }),
  p11: integer("p11"),
  p12: integer("p12"),
  p13: integer("p13"),
  p14: integer("p14"),
  p15: integer("p15"),
  buktiDukung: text("bukti_dukung"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ======================================
// 4️⃣ Forum Pembelajaran
// ======================================
export const forumPembelajaran = pgTable("forum_pembelajaran", {
  surveiId: integer("survei_id")
    .primaryKey()
    .references(() => surveiCorpu.id, { onDelete: "cascade" }),
  p16: integer("p16"),
  p17: integer("p17"),
  p18: integer("p18"),
  p19: integer("p19"),
  buktiDukung: text("bukti_dukung"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ======================================
// 5️⃣ Sistem Pembelajaran
// ======================================
export const sistemPembelajaran = pgTable("sistem_pembelajaran", {
  surveiId: integer("survei_id")
    .primaryKey()
    .references(() => surveiCorpu.id, { onDelete: "cascade" }),
  p20: integer("p20"),
  p21: integer("p21"),
  p22: integer("p22"),
  p23: integer("p23"),
  buktiDukung: text("bukti_dukung"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ======================================
// 6️⃣ Strategi Pembelajaran
// ======================================
export const strategiPembelajaran = pgTable("strategi_pembelajaran", {
  surveiId: integer("survei_id")
    .primaryKey()
    .references(() => surveiCorpu.id, { onDelete: "cascade" }),
  p24: integer("p24"),
  p25: integer("p25"),
  p26: integer("p26"),
  p27: integer("p27"),
  p28: integer("p28"),
  buktiDukung: text("bukti_dukung"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ======================================
// 7️⃣ Teknologi Pembelajaran
// ======================================
export const teknologiPembelajaran = pgTable("teknologi_pembelajaran", {
  surveiId: integer("survei_id")
    .primaryKey()
    .references(() => surveiCorpu.id, { onDelete: "cascade" }),
  p29: text("p29"),
  p30: text("p30"),
  p31: text("p31"),
  p32: text("p32"),
  p33: text("p33"),
  buktiDukung: text("bukti_dukung"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ======================================
// 8️⃣ Integrasi Sistem
// ======================================
export const integrasiSistem = pgTable("integrasi_sistem", {
  surveiId: integer("survei_id")
    .primaryKey()
    .references(() => surveiCorpu.id, { onDelete: "cascade" }),
  p34: integer("p34"),
  p35: integer("p35"),
  p36: integer("p36"),
  p37: integer("p37"),
  buktiDukung: text("bukti_dukung"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ======================================
// 9️⃣ Evaluasi ASN Corpu
// ======================================
export const evaluasiAsnCorpu = pgTable("evaluasi_asn_corpu", {
  surveiId: integer("survei_id")
    .primaryKey()
    .references(() => surveiCorpu.id, { onDelete: "cascade" }),
  p38: integer("p38"),
  p39: integer("p39"),
  p40: integer("p40"),
  p41: integer("p41"),
  buktiDukung: text("bukti_dukung"),
  updatedAt: timestamp("updated_at").defaultNow(),
});
