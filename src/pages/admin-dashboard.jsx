import { useEffect, useState } from 'react';
import { supabase } from '../js/supabase';
import { useAuth } from '../js/auth';
import { TrendingUp, AlertTriangle, Lightbulb, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalPrices: 0,
    activeAlerts: 0,
    activeRecommendations: 0,
    lastUpdate: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Contar precios
      const { count: pricesCount } = await supabase
        .from('precios')
        .select('*', { count: 'exact', head: true });

      // Contar alertas activas
      const { count: alertsCount } = await supabase
        .from('alertas')
        .select('*', { count: 'exact', head: true })
        .eq('activa', true);

      // Contar recomendaciones activas
      const { count: recsCount } = await supabase
        .from('recomendaciones')
        .select('*', { count: 'exact', head: true })
        .eq('activa', true);

      // Obtener fecha última actualización de precios
      const { data: lastPrice } = await supabase
        .from('precios')
        .select('fecha')
        .order('fecha', { ascending: false })
        .limit(1)
        .single();

      setStats({
        totalPrices: pricesCount || 0,
        activeAlerts: alertsCount || 0,
        activeRecommendations: recsCount || 0,
        lastUpdate: lastPrice?.fecha
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!profile?.es_admin) return null;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-yellow-600">Panel de Control — Admin</h1>
        <p className="text-gray-600 mt-2">Gestiona precios, alertas y recomendaciones para los agricultores de La Libertad.</p>
      </header>

      {/* Flujo de trabajo */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-blue-900 mb-4">📋 Flujo de trabajo diario:</h2>
        <ol className="space-y-2 text-blue-900 list-decimal list-inside">
          <li><strong>Consultar precios</strong> en MIDAGRI o mercado físico (La Hermelinda)</li>
          <li><strong>Cargar precios</strong> en la sección <strong>Precios</strong> (datos del día)</li>
          <li><strong>Crear alertas</strong> si algún precio bajó más del 20% o hay sobreoferta</li>
          <li><strong>Actualizar recomendaciones</strong> según tendencia actual de precios</li>
        </ol>
      </div>

      {/* Estadísticas */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Precios Registrados</p>
              <p className="text-3xl font-bold text-agro-dark">{stats.totalPrices}</p>
              {stats.lastUpdate && (
                <p className="text-xs text-gray-500 mt-2">
                  Última: {new Date(stats.lastUpdate).toLocaleDateString('es-PE')}
                </p>
              )}
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Alertas Activas</p>
              <p className="text-3xl font-bold text-orange-600">{stats.activeAlerts}</p>
            </div>
            <div className="bg-orange-100 p-4 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Recomendaciones Activas</p>
              <p className="text-3xl font-bold text-blue-600">{stats.activeRecommendations}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <Lightbulb className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Estado</p>
              <p className="text-xl font-bold text-agro-primary">✅ Activo</p>
              <p className="text-xs text-gray-500 mt-2">Sistema listo</p>
            </div>
            <div className="bg-agro-light p-4 rounded-lg">
              <BarChart3 className="h-8 w-8 text-agro-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Guía rápida */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Cargar Precios</h3>
          <p className="text-sm text-gray-600 mb-4">Registra los precios del día por cultivo y mercado. Este es el dato más importante de la plataforma.</p>
          <a href="/admin/prices" className="text-agro-primary hover:text-agro-dark font-semibold">Ir a Precios →</a>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Crear Alertas</h3>
          <p className="text-sm text-gray-600 mb-4">Avisa a los agricultores sobre caídas de precio, sobreoferta o cambios importantes en el mercado.</p>
          <a href="/admin/alerts" className="text-agro-primary hover:text-agro-dark font-semibold">Ir a Alertas →</a>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Lightbulb className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Recomendaciones</h3>
          <p className="text-sm text-gray-600 mb-4">Define qué cultivos se deben sembrar o evitar según el comportamiento actual del mercado.</p>
          <a href="/admin/recommendations" className="text-agro-primary hover:text-agro-dark font-semibold">Ir a Recomendaciones →</a>
        </div>
      </div>
    </div>
  );
}
