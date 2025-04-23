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
    <div className="max-w-5xl mx-auto px-2 py-8">
      <h1 className="text-3xl font-extrabold mb-4 text-center text-[#4A4A4A]">Mapa de reportes ciudadanos</h1>
      <Mapa reportes={reportesMapa} />
    </div>
  );
}
