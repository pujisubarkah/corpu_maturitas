// ======================================
// Evaluasi ASN Corpu
// ======================================
export const evaluasiAsnCorpu = pgTable("evaluasi_asn_corpu", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number" }),
  tahun: integer("tahun").notNull(),
  p38: integer("p38"),
  p39: integer("p39"),
  p40: integer("p40"),
  p41: integer("p41"),
  vp38: integer("vp38"),
  vp39: integer("vp39"),
  vp40: integer("vp40"),
  vp41: integer("vp41"),
  isVerified: boolean("is_verified").default(false),
  verifiedBy: bigint("verified_by", { mode: "number" }),
  verifiedAt: timestamp("verified_at"),
  verifikatorNotes: text("verifikator_notes"),
  buktiDukung: jsonb("bukti_dukung"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
// ======================================
// Integrasi Sistem
// ======================================
export const integrasiSistem = pgTable("integrasi_sistem", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number" }),
  tahun: integer("tahun").notNull(),
  p34: integer("p34"),
  p35: integer("p35"),
  p36: integer("p36"),
  p37: integer("p37"),
  vp34: integer("vp34"),
  vp35: integer("vp35"),
  vp36: integer("vp36"),
  vp37: integer("vp37"),
  isVerified: boolean("is_verified").default(false),
  verifiedBy: bigint("verified_by", { mode: "number" }),
  verifiedAt: timestamp("verified_at"),
  verifikatorNotes: text("verifikator_notes"),
  buktiDukung: jsonb("bukti_dukung"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
// ======================================
// Teknologi Pembelajaran
// ======================================
export const teknologiPembelajaran = pgTable("teknologi_pembelajaran", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number" }),
  tahun: integer("tahun").notNull(),
  p29: text("p29"),
  p30: text("p30"),
  p31: text("p31"),
  p32: text("p32"),
  p33: text("p33"),
  vp29: text("vp29"),
  vp30: text("vp30"),
  vp31: text("vp31"),
  vp32: text("vp32"),
  vp33: text("vp33"),
  isVerified: boolean("is_verified").default(false),
  verifiedBy: bigint("verified_by", { mode: "number" }),
  verifiedAt: timestamp("verified_at"),
  verifikatorNotes: text("verifikator_notes"),
  buktiDukung: jsonb("bukti_dukung"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
// ======================================
// Strategi Pembelajaran (p24-p28, vp24-vp28)
// ======================================
export const strategiPembelajaran = pgTable("strategi_pembelajaran", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number" }),
  tahun: integer("tahun").notNull(),
  p24: integer("p24"),
  p25: integer("p25"),
  p26: integer("p26"),
  p27: integer("p27"),
  p28: integer("p28"),
  vp24: integer("vp24"),
  vp25: integer("vp25"),
  vp26: integer("vp26"),
  vp27: integer("vp27"),
  vp28: integer("vp28"),
  isVerified: boolean("is_verified").default(false),
  verifiedBy: bigint("verified_by", { mode: "number" }),
  verifiedAt: timestamp("verified_at"),
  verifikatorNotes: text("verifikator_notes"),
  buktiDukung: jsonb("bukti_dukung"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
// ======================================
// Sistem Pembelajaran
// ======================================
export const sistemPembelajaran = pgTable("sistem_pembelajaran", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number" }),
  tahun: integer("tahun").notNull(),
  p20: integer("p20"),
  p21: integer("p21"),
  p22: integer("p22"),
  p23: integer("p23"),
  vp20: integer("vp20"),
  vp21: integer("vp21"),
  vp22: integer("vp22"),
  vp23: integer("vp23"),
  isVerified: boolean("is_verified").default(false),
  verifiedBy: bigint("verified_by", { mode: "number" }),
  verifiedAt: timestamp("verified_at"),
  verifikatorNotes: text("verifikator_notes"),
  buktiDukung: jsonb("bukti_dukung"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
// ======================================
// Forum Pembelajaran
// ======================================
export const forumPembelajaran = pgTable("forum_pembelajaran", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number" }),
  tahun: integer("tahun").notNull(),
  p16: integer("p16"),
  p17: integer("p17"),
  p18: integer("p18"),
  p19: integer("p19"),
  vp16: integer("vp16"),
  vp17: integer("vp17"),
  vp18: integer("vp18"),
  vp19: integer("vp19"),
  isVerified: boolean("is_verified").default(false),
  verifiedBy: bigint("verified_by", { mode: "number" }),
  verifiedAt: timestamp("verified_at"),
  verifikatorNotes: text("verifikator_notes"),
  buktiDukung: jsonb("bukti_dukung"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

import { pgTable, serial, bigint, integer, text, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
// ======================================
// Manajemen Pengetahuan
// ======================================
export const manajemenPengetahuan = pgTable("manajemen_pengetahuan", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number" }),
  tahun: integer("tahun").notNull(),
  p11: integer("p11"),
  p12: integer("p12"),
  p13: integer("p13"),
  p14: integer("p14"),
  p15: integer("p15"),
  vp11: integer("vp11"),
  vp12: integer("vp12"),
  vp13: integer("vp13"),
  vp14: integer("vp14"),
  vp15: integer("vp15"),
  isVerified: boolean("is_verified").default(false),
  verifiedBy: bigint("verified_by", { mode: "number" }),
  verifiedAt: timestamp("verified_at"),
  verifikatorNotes: text("verifikator_notes"),
  buktiDukung: jsonb("bukti_dukung"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});



// ======================================
// 1️⃣ Kompetensi Generik Nasional
// ======================================
export const kompetensiGenerikNasional = pgTable("kompetensi_generik_nasional", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number" }),
  tahun: integer("tahun").notNull(),
  p1: integer("p1"),
  p2: integer("p2"),
  p3: integer("p3"),
  p4: integer("p4"),
  p5: integer("p5"),
  p6: integer("p6"),
  isVerified: boolean("is_verified").default(false),
  verifiedBy: bigint("verified_by", { mode: "number" }),
  verifiedAt: timestamp("verified_at"),
  verifikatorNotes: text("verifikator_notes"),
  buktiDukung: jsonb("bukti_dukung"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ======================================
// 2️⃣ Struktur ASN Corpu
// ======================================
export const strukturAsnCorpu = pgTable("struktur_asn_corpu", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number" }),
  tahun: integer("tahun").notNull(),
  p7: integer("p7"),
  p8: integer("p8"),
  p9: integer("p9"),
  p10: integer("p10"),
  vp7: integer("vp7"),
  vp8: integer("vp8"),
  vp9: integer("vp9"),
  vp10: integer("vp10"),
  isVerified: boolean("is_verified").default(false),
  verifiedBy: bigint("verified_by", { mode: "number" }),
  verifiedAt: timestamp("verified_at"),
  verifikatorNotes: text("verifikator_notes"),
  buktiDukung: jsonb("bukti_dukung"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
