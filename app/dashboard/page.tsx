"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

// Tipos definidos para el dashboard
type ZonaType = {
  id: number;
  nombre: string;
  cityscore: number;
  reportes_count: number;
  tendencia: number;
};

type CategoriaType = {
  nombre: string;
  cantidad: number;
  porcentaje: number;
  color: string;
};

type ReporteType = {
  id: string;
  zona: string;
  categoria: string;
  estado: string;
  fecha: string;
};

// Componentes para el dashboard
interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  change?: string;
  color?: string;
}

const StatCard = ({ title, value, icon, change, color = '#FFD600' }: StatCardProps) => (
  <div className={`bg-white rounded-xl shadow-md p-6 border-l-4`} style={{ borderLeftColor: color }}>
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="mt-1 text-3xl font-semibold text-[#4A4A4A]">{value}</p>
        {change && (
          <p className={`text-xs mt-1 ${change.startsWith('+') ? 'text-[#4CAF50]' : 'text-[#F44336]'}`}>
            {change} vs. mes anterior
          </p>
        )}
      </div>
      <div className="p-3 rounded-full" style={{ backgroundColor: `${color}30` }}>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  </div>
);

interface ZonaRankingProps {
  zonas: ZonaType[];
}

const ZonaRanking = ({ zonas }: ZonaRankingProps) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-bold text-[#4A4A4A]">Ranking de Zonas</h2>
      <button className="text-sm text-[#4CAF50] hover:underline">Ver todas</button>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zona</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reportes</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tendencia</th>
          </tr>
        </thead>
        <tbody>
          {zonas.map((zona: ZonaType, index: number) => (
            <tr key={zona.id} className={index % 2 === 0 ? 'bg-[#FFFDE7]' : 'bg-white'}>
              <td className="py-4 px-4 whitespace-nowrap font-medium">{zona.nombre}</td>
              <td className="py-4 px-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-[#FFD600] h-2.5 rounded-full" 
                      style={{ width: `${zona.cityscore}%` }}
                    ></div>
                  </div>
                  <span>{zona.cityscore}</span>
                </div>
              </td>
              <td className="py-4 px-4 whitespace-nowrap">{zona.reportes_count}</td>
              <td className="py-4 px-4 whitespace-nowrap">
                <span className={zona.tendencia > 0 ? 'text-[#4CAF50]' : 'text-[#F44336]'}>
                  {zona.tendencia > 0 ? '↑' : '↓'} {Math.abs(zona.tendencia)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

interface CategoriasPieChartProps {
  data: CategoriaType[];
}

const CategoriasPieChart = ({ data }: CategoriasPieChartProps) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <h2 className="text-lg font-bold text-[#4A4A4A] mb-4">Categorías más reportadas</h2>
    <div className="flex flex-col space-y-4">
      {data.map((item: CategoriaType, index: number) => (
        <div key={index} className="flex items-center">
          <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
          <span className="flex-1 text-sm">{item.nombre}</span>
          <span className="text-sm font-medium">{item.cantidad}</span>
          <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
            <div 
              className="h-2.5 rounded-full" 
              style={{ width: `${item.porcentaje}%`, backgroundColor: item.color }}
            ></div>
          </div>
          <span className="text-xs ml-2 w-12 text-right">{item.porcentaje}%</span>
        </div>
      ))}
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalReportes: 0,
    reportesResueltos: 0,
    reportesPendientes: 0,
    zonasActivas: 0
  });
  
  const [zonas, setZonas] = useState<ZonaType[]>([]);
  const [categorias, setCategorias] = useState<CategoriaType[]>([]);
  const [loading, setLoading] = useState(true);

  const [ultimosReportes, setUltimosReportes] = useState<ReporteType[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        
        // Obtener estadísticas de reportes
        const { data: reportes, error: reportesError } = await supabase
          .from('reportes')
          .select('id, estado, zona, categoria');

        if (reportesError) throw reportesError;

        // Contar totales
        const totalReportes = reportes.length;
        const reportesResueltos = reportes.filter((r: any) => r.estado === 'resuelto').length;
        const reportesPendientes = totalReportes - reportesResueltos;
        
        // Obtener zonas activas (con al menos un reporte)
        const zonasUnicas = [...new Set(reportes.map((r: any) => r.zona))];
        
        // Actualizar stats
        setStats({
          totalReportes,
          reportesResueltos,
          reportesPendientes,
          zonasActivas: zonasUnicas.length
        });

        // Obtener datos de zonas para ranking
        const { data: zonasData, error: zonasError } = await supabase
          .from('zonas')
          .select('*');
          
        if (zonasError) throw zonasError;

        // Agregar datos simulados de tendencia (en un sistema real esto vendría de datos históricos)
        const zonasConTendencia = zonasData.map((zona: any) => ({
          ...zona,
          tendencia: Math.floor(Math.random() * 20) - 10  // Tendencia simulada entre -10% y +10%
        }));
        
        // Ordenar por cityscore descendente
        setZonas(zonasConTendencia.sort((a: any, b: any) => b.cityscore - a.cityscore).slice(0, 5));

        // Contar categorías
        const categoriasCount: Record<string, number> = {};
        reportes.forEach((reporte: any) => {
          categoriasCount[reporte.categoria] = (categoriasCount[reporte.categoria] || 0) + 1;
        });

        // Convertir a array y calcular porcentajes
        const colores = ['#FFD600', '#4CAF50', '#F44336', '#2196F3', '#9C27B0', '#FF9800'];
        const categoriasData = Object.entries(categoriasCount)
          .map(([nombre, cantidad], index) => ({
            nombre,
            cantidad,
            porcentaje: Math.round((cantidad / totalReportes) * 100),
            color: colores[index % colores.length]
          }))
          .sort((a: CategoriaType, b: CategoriaType) => b.cantidad - a.cantidad)
          .slice(0, 6);

        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
    // Fetch últimos reportes reales
    async function fetchUltimosReportes() {
      const { data, error } = await supabase
        .from('reportes')
        .select('id, zona, categoria, estado, fecha')
        .order('fecha', { ascending: false })
        .limit(5);
      if (!error && data) {
        setUltimosReportes(data);
      }
    }
    fetchUltimosReportes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD600]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#4A4A4A]">Panel de Control</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
          <button className="flex items-center gap-2 bg-[#4CAF50] text-white px-4 py-2 rounded-lg hover:bg-[#3d9c40] transition shadow-sm">
            <span className="text-sm">📥</span> Descargar Reporte
          </button>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Reportes" 
          value={stats.totalReportes} 
          icon="📊"
          color="#FFD600"
        />
        <StatCard 
          title="Reportes Resueltos" 
          value={stats.reportesResueltos} 
          icon="✅"
          color="#4CAF50"
        />
        <StatCard 
          title="Reportes Pendientes" 
          value={stats.reportesPendientes} 
          icon="⏱️"
          color="#F44336"
        />
        <StatCard 
          title="Zonas Activas" 
          value={stats.zonasActivas} 
          icon="🏙️"
          color="#2196F3"
        />
      </div>

      {/* Gráficos y tablas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ZonaRanking zonas={zonas} />
        <CategoriasPieChart data={categorias} />
      </div>

      {/* Información adicional */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[#4A4A4A]">Últimos Reportes</h2>
          <Link href="/dashboard/reportes" className="text-sm text-[#4CAF50] hover:underline">Ver todos</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Zona</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ultimosReportes.map((reporte: ReporteType, index: number) => (
  <tr key={reporte.id} className={index % 2 === 0 ? 'bg-[#FFFDE7]' : 'bg-white'}>
    <td className="py-3 px-4 text-sm">{reporte.id}</td>
    <td className="py-3 px-4 text-sm">{reporte.zona}</td>
    <td className="py-3 px-4 text-sm">{reporte.categoria}</td>
    <td className="py-3 px-4 text-sm">
      <span className={`px-2 py-1 rounded-full text-xs ${
        reporte.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
        reporte.estado === 'en proceso' ? 'bg-blue-100 text-blue-800' :
        reporte.estado === 'resuelto' ? 'bg-green-100 text-green-800' : ''
      }`}>
        {reporte.estado}
      </span>
    </td>
    <td className="py-3 px-4 text-sm">{new Date(reporte.fecha).toLocaleDateString()}</td>
    <td className="py-3 px-4 text-sm">
      <button className="text-[#4CAF50] hover:underline">Ver</button>
    </td>
  </tr>
))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
