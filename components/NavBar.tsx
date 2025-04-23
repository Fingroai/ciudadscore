"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 w-full bg-[#FFD600] shadow flex items-center justify-between px-4 sm:px-8 py-2">
      <div className="flex items-center gap-2">
        <Link href="/">
  <span className="bg-white rounded-full border-2 border-[#FFD600] flex items-center justify-center drop-shadow mr-2" style={{width:38, height:38}}>
    <svg width="28" height="28" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="70" cy="70" r="66" stroke="#222" strokeWidth="8" fill="#FFD600"/>
      <g>
        <rect x="40" y="60" width="16" height="32" fill="#222"/>
        <rect x="62" y="44" width="16" height="48" fill="#222"/>
        <rect x="84" y="54" width="16" height="38" fill="#222"/>
        <polygon points="35,110 70,95 105,110 70,120" fill="#222"/>
      </g>
    </svg>
  </span>
</Link>
        <Link href="/" className="font-extrabold text-lg sm:text-2xl tracking-tight text-[#4A4A4A]">CiudadScore<span className="text-[#4CAF50]">.gt</span></Link>
      </div>
      {/* Desktop links */}
      <div className="hidden md:flex gap-6 items-center font-semibold">
        <Link href="/mapa" className="hover:text-[#4CAF50] transition-colors">Mapa</Link>
        <Link href="/reportar" className="hover:text-[#4CAF50] transition-colors">Reportar</Link>
        <Link href="/municipalidad" className="ml-2 px-4 py-2 rounded-full bg-[#4A4A4A] text-[#FFD600] hover:bg-[#333] transition-colors shadow font-bold">Soy de la muni</Link>
      </div>
      {/* Mobile menu button */}
      <button className="md:hidden flex flex-col gap-1" onClick={() => setOpen(!open)} aria-label="Abrir menú">
        <span className={`block w-7 h-1 rounded bg-[#4A4A4A] transition-all ${open ? "rotate-45 translate-y-2" : ""}`}></span>
        <span className={`block w-7 h-1 rounded bg-[#4A4A4A] transition-all ${open ? "opacity-0" : ""}`}></span>
        <span className={`block w-7 h-1 rounded bg-[#4A4A4A] transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`}></span>
      </button>
      {/* Mobile menu */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-[#FFD600] flex flex-col items-center gap-4 py-4 shadow-md md:hidden animate-fade-in">
          <Link href="/mapa" className="font-semibold text-lg" onClick={() => setOpen(false)}>Mapa</Link>
          <Link href="/reportar" className="font-semibold text-lg" onClick={() => setOpen(false)}>Reportar</Link>
          <Link href="/municipalidad" className="px-4 py-2 rounded-full bg-[#4A4A4A] text-[#FFD600] font-bold mt-2" onClick={() => setOpen(false)}>Soy de la muni</Link>
        </div>
      )}
    </nav>
  );
}
