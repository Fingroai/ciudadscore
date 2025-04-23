"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface Reporte {
  id: string;
  zona: string;
  categoria: string;
  descripcion: string;
  fotos: string[];
  fecha: string;
  estado?: string;
}

export default function ReportesConEstadisticas() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [zonaSeleccionada, setZonaSeleccionada] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReportes() {
      setLoading(true);
      const { data, error } = await supabase
        .from("reportes")
        .select("id, zona, categoria, descripcion, fotos, fecha, estado")
        .order("fecha", { ascending: false });
      if (!error && data) setReportes(data);
      setLoading(false);
    }
    fetchReportes();
  }, []);

  // Zonas oficiales de la Ciudad de Guatemala (Zona 1 a Zona 25)
  const zonasCiudad = Array.from({ length: 25 }, (_, i) => `Zona ${i + 1}`);
  // Reportes filtrados
  const reportesFiltrados = zonaSeleccionada
    ? reportes.filter(r => r.zona === zonaSeleccionada)
    : reportes;
  // Estadísticas
  const totalReportes = reportesFiltrados.length;
  const zonasActivas = new Set(reportesFiltrados.map(r => r.zona)).size;
  const problemasResueltos = reportesFiltrados.filter(r => r.estado && r.estado.toLowerCase() === "resuelto").length;

  return (
    <section className="w-full max-w-4xl mx-auto mb-12">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 bg-[#FFD600] rounded-2xl p-6 flex flex-col items-center justify-center shadow-xl border-2 border-[#4A4A4A] transition-transform hover:scale-105 hover:shadow-2xl cursor-pointer">
          <span className="text-4xl mb-2">📋</span>
          <span className="text-4xl font-extrabold text-[#4A4A4A]">{totalReportes}</span>
          <span className="text-sm text-[#4A4A4A] font-semibold uppercase tracking-wide mt-1">Reportes</span>
        </div>
        <div className="flex-1 bg-[#4CAF50] rounded-2xl p-6 flex flex-col items-center justify-center shadow-xl border-2 border-[#388E3C] transition-transform hover:scale-105 hover:shadow-2xl cursor-pointer">
          <span className="text-4xl mb-2">🗺️</span>
          <span className="text-4xl font-extrabold text-white">{zonasActivas}</span>
          <span className="text-sm text-white font-semibold uppercase tracking-wide mt-1">Zonas activas</span>
        </div>
        <div className="flex-1 bg-[#232323] rounded-2xl p-6 flex flex-col items-center justify-center shadow-xl border-2 border-[#FFD600] transition-transform hover:scale-105 hover:shadow-2xl cursor-pointer">
          <span className="text-4xl mb-2">✅</span>
          <span className="text-4xl font-extrabold text-[#FFD600]">{problemasResueltos}</span>
          <span className="text-sm text-[#FFD600] font-semibold uppercase tracking-wide mt-1">Problemas resueltos</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h3 className="text-2xl font-extrabold flex items-center gap-2 mb-3 md:mb-0 text-[#232323]">
          <span className="inline-block w-5 h-5 bg-[#4CAF50] rounded-full mr-1"></span>
          Reportes recientes
        </h3>
        <div className="flex items-center gap-2 bg-[#FFFDE7] px-3 py-2 rounded-lg border border-[#FFD600] shadow-sm">
          <label htmlFor="zona-select" className="text-sm font-semibold text-[#4A4A4A] mr-1">Filtrar por zona:</label>
          <select
            id="zona-select"
            className="border-none bg-transparent text-base font-bold text-[#4A4A4A] focus:ring-2 focus:ring-[#4CAF50] focus:outline-none transition cursor-pointer"
            value={zonaSeleccionada}
            onChange={e => setZonaSeleccionada(e.target.value)}
          >
            <option value="">Todas</option>
            {zonasCiudad.map(z => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-14 text-[#FFD600] animate-pulse">
          <svg width="60" height="60" fill="none" className="mx-auto mb-2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#FFD600" strokeWidth="4" fill="#FFFDE7"/><path d="M12 6v6l4 2" stroke="#FFD600" strokeWidth="2" strokeLinecap="round"/></svg>
          Cargando reportes...
        </div>
      ) : !reportesFiltrados.length ? (
        <div className="text-center py-14 text-[#757575] flex flex-col items-center">
          <svg width="80" height="80" fill="none" className="mb-4" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" stroke="#FFD600" strokeWidth="3" fill="#FFFDE7"/><path d="M16 22h16M16 28h8" stroke="#4A4A4A" strokeWidth="2" strokeLinecap="round"/></svg>
          <span className="font-semibold">No hay reportes para esta zona.</span>
        </div>
      ) : (
        <div className="grid gap-7">
          {reportesFiltrados.slice(0, 8).map((r) => (
            <div key={r.id} className="rounded-2xl bg-[#FAFAFA] p-6 shadow-xl flex flex-col gap-2 border-l-8 border-[#FFD600] transition-transform hover:scale-[1.025] hover:shadow-2xl cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-lg capitalize text-[#232323]">{r.categoria}</span>
                <span className="bg-[#FFD600] text-[#4A4A4A] rounded-full px-3 py-1 text-xs font-bold ml-2 shadow">{r.zona}</span>
                {r.estado && <span className="text-xs ml-auto px-2 py-1 rounded bg-[#4CAF50] text-white font-semibold">{r.estado}</span>}
              </div>
              <span className="text-base italic text-[#4A4A4A]">{r.descripcion}</span>
              {r.fotos && r.fotos.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {r.fotos.map((url, i) => (
                    <img key={i} src={url} alt="foto" className="h-24 w-24 object-cover rounded-xl shadow border border-gray-200" />
                  ))}
                </div>
              )}
              <span className="text-xs text-[#757575] mt-2">{new Date(r.fecha).toLocaleString("es-GT", { dateStyle: "short", timeStyle: "short" })}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
