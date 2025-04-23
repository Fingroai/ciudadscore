"use client";
import React from "react";
import Image from "next/image";
import FeedReportes from "../components/FeedReportes";
import ReportesConEstadisticas from "../components/ReportesConEstadisticas";
import Mapa from "../components/Mapa";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  type ReporteMarcador = {
    id: string;
    zona: string;
    categoria: string;
    descripcion: string;
    lat: number;
    lon: number;
  };
  const [reportesMapa, setReportesMapa] = useState<ReporteMarcador[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    async function fetchReportesMapa() {
      const { data, error } = await supabase
        .from("reportes")
        .select("id, zona, categoria, descripcion, lat, lon");
      if (!error && data) {
        const marcadores = data.filter(r => typeof r.lat === "number" && typeof r.lon === "number")
          .map(r => ({
            id: r.id,
            zona: r.zona,
            categoria: r.categoria,
            descripcion: r.descripcion,
            lat: r.lat,
            lon: r.lon
          }));
        setReportesMapa(marcadores);
      }
    }
    fetchReportesMapa();
    interval = setInterval(fetchReportesMapa, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-[#FFFDE7] text-[#232323] font-sans">
      {/* HERO */}
      <section className="flex flex-col items-center justify-center flex-1 px-4 pt-16 pb-10 text-center bg-gradient-to-b from-[#FFD600] via-[#FFFDE7] to-white">
        <div className="flex flex-col items-center">
          <span className="mx-auto mb-6 drop-shadow-2xl bg-white rounded-full border-4 border-[#FFD600] flex items-center justify-center" style={{width:180, height:180}}>
  {/* SVG LOGO CiudadScore.gt */}
  <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="70" cy="70" r="66" stroke="#222" strokeWidth="8" fill="#FFD600"/>
    <g>
      <rect x="40" y="60" width="16" height="32" fill="#222"/>
      <rect x="62" y="44" width="16" height="48" fill="#222"/>
      <rect x="84" y="54" width="16" height="38" fill="#222"/>
      <polygon points="35,110 70,95 105,110 70,120" fill="#222"/>
    </g>
  </svg>
</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 max-w-2xl leading-tight">
            Tu zona merece más <span className="text-[#4CAF50]">Reporta, comparte, cambia.</span>
          </h1>
          <p className="mb-8 text-lg max-w-xl mx-auto font-medium text-[#4A4A4A]">
            CiudadScore.gt te da el poder de visibilizar problemas urbanos y generar presión para que la municipalidad actúe. <span className="text-[#4CAF50] font-bold">La voz ciudadana sí cuenta.</span>
          </p>
          <a
            href="/reportar"
            className="inline-block px-10 py-4 rounded-full bg-[#4A4A4A] text-[#FFD600] text-xl font-bold shadow-lg hover:bg-[#333] transition-colors tracking-wide mb-2"
          >
            Envía tu reporte ahora
          </a>
          <span className="text-xs text-[#757575] mt-2">Es gratis, rápido y puedes hacerlo de forma anónima.</span>
        </div>
      </section>

      {/* PASOS */}
      <section className="py-10 px-4 bg-white text-[#232323]">
        <h2 className="text-2xl font-bold mb-8 text-center">¿Cómo funciona?</h2>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-stretch">
          <div className="flex-1 flex flex-col items-center p-4">
            <span className="bg-[#FFD600] rounded-full w-16 h-16 flex items-center justify-center text-3xl font-extrabold mb-2 border-4 border-[#4A4A4A] shadow">📸</span>
            <p className="font-bold text-lg mb-1">Reporta</p>
            <span className="text-sm text-[#757575]">Sube foto, ubicación y cuenta qué pasa</span>
          </div>
          <div className="flex-1 flex flex-col items-center p-4">
            <span className="bg-[#4CAF50] rounded-full w-16 h-16 flex items-center justify-center text-3xl font-extrabold mb-2 border-4 border-[#4A4A4A] text-white shadow">🌎</span>
            <p className="font-bold text-lg mb-1">Se publica</p>
            <span className="text-sm text-[#757575]">Tu reporte aparece en el mapa y ranking</span>
          </div>
          <div className="flex-1 flex flex-col items-center p-4">
            <span className="bg-[#4A4A4A] rounded-full w-16 h-16 flex items-center justify-center text-3xl font-extrabold mb-2 border-4 border-[#FFD600] text-[#FFD600] shadow">🏆</span>
            <p className="font-bold text-lg mb-1">Tu zona sube o baja</p>
            <span className="text-sm text-[#757575]">Entre más participación, mejor puntaje</span>
          </div>
        </div>
      </section>

      {/* REPORTES + ESTADÍSTICAS */}
      <ReportesConEstadisticas />

      {/* MAPA INTERACTIVO */}
      <Mapa reportes={reportesMapa} />
    </main>
  );
}
