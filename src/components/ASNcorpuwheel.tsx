'use client'

import React from 'react'
import Image from 'next/image'

export default function ASNcorpuwheel(): React.ReactElement {
  return (
    <section className="bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <div className="text-center my-2">
              {/* Responsive wrapper: maintain aspect ratio and let Image fill */}
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <Image src="/assets/7elemen.svg" alt="7 elemen ASN Corpu" fill className="object-contain rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}