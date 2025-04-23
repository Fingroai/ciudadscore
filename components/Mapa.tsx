"use client";
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface ReporteMarcador {
  id: string;
  lat: number;
  lon: number;
  zona: string;
  categoria: string;
  descripcion: string;
}

interface MapaProps {
  reportes?: ReporteMarcador[];
}

// Diccionario de emojis por categoría
const iconosCategoria: Record<string, string> = {
  hoyo: "🕳️",
  acera: "🚶‍♂️",
  alcantarilla: "🕳️",
  semaforo: "🚦",
  senalizacion: "🚧",
  arbol: "🌳",
  agua: "💧",
  drenaje: "🚽",
  basura: "🗑️",
  inseguridad: "🚨",
  alumbrado: "💡",
  rio: "🌊",
  otro: "❓"
};

export default function Mapa({ reportes = [] }: MapaProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Mantén referencia a los marcadores para poder quitarlos
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  // Referencia al último conjunto de reportes procesados para evitar renderizados innecesarios
  const reportesProcessedRef = useRef<string>("");

  useEffect(() => {
    // Resize Mapbox map si el contenedor cambia de tamaño
    function handleResize() {
      if (mapRef.current) mapRef.current.resize();
    }
    window.addEventListener('resize', handleResize);
    // Llama a resize al montar
    setTimeout(handleResize, 200);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;
    // Espera a que el contenedor tenga tamaño real antes de inicializar el mapa
    function ensureContainerReadyAndInit() {
      const div = mapContainer.current;
      if (!div) return;
      const { width, height } = div.getBoundingClientRect();
      if (width < 100 || height < 100) {
        // Espera al siguiente frame si el tamaño aún no es correcto
        requestAnimationFrame(ensureContainerReadyAndInit);
        return;
      }
      if (!mapRef.current) {
        const map = new mapboxgl.Map({
          container: div,
          style: "mapbox://styles/mapbox/light-v11",
          center: [-90.5133, 14.6349], // Centro de Ciudad de Guatemala
          zoom: 11.5,
        });
        mapRef.current = map;
        // Forzar resize justo después de crear el mapa
        setTimeout(() => map.resize(), 50);
        // Cargar zonas desde GeoJSON
        map.on("load", () => {
          fetch("/zonas.json")
            .then((r) => r.json())
            .then((geojson) => {
              map.addSource("zonas", {
                type: "geojson",
                data: geojson,
              });
              map.addLayer({
                id: "zonas-fill",
                type: "fill",
                source: "zonas",
                paint: {
                  "fill-color": "#FFD600",
                  "fill-opacity": 0.18,
                },
              });
              map.addLayer({
                id: "zonas-outline",
                type: "line",
                source: "zonas",
                paint: {
                  "line-color": "#4A4A4A",
                  "line-width": 2,
                },
              });
              // Etiquetas de zona
              map.addLayer({
                id: "zonas-label",
                type: "symbol",
                source: "zonas",
                layout: {
                  "text-field": ["to-string", ["get", "zona"]],
                  "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                  "text-size": 14,
                  "text-anchor": "center"
                },
                paint: {
                  "text-color": "#4A4A4A",
                  "text-halo-color": "#FFFFFF",
                  "text-halo-width": 2
                }
              });
            });
        });
      }
    }
    ensureContainerReadyAndInit();
  }, []); 

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    
    // Verificar si los reportes han cambiado para evitar renderizados innecesarios
    const reportesHash = JSON.stringify(reportes.map(r => r.id));
    if (reportesHash === reportesProcessedRef.current) return;
    reportesProcessedRef.current = reportesHash;
    
    // Eliminar marcadores anteriores
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Eliminar la fuente y capa de reportes si existe
    if (map.getSource('reportes-source')) {
      if (map.getLayer('reportes-layer')) {
        map.removeLayer('reportes-layer');
      }
      map.removeSource('reportes-source');
    }
    
    // Si no hay reportes, no hacemos nada más
    if (reportes.length === 0) return;
    
    // Asegurarnos de que el mapa esté completamente cargado
    const setupMarkers = () => {
      if (!map.loaded()) {
        // Si el mapa no está cargado, intentar de nuevo en 100ms
        setTimeout(setupMarkers, 100);
        return;
      }
      addReportesLayer();
    };
    
    setupMarkers();
    
    // Función para añadir la capa de reportes
    function addReportesLayer() {
      // Asegurarnos de que map no sea null
      if (!map) return;
      
      // IMPORTANTE: Verificar y eliminar source y layer existentes
      try {
        if (map.getLayer('reportes-layer')) {
          map.removeLayer('reportes-layer');
        }
        
        if (map.getSource('reportes-source')) {
          map.removeSource('reportes-source');
        }
      } catch (e) {
        console.error('Error limpiando capas antiguas:', e);
      }
      
      // Crear GeoJSON para los reportes
      const geojsonData = {
        type: 'FeatureCollection',
        features: reportes.map(r => ({
          type: 'Feature',
          properties: {
            id: r.id,
            categoria: r.categoria,
            zona: r.zona,
            descripcion: r.descripcion,
            emoji: iconosCategoria[r.categoria] || '📍'
          },
          geometry: {
            type: 'Point',
            coordinates: [r.lon, r.lat]
          }
        }))
      };
      
      // Verificar nuevamente que no exista el source antes de crearlo
      if (!map.getSource('reportes-source')) {
        try {
          // Añadir source de reportes
          map.addSource('reportes-source', {
            type: 'geojson',
            data: geojsonData as any
          });
        } catch (e) {
          console.error('Error al añadir source:', e);
          return; // Salir si no podemos añadir el source
        }
      }
      
      // Ahora creamos marcadores HTML y aseguramos que sean visibles
      reportes.forEach((r) => {
        // Verificamos que el mapa y el reporte sean válidos
        if (!map || !r) return;
        
        const emoji = iconosCategoria[r.categoria] || "📍";
        
        // Crear un elemento HTML para el marcador con mejor visibilidad
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.innerHTML = emoji;
        el.style.fontSize = '24px';
        el.style.display = 'flex';
        el.style.justifyContent = 'center';
        el.style.alignItems = 'center';
        el.style.width = '36px';
        el.style.height = '36px';
        el.style.textShadow = '0 0 3px white, 0 0 5px white';
        
        try {
          // Crear un marcador con posicionamiento geográfico exacto
          const marker = new mapboxgl.Marker({
            element: el,
            anchor: 'bottom',
          })
            .setLngLat([r.lon, r.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<strong>${r.categoria}</strong><br/><em>${r.zona}</em><br/>${r.descripcion}`)
            )
            .addTo(map);
          
          // Guardar referencia para poder eliminarlos después
          markersRef.current.push(marker);
        } catch (e) {
          console.error('Error al añadir marcador:', e);
        }
      });
      
      // Los popups ya están configurados en cada marcador
      // No necesitamos agregar listeners adicionales
    }
    
    return () => {
      // Limpiar solo los marcadores al desmontar
      markersRef.current.forEach(marker => {
        try {
          if (marker) marker.remove();
        } catch (e) {
          console.error('Error al eliminar marcador:', e);
        }
      });
      markersRef.current = [];
    };
  }, [reportes]);

  return (
    <div style={{ width: '100%', maxWidth: 900, height: 500, border: '4px solid #FFD600', borderRadius: 18, overflow: 'hidden', margin: '32px auto', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
