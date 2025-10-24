"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Home, Users, FileText, LogOut } from 'lucide-react';

type User = {
  username?: string;
  fullName?: string;
  roleId?: number;
};

function initials(name?: string) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Sidebar() {
  const params = useParams();
  const slug = params?.slug ?? "";
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("currentUser");
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      console.warn("Failed to parse currentUser from localStorage", e);
    }
  }, []);

  const isAdmin = user?.username === "admin" || user?.roleId === 1;

  return (
  <aside className="w-full md:w-64 bg-linear-to-b from-blue-700 via-indigo-700 to-indigo-800 text-white rounded-lg shadow-xl p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center h-14 w-14 rounded-full bg-white/20 text-xl font-bold">{initials(user?.fullName ?? user?.username)}</div>
        <div>
          <div className="text-sm text-white/80">Signed in as</div>
          <div className="text-base font-semibold">{user?.fullName ?? user?.username ?? 'Guest'}</div>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        {isAdmin ? (
          <>
            <Link href={`/${slug}/Dashboard`} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition">
              <Home className="h-5 w-5 text-white/90" />
              <span className="font-medium">Dashboard</span>
            </Link>

            <Link href={`/${slug}/users`} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition">
              <Users className="h-5 w-5 text-white/90" />
              <span className="font-medium">User</span>
            </Link>

            <Link href={`/${slug}/Survei`} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition">
              <FileText className="h-5 w-5 text-white/90" />
              <span className="font-medium">Survey</span>
            </Link>
          </>
        ) : (
          <>
            <Link href={`/${slug}/Survei`} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition">
              <FileText className="h-5 w-5 text-white/90" />
              <span className="font-medium">Survey</span>
            </Link>
          </>
        )}
      </nav>

      <div className="mt-6 pt-4 border-t border-white/10">
        <button
          onClick={() => {
            try {
              localStorage.removeItem('currentUser');
            } catch (e) {
              console.warn('Failed to remove currentUser from localStorage', e);
            }
            // redirect to homepage
            window.location.href = '/';
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-600/20 transition text-red-100 font-medium"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
