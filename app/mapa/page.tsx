"use client";
import React, { useEffect, useState } from "react";
import Mapa from "../../components/Mapa";
import { supabase } from "../../lib/supabaseClient";

export default function MapaPage() {
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
    
    // Definiendo un tipo para los datos que vienen de Supabase
    type ReporteDB = {
      id: string;
      zona: string;
      categoria: string;
      descripcion: string;
      lat: number | null;
      lon: number | null;
    };
    
    async function fetchReportesMapa() {
      const { data, error } = await supabase
        .from("reportes")
        .select("id, zona, categoria, descripcion, lat, lon");
      
      if (!error && data) {
        // Asegurando que data es tipado correctamente
        const reportesData = data as ReporteDB[];
        
        const marcadores = reportesData
          .filter((r: ReporteDB) => typeof r.lat === "number" && typeof r.lon === "number")
          .map((r: ReporteDB) => ({
            id: r.id,
            zona: r.zona,
            categoria: r.categoria,
            descripcion: r.descripcion,
            lat: r.lat as number,  // Aseguramos que TypeScript sabe que es número
            lon: r.lon as number   // Aseguramos que TypeScript sabe que es número
          }));
          
        setReportesMapa(marcadores);
      }
    }
    fetchReportesMapa();
    interval = setInterval(fetchReportesMapa, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-2 py-8">
      <h1 className="text-3xl font-extrabold mb-4 text-center text-[#4A4A4A]">Mapa de reportes ciudadanos</h1>
      <Mapa reportes={reportesMapa} />
    </div>
  );
}
