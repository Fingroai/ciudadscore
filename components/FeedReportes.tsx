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

export default function FeedReportes() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReportes() {
      setLoading(true);
      const { data, error } = await supabase
        .from("reportes")
        .select("id, zona, categoria, descripcion, fotos, fecha, estado")
        .order("fecha", { ascending: false })
        .limit(6);
      if (!error && data) setReportes(data);
      setLoading(false);
    }
    fetchReportes();
  }, []);

  if (loading) return <div className="text-center py-8">Cargando reportes...</div>;
  if (!reportes.length) return <div className="text-center py-8 text-gray-500">Aún no hay reportes recientes.</div>;

  return (
    <div>
      <h3 className="text-xl font-extrabold mb-4 flex items-center gap-2"><span className="text-[#4CAF50]">●</span> Últimos reportes</h3>
      <div className="grid gap-5">
        {reportes.map((r) => (
          <div key={r.id} className="rounded-xl bg-white p-5 shadow-lg flex flex-col gap-2 border-l-8 border-[#FFD600]">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-lg capitalize">{r.categoria}</span>
              <span className="bg-[#FFD600] text-[#4A4A4A] rounded-full px-3 py-1 text-xs font-bold ml-2">{r.zona}</span>
              {r.estado && <span className="text-xs ml-auto px-2 py-1 rounded bg-[#4CAF50] text-white font-semibold">{r.estado}</span>}
            </div>
            <span className="text-sm italic text-[#4A4A4A]">{r.descripcion}</span>
            {r.fotos && r.fotos.length > 0 && (
              <div className="flex gap-2 mt-2">
                {r.fotos.map((url, i) => (
                  <img key={i} src={url} alt="foto" className="h-20 w-20 object-cover rounded shadow border border-gray-200" />
                ))}
              </div>
            )}
            <span className="text-xs text-[#757575] mt-2">{new Date(r.fecha).toLocaleString("es-GT", { dateStyle: "short", timeStyle: "short" })}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
