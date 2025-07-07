"use client"
import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { User, UserPlus, LogIn, EyeIcon, EyeOffIcon, KeyRound } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/src/components/ui/navigation-menu';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'user@example.com' && password === 'password') {
      setMessage('Login successful!');
    } else {
      setMessage('Invalid credentials.');
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="w-full bg-white shadow-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <img src="/logo-lan.png" alt="Logo LAN" className="h-10 w-auto" />
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <a href="/">Beranda</a>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <a href="/">Tentang</a>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <a href="/">Panduan</a>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <a href="/">Helpdesk</a>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <a href="/login">Masuk</a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
    </main>
  );
}