'use client';

import React from 'react';

type Segment = {
  number: number;
  title: string;
  descriptions: string[];
  color: string;
  bgColor: string;
};

const segments: Segment[] = [
  {
    number: 1,
    title: 'Struktur ASN Corpu',
    descriptions: [
      'Dewan Pengarah Pembelajaran',
      'Koordinator Pembelajaran (Chief of Learning Officer)',
      'Koordinator Kelompok Keahlian (Chief of Group Skill)'
    ],
    color: '#0F172A', // bg-blue-900
    bgColor: '#1E40AF' // bg-blue-800
  },
  {
    number: 2,
    title: 'Manajemen Pengetahuan',
    descriptions: [
      'Pengelolaan pengetahuan baik tacit maupun eksplisit untuk penyelenggaraan Pengembangan Kompetensi'
    ],
    color: '#EF4444', // bg-red-500
    bgColor: '#DC2626' // bg-red-600
  },
  {
    number: 3,
    title: 'Forum Pembelajaran',
    descriptions: ['Level Strategis', 'Level Operasional', 'Level Teknis'],
    color: '#9CA3AF', // bg-gray-400
    bgColor: '#6B7280' // bg-gray-500
  },
  {
    number: 4,
    title: 'Sistem Pembelajaran',
    descriptions: [
      'Diagnosis kebutuhan pembelajaran',
      'Pengembangan desain pembelajaran',
      'Implementasi pembelajaran',
      'Evaluasi pembelajaran'
    ],
    color: '#F59E0B', // bg-yellow-500
    bgColor: '#D97706' // bg-yellow-600
  },
  {
    number: 5,
    title: 'Integrasi Pembelajaran',
    descriptions: [
      'Visi Misi dan Arah Kebijakan Organisasi',
      'Pengembangan Budaya Organisasi',
      'Teknologi Pembelajaran',
      'Manajemen Pengetahuan',
      'Manajemen Talenta dan Pengembangan Karier',
      'Penilaian Kinerja Pegawai'
    ],
    color: '#2563EB', // bg-indigo-600
    bgColor: '#1D4ED8' // bg-indigo-700
  },
  {
    number: 6,
    title: 'Teknologi Pembelajaran',
    descriptions: [
      'Pemanfaatan teknologi informasi dan komunikasi untuk mendukung keberhasilan pencapaian tujuan pembelajaran'
    ],
    color: '#F57C00', // bg-orange-500
    bgColor: '#FB8C00' // bg-orange-600
  },
  {
    number: 7,
    title: 'Strategi Pembelajaran',
    descriptions: [
      'Pembelajaran formal',
      'Pembelajaran berbasis lingkungan sosial',
      'Pembelajaran berbasis pengalaman'
    ],
    color: '#16A34A', // bg-green-600
    bgColor: '#15803D' // bg-green-700
  }
];

const RADIUS = 150; // jari-jari lingkaran utama
const CENTER_X = 200;
const CENTER_Y = 200;
const SEGMENT_ANGLE = 360 / segments.length; // ~51.43°

function getPointOnCircle(angleDeg: number, radius: number) {
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER_X + radius * Math.cos(angleRad),
    y: CENTER_Y + radius * Math.sin(angleRad)
  };
}

function createWedgePath(startAngle: number, endAngle: number, innerRadius = 0) {
  const start = getPointOnCircle(startAngle, RADIUS);
  const end = getPointOnCircle(endAngle, RADIUS);
  const innerStart = getPointOnCircle(startAngle, innerRadius);
  const innerEnd = getPointOnCircle(endAngle, innerRadius);

  return `
    M ${CENTER_X} ${CENTER_Y}
    L ${innerStart.x} ${innerStart.y}
    A ${RADIUS} ${RADIUS} 0 0 1 ${end.x} ${end.y}
    L ${CENTER_X} ${CENTER_Y}
    Z
  `;
}

function getSegmentCenter(startAngle: number, endAngle: number) {
  const midAngle = startAngle + (endAngle - startAngle) / 2;
  const point = getPointOnCircle(midAngle, RADIUS * 0.6); // 60% dari jari-jari
  return { x: point.x, y: point.y };
}

export default function ASNcorpuwheel(): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white">
      <h2 className="text-2xl font-bold mb-6">ASN Corpu</h2>

      <div className="relative w-[500px] h-[500px]">
        {/* SVG Lingkaran Utama */}
        <svg width="400" height="400" viewBox="0 0 400 400" className="mx-auto">
          {/* Lingkaran pusat */}
          <circle cx={CENTER_X} cy={CENTER_Y} r="40" fill="white" stroke="#9CA3AF" strokeWidth="2" />

          {/* Logo & teks pusat */}
          <text x={CENTER_X} y={CENTER_Y - 10} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1F2937">
            ASN Corpu
          </text>
          <text x={CENTER_X} y={CENTER_Y + 10} textAnchor="middle" fontSize="12" fill="#6B7280">
            🏛️
          </text>

          {/* Render setiap sektor (wedge) */}
          {segments.map((item, index) => {
            const startAngle = index * SEGMENT_ANGLE - 90; // mulai dari atas
            const endAngle = startAngle + SEGMENT_ANGLE;

            const path = createWedgePath(startAngle, endAngle);
            const center = getSegmentCenter(startAngle, endAngle);

            return (
              <g key={index}>
                {/* Sektor lingkaran */}
                <path d={path} fill={item.color} stroke="#fff" strokeWidth="1" />

                {/* Nomor di tengah sektor */}
                <text
                  x={center.x}
                  y={center.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="20"
                  fontWeight="bold"
                  fill="white"
                >
                  {item.number}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Teks deskripsi di luar lingkaran */}
        {segments.map((item, index) => {
          const startAngle = index * SEGMENT_ANGLE - 90;
          const endAngle = startAngle + SEGMENT_ANGLE;
          const midAngle = startAngle + SEGMENT_ANGLE / 2;

          const outerPoint = getPointOnCircle(midAngle, RADIUS + 80); // 80px di luar lingkaran

          // Garis penghubung dari pusat ke teks
          const lineStart = getPointOnCircle(midAngle, RADIUS);
          const lineEnd = getPointOnCircle(midAngle, RADIUS + 60);

          return (
            <React.Fragment key={index}>
              {/* Garis penghubung tipis */}
              <svg
                width="400"
                height="400"
                viewBox="0 0 400 400"
                className="absolute top-0 left-0 pointer-events-none"
                style={{ transform: 'translate(-50%, -50%)', top: '50%', left: '50%' }}
              >
                <line
                  x1={lineStart.x}
                  y1={lineStart.y}
                  x2={lineEnd.x}
                  y2={lineEnd.y}
                  stroke="#9CA3AF"
                  strokeWidth="1"
                />
              </svg>

              {/* Kotak teks deskripsi */}
              <div
                className={`absolute text-left w-64 p-4 rounded-md text-white shadow-lg ${item.bgColor}`}
                style={{
                  top: `${outerPoint.y}px`,
                  left: `${outerPoint.x}px`,
                  transform: 'translate(-50%, -50%)',
                  maxWidth: '250px'
                }}
              >
                <h3 className="font-bold mb-2">{item.title}</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {item.descriptions.map((desc, i) => (
                    <li key={i}>{desc}</li>
                  ))}
                </ul>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}