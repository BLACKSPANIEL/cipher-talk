'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Главная', href: '/' },
    { label: 'Как это работает', href: '/#how-it-works' },
    { label: 'Песочница', href: '/#sandbox' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md border-b border-green-500/20" />

      <div className="container relative flex items-center justify-between h-16 mx-auto px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Shield className="h-6 w-6 text-green-400 group-hover:text-green-300 transition" />
            <div className="absolute inset-0 bg-green-500/30 blur-lg group-hover:bg-green-500/50 transition" />
          </div>
          <span className="text-lg font-bold text-white group-hover:text-green-300 transition">
            Cipher Talk
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-gray-300 hover:text-green-400 transition"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/chat">
            <Button variant="secondary" className="text-xs">
              Веб-версия
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-green-400 hover:text-green-300 transition"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
        transition={{ duration: 0.2 }}
        className={`absolute top-16 left-0 right-0 md:hidden ${isOpen ? 'block' : 'hidden'}`}
      >
        <div className="bg-black/80 backdrop-blur-md border-b border-green-500/20 px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block text-sm text-gray-300 hover:text-green-400 transition py-2"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="flex gap-3 pt-3">
            <Link href="/chat" className="flex-1">
              <Button variant="secondary" className="w-full text-xs">
                Веб-версия
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </nav>
  );
}