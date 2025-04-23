"use client";
import React from 'react';

import { useState, useEffect } from "react";
import * as turf from '@turf/turf';

const categorias = [
  { value: "hoyo", label: "🕳️ Hoyo en la calle" },
  { value: "acera", label: "🚶‍♂️ Acera en mal estado" },
  { value: "alcantarilla", label: "🕳️ Alcantarilla tapada" },
  { value: "semaforo", label: "🚦 Semáforo dañado" },
  { value: "senalizacion", label: "🚧 Falta de señalización" },
  { value: "arbol", label: "🌳 Árbol caído" },
  { value: "agua", label: "💧 Fuga de agua" },
  { value: "drenaje", label: "🚽 Fuga de drenaje" },
  { value: "basura", label: "🗑️ Basura" },
  { value: "inseguridad", label: "🚨 Inseguridad" },
  { value: "alumbrado", label: "💡 Alumbrado público" },
  { value: "rio", label: "🌊 Río o barranco contaminado" },
  { value: "otro", label: "❓ Otro" },
];

export default function ReportarPage() {
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fotos, setFotos] = useState<File[]>([]);
  const [zona, setZona] = useState("");
  const [zonaDetectada, setZonaDetectada] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geojson, setGeojson] = useState<any>(null);
  const [anonimo, setAnonimo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Cargar GeoJSON de zonas al montar el componente
  useEffect(() => {
    fetch('/zonas.json')
      .then(res => res.json())
      .then(setGeojson)
      .catch(() => setGeojson(null));
  }, []);

  // Detectar zona automáticamente cuando cambian las coords
  useEffect(() => {
    if (!geojson || !coords) {
      setZonaDetectada(null);
      return;
    }
    const pt = turf.point([coords.lng, coords.lat]);
    let found = null;
    for (const feature of geojson.features) {
      if (turf.booleanPointInPolygon(pt, feature)) {
        // Puedes ajustar el nombre de la propiedad según el GeoJSON
        found = feature.properties.NOMBRE || feature.properties.nombre || feature.properties.Name || feature.properties.ZONA || feature.properties.zona || null;
        break;
      }
    }
    setZonaDetectada(found);
    if (found) setZona(found);
  }, [coords, geojson]);

  // Geolocalización automática
  const handleGeo = () => {
    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización.");
      return;
    }
    
    setError("Obteniendo tu ubicación...");
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setError("");
        console.log("Ubicación obtenida:", pos.coords.latitude, pos.coords.longitude);
      },
      (posError) => {
        console.error("Error de geolocalización:", posError.code, posError.message);
        
        // Proporcionar mensajes de error más específicos
        switch (posError.code) {
          case 1: // PERMISSION_DENIED
            setError("Permiso de ubicación denegado. Por favor, permite el acceso a tu ubicación en la configuración del navegador.");
            break;
          case 2: // POSITION_UNAVAILABLE
            setError("Tu ubicación actual no está disponible. Verifica tu conexión a internet y los servicios de ubicación.");
            break;
          case 3: // TIMEOUT
            setError("Se agotó el tiempo para obtener tu ubicación. Inténtalo nuevamente.");
            break;
          default:
            setError("No se pudo obtener tu ubicación. Error: " + posError.message);
        }
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,        // 10 segundos de timeout
        maximumAge: 0          // No usar cache de ubicación
      }
    );
  };

  const handleFotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 3);
    setFotos(files);
  };

    // Conexión real a Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validar al menos una foto
    if (fotos.length === 0) {
      setError("Debes subir al menos una foto.");
      return;
    }
    setLoading(true);
    setSuccess(false);
    setError("");
    try {
      // 1. Subir fotos al Storage
      let fotosUrls: string[] = [];
      if (fotos.length > 0) {
        for (const foto of fotos) {
          const fileExt = foto.name.split('.').pop();
          const filePath = `reportes/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
          // @ts-ignore
          const { data, error: uploadError } = await (await import("../../lib/supabaseClient")).supabase.storage.from('fotos').upload(filePath, foto);
          if (uploadError) throw new Error("Error subiendo foto: " + uploadError.message);
          const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/fotos/${filePath}`;
          fotosUrls.push(url);
        }
      }
      // 2. Insertar reporte en la tabla
      if (!coords) throw new Error("Debes ingresar la ubicación del problema (latitud y longitud)");
      const { error: insertError } = await (await import("../../lib/supabaseClient")).supabase.from('reportes').insert([
        {
          zona,
          lat: coords.lat,
          lon: coords.lng,
          categoria,
          descripcion,
          fotos: fotosUrls,
          anonimo,
        }
      ]);
      if (insertError) throw new Error("Error guardando reporte: " + insertError.message);
      setSuccess(true);
      setCategoria("");
      setDescripcion("");
      setFotos([]);
      setZona("");
      setCoords(null);
      setAnonimo(true);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-2 text-center text-[#4A4A4A]">Reporta un problema</h1>
      <p className="text-center text-[#757575] mb-6 text-sm">Completa los datos para reportar un problema urbano en tu zona. ¡Tu reporte ayuda a mejorar la ciudad!</p>
      <form onSubmit={handleSubmit} className="space-y-7 bg-white rounded-2xl shadow-2xl p-7 border border-[#F1F1F1]">
        <div>
          <label className="block font-semibold mb-2 text-[#4A4A4A] text-sm">Categoría del problema <span className='text-[#FFD600]'>(elige la opción más cercana)</span></label>
          <select
            className="w-full border-2 border-[#FFD600] rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-[#4CAF50] focus:outline-none transition"
            required
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <hr className="my-2 border-[#F1F1F1]" />
        <div>
          <label className="block font-semibold mb-2 text-[#4A4A4A] text-sm">Descripción breve del problema</label>
          <textarea
            className="w-full border-2 border-[#FFD600] rounded-lg px-4 py-3 text-base min-h-[70px] focus:ring-2 focus:ring-[#4CAF50] focus:outline-none transition"
            required
            maxLength={180}
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            placeholder="Ejemplo: Hay un hoyo grande frente a la parada de bus."
          />
          <span className="text-xs text-[#757575]">Sé claro y específico. Máximo 180 caracteres.</span>
        </div>
        <hr className="my-2 border-[#F1F1F1]" />
        <div>
          <label className="block font-semibold mb-2 text-[#4A4A4A] text-sm">Fotos del problema <span className='text-[#FFD600]'>(máx 3)</span></label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFotos}
            className="w-full border-2 border-dashed border-[#FFD600] rounded-lg px-4 py-2 text-base bg-[#FFFDE7] hover:bg-[#FFF9C4] transition"
          />
          <div className="flex gap-2 mt-2 flex-wrap">
            {fotos.map((foto, idx) => (
              <span key={idx} className="text-xs bg-[#FFD600]/20 px-2 py-1 rounded text-[#4A4A4A] border border-[#FFD600]">{foto.name}</span>
            ))}
          </div>
          <span className="text-xs text-[#757575]">Puedes subir hasta 3 fotos (opcional).</span>
          {fotos.length === 0 && (
            <p className="text-xs text-red-600 mt-1">Debes subir al menos una foto.</p>
          )}
        </div>
        <hr className="my-2 border-[#F1F1F1]" />
        <div>
          <label className="block font-semibold mb-2 text-[#4A4A4A] text-sm">Zona, colonia o referencia</label>
          <input
            className="w-full border-2 border-[#FFD600] rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-[#4CAF50] focus:outline-none transition"
            required
            value={zona}
            onChange={e => setZona(e.target.value)}
            placeholder="Ej. Zona 1, La Reformita, cerca de parque, etc."
            disabled={!!zonaDetectada}
          />
          {zonaDetectada && (
            <p className="text-xs text-green-700 mt-1">Zona detectada automáticamente: <b>{zonaDetectada}</b></p>
          )}
          {coords && !zonaDetectada && (
            <p className="text-xs text-red-600 mt-1">No se pudo detectar la zona automáticamente para esta ubicación.</p>
          )}
        </div>
        <hr className="my-2 border-[#F1F1F1]" />
        <div>
          <label className="block font-semibold mb-2 text-[#4A4A4A] text-sm">Ubicación geográfica</label>
          <div className="flex gap-2 items-center mb-2">
            <button type="button" className="px-3 py-1 bg-[#FFD600] rounded font-bold text-[#4A4A4A] hover:bg-[#FFE066] transition" onClick={handleGeo}>Usar mi ubicación</button>
            {coords && <span className="text-xs text-gray-600">{coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</span>}
          </div>
          <input
            className="w-full border-2 border-[#FFD600] rounded-lg px-4 py-3 text-base mt-1 focus:ring-2 focus:ring-[#4CAF50] focus:outline-none transition"
            type="text"
            placeholder="O ingresa latitud,longitud manualmente"
            value={coords ? `${coords.lat},${coords.lng}` : ""}
            onChange={e => {
              const val = e.target.value.split(",");
              if (val.length === 2) {
                setCoords({ lat: parseFloat(val[0]), lng: parseFloat(val[1]) });
              }
            }}
          />
          <span className="text-xs text-[#757575]">Puedes usar tu ubicación actual o escribirla manualmente.</span>
        </div>
        <hr className="my-2 border-[#F1F1F1]" />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={anonimo}
            onChange={e => setAnonimo(e.target.checked)}
            id="anonimo"
          />
          <label htmlFor="anonimo" className="text-sm">Reportar de forma anónima</label>
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-full bg-[#4CAF50] text-white font-extrabold text-lg shadow-lg hover:bg-[#388E3C] transition-colors disabled:opacity-60 tracking-wide mt-2"
          disabled={loading || fotos.length === 0}
        >
          {loading ? "Enviando..." : "Enviar reporte"}
        </button>
        {success && <div className="text-green-600 font-semibold text-center mt-3">Reporte enviado con éxito</div>}
        {error && <div className="text-red-600 font-semibold text-center mt-3">{error}</div>}
      </form>
    </div>
  );
}
