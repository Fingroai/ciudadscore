"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function MunicipalidadPage() {
  const [showCalendly, setShowCalendly] = useState(false);
  
  return (
    <main className="min-h-screen bg-white text-[#333] font-sans overflow-hidden">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-b from-[#FFD600] to-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-full border-4 border-[#FFD600] p-4 drop-shadow-xl">
              <svg width="80" height="80" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="70" cy="70" r="66" stroke="#222" strokeWidth="8" fill="#FFD600"/>
                <g>
                  <rect x="40" y="60" width="16" height="32" fill="#222"/>
                  <rect x="62" y="44" width="16" height="48" fill="#222"/>
                  <rect x="84" y="54" width="16" height="38" fill="#222"/>
                  <polygon points="35,110 70,95 105,110 70,120" fill="#222"/>
                </g>
              </svg>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-6 text-[#333]">
            CiudadScore.gt: <span className="text-[#4CAF50]">transforme los reportes ciudadanos</span> en decisiones inteligentes.
          </h1>
          
          <p className="text-xl text-center mb-8 max-w-3xl mx-auto text-[#4A4A4A]">
            Visualice los problemas urbanos por zona, priorice con datos reales y comunique avances con evidencia pública.
          </p>
          
          <div className="flex justify-center mb-12">
            <button 
              onClick={() => setShowCalendly(true)}
              className="px-8 py-4 bg-[#4CAF50] text-white rounded-full text-xl font-bold hover:bg-[#3d9c40] transition shadow-xl"
            >
              Agendar reunión
            </button>
          </div>
        </div>
      </section>

      {/* El problema */}
      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#4A4A4A]">
            El <span className="text-[#4CAF50]">problema</span>
          </h2>
          
          <p className="text-xl text-center mb-10 max-w-3xl mx-auto">
            Hoy, las ciudades reciben miles de reclamos por diferentes canales: redes sociales, llamadas, chats y ventanillas.
            Pero esta información no está organizada, centralizada ni visualizada por zona.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Decisiones reactivas",
                icon: "🔥",
                color: "#FFD600"
              },
              {
                title: "Presión sin contexto",
                icon: "📊",
                color: "#4CAF50"
              },
              {
                title: "Dificultad para priorizar",
                icon: "📋",
                color: "#4A4A4A"
              },
              {
                title: "Complicaciones al comunicar avances",
                icon: "📣",
                color: "#4CAF50"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition flex flex-col items-center text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4"
                  style={{ backgroundColor: item.color, color: item.color === "#4A4A4A" ? "white" : "#333" }}
                >
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* La solución */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#4A4A4A]">
            La <span className="text-[#FFD600]">solución</span>
          </h2>
          
          <p className="text-xl text-center mb-12 max-w-3xl mx-auto">
            CiudadScore.gt es una plataforma que recopila y organiza reportes ciudadanos en tiempo real.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-[#FFFDE7] rounded-xl p-6 shadow border-l-4 border-[#FFD600]">
              <div className="text-3xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold mb-3">Mapa interactivo</h3>
              <p>Ver un mapa interactivo con todos los reportes urbanos por zona</p>
            </div>
            
            <div className="bg-[#FFFDE7] rounded-xl p-6 shadow border-l-4 border-[#4CAF50]">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3">Score público</h3>
              <p>Consultar el score (puntuación) público de cada zona</p>
            </div>
            
            <div className="bg-[#FFFDE7] rounded-xl p-6 shadow border-l-4 border-[#4A4A4A]">
              <div className="text-3xl mb-4">⚙️</div>
              <h3 className="text-xl font-bold mb-3">Panel institucional</h3>
              <p>Acceder a un panel exclusivo con filtros, reportes descargables y gestión de estados</p>
            </div>
          </div>
          
          <div className="bg-[#F8F8F8] p-8 rounded-2xl shadow-inner border border-gray-200">
            <h3 className="text-2xl font-bold mb-6 text-center">Panel institucional exclusivo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="bg-[#4CAF50] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 mt-1 flex-shrink-0">✓</div>
                <p>Filtros por fecha, categoría, estado</p>
              </div>
              <div className="flex items-start">
                <div className="bg-[#4CAF50] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 mt-1 flex-shrink-0">✓</div>
                <p>Reportes descargables</p>
              </div>
              <div className="flex items-start">
                <div className="bg-[#4CAF50] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 mt-1 flex-shrink-0">✓</div>
                <p>Visualización por zona</p>
              </div>
              <div className="flex items-start">
                <div className="bg-[#4CAF50] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 mt-1 flex-shrink-0">✓</div>
                <p>Opción de marcar reportes como "en proceso" o "resuelto"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 px-4 bg-[#4A4A4A] text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Beneficios para su <span className="text-[#FFD600]">equipo</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="flex">
              <div className="text-[#FFD600] text-4xl mr-4">1.</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Planificación más precisa</h3>
                <p className="text-gray-300">Priorice obras según datos reales</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="text-[#FFD600] text-4xl mr-4">2.</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Mejor comunicación institucional</h3>
                <p className="text-gray-300">Evidencie lo que se está haciendo</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="text-[#FFD600] text-4xl mr-4">3.</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Gestión por zonas</h3>
                <p className="text-gray-300">Detecte patrones, zonas críticas, evolución de reportes</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="text-[#FFD600] text-4xl mr-4">4.</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Mayor confianza ciudadana</h3>
                <p className="text-gray-300">Datos abiertos, visibles y trazables</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-[#FFFDE7]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Agende una reunión con nuestro equipo
          </h2>
          
          <p className="text-lg mb-10 max-w-3xl mx-auto text-[#4A4A4A]">
            Le mostraremos en 30 minutos cómo puede utilizar CiudadScore.gt para mejorar la gestión urbana desde el primer día, sin necesidad de cambiar sus procesos actuales.
          </p>
          
          <button 
            onClick={() => setShowCalendly(true)}
            className="px-10 py-5 bg-[#4CAF50] text-white rounded-full text-xl font-bold hover:bg-[#3d9c40] transition shadow-xl"
          >
            Agendar reunión ahora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-[#333] text-white text-center">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-4">
            <svg width="40" height="40" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="70" cy="70" r="66" stroke="#fff" strokeWidth="8" fill="#FFD600"/>
              <g>
                <rect x="40" y="60" width="16" height="32" fill="#333"/>
                <rect x="62" y="44" width="16" height="48" fill="#333"/>
                <rect x="84" y="54" width="16" height="38" fill="#333"/>
                <polygon points="35,110 70,95 105,110 70,120" fill="#333"/>
              </g>
            </svg>
          </div>
          <p className="mb-2">© {new Date().getFullYear()} CiudadScore.gt - Todos los derechos reservados</p>
          <div className="flex justify-center space-x-4">
            <Link href="/" className="text-[#FFD600] hover:underline">Inicio</Link>
            <Link href="/reportar" className="text-[#FFD600] hover:underline">Reportar</Link>
            <Link href="/mapa" className="text-[#FFD600] hover:underline">Mapa</Link>
          </div>
        </div>
      </footer>

      {/* Calendly Modal */}
      {showCalendly && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl h-[80vh] relative">
            <button 
              onClick={() => setShowCalendly(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
            >
              ×
            </button>
            <div className="p-8 h-full">
              <h3 className="text-2xl font-bold mb-4 text-center">Agendar una reunión</h3>
              <div className="h-[calc(100%-6rem)] flex items-center justify-center">
                {/* Aquí agregará el código de Calendly */}
                <p className="text-center text-lg text-gray-600">
                  En una implementación real, aquí se integraría el widget de Calendly u otro sistema de agendamiento.<br/><br/>
                  <a href="https://calendly.com" target="_blank" rel="noopener noreferrer" className="text-[#4CAF50] font-medium">
                    Haga clic aquí para integrar Calendly
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
