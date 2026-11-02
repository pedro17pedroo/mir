"use client";
import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import useSiteStore from '../store/useSiteStore';

export default function Carousel({ slides = [] }) {
  const [current, setCurrent] = useState(0);
  const theme = useSiteStore(state => state.theme);
  
  const activeSlides = slides.filter(s => s.ativo !== false);

  useEffect(() => {
    if (activeSlides.length < 2) return;
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  if (!activeSlides.length) return null;

  const nextSlide = () => {
    setCurrent((current + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    setCurrent((current - 1 + activeSlides.length) % activeSlides.length);
  };

  // Configurações do hero do tema (Landing Page)
  const heroConfig = {
    gradienteInicio: theme?.heroHomeGradienteInicio || '#9333ea',
    gradienteFim: theme?.heroHomeGradienteFim || '#ec4899',
    gradienteDirecao: theme?.heroHomeGradienteDirecao || 'to right',
    textoTitulo: theme?.heroHomeTextoTitulo || '#ffffff',
    textoSubtitulo: theme?.heroHomeTextoSubtitulo || '#f3f4f6',
    curvaEstilo: theme?.heroHomeCurvaEstilo || 'wave',
    curvaCor: theme?.heroHomeCurvaCor || '#ffffff',
    altura: theme?.heroHomeAltura || 'medium',
    overlay: theme?.heroHomeOverlay || 'gradient'
  };

  // Mapeamento de alturas
  const alturaMap = {
    small: '300px',
    medium: '500px',
    large: '600px',
    xlarge: '700px',
    fullscreen: '100vh'
  };

  // SVG paths para as curvas
  const curvasPaths = {
    wave: 'M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
    curve: 'M0,160L1440,96L1440,320L0,320Z',
    triangle: 'M0,320L720,96L1440,320Z',
    tilt: 'M0,224L1440,96L1440,320L0,320Z',
    none: ''
  };

  // Estilo do overlay
  const getOverlayStyle = () => {
    switch (heroConfig.overlay) {
      case 'gradient':
        return 'linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.4))';
      case 'dark':
        return 'rgba(0,0,0,0.6)';
      case 'light':
        return 'rgba(255,255,255,0.2)';
      default:
        return 'none';
    }
  };

  return (
    <div 
      className="relative w-full overflow-hidden min-h-[580px] md:min-h-0"
      style={{ height: alturaMap[heroConfig.altura] }}
    >
      {activeSlides.map((slide, i) => (
        <div
          key={slide._id || i}
          className={`absolute inset-0 transition-all duration-1000 ${
            i === current ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'
          }`}
        >
          {/* Imagem de fundo ou gradiente */}
          {slide.imagem || theme?.heroHomeImagem ? (
            <img 
              src={slide.imagem || theme?.heroHomeImagem} 
              alt={slide.titulo || ''} 
              style={{ objectPosition: slide.posicaoImagem || theme?.heroHomePosicaoImagem || 'center' }}
              className="w-full h-full object-cover"
            />
          ) : (
            <div 
              className="w-full h-full"
              style={{
                background: `linear-gradient(${heroConfig.gradienteDirecao}, ${heroConfig.gradienteInicio}, ${heroConfig.gradienteFim})`
              }}
            />
          )}
          
          {/* Overlay */}
          {heroConfig.overlay !== 'none' && (
            <div 
              className="absolute inset-0"
              style={{ background: getOverlayStyle() }}
            />
          )}
          
          {/* Conteúdo */}
          <div className="absolute inset-0 flex flex-col justify-center items-center px-4 pt-16 pb-16 md:pt-0 md:pb-0 z-10">
            <div className="max-w-4xl text-center">
              <h2 
                className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold drop-shadow-2xl mb-4 sm:mb-6 animate-fade-in tracking-tight"
                style={{ color: heroConfig.textoTitulo }}
              >
                {slide.titulo}
              </h2>
              <p 
                className="text-base sm:text-xl md:text-3xl drop-shadow-lg font-medium animate-fade-in-delay max-w-2xl mx-auto"
                style={{ color: heroConfig.textoSubtitulo }}
              >
                {slide.subtitulo || slide.descricao || slide.conteudo}
              </p>
              {slide.mostrarBotoes !== false && (
                <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4 justify-center animate-fade-in-delay-2">
                  {(slide.textoBotao || 'Saiba Mais') && (
                    <a 
                      href={slide.link || "#sobre"} 
                      style={{ backgroundColor: slide.corBotao || '#facc15' }}
                      className="hover:opacity-95 text-gray-900 font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base inline-flex items-center justify-center"
                    >
                      {slide.textoBotao || 'Saiba Mais'}
                    </a>
                  )}
                  {(slide.textoBotaoSecundario ?? 'Próximos Eventos') && (
                    <a 
                      href={slide.linkBotaoSecundario || "#eventos"} 
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-white text-sm sm:text-base inline-flex items-center justify-center"
                    >
                      {slide.textoBotaoSecundario ?? 'Próximos Eventos'}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Curva inferior */}
          {heroConfig.curvaEstilo !== 'none' && curvasPaths[heroConfig.curvaEstilo] && (
            <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none">
              <svg 
                viewBox="0 0 1440 320" 
                preserveAspectRatio="none"
                className="w-full h-12 sm:h-16 md:h-24"
              >
                <path 
                  fill={heroConfig.curvaCor}
                  d={curvasPaths[heroConfig.curvaEstilo]}
                />
              </svg>
            </div>
          )}
        </div>
      ))}
      
      {/* Controles de navegação */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-4 rounded-full transition-all duration-300 hover:scale-110"
            aria-label="Slide anterior"
          >
            <FaChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-4 rounded-full transition-all duration-300 hover:scale-110"
            aria-label="Próximo slide"
          >
            <FaChevronRight className="text-2xl" />
          </button>
        </>
      )}
      
      {/* Indicadores */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-8 flex gap-3 z-30">
        {activeSlides.map((_, i) => (
          <button
            key={i}
            className={`transition-all duration-300 rounded-full ${
              i === current 
                ? 'w-12 h-3 bg-yellow-400' 
                : 'w-3 h-3 bg-white/60 hover:bg-white/80'
            }`}
            onClick={() => setCurrent(i)}
            aria-label={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
