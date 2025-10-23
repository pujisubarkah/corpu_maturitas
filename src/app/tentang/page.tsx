import React from 'react'
import Image from 'next/image'
import Navbar from '@/src/components/sections/Navbar'
import Footer from '@/src/components/sections/Footer'

export default function TentangPage() {
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1">
				{/* Hero */}
					{/* Large two-column section: left badge, right hero for larger visibility */}
					<section className="py-3 mb-2">
						<div className="container mx-auto px-4 py-3" style={{ marginTop: 10, marginBottom: 10 }}>
							<div className="flex flex-col md:flex-row items-center gap-6">
								{/* Left: badge (centered on small screens) */}
								<div className="flex-1 md:flex-[0_0_40%] flex justify-center">
									<div className="max-w-[420px] w-full">
										{/* Text image above the badge */}
										<div className="mb-3 px-4">
											<Image src="/text-tentang-asn-corpu.svg" alt="Tentang ASN Corpu - Text" width={600} height={120} className="w-full h-auto mx-auto" priority />
										</div>
										<div className="w-72 sm:w-80 md:w-96 lg:w-[420px] transform transition-transform duration-300 hover:scale-105 mx-auto">
											<Image src="/tentang-asn-corpu.svg" alt="Tentang ASN Corpu" width={720} height={720} className="w-full h-auto mb-3" priority />
										</div>
									</div>
								</div>

								{/* Right: hero image (fills available width) */}
								<div className="flex-1 md:flex-[0_0_60%] flex items-center justify-center">
									<div className="w-full">
										<Image src="/asn-corpu.svg" alt="ASN Corpu hero" width={1200} height={800} className="w-full h-auto rounded-lg max-h-[56vh] object-contain" priority />
									</div>
								</div>
							</div>
						</div>
					</section>

					{/* Kerangka image section */}
					<section className="py-8 bg-white">
						<div className="container mx-auto px-6 text-center">
							<div className="max-w-4xl mx-auto">
								<Image src="/kerangka.svg" alt="Kerangka ASN Corpu" width={1200} height={600} className="w-full h-auto" priority />
							</div>
						</div>
					</section>

					{/* ASN image section */}
					<section className="py-8 bg-transparent">
						<div className="container mx-auto px-6 text-center">
							<div className="max-w-3xl mx-auto">
								<Image src="/asn.svg" alt="ASN" width={1000} height={400} className="w-full h-auto" priority />
							</div>
						</div>
					</section>


			</main>
			<Footer />
		</div>
	)
}

