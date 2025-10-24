"use client";

import Image from "next/image";
import Link from 'next/link';
import Navbar from '../../components/sections/Navbar';
import Footer from '../../components/sections/Footer';
import { motion } from 'framer-motion';

// Use motion.* components directly for correct typing with HTML props
// (No need to create MotionDiv, MotionAside, MotionSection aliases)

export default function MaturitasPage() {
    return (
        <>
            <Navbar />

            <main className="flex flex-col items-center justify-center min-h-screen py-12 px-4 bg-linear-to-b from-white to-blue-50">
                <div className="w-full max-w-6xl">
                    <section className="bg-linear-to-br from-white/80 via-white to-blue-50 rounded-2xl p-6 shadow-lg border border-gray-100">
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                                <div className="md:col-span-8 bg-white rounded-xl p-4 shadow-inner hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6 }}
                                        viewport={{ once: true, amount: 0.3 }}
                                    >
                                        <Image
                                            src="/maturitas.svg"
                                            alt="Maturitas diagram"
                                            width={1400}
                                            height={900}
                                            className="w-full h-auto"
                                            style={{ objectFit: "contain" }}
                                            priority
                                        />
                                        <p className="text-sm text-gray-500 mt-3">Diagram alur maturitas — jelaskan setiap tahap dan bagaimana pengukuran dilakukan.</p>
                                    </motion.div>
                                </div>
                                <div className="md:col-span-4 flex flex-col gap-4">
                                    <motion.div
                                        initial={{ opacity: 0, x: 10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: 0.15 }}
                                        viewport={{ once: true, amount: 0.3 }}
                                    >
                                        <Image src="/maturitas-people.png" alt="People" width={140} height={140} className="rounded-lg object-cover" />
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">Peran dan Dampak</h3>
                                            <p className="text-sm text-gray-500">Lihat bagaimana setiap peran berkontribusi pada peningkatan maturitas.</p>
                                        </div>

                                        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                                            <p className="text-sm text-gray-600 mb-3">Siap menilai? Mulai survei maturitas untuk instansi Anda.</p>
                                            <Link href="/login" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                                                Login untuk Memulai Survei
                                            </Link>
                                        </div>

                                        <div className="text-xs text-gray-400">Tip: Gunakan data terbaru untuk hasil penilaian yang akurat.</div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </section>
                    {/* motion.section is now called as a function, so no closing tag needed */}
                    <div className="mt-6 text-center text-sm text-gray-500">Anda dapat memperbesar gambar untuk melihat detail atau klik tombol di samping untuk memulai.</div>
                </div>
            </main>

            <Footer />
        </>
    );
}
