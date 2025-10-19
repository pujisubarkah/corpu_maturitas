import React from 'react'
import Navbar from '@/src/components/sections/Navbar'
import Footer from '@/src/components/sections/Footer'
import ASNcorpuwheel from '@/src/components/ASNcorpuwheel'

export default function TentangPage() {
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1 container mx-auto px-6 py-12">
				<h1 className="text-3xl font-bold mb-6">Tentang ASN Corpu</h1>
				<p className="mb-6 text-gray-700">Berikut adalah visualisasi struktur dan elemen ASN Corpu.</p>

				<ASNcorpuwheel />
			</main>
			<Footer />
		</div>
	)
}

