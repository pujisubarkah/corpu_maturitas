// Test file to verify schema imports
import {
  kompetensiGenerikNasional,
  strukturAsnCorpu,
  strategiPembelajaran,
  pengelolaanPengetahuan
} from '../lib/schema.js';

console.log('Schema berhasil di-import:');
console.log('kompetensiGenerikNasional:', typeof kompetensiGenerikNasional);
console.log('strukturAsnCorpu:', typeof strukturAsnCorpu);
console.log('strategiPembelajaran:', typeof strategiPembelajaran);
console.log('pengelolaanPengetahuan:', typeof pengelolaanPengetahuan);