"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils"; // pastikan file utils tersedia
import {
  Users,
  FileText,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

type User = {
  username?: string;
  fullName?: string;
  roleId?: number;
};

function initials(name?: string) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Menu untuk admin
const adminMenu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    children: [
      { title: "Dashboard", href: "/[slug]/Dashboard" },
    ],
  },
  {
    title: "Manajemen",
    icon: Users,
    children: [
      { title: "User", href: "/[slug]/users" },
    ],
  },
  {
    title: "Survei",
    icon: FileText,
    children: [
      { title: "Survei", href: "/[slug]/Survei" },
    ],
  },
];

// Menu untuk non-admin
const userMenu = [
  {
    title: "",
    icon: FileText,
    children: [
          { title: "Profile", href: "/[slug]/profile" },
      { title: "Panduan", href: "/[slug]/Survei" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const slug = pathname.split("/")[1] || ""; // Ambil slug dari URL

  useEffect(() => {
    try {
      const raw = localStorage.getItem("currentUser");
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      console.warn("Failed to parse currentUser from localStorage", e);
    }
  }, []);

  const isAdmin = user?.username === "admin" || user?.roleId === 1;
  const menuItems = isAdmin ? adminMenu : userMenu;

  const isActive = (href: string) => {
    // Ganti placeholder [slug] dengan slug aktual
    const actualHref = href.replace("[slug]", slug);
    return pathname === actualHref;
  };

  return (
    <aside className="hidden md:block md:fixed md:left-0 md:top-0 md:h-screen md:w-[260px] md:min-w-[260px] md:max-w-[260px] bg-white border-r p-4 shadow-md overflow-y-auto z-30">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
          {initials(user?.fullName ?? user?.username)}
        </div>
        <div className="truncate">
          <div className="text-xs text-gray-500">Signed in as</div>
          <div className="text-sm font-semibold text-gray-800 truncate">
            {user?.fullName ?? user?.username ?? "Guest"}
          </div>
        </div>
      </div>

      {/* Menu */}
      {menuItems.map((section) => (
        <div key={section.title} className="mb-4">
          {section.title ? (
            <div className="flex items-center text-xs font-semibold text-gray-600 mb-2">
              <section.icon className="mr-2 w-4 h-4" />
              {section.title}
            </div>
          ) : null}
          <ul className="space-y-1 ml-2">
            {section.children.map((item) => {
              const actualHref = item.href.replace("[slug]", slug);
              const active = isActive(item.href);

              return (
                <li key={item.href}>
                  <Link href={actualHref}>
                    <div
                      className={cn(
                        "flex items-center text-sm font-medium p-2 rounded-lg transition-colors",
                        active
                          ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                      )}
                    >
                      <span className="ml-2 truncate">{item.title}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {/* Logout */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            try {
              localStorage.removeItem("currentUser");
            } catch (e) {
              console.warn("Failed to remove currentUser", e);
            }
            window.location.href = "/";
          }}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}