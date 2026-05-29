import { Link } from 'react-router-dom';
import { Sprout, LineChart, BellRing, Target, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-12">
      {/* Hero Section */}
      <section className="pt-12 pb-8 px-4">
        <div className="grid items-center gap-10 lg:grid-cols-[1.4fr,1fr]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 rounded-full bg-agro-light px-4 py-2 mb-6 text-sm font-semibold text-agro-dark">
              <Sprout className="h-5 w-5" />
              AgroAlert para agricultores de La Libertad
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-agro-dark mb-6 leading-tight text-left">
              Datos de mercado claros para tomar decisiones agrícolas más rentables
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl text-left">
              Evita pérdidas por sobreproducción, conoce precios actualizados y recibe alertas de mercado diseñadas para tu zona y tus cultivos.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-agro-primary text-white text-lg font-bold px-8 py-4 rounded-full hover:bg-agro-dark transition-colors shadow-lg hover:shadow-xl"
              >
                Ingresar
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/login?mode=register"
                className="inline-flex items-center justify-center text-agro-dark bg-white border border-agro-primary text-lg font-bold px-8 py-4 rounded-full hover:bg-agro-light transition-colors shadow-sm"
              >
                Registrarse
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-2xl border border-gray-100">
            <p className="text-sm uppercase tracking-[0.25em] text-gray-500 mb-6">Resultados rápidos</p>
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-3xl bg-agro-light p-5">
                <div>
                  <p className="text-2xl font-bold text-agro-dark">+18%</p>
                  <p className="text-sm text-gray-600">Aumento en ganancias estimadas</p>
                </div>
                <LineChart className="h-8 w-8 text-agro-primary" />
              </div>
              <div className="flex items-center justify-between rounded-3xl bg-slate-50 p-5">
                <div>
                  <p className="text-2xl font-bold text-slate-900">3x</p>
                  <p className="text-sm text-gray-600">Más certeza en decisiones de siembra</p>
                </div>
                <BellRing className="h-8 w-8 text-orange-600" />
              </div>
              <div className="flex items-center justify-between rounded-3xl bg-green-50 p-5">
                <div>
                  <p className="text-2xl font-bold text-slate-900">24/7</p>
                  <p className="text-sm text-gray-600">Acceso a datos y alertas en todo momento</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose AgroAlert */}
      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto text-center mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-agro-primary font-semibold mb-3">Por qué elegir AgroAlert</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-agro-dark">Una plataforma pensada para agricultores de La Libertad</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Datos de mercado reales, alertas puntuales y recomendaciones prácticas para que vendas mejor, siembres con seguridad y evites perder dinero.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 text-left">
            <div className="mb-5 inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-agro-light text-agro-dark">
              <Sprout className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Cercanía local</h3>
            <p className="text-gray-600">Nuestra data y recomendaciones están enfocadas en los principales mercados de La Libertad y los cultivos de la región.</p>
          </div>
          <div className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 text-left">
            <div className="mb-5 inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-orange-100 text-orange-600">
              <BellRing className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Alertas prácticas</h3>
            <p className="text-gray-600">Recibe avisos precisos sobre cambios de precio, baja demanda o exceso de oferta para anticiparte con tus ventas.</p>
          </div>
          <div className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 text-left">
            <div className="mb-5 inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-green-100 text-green-600">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Decisiones más seguras</h3>
            <p className="text-gray-600">Planifica tus siembras y ventas apoyado en datos reales, historia de precios y recomendaciones diseñadas para ti.</p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-start">
          <div className="bg-agro-light p-3 rounded-lg mt-1">
            <LineChart className="h-6 w-6 text-agro-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Precios del día</h3>
            <p className="text-gray-600">Conoce el precio exacto de tus cultivos en los principales mercados como La Hermelinda.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-start">
          <div className="bg-orange-100 p-3 rounded-lg mt-1">
            <BellRing className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Alertas tempranas</h3>
            <p className="text-gray-600">Recibe notificaciones sobre posibles caídas de precio o sobreoferta en el mercado.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-start">
          <div className="bg-blue-100 p-3 rounded-lg mt-1">
            <LineChart className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Historial de datos</h3>
            <p className="text-gray-600">Analiza cómo han variado los precios en los últimos 30 o 60 días para planificar mejor.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-start">
          <div className="bg-green-100 p-3 rounded-lg mt-1">
            <Target className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Recomendaciones</h3>
            <p className="text-gray-600">Te sugerimos qué cultivos son más rentables según la demanda actual y la temporada.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-agro-dark text-white rounded-3xl p-8 md:p-12 text-center shadow-xl">
        <h2 className="text-3xl font-bold mb-10">¿Cómo funciona?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="bg-white text-agro-dark w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">1</div>
            <h4 className="text-xl font-bold mb-2">Regístrate</h4>
            <p className="text-gray-300">Crea tu cuenta gratuita e indica qué cultivos produces y en qué zona de La Libertad estás.</p>
          </div>
          <div>
            <div className="bg-white text-agro-dark w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">2</div>
            <h4 className="text-xl font-bold mb-2">Revisa el mercado</h4>
            <p className="text-gray-300">Monitorea los precios actualizados a diario para saber cuándo es el mejor momento para vender.</p>
          </div>
          <div>
            <div className="bg-white text-agro-dark w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">3</div>
            <h4 className="text-xl font-bold mb-2">Toma acción</h4>
            <p className="text-gray-300">Comparte alertas por WhatsApp y planifica tu próxima siembra con nuestras recomendaciones.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
