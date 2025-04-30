"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import Mapa from '../../../components/Mapa';

// Tipos para la página de zonas
type ZonaType = {
  id: number;
  nombre: string;
  cityscore: number;
  reportes_count: number;
  reportes_resueltos?: number;
  reportes_pendientes?: number;
};

type EstadisticasZonaType = {
  total: number;
  resueltos: number;
  pendientes: number;
  en_proceso: number;
  por_categoria: Record<string, number>;
};

export default function ZonasPage() {
  const [reportesMapa, setReportesMapa] = useState<any[]>([]);
  const [zonas, setZonas] = useState<ZonaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [zonaSeleccionada, setZonaSeleccionada] = useState<ZonaType | null>(null);
  const [estadisticas, setEstadisticas] = useState<EstadisticasZonaType | null>(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [valorScore, setValorScore] = useState<number>(0);
  
  // Cargar datos iniciales
  useEffect(() => {
    async function fetchReportesMapa() {
      const { data, error } = await supabase
        .from('reportes')
        .select('id, lat, lon, zona, categoria, descripcion');
      if (!error && data) {
        setReportesMapa(data);
      }
    }
    fetchReportesMapa();
    async function fetchZonas() {
      try {
        setLoading(true);
        
        // Obtener zonas ordenadas por score
        const { data, error } = await supabase
          .from('zonas')
          .select('*')
          .order('cityscore', { ascending: false });
        
        if (error) throw error;
        
        setZonas(data);
      } catch (error) {
        console.error('Error al cargar zonas:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchZonas();
  }, []);
  
  // Cargar estadísticas al seleccionar una zona
  useEffect(() => {
    async function fetchEstadisticasZona() {
      if (!zonaSeleccionada) return;
      
      try {
        const { data, error } = await supabase
          .from('reportes')
          .select('id, estado, categoria')
          .eq('zona', zonaSeleccionada.nombre);
        
        if (error) throw error;
        
        // Conteo por estado
        const total = data.length;
        const resueltos = data.filter((r: any) => r.estado === 'resuelto').length;
        const en_proceso = data.filter((r: any) => r.estado === 'en proceso').length;
        const pendientes = total - resueltos - en_proceso;
        
        // Conteo por categoría
        const por_categoria: Record<string, number> = {};
        data.forEach((reporte: any) => {
          por_categoria[reporte.categoria] = (por_categoria[reporte.categoria] || 0) + 1;
        });
        
        setEstadisticas({
          total,
          resueltos,
          pendientes,
          en_proceso,
          por_categoria
        });
        
        setValorScore(zonaSeleccionada.cityscore);
      } catch (error) {
        console.error('Error al cargar estadísticas de la zona:', error);
      }
    }
    
    fetchEstadisticasZona();
  }, [zonaSeleccionada]);
  
  // Seleccionar zona para ver detalle
  const seleccionarZona = (zona: ZonaType) => {
    setZonaSeleccionada(zona);
    setModoEdicion(false);
  };
  
  // Cerrar detalle de zona
  const cerrarDetalle = () => {
    setZonaSeleccionada(null);
    setEstadisticas(null);
    setModoEdicion(false);
  };
  
  // Activar modo edición
  const activarEdicion = () => {
    setModoEdicion(true);
  };
  
  // Guardar cambios en zona
  const guardarCambios = async () => {
    if (!zonaSeleccionada) return;
    
    try {
      // Actualizar score en base de datos
      const { error } = await supabase
        .from('zonas')
        .update({ cityscore: valorScore })
        .eq('id', zonaSeleccionada.id);
      
      if (error) throw error;
      
      // Actualizar estado local
      setZonas(zonas.map(zona => 
        zona.id === zonaSeleccionada.id 
          ? { ...zona, cityscore: valorScore } 
          : zona
      ));
      
      setZonaSeleccionada({
        ...zonaSeleccionada,
        cityscore: valorScore
      });
      
      setModoEdicion(false);
    } catch (error) {
      console.error('Error al actualizar zona:', error);
    }
  };
  
  // Cancelar edición
  const cancelarEdicion = () => {
    setValorScore(zonaSeleccionada?.cityscore || 0);
    setModoEdicion(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD600]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#4A4A4A]">Zonas de Ciudad</h1>
        <div className="flex items-center gap-2">
          <button 
            className="bg-[#4CAF50] text-white px-4 py-2 rounded-lg hover:bg-green-600 transition shadow-sm text-sm font-medium"
            onClick={() => {/* Generar reporte de zonas */}}
          >
            Exportar mapa
          </button>
        </div>
      </div>

      {/* Mapa de todas las zonas */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="h-80 bg-gray-200">
          <Mapa reportes={reportesMapa} />
        </div>
      </div>

      {/* Tabla de Zonas */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-[#4A4A4A] text-white">
          <h2 className="text-lg font-semibold">Ranking de Zonas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zona</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CityScore</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Reportes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {zonas.map((zona, index) => (
                <tr key={zona.id} className={index % 2 === 0 ? 'bg-[#FFFDE7]' : 'bg-white'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{zona.nombre}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full max-w-48 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className="h-2.5 rounded-full" 
                          style={{ width: `${zona.cityscore}%`, backgroundColor: getScoreColor(zona.cityscore) }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{zona.cityscore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {zona.reportes_count || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => seleccionarZona(zona)}
                      className="text-[#4CAF50] hover:text-green-700"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal de Detalle de Zona */}
      {zonaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-[#4A4A4A] text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold">
                Zona: {zonaSeleccionada.nombre}
              </h3>
              <button
                onClick={cerrarDetalle}
                className="text-white hover:text-gray-300"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h4 className="text-lg font-semibold text-[#4A4A4A] mb-4">CityScore</h4>
                    
                    {modoEdicion ? (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ajustar valor (0-100)
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={valorScore}
                          onChange={(e) => setValorScore(parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between mt-2">
                          <span className="text-sm text-gray-500">0</span>
                          <span className="text-sm font-medium">{valorScore}</span>
                          <span className="text-sm text-gray-500">100</span>
                        </div>
                        <div className="flex justify-end mt-4 space-x-2">
                          <button
                            onClick={cancelarEdicion}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={guardarCambios}
                            className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-green-600 transition"
                          >
                            Guardar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center mb-4">
                          <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                            <div 
                              className="h-4 rounded-full" 
                              style={{ width: `${zonaSeleccionada.cityscore}%`, backgroundColor: getScoreColor(zonaSeleccionada.cityscore) }}
                            ></div>
                          </div>
                          <span className="text-xl font-bold">{zonaSeleccionada.cityscore}</span>
                        </div>
                        <button
                          onClick={activarEdicion}
                          className="px-4 py-2 bg-[#FFD600] text-[#4A4A4A] rounded-lg hover:bg-yellow-500 transition text-sm font-medium"
                        >
                          Ajustar score
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h4 className="text-lg font-semibold text-[#4A4A4A] mb-4">Estadísticas generales</h4>
                    {estadisticas ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-[#FFFDE7] p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Total reportes</p>
                            <p className="text-2xl font-bold text-[#4A4A4A]">{estadisticas.total}</p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Resueltos</p>
                            <p className="text-2xl font-bold text-[#4CAF50]">{estadisticas.resueltos}</p>
                          </div>
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Pendientes</p>
                            <p className="text-2xl font-bold text-[#FFC107]">{estadisticas.pendientes}</p>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">En proceso</p>
                            <p className="text-2xl font-bold text-[#2196F3]">{estadisticas.en_proceso}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FFD600]"></div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h4 className="text-lg font-semibold text-[#4A4A4A] mb-4">Por categoría</h4>
                    {estadisticas && estadisticas.por_categoria ? (
                      <div className="space-y-4">
                        {Object.entries(estadisticas.por_categoria)
                          .sort(([, a], [, b]) => b - a)
                          .map(([categoria, cantidad], index) => (
                            <div key={categoria} className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2" 
                                style={{ backgroundColor: getCategoryColor(index) }}
                              ></div>
                              <span className="flex-1 text-sm">{categoria}</span>
                              <span className="text-sm font-medium">{cantidad}</span>
                              <div className="w-full max-w-48 bg-gray-200 rounded-full h-2.5 ml-2">
                                <div 
                                  className="h-2.5 rounded-full" 
                                  style={{ 
                                    width: `${(cantidad / estadisticas.total) * 100}%`, 
                                    backgroundColor: getCategoryColor(index) 
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-40">
                        <p className="text-gray-500">No hay datos disponibles</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h4 className="text-lg font-semibold text-[#4A4A4A] mb-4">Mapa de la zona</h4>
                    <div className="h-64 bg-gray-200 rounded-lg">
                      {/* Aquí iría un mapa focalizado en la zona seleccionada */}
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Mapa de la zona {zonaSeleccionada.nombre}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 px-6 py-3 border-t">
              <div className="flex justify-end">
                <button
                  onClick={cerrarDetalle}
                  className="bg-[#4A4A4A] text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition shadow-sm text-sm font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Función para obtener color basado en el score
function getScoreColor(score: number): string {
  if (score >= 80) return '#4CAF50'; // Verde
  if (score >= 60) return '#8BC34A'; // Verde claro
  if (score >= 40) return '#FFD600'; // Amarillo
  if (score >= 20) return '#FF9800'; // Naranja
  return '#F44336'; // Rojo
}

// Función para obtener colores para categorías
function getCategoryColor(index: number): string {
  const colors = ['#FFD600', '#4CAF50', '#2196F3', '#9C27B0', '#F44336', '#FF9800', '#795548', '#607D8B'];
  return colors[index % colors.length];
}
