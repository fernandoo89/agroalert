import { Link } from 'react-router-dom';
import { Sprout, LineChart, BellRing, Target, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 px-4" aria-label="Introducción a AgroAlert">
        <div className="absolute inset-0 bg-gradient-to-tr from-agro-light/40 via-transparent to-agro-light/20 -z-10 rounded-3xl" />
        
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr,1fr]">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-emerald-50 border border-emerald-100 px-4 py-2 mb-6 text-sm font-semibold text-agro-dark animate-bounce-subtle">
              <Sprout className="h-5 w-5 text-agro-primary animate-pulse" aria-hidden="true" />
              <span>AgroAlert para agricultores de La Libertad</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              Datos de mercado claros para tomar decisiones <span className="text-transparent bg-clip-text bg-gradient-to-r from-agro-primary to-agro-dark">más rentables</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
              Evita pérdidas por sobreproducción, conoce precios actualizados al instante y recibe alertas de mercado diseñadas especialmente para tu zona y cultivos.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4">
              <Link
                to="/login"
                aria-label="Ingresar a mi cuenta de AgroAlert"
                className="inline-flex items-center justify-center gap-2 bg-agro-primary text-white text-lg font-bold px-8 py-4 rounded-xl hover:bg-agro-dark transition-all duration-300 shadow-lg hover:shadow-xl shadow-agro-primary/20 active:scale-[0.98]"
              >
                <span>Ingresar</span>
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                to="/login?mode=register"
                aria-label="Registrar nueva cuenta en AgroAlert"
                className="inline-flex items-center justify-center text-agro-dark bg-white border-2 border-slate-200 text-lg font-bold px-8 py-4 rounded-xl hover:border-agro-primary hover:text-agro-primary transition-all duration-300 shadow-sm hover:shadow active:scale-[0.98]"
              >
                <span>Registrarse</span>
              </Link>
            </div>
          </div>

          {/* Visual Showcase (Mockup) */}
          <div className="relative rounded-3xl bg-white p-8 shadow-2xl border border-slate-100/80 hover-premium">
            <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-amber-500 text-white p-2 rounded-full shadow-lg">
              <Zap className="h-5 w-5" aria-hidden="true" />
            </div>
            
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-400 mb-6">Resultados rápidos comprobados</p>
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-2xl bg-emerald-50/70 border border-emerald-100 p-5 hover:bg-emerald-50 transition-colors">
                <div>
                  <p className="text-3xl font-extrabold text-agro-primary">+18%</p>
                  <p className="text-sm font-medium text-slate-700 mt-1">Aumento en ganancias estimadas</p>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-sm text-agro-primary">
                  <LineChart className="h-6 w-6" aria-hidden="true" />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-100 p-5 hover:bg-slate-100/50 transition-colors">
                <div>
                  <p className="text-3xl font-extrabold text-slate-800">3x</p>
                  <p className="text-sm font-medium text-slate-700 mt-1">Más certeza en decisiones de siembra</p>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-sm text-amber-600">
                  <BellRing className="h-6 w-6" aria-hidden="true" />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-teal-50/50 border border-teal-100 p-5 hover:bg-teal-50 transition-colors">
                <div>
                  <p className="text-3xl font-extrabold text-teal-800">24/7</p>
                  <p className="text-sm font-medium text-slate-700 mt-1">Acceso a datos y alertas locales</p>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-sm text-teal-600">
                  <Target className="h-6 w-6" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose AgroAlert */}
      <section className="py-8 px-4" aria-labelledby="why-choose-title">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-sm uppercase tracking-[0.25em] text-agro-primary font-bold mb-3">Por qué elegir AgroAlert</p>
          <h2 id="why-choose-title" className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Una plataforma pensada para agricultores de La Libertad
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed max-w-xl mx-auto">
            Datos reales de mercado, alertas instantáneas y recomendaciones prácticas para vender a mejor precio, sembrar con seguridad y evitar sobreproducción.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md border border-slate-100 transition-all duration-300 text-left">
            <div className="mb-6 inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-emerald-50 text-agro-primary border border-emerald-100">
              <Sprout className="h-7 w-7" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Cercanía Local</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Nuestra data y recomendaciones están enfocadas en los principales mercados de La Libertad y en los cultivos clave de la región.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md border border-slate-100 transition-all duration-300 text-left">
            <div className="mb-6 inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
              <BellRing className="h-7 w-7" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Alertas Prácticas</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Recibe avisos precisos sobre cambios repentinos de precio, baja demanda o exceso de oferta para anticiparte y proteger tu inversión.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md border border-slate-100 transition-all duration-300 text-left">
            <div className="mb-6 inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100">
              <Target className="h-7 w-7" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Decisiones más Seguras</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Planifica tus campañas agrícolas basándote en el historial de precios reales y en las recomendaciones diseñadas por expertos de la zona.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="grid md:grid-cols-2 gap-8" aria-label="Beneficios clave">
        <div className="bg-white p-7 rounded-2xl shadow-sm hover:shadow border border-slate-100 flex gap-5 items-start transition-all duration-300">
          <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl text-agro-primary flex-shrink-0">
            <LineChart className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Precios del Día</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Consulta a diario el precio de tus cultivos en los principales centros de abasto como el Mercado Mayorista La Hermelinda.
            </p>
          </div>
        </div>
        <div className="bg-white p-7 rounded-2xl shadow-sm hover:shadow border border-slate-100 flex gap-5 items-start transition-all duration-300">
          <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-xl text-amber-600 flex-shrink-0">
            <BellRing className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Alertas Tempranas</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Entérate antes que nadie de riesgos de sobreoferta, caídas drásticas de precios o problemas logísticos de distribución.
            </p>
          </div>
        </div>
        <div className="bg-white p-7 rounded-2xl shadow-sm hover:shadow border border-slate-100 flex gap-5 items-start transition-all duration-300">
          <div className="bg-blue-50 border border-blue-100 p-3.5 rounded-xl text-blue-600 flex-shrink-0">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Historial Confiable</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Visualiza gráficas interactivas con tendencias de precio de los últimos 7, 30 o 60 días para proyectar mejor tus ventas.
            </p>
          </div>
        </div>
        <div className="bg-white p-7 rounded-2xl shadow-sm hover:shadow border border-slate-100 flex gap-5 items-start transition-all duration-300">
          <div className="bg-teal-50 border border-teal-100 p-3.5 rounded-xl text-teal-600 flex-shrink-0">
            <Target className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Recomendaciones de Siembra</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Analizamos las condiciones de siembra y demanda para sugerirte qué cultivos son óptimos y cuáles deberías evitar en la temporada.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-14 text-center shadow-2xl relative overflow-hidden" aria-labelledby="how-it-works-title">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-agro-primary via-emerald-400 to-agro-dark" />
        
        <h2 id="how-it-works-title" className="text-3xl font-extrabold mb-12 tracking-tight">¿Cómo funciona AgroAlert?</h2>
        
        <div className="grid md:grid-cols-3 gap-10">
          <div className="relative">
            <div className="bg-agro-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg mx-auto mb-5 shadow-lg border-2 border-slate-800">
              1
            </div>
            <h4 className="text-lg font-bold mb-2">Crea tu cuenta</h4>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
              Regístrate de forma gratuita, indica tu provincia de La Libertad y selecciona tus cultivos principales.
            </p>
          </div>
          <div className="relative">
            <div className="bg-agro-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg mx-auto mb-5 shadow-lg border-2 border-slate-800">
              2
            </div>
            <h4 className="text-lg font-bold mb-2">Monitorea el mercado</h4>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
              Accede diariamente a la cotización en tiempo real y analiza tendencias históricas de manera comprensible.
            </p>
          </div>
          <div className="relative">
            <div className="bg-agro-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg mx-auto mb-5 shadow-lg border-2 border-slate-800">
              3
            </div>
            <h4 className="text-lg font-bold mb-2">Toma acción y comparte</h4>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
              Envía alertas rápidas a tus grupos de WhatsApp y planifica tu próxima siembra guiado por datos confiables.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
