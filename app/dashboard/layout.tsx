"use client";
import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Componente de Layout para el Dashboard
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Panel Principal', href: '/dashboard', icon: '📊' },
    { name: 'Zonas', href: '/dashboard/zonas', icon: '🗺️' },
    { name: 'Reportes', href: '/dashboard/reportes', icon: '📝' },
    { name: 'Configuración', href: '/dashboard/configuracion', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDE7]">
      {/* Header */}
      <header className="bg-[#4A4A4A] text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full p-2 drop-shadow">
              <svg width="24" height="24" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="70" cy="70" r="66" stroke="#222" strokeWidth="8" fill="#FFD600"/>
                <g>
                  <rect x="40" y="60" width="16" height="32" fill="#222"/>
                  <rect x="62" y="44" width="16" height="48" fill="#222"/>
                  <rect x="84" y="54" width="16" height="38" fill="#222"/>
                  <polygon points="35,110 70,95 105,110 70,120" fill="#222"/>
                </g>
              </svg>
            </div>
            <h1 className="font-bold text-xl">
              Panel <span className="text-[#FFD600]">CiudadScore</span>
            </h1>
          </div>
          
          {/* Botón de menú móvil */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? '✕' : '☰'}
          </button>
          
          {/* Navegación de usuario */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-sm">
              Admin <span className="text-[#FFD600]">Municipal</span>
            </div>
            <Link href="/" className="text-sm text-white hover:text-[#FFD600] transition">
              Ver sitio
            </Link>
            <button className="bg-[#FFD600] text-[#4A4A4A] px-3 py-1 rounded-full text-sm font-medium hover:bg-yellow-400 transition">
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className={`bg-[#4A4A4A] text-white w-64 shadow-lg transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static top-16 bottom-0 z-30`}>
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      pathname === item.href 
                        ? 'bg-[#FFD600] text-[#4A4A4A] font-medium'
                        : 'hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            
            <hr className="my-6 border-gray-600" />
            
            <div className="bg-[#333] p-4 rounded-lg">
              <h3 className="font-medium text-[#FFD600] mb-2">CiudadScore.gt</h3>
              <p className="text-sm text-gray-300">Panel administrativo para la gestión de reportes ciudadanos.</p>
            </div>
          </nav>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
