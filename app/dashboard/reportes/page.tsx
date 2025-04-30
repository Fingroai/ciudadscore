"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

// Tipos para la página de reportes
type ReporteType = {
  id: string;
  zona: string;
  categoria: string;
  descripcion: string;
  estado: string;
  fecha: string;
  usuario: string;
  anonimo: boolean;
  lat: number;
  lon: number;
  fotos?: string[];
};

type FiltrosType = {
  zona: string;
  categoria: string;
  estado: string;
  desde: string;
  hasta: string;
};

export default function ReportesPage() {
  const [reportes, setReportes] = useState<ReporteType[]>([]);
  const [filtros, setFiltros] = useState<FiltrosType>({
    zona: '',
    categoria: '',
    estado: '',
    desde: '',
    hasta: ''
  });
  const [loading, setLoading] = useState(true);
  const [zonas, setZonas] = useState<string[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [reporteSeleccionado, setReporteSeleccionado] = useState<ReporteType | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const reportesPorPagina = 10;

  // Cargar datos iniciales
  useEffect(() => {
    async function fetchReportes() {
      try {
        setLoading(true);
        
        // Obtener reportes
        let query = supabase
          .from('reportes')
          .select('*');
        
        // Aplicar filtros si existen
        if (filtros.zona) {
          query = query.eq('zona', filtros.zona);
        }
        if (filtros.categoria) {
          query = query.eq('categoria', filtros.categoria);
        }
        if (filtros.estado) {
          query = query.eq('estado', filtros.estado);
        }
        if (filtros.desde) {
          query = query.gte('fecha', filtros.desde);
        }
        if (filtros.hasta) {
          query = query.lte('fecha', filtros.hasta);
        }
        
        // Ordenar por fecha, más recientes primero
        query = query.order('fecha', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Formatear fechas para mostrar
        const reportesFormateados = data.map((reporte: any) => ({
          ...reporte,
          fecha: new Date(reporte.fecha).toLocaleDateString('es-GT', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }));
        
        setReportes(reportesFormateados);
        
        // Obtener lista única de zonas y categorías para filtros
        const zonasUnicas = [...new Set(data.map((r: any) => String(r.zona)))].filter(Boolean) as string[];
        const categoriasUnicas = [...new Set(data.map((r: any) => String(r.categoria)))].filter(Boolean) as string[];
        
        setZonas(zonasUnicas);
        setCategorias(categoriasUnicas);
        
      } catch (error) {
        console.error('Error al cargar reportes:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchReportes();
  }, [filtros]);
  
  // Actualizar estado de reporte
  const actualizarEstado = async (id: string, nuevoEstado: string, pruebasResuelto: string[] = [], comentarioResolucion: string = "") => {
    try {
      let updateData: any = { estado: nuevoEstado };
      if (nuevoEstado === 'resuelto') {
        updateData.pruebas_resuelto = pruebasResuelto;
        updateData.comentario_resolucion = comentarioResolucion;
        updateData.fecha_resolucion = new Date();
      }
      const { error } = await supabase
        .from('reportes')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      
      // Actualizar estado local
      setReportes(reportes.map(reporte => 
        reporte.id === id 
          ? { ...reporte, estado: nuevoEstado } 
          : reporte
      ));
      
      // Si es el reporte seleccionado, actualizarlo también
      if (reporteSeleccionado && reporteSeleccionado.id === id) {
        setReporteSeleccionado({
          ...reporteSeleccionado,
          estado: nuevoEstado
        });
      }
      
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };
  
  // Ver detalle de reporte
  const verDetalle = (reporte: ReporteType) => {
    setReporteSeleccionado(reporte);
  };
  
  // Cerrar modal de detalle
  const cerrarDetalle = () => {
    setReporteSeleccionado(null);
  };
  
  // Manejar cambios en los filtros
  const handleFiltroChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFiltros({
      ...filtros,
      [name]: value
    });
    // Reset a primera página cuando se filtran resultados
    setPaginaActual(1);
  };
  
  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setFiltros({
      zona: '',
      categoria: '',
      estado: '',
      desde: '',
      hasta: ''
    });
    setPaginaActual(1);
  };
  
  // Paginación
  const totalPaginas = Math.ceil(reportes.length / reportesPorPagina);
  const idxInicio = (paginaActual - 1) * reportesPorPagina;
  const idxFin = idxInicio + reportesPorPagina;
  const reportesPaginados = reportes.slice(idxInicio, idxFin);
  
  // Cambiar página
  const cambiarPagina = (pagina: number) => {
    if (pagina > 0 && pagina <= totalPaginas) {
      setPaginaActual(pagina);
    }
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
        <h1 className="text-2xl font-bold text-[#4A4A4A]">Gestión de Reportes</h1>
        <div className="flex items-center gap-2">
          <button 
            className="bg-[#FFD600] text-[#4A4A4A] px-4 py-2 rounded-lg hover:bg-yellow-500 transition shadow-sm text-sm font-medium"
            onClick={() => {/* Exportar a CSV */}}
          >
            Exportar CSV
          </button>
          <button 
            className="bg-[#4CAF50] text-white px-4 py-2 rounded-lg hover:bg-green-600 transition shadow-sm text-sm font-medium"
            onClick={() => {/* Generar PDF */}}
          >
            Reporte PDF
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-[#4A4A4A] mb-4">Filtros</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Filtro de Zona */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Zona</label>
            <select
              name="zona"
              value={filtros.zona}
              onChange={handleFiltroChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FFD600] focus:ring focus:ring-[#FFD600] focus:ring-opacity-50"
            >
              <option value="">Todas</option>
              {zonas.map(zona => (
                <option key={zona} value={zona}>{zona}</option>
              ))}
            </select>
          </div>
          
          {/* Filtro de Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              name="categoria"
              value={filtros.categoria}
              onChange={handleFiltroChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FFD600] focus:ring focus:ring-[#FFD600] focus:ring-opacity-50"
            >
              <option value="">Todas</option>
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
          </div>
          
          {/* Filtro de Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              name="estado"
              value={filtros.estado}
              onChange={handleFiltroChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FFD600] focus:ring focus:ring-[#FFD600] focus:ring-opacity-50"
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="en proceso">En proceso</option>
              <option value="resuelto">Resuelto</option>
            </select>
          </div>
          
          {/* Filtro de Fecha Desde */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
            <input
              type="date"
              name="desde"
              value={filtros.desde}
              onChange={handleFiltroChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FFD600] focus:ring focus:ring-[#FFD600] focus:ring-opacity-50"
            />
          </div>
          
          {/* Filtro de Fecha Hasta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
            <input
              type="date"
              name="hasta"
              value={filtros.hasta}
              onChange={handleFiltroChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FFD600] focus:ring focus:ring-[#FFD600] focus:ring-opacity-50"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={limpiarFiltros}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition mr-2"
          >
            Limpiar filtros
          </button>
          <button
            onClick={() => {/* Buscar */}}
            className="px-4 py-2 bg-[#4A4A4A] text-white rounded-lg hover:bg-gray-700 transition"
          >
            Aplicar filtros
          </button>
        </div>
      </div>

      {/* Tabla de Reportes */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zona</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportesPaginados.length > 0 ? (
                reportesPaginados.map((reporte, index) => (
                  <tr key={reporte.id} className={index % 2 === 0 ? 'bg-[#FFFDE7]' : 'bg-white'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reporte.id.substring(0, 8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reporte.zona}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reporte.categoria}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        reporte.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        reporte.estado === 'en proceso' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {reporte.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reporte.fecha}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => verDetalle(reporte)}
                          className="text-[#4CAF50] hover:text-green-700"
                        >
                          Ver
                        </button>
                        <div className="h-4 w-px bg-gray-300"></div>
                        <button
                          onClick={() => actualizarEstado(reporte.id, 'en proceso')}
                          className="text-blue-600 hover:text-blue-800"
                          disabled={reporte.estado === 'en proceso' || reporte.estado === 'resuelto'}
                        >
                          En proceso
                        </button>
                        <div className="h-4 w-px bg-gray-300"></div>
                        <button
                          onClick={() => actualizarEstado(reporte.id, 'resuelto')}
                          className="text-[#4CAF50] hover:text-green-700"
                          disabled={reporte.estado === 'resuelto'}
                        >
                          Resolver
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No se encontraron reportes con los filtros seleccionados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Paginación */}
        {reportes.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{idxInicio + 1}</span> a <span className="font-medium">
                {Math.min(idxFin, reportes.length)}
              </span> de <span className="font-medium">{reportes.length}</span> reportes
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  paginaActual === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Anterior
              </button>
              
              {/* Páginas */}
              <div className="hidden md:flex">
                {[...Array(totalPaginas)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => cambiarPagina(idx + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                      paginaActual === idx + 1
                        ? 'bg-[#FFD600] text-[#4A4A4A]'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } rounded-md mx-1`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              
              {/* En móvil solo mostramos el número de página actual */}
              <div className="md:hidden">
                <span className="text-sm text-gray-700">
                  Página {paginaActual} de {totalPaginas}
                </span>
              </div>
              
              <button
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  paginaActual === totalPaginas
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Modal de Detalle de Reporte */}
      {reporteSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#4A4A4A]">
                Detalle del Reporte
              </h3>
              <button
                onClick={cerrarDetalle}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">ID</h4>
                    <p className="text-[#4A4A4A]">{reporteSeleccionado.id}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Zona</h4>
                    <p className="text-[#4A4A4A] font-medium">{reporteSeleccionado.zona}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Categoría</h4>
                    <p className="text-[#4A4A4A]">{reporteSeleccionado.categoria}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Estado</h4>
                    <div className="flex items-center mt-1">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        reporteSeleccionado.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        reporteSeleccionado.estado === 'en proceso' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {reporteSeleccionado.estado}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Fecha</h4>
                    <p className="text-[#4A4A4A]">{reporteSeleccionado.fecha}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Reportado por</h4>
                    <p className="text-[#4A4A4A]">
                      {reporteSeleccionado.anonimo ? 'Anónimo' : reporteSeleccionado.usuario || 'Usuario no identificado'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Descripción</h4>
                    <p className="text-[#4A4A4A]">{reporteSeleccionado.descripcion || 'Sin descripción'}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Ubicación</h4>
                    <p className="text-[#4A4A4A]">
                      Lat: {reporteSeleccionado.lat}, Lon: {reporteSeleccionado.lon}
                    </p>
                    <div className="h-40 bg-gray-200 mt-2 rounded overflow-hidden">
                      {/* Aquí se colocaría el mapa */}
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Vista de mapa no disponible en esta versión
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Fotos</h4>
                    {reporteSeleccionado.fotos && reporteSeleccionado.fotos.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {reporteSeleccionado.fotos.map((foto, idx) => (
                          <div key={idx} className="h-24 bg-gray-200 rounded overflow-hidden">
                            <img 
                              src={foto} 
                              alt={`Foto ${idx + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No hay fotos adjuntas</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 border-t pt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-4">Actualizar estado</h4>
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      actualizarEstado(reporteSeleccionado.id, 'pendiente');
                      cerrarDetalle();
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      reporteSeleccionado.estado === 'pendiente'
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                    disabled={reporteSeleccionado.estado === 'pendiente'}
                  >
                    Pendiente
                  </button>
                  <button
                    onClick={() => {
                      actualizarEstado(reporteSeleccionado.id, 'en proceso');
                      cerrarDetalle();
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      reporteSeleccionado.estado === 'en proceso'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                    disabled={reporteSeleccionado.estado === 'en proceso'}
                  >
                    En Proceso
                  </button>
                  <button
                    onClick={() => {
                      actualizarEstado(reporteSeleccionado.id, 'resuelto');
                      cerrarDetalle();
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      reporteSeleccionado.estado === 'resuelto'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                    disabled={reporteSeleccionado.estado === 'resuelto'}
                  >
                    Resuelto
                  </button>
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
