const { Pool } = require('pg');

async function testConnection() {
  const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_PVUJoDC5SZO1@ep-divine-art-a1a7tqpt-pooler.ap-southeast-1.aws.neon.tech/corpu?sslmode=require&channel_binding=require'
  });

  try {
    console.log('Testing database connection...');
    const result = await pool.query('SELECT 1 as test');
    console.log('Database connected successfully:', result.rows);

    // Check if tables exist
    console.log('Checking if tables exist...');
    const tablesResult = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('survei_corpu', 'kompetensi_generik_nasional', 'struktur_asn_corpu', 'manajemen_pengetahuan', 'forum_pembelajaran', 'sistem_pembelajaran', 'strategi_pembelajaran', 'teknologi_pembelajaran', 'integrasi_sistem', 'evaluasi_asn_corpu')
    `);
    console.log('Existing tables:', tablesResult.rows.map(row => row.table_name));

  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await pool.end();
  }
}

testConnection();