"use client";
import React, { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

// Tipos para la página de configuración
type ConfiguracionForm = {
  nombreMunicipio: string;
  emailNotificaciones: string;
  categorias: string[];
  periodoActualizacion: number;
  umbralAlerta: number;
};

type AdminUsuario = {
  nombre: string;
  email: string;
  rol: string;
};

export default function ConfiguracionPage() {
  const [configuracion, setConfiguracion] = useState<ConfiguracionForm>({
    nombreMunicipio: 'Municipalidad de Ciudad de Guatemala',
    emailNotificaciones: 'notificaciones@ciudadscore.gt',
    categorias: ['bache', 'alumbrado', 'basura', 'alcantarilla', 'acera', 'otro'],
    periodoActualizacion: 24,
    umbralAlerta: 10
  });
  
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{tipo: 'exito' | 'error', texto: string} | null>(null);
  
  // Usuarios administradores (simulados)
  const [adminUsuarios, setAdminUsuarios] = useState<AdminUsuario[]>([
    { nombre: 'Admin Principal', email: 'admin@ciudadscore.gt', rol: 'administrador' },
    { nombre: 'Operador Zonas', email: 'zonas@ciudadscore.gt', rol: 'editor' }
  ]);
  
  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConfiguracion({
      ...configuracion,
      [name]: value
    });
  };
  
  // Agregar nueva categoría
  const agregarCategoria = () => {
    if (nuevaCategoria.trim() && !configuracion.categorias.includes(nuevaCategoria.trim())) {
      setConfiguracion({
        ...configuracion,
        categorias: [...configuracion.categorias, nuevaCategoria.trim()]
      });
      setNuevaCategoria('');
    }
  };
  
  // Eliminar categoría
  const eliminarCategoria = (categoriaAEliminar: string) => {
    setConfiguracion({
      ...configuracion,
      categorias: configuracion.categorias.filter(categoria => categoria !== categoriaAEliminar)
    });
  };
  
  // Guardar configuración
  const guardarConfiguracion = async () => {
    setGuardando(true);
    setMensaje(null);
    
    try {
      // Aquí se implementaría la lógica para guardar en la base de datos
      // Simulamos una operación exitosa
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMensaje({
        tipo: 'exito',
        texto: 'Configuración guardada correctamente'
      });
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: 'Error al guardar la configuración'
      });
      console.error('Error al guardar configuración:', error);
    } finally {
      setGuardando(false);
    }
  };
  
  // Simular reinicio de cache
  const reiniciarCache = async () => {
    setGuardando(true);
    
    try {
      // Simulamos el reinicio
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMensaje({
        tipo: 'exito',
        texto: 'Cache del sistema reiniciado correctamente'
      });
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: 'Error al reiniciar el cache'
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#4A4A4A]">Configuración del Sistema</h1>
      </div>

      {/* Mensaje de operación */}
      {mensaje && (
        <div className={`rounded-lg p-4 ${mensaje.tipo === 'exito' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {mensaje.texto}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuración General */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-[#4A4A4A] text-white">
            <h2 className="text-lg font-semibold">Configuración General</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Municipio
              </label>
              <input
                type="text"
                name="nombreMunicipio"
                value={configuracion.nombreMunicipio}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FFD600] focus:ring focus:ring-[#FFD600] focus:ring-opacity-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email para Notificaciones
              </label>
              <input
                type="email"
                name="emailNotificaciones"
                value={configuracion.emailNotificaciones}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FFD600] focus:ring focus:ring-[#FFD600] focus:ring-opacity-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Período de Actualización de Datos (horas)
              </label>
              <input
                type="number"
                name="periodoActualizacion"
                value={configuracion.periodoActualizacion}
                onChange={handleChange}
                min="1"
                max="48"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FFD600] focus:ring focus:ring-[#FFD600] focus:ring-opacity-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Umbral de Alerta para Reportes (cantidad)
              </label>
              <input
                type="number"
                name="umbralAlerta"
                value={configuracion.umbralAlerta}
                onChange={handleChange}
                min="1"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FFD600] focus:ring focus:ring-[#FFD600] focus:ring-opacity-50"
              />
            </div>
          </div>
        </div>
        
        {/* Categorías de Reportes */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-[#4A4A4A] text-white">
            <h2 className="text-lg font-semibold">Categorías de Reportes</h2>
          </div>
          <div className="p-6">
            <div className="flex mb-4">
              <input
                type="text"
                value={nuevaCategoria}
                onChange={(e) => setNuevaCategoria(e.target.value)}
                placeholder="Nueva categoría"
                className="flex-1 rounded-l-lg border-gray-300 shadow-sm focus:border-[#FFD600] focus:ring focus:ring-[#FFD600] focus:ring-opacity-50"
              />
              <button
                onClick={agregarCategoria}
                className="bg-[#FFD600] text-[#4A4A4A] px-4 py-2 rounded-r-lg hover:bg-yellow-500 transition"
              >
                Agregar
              </button>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {configuracion.categorias.map((categoria, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between bg-[#FFFDE7] p-3 rounded-lg"
                >
                  <span>{categoria}</span>
                  <button
                    onClick={() => eliminarCategoria(categoria)}
                    className="text-red-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Gestión de Usuarios */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-[#4A4A4A] text-white">
            <h2 className="text-lg font-semibold">Usuarios Administrativos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {adminUsuarios.map((usuario, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-[#FFFDE7]' : 'bg-white'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {usuario.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {usuario.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {usuario.rol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-[#4CAF50] hover:text-green-700 mr-3">
                        Editar
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t">
            <button className="bg-[#4CAF50] text-white px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm">
              Agregar Usuario
            </button>
          </div>
        </div>
        
        {/* Operaciones del Sistema */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-[#4A4A4A] text-white">
            <h2 className="text-lg font-semibold">Operaciones del Sistema</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-[#4A4A4A] mb-2">Mantenimiento</h3>
              <p className="text-sm text-gray-600 mb-4">
                Operaciones de mantenimiento del sistema. Estas acciones pueden afectar temporalmente el rendimiento.
              </p>
              <div className="flex space-x-3">
                <button 
                  className="bg-[#FFD600] text-[#4A4A4A] px-4 py-2 rounded-lg hover:bg-yellow-500 transition text-sm font-medium"
                  onClick={reiniciarCache}
                  disabled={guardando}
                >
                  {guardando ? 'Procesando...' : 'Reiniciar Cache'}
                </button>
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm font-medium">
                  Actualizar Zonas
                </button>
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-medium text-red-700 mb-2">Zona de Peligro</h3>
              <p className="text-sm text-red-600 mb-4">
                Estas acciones son irreversibles y pueden resultar en pérdida de datos.
              </p>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm font-medium">
                Reiniciar Estadísticas
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Botones de Acción */}
      <div className="flex justify-end space-x-4 mt-6">
        <button 
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Cancelar
        </button>
        <button
          onClick={guardarConfiguracion}
          disabled={guardando}
          className="px-6 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-green-600 transition shadow-sm"
        >
          {guardando ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>
    </div>
  );
}
