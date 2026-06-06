import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  LineChart, 
  BellRing, 
  Target, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  ChevronDown, 
  HelpCircle, 
  DollarSign, 
  Users, 
  CheckCircle2,
  Share2
} from 'lucide-react';

const TICKER_ITEMS = [
  { nombre: 'Papa Yungay', precio: 'S/ 2.20', cambio: '+5.3%', tend: 'sube' },
  { nombre: 'Cebolla Roja', precio: 'S/ 3.50', cambio: 'Estable', tend: 'igual' },
  { nombre: 'Tomate Katya', precio: 'S/ 2.80', cambio: '-10.5%', tend: 'baja' },
  { nombre: 'Espárrago Verde', precio: 'S/ 6.50', cambio: '+8.1%', tend: 'sube' },
  { nombre: 'Zanahoria Criolla', precio: 'S/ 1.50', cambio: '-4.2%', tend: 'baja' },
  { nombre: 'Maíz Amarillo', precio: 'S/ 1.95', cambio: 'Estable', tend: 'igual' },
  { nombre: 'Arroz Extra', precio: 'S/ 3.80', cambio: '+2.4%', tend: 'sube' },
];

const CROP_CALCULATOR_DATA = {
  papa: { nombre: 'Papa Yungay', precioIntermediario: 1.20, precioOptimo: 2.20, unidad: 'kg' },
  cebolla: { nombre: 'Cebolla Roja', precioIntermediario: 1.80, precioOptimo: 3.50, unidad: 'kg' },
  tomate: { nombre: 'Tomate Katya', precioIntermediario: 1.60, precioOptimo: 2.80, unidad: 'kg' },
  esparrago: { nombre: 'Espárrago Verde', precioIntermediario: 4.50, precioOptimo: 6.50, unidad: 'kg' },
};

const TESTIMONIALS = [
  {
    nombre: 'Don Alberto Huamán',
    cultivo: 'Productor de Papa',
    ubicacion: 'Julcán, La Libertad',
    texto: 'Gracias a la alerta de sobreproducción retrasé mi cosecha 10 días y evité vender a pérdida. ¡AgroAlert me salvó más de S/ 1,800!',
    avatarColor: 'bg-emerald-600'
  },
  {
    nombre: 'Doña María Flores',
    cultivo: 'Productora de Tomate',
    ubicacion: 'Virú, La Libertad',
    texto: 'En el mercado La Hermelinda querían pagarme S/ 1.20 el kilo. Les mostré los precios oficiales en la app y logré cerrar en S/ 2.00.',
    avatarColor: 'bg-amber-600'
  },
  {
    nombre: 'Carlos Benites',
    cultivo: 'Cultivos de Espárrago',
    ubicacion: 'Chao, La Libertad',
    texto: 'Lo mejor es que la abro en el campo sin internet y puedo ver las recomendaciones de siembra. Ya la compartí con toda mi asociación.',
    avatarColor: 'bg-teal-600'
  }
];

const FAQS = [
  {
    pregunta: '¿Cómo funciona AgroAlert sin internet o datos móviles?',
    respuesta: 'AgroAlert está desarrollada como una Aplicación Web Progresiva (PWA). Al ingresar con señal, la app guarda en la memoria de tu celular los precios y alertas. Si viajas al campo o entras a mercados cerrados sin internet, podrás abrir la aplicación y consultar la última información guardada de forma automática.'
  },
  {
    pregunta: '¿De dónde provienen los precios que se muestran?',
    respuesta: 'Nuestros datos se actualizan diariamente combinando la información del Ministerio de Desarrollo Agrario y Riego (MIDAGRI) y el relevamiento físico directo que realiza nuestro equipo en el Mercado Mayorista La Hermelinda de Trujillo.'
  },
  {
    pregunta: '¿Tiene algún costo registrarse y usar la plataforma?',
    respuesta: 'No, AgroAlert es y será siempre 100% gratuita para los agricultores de La Libertad. Nuestro propósito es reducir la asimetría de información y apoyar la rentabilidad del sector agrícola familiar.'
  },
  {
    pregunta: '¿Cómo comparto la información con mi comunidad?',
    respuesta: 'Cada alerta del mercado cuenta con un botón verde de WhatsApp. Al pulsarlo, el sistema redacta automáticamente una advertencia con emojis lista para ser enviada a tus grupos o contactos de WhatsApp con un solo clic.'
  }
];

