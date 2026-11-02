'use client';
import useSiteStore from '../store/useSiteStore';
import { useEffect } from 'react';

export default function PageTemplate({ page }) {
  const theme = useSiteStore(state => state.theme);
  const loadTheme = useSiteStore(state => state.loadTheme);

  useEffect(() => {
    if (!theme || !theme.corPrimaria) {
      loadTheme();
    }
  }, [theme, loadTheme]);

  if (!page) return null;

  // Cor de fundo efetiva da página (personalizada ou padrão do tema)
  const pageBgColor =
    page.usarCorPadrao === false && page.corFundo
      ? page.corFundo
      : theme?.corFundoPaginas || '#ffffff';

  const pageTextColor = page.corTexto || theme?.corTexto || '#1F2937';
  const pageHeadingFont = page.fonteTitulo || theme?.fonteTitulos || 'Playfair Display';
  const showHero = page.mostrarHero !== false;
  const showCta = page.mostrarCta !== false;

  const containerWidthClass =
    page.larguraConteudo === 'narrow'
      ? 'max-w-4xl'
      : page.larguraConteudo === 'full'
        ? 'max-w-full'
        : 'max-w-7xl';

  // Configurações do hero do tema (Páginas Internas) + Overrides por página
  const heroConfig = {
    imagem: page.imagemHero || theme?.heroPaginasImagem || '',
    posicaoImagem: page.posicaoImagemHero || theme?.heroPaginasPosicaoImagem || 'center',
    gradienteInicio: theme?.heroPaginasGradienteInicio || '#9333ea',
    gradienteFim: theme?.heroPaginasGradienteFim || '#ec4899',
    gradienteDirecao: theme?.heroPaginasGradienteDirecao || 'to right',
    textoTitulo: theme?.heroPaginasTextoTitulo || '#ffffff',
    textoSubtitulo: theme?.heroPaginasTextoSubtitulo || '#f3f4f6',
    curvaEstilo: theme?.heroPaginasCurvaEstilo || 'wave',
    curvaCor:
      page.usarCorPadrao === false && page.corFundo
        ? page.corFundo
        : theme?.heroPaginasCurvaCor || pageBgColor || '#ffffff',
    altura: page.alturaHero || theme?.heroPaginasAltura || 'medium',
    overlay: theme?.heroPaginasOverlay || 'gradient'
  };

  // Mapeamento de alturas
  const alturaMap = {
    small: 'py-12 pt-24',
    medium: 'py-20 pt-28',
    large: 'py-28 pt-36',
    xlarge: 'py-36 pt-40'
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
        return 'linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.15))';
      case 'dark':
        return 'rgba(0,0,0,0.5)';
      case 'light':
        return 'rgba(255,255,255,0.2)';
      default:
        return 'none';
    }
  };

  return (
    <div
      className="min-h-screen transition-colors"
      style={{
        backgroundColor: pageBgColor,
        color: pageTextColor,
        '--font-heading': `'${pageHeadingFont}', serif`,
      }}
    >
      {/* Hero Section */}
      {showHero ? (
        <div 
          className={`relative overflow-hidden ${alturaMap[heroConfig.altura] || alturaMap.medium}`}
          style={{
            background: `linear-gradient(${heroConfig.gradienteDirecao}, ${heroConfig.gradienteInicio}, ${heroConfig.gradienteFim})`
          }}
        >
          {heroConfig.imagem && (
            <img
              src={heroConfig.imagem}
              alt={page.titulo}
              style={{ objectPosition: heroConfig.posicaoImagem }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Overlay */}
          {heroConfig.overlay !== 'none' && (
            <div 
              className="absolute inset-0"
              style={{ background: getOverlayStyle() }}
            />
          )}
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg"
              style={{
                color: heroConfig.textoTitulo,
                fontFamily: `'${pageHeadingFont}', serif`,
              }}
            >
              {page.titulo}
            </h1>
            {page.metaDescricao && (
              <p 
                className="text-xl md:text-2xl max-w-3xl drop-shadow"
                style={{ color: heroConfig.textoSubtitulo }}
              >
                {page.metaDescricao}
              </p>
            )}
          </div>

          {/* Curva inferior */}
          {heroConfig.curvaEstilo !== 'none' && curvasPaths[heroConfig.curvaEstilo] && (
            <div className="absolute bottom-0 left-0 w-full z-10">
              <svg 
                viewBox="0 0 1440 320" 
                preserveAspectRatio="none"
                className="w-full h-16"
              >
                <path 
                  fill={heroConfig.curvaCor}
                  d={curvasPaths[heroConfig.curvaEstilo]}
                />
              </svg>
            </div>
          )}
        </div>
      ) : (
        <div className="pt-20" />
      )}

      {/* Content Section */}
      <div className={`${containerWidthClass} mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16`}>
        <div 
          style={{ color: pageTextColor }}
          className="prose prose-lg prose-purple max-w-none
            prose-headings:font-bold
            prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8
            prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8
            prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6
            prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-purple-600 prose-a:no-underline hover:prose-a:text-purple-800
            prose-strong:font-semibold
            prose-ul:my-6 prose-li:my-2
            prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8
            prose-blockquote:border-l-4 prose-blockquote:border-purple-600 prose-blockquote:bg-purple-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-6
          "
          dangerouslySetInnerHTML={{ __html: page.conteudo }}
        />
      </div>

      {/* CTA Section */}
      {showCta && (
        <div 
          className="text-white py-16 mt-16"
          style={{
            background: `linear-gradient(${heroConfig.gradienteDirecao}, ${heroConfig.gradienteInicio}, ${heroConfig.gradienteFim})`
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{
                color: heroConfig.textoTitulo,
                fontFamily: `'${pageHeadingFont}', serif`,
              }}
            >
              Venha nos Visitar!
            </h2>
            <p 
              className="text-xl mb-8 max-w-2xl mx-auto"
              style={{ color: heroConfig.textoSubtitulo }}
            >
              Faça parte da nossa comunidade e experimente o amor de Deus em sua vida.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/sou-novo" 
                className="inline-block px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
              >
                Sou Novo Aqui
              </a>
              <a 
                href="/" 
                className="inline-block px-8 py-4 bg-purple-800 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-900 transition-all duration-200 transform hover:scale-105"
              >
                Voltar ao Início
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
