"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Bell, Search } from 'lucide-react';

function initials(name?: string) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Header() {
  const params = useParams();
  const slug = params?.slug ?? '';
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('currentUser');
      if (raw) {
        const u = JSON.parse(raw);
        setUserName(u?.fullName ?? u?.full_name ?? u?.username ?? null);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <header className="w-full bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-linear-to-br from-blue-100 to-indigo-100">
            <Image src="/logo-lan.png" alt="Logo" width={40} height={40} className="object-contain" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
            <div className="text-sm text-gray-500">{slug ? `Pengguna: ${slug}` : 'Overview'}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center bg-gray-100 rounded-full px-3 py-1 gap-2">
            <Search className="h-4 w-4 text-gray-500" />
            <input placeholder="Search..." className="bg-transparent text-sm outline-none" />
          </div>

          <div className="relative">
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium leading-none text-white bg-red-500 rounded-full">3</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center font-semibold text-blue-700">{initials(userName ?? undefined)}</div>
            <div className="hidden sm:block text-right">
              <div className="text-sm text-gray-500">Signed in as</div>
              <div className="text-sm font-medium text-gray-900">{userName ?? 'Guest'}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