export default function Home() {
  // Estado para la calculadora de rentabilidad
  const [selectedCropKey, setSelectedCropKey] = useState('papa');
  const [harvestWeight, setHarvestWeight] = useState(2000); // Kilos predeterminados
  
  // Estado para las FAQ
  const [activeFaq, setActiveFaq] = useState(null);

  const cropInfo = CROP_CALCULATOR_DATA[selectedCropKey];
  const earningsIntermediary = harvestWeight * cropInfo.precioIntermediario;
  const earningsOptimal = harvestWeight * cropInfo.precioOptimo;
  const profitDifference = earningsOptimal - earningsIntermediary;

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-24 pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-4" aria-label="Presentación de AgroAlert">
        {/* Luces de fondo premium */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/3 left-10 w-[250px] h-[250px] bg-teal-500/10 rounded-full blur-3xl -z-10" />

        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr,1fr] max-w-7xl mx-auto">
          <div className="max-w-3xl text-left space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-4 py-2 text-sm font-semibold text-agro-dark animate-bounce-subtle">
              <Sprout className="h-5 w-5 text-agro-primary" aria-hidden="true" />
              <span>Inteligencia de Mercado para La Libertad</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Toma decisiones de venta <span className="text-transparent bg-clip-text bg-gradient-to-r from-agro-primary to-agro-dark">más rentables</span> y evita pérdidas
            </h1>
            
            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              Monitorea los precios del día en el Mercado Mayorista La Hermelinda, recibe alertas tempranas de sobreoferta y planifica tus cultivos con recomendaciones de expertos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/login"
                aria-label="Acceder a mi panel de AgroAlert"
                className="inline-flex items-center justify-center gap-2 bg-agro-primary text-white text-lg font-bold px-8 py-4 rounded-2xl hover:bg-agro-dark transition-all duration-300 shadow-lg hover:shadow-xl shadow-agro-primary/20 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <span>Acceder a la App</span>
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                to="/login?mode=register"
                aria-label="Registrarme en AgroAlert"
                className="inline-flex items-center justify-center text-agro-dark bg-white border-2 border-slate-200 text-lg font-bold px-8 py-4 rounded-2xl hover:border-agro-primary hover:text-agro-primary hover:-translate-y-0.5 transition-all duration-300 shadow-sm active:scale-[0.98]"
              >
                <span>Registrarme Gratis</span>
              </Link>
            </div>
          </div>

          {/* Simulador de Dashboard / Visual Showcase Premium */}
          <div className="relative rounded-3xl p-6 glass-premium shadow-2xl border border-slate-200/50 hover-premium max-w-lg mx-auto w-full">
            <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Zap className="h-3.5 w-3.5" />
              <span>Simulación en Vivo</span>
            </div>

            <h3 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase mb-4 text-left">Resumen AgroAlert</h3>
            
            <div className="space-y-4">
              {/* Tarjeta de precio simulada */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-50 p-2.5 rounded-xl text-agro-primary">
                    <LineChart className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-500 font-semibold">Papa Yungay (Hermelinda)</p>
                    <p className="text-lg font-extrabold text-slate-800">S/ 2.20 <span className="text-xs text-slate-400 font-normal">x kg</span></p>
                  </div>
                </div>
                <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                  <TrendingUp className="h-3.5 w-3.5" />
                  +5.3%
                </span>
              </div>

              {/* Tarjeta de alerta simulada */}
              <div className="bg-yellow-50/50 border-2 border-yellow-100 p-4 rounded-2xl flex gap-3 text-left">
                <BellRing className="text-amber-600 h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200/50">Alerta Activa</span>
                    <span className="text-[11px] font-bold text-slate-700">Tomate Katya</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">Sobreoferta crítica de tomate detectada. Sugerimos retrasar la recolección si es viable.</p>
                </div>
              </div>

              {/* Tarjeta de recomendación simulada */}
              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">💡</span>
                  <div className="text-left">
                    <p className="text-xs text-slate-500 font-bold">Próxima campaña recomendada</p>
                    <p className="text-sm font-bold text-slate-800">Cebolla Roja</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-agro-dark bg-emerald-100/60 px-2.5 py-1 rounded-lg">Estabilidad alta</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker de precios en vivo */}
      <section className="bg-slate-900 border-y border-slate-800 py-3 shadow-md -mt-10" aria-label="Precios en tiempo real ticker">
        <div className="overflow-hidden relative flex">
          <div className="animate-ticker flex gap-10">
            {/* Ticker Duplicado para loop infinito fluido */}
            {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm text-white font-medium">
                <span className="text-slate-400 font-bold">{item.nombre}</span>
                <span className="font-extrabold">{item.precio}</span>
                <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                  item.tend === 'sube' ? 'text-green-400 bg-green-500/10' :
                  item.tend === 'baja' ? 'text-red-400 bg-red-500/10' :
                  'text-slate-400 bg-slate-500/10'
                }`}>
                  {item.cambio}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Calculadora interactiva de Rentabilidad (ROI) */}
      <section className="max-w-7xl mx-auto px-4 w-full" aria-labelledby="calc-title">
        <div className="bg-gradient-to-br from-agro-dark to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden text-left">
          {/* Luces sutiles */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-agro-primary/20 rounded-full blur-3xl -z-10" />

          <div className="grid lg:grid-cols-[1.1fr,1fr] gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
                <DollarSign className="w-4 h-4" />
                <span>Simulador de Beneficios</span>
              </div>
              
              <h2 id="calc-title" className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Calcula cuánto puedes optimizar tus ganancias
              </h2>
              
              <p className="text-slate-300 leading-relaxed">
                Vender tus cultivos a ciegas a intermediarios puede costarte miles de soles en pérdidas. Compara las ganancias que obtienes con precios de intermediarios versus el precio real del mercado optimizado por AgroAlert.
              </p>

              {/* Formulario de control */}
              <div className="space-y-5 pt-4">
                <div>
                  <label htmlFor="calc-crop" className="block text-sm font-bold text-slate-300 mb-2">Selecciona un Cultivo:</label>
                  <select 
                    id="calc-crop"
                    value={selectedCropKey}
                    onChange={(e) => setSelectedCropKey(e.target.value)}
                    className="w-full sm:w-72 bg-slate-800/90 border border-slate-700 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-agro-primary outline-none transition-all font-semibold"
                  >
                    {Object.entries(CROP_CALCULATOR_DATA).map(([key, value]) => (
                      <option key={key} value={key} className="bg-slate-900">{value.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="calc-range" className="text-sm font-bold text-slate-300">Cantidad Estimada de Cosecha:</label>
                    <span className="font-extrabold text-agro-light text-lg">{harvestWeight.toLocaleString('es-PE')} kg</span>
                  </div>
                  <input 
                    id="calc-range"
                    type="range"
                    min={500}
                    max={10000}
                    step={100}
                    value={harvestWeight}
                    onChange={(e) => setHarvestWeight(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-agro-primary"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1 font-semibold">
                    <span>500 kg (10 sacos)</span>
                    <span>10,000 kg (200 sacos)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resultados del Cálculo */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl space-y-6 flex flex-col justify-between">
              <div>
                <h4 className="text-slate-300 text-sm font-bold uppercase tracking-wider mb-6">Comparativa de ingresos estimados</h4>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="text-slate-400 text-sm font-medium">Con intermediario habitual:</span>
                    <div className="text-right">
                      <p className="text-slate-400 text-xs font-semibold">S/ {cropInfo.precioIntermediario.toFixed(2)} / kg</p>
                      <p className="text-lg font-bold text-slate-300">S/ {earningsIntermediary.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pb-2">
                    <span className="text-emerald-300 text-sm font-bold">Con precio óptimo (AgroAlert):</span>
                    <div className="text-right">
                      <p className="text-emerald-400 text-xs font-extrabold">S/ {cropInfo.precioOptimo.toFixed(2)} / kg</p>
                      <p className="text-xl font-extrabold text-emerald-300">S/ {earningsOptimal.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Caja de ROI optimizado */}
              <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl p-5 text-center mt-4">
                <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-widest block mb-1">Dinero adicional recuperado</span>
                <span className="text-3xl md:text-4xl font-black text-emerald-300 block">S/ {profitDifference.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <p className="text-xs text-emerald-200/80 mt-2 font-medium">Decidiendo con base en información real de mercado en La Libertad.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Características Principales */}
      <section className="max-w-7xl mx-auto px-4 text-center space-y-12" aria-labelledby="features-title">
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-agro-primary font-extrabold">La Plataforma Completa</p>
          <h2 id="features-title" className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Todo lo necesario en un solo lugar
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto leading-relaxed">
            Hemos integrado las herramientas agrícolas clave solicitadas directamente por productores de La Libertad.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover-premium text-left">
            <div className="mb-5 inline-flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-50 text-agro-primary border border-emerald-100">
              <LineChart className="h-6 w-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg mb-2">Precios del Día</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Consulta en tiempo real la cotización del kilo de tus productos en el Mercado La Hermelinda.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover-premium text-left">
            <div className="mb-5 inline-flex items-center justify-center h-12 w-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <BellRing className="h-6 w-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg mb-2">Alertas Tempranas</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Recibe avisos directos sobre desplome de precios o exceso de producción antes de cosechar.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover-premium text-left">
            <div className="mb-5 inline-flex items-center justify-center h-12 w-12 rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg mb-2">Recomendaciones</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Guías inteligentes y prácticas basadas en la temporada y la demanda para tus próximas siembras.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover-premium text-left">
            <div className="mb-5 inline-flex items-center justify-center h-12 w-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg mb-2">Acceso Offline</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              ¿Sin señal en el campo? La app funciona perfectamente sin conexión de datos cargando la caché.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="bg-slate-50 py-16 border-y border-slate-100 text-center space-y-12" aria-labelledby="testimonials-title">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-agro-primary font-extrabold">Historias de éxito</p>
          <h2 id="testimonials-title" className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Impacto real en agricultores locales
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100/80 flex flex-col justify-between text-left hover-premium">
              <p className="text-slate-600 text-sm leading-relaxed italic mb-6">"{t.texto}"</p>
              
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${t.avatarColor}`}>
                  {t.nombre[4]}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">{t.nombre}</h4>
                  <p className="text-slate-400 text-xs font-semibold">{t.cultivo} • {t.ubicacion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección interactiva de FAQs Accordion */}
      <section className="max-w-4xl mx-auto px-4 w-full text-center space-y-12" aria-labelledby="faq-title">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-agro-primary font-extrabold">Dudas y Respuestas</p>
          <h2 id="faq-title" className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Preguntas Frecuentes
          </h2>
        </div>

        <div className="space-y-4 text-left">
          {FAQS.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={index} 
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-slate-800 font-extrabold text-base md:text-lg focus:outline-none hover:bg-slate-50/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{faq.pregunta}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-60 border-t border-slate-100' : 'max-h-0'
                  }`}
                >
                  <div className="p-6 text-slate-600 text-sm md:text-base leading-relaxed bg-slate-50/30">
                    {faq.respuesta}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-7xl mx-auto px-4 w-full pb-6 text-center" aria-labelledby="cta-title">
        <div className="bg-slate-900 text-white rounded-3xl p-10 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-agro-primary/30 via-transparent to-agro-dark/40 -z-10" />
          
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 id="cta-title" className="text-3xl md:text-4xl font-extrabold tracking-tight">
              ¿Listo para vender a precios justos?
            </h2>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base max-w-lg mx-auto">
              Regístrate hoy de manera gratuita y comienza a recibir alertas directas del mercado en tu celular. No dejes que decidan por ti.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/login?mode=register"
                className="inline-flex items-center gap-2 bg-agro-primary hover:bg-agro-dark text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-agro-primary/20 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
              >
                <span>Registrarme ahora</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/login"
                className="text-slate-300 hover:text-white font-extrabold text-sm border-b-2 border-transparent hover:border-white transition-all py-1.5"
              >
                Ya tengo cuenta, ingresar
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
