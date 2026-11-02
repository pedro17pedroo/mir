'use client';

import useSiteStore from '../store/useSiteStore';


/**
 * Reusable Theme-Driven Page Hero for all internal pages.
 * Automatically consumes `theme.heroPaginas*` settings (gradient, background image, overlay, height, curve SVG, typography colors)
 * while supporting optional per-page overrides (custom background image, custom height, badge, action buttons/children).
 */
export default function PageHero({
  titulo,
  subtitulo,
  badge = null,
  badgeIcon: BadgeIcon = null,
  imagemFundo = null,
  posicaoImagem = null,
  altura = null,
  curvaCorOverride = null,
  children = null,
}) {
  const theme = useSiteStore((s) => s.theme);

  const heroAltura = altura || theme?.heroPaginasAltura || 'medium';
  const heroBgImage = imagemFundo !== null ? imagemFundo : theme?.heroPaginasImagem || '';
  const heroBgPos = posicaoImagem || theme?.heroPaginasPosicaoImagem || 'center';
  const gradInicio = theme?.heroPaginasGradienteInicio || theme?.corPrimaria || '#9333ea';
  const gradFim = theme?.heroPaginasGradienteFim || theme?.corSecundaria || '#ec4899';
  const gradDir = theme?.heroPaginasGradienteDirecao || 'to right';
  const overlayStyle = theme?.heroPaginasOverlay || 'gradient';
  const curvaEstilo = theme?.heroPaginasCurvaEstilo || 'wave';
  const curvaCor = curvaCorOverride || theme?.heroPaginasCurvaCor || theme?.corFundoPaginas || '#ffffff';

  const getHeightClass = () => {
    switch (heroAltura) {
      case 'small':
        return 'py-16 pt-28';
      case 'large':
        return 'py-28 pt-36';
      case 'full':
        return 'min-h-[75vh] flex items-center pt-28';
      case 'medium':
      default:
        return 'py-20 pt-32';
    }
  };

  const renderCurveSVG = () => {
    if (curvaEstilo === 'none') return null;

    switch (curvaEstilo) {
      case 'smooth':
        return (
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
            <path d="M0 120L1440 120L1440 0C1440 0 1080 80 720 80C360 80 0 0 0 0L0 120Z" fill={curvaCor} />
          </svg>
        );
      case 'sharp':
        return (
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
            <path d="M0 120L720 20L1440 120H0Z" fill={curvaCor} />
          </svg>
        );
      case 'wave':
      default:
        return (
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill={curvaCor}
            />
          </svg>
        );
    }
  };

  return (
    <section
      className={`relative text-white overflow-hidden ${getHeightClass()}`}
      style={{
        backgroundImage: `linear-gradient(${gradDir}, ${gradInicio}, ${gradFim})`,
      }}
    >
      {/* Optional Background Image */}
      {heroBgImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={heroBgImage}
            alt={titulo || 'Banner'}
            style={{ objectPosition: heroBgPos }}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                overlayStyle === 'dark'
                  ? 'rgba(0, 0, 0, 0.6)'
                  : overlayStyle === 'light'
                  ? 'rgba(255, 255, 255, 0.2)'
                  : overlayStyle === 'none'
                  ? 'rgba(0, 0, 0, 0.25)'
                  : `linear-gradient(${gradDir}, ${gradInicio}cc, ${gradFim}cc)`,
            }}
          />
        </div>
      )}

      {/* Overlay when no background image is set */}
      {!heroBgImage && overlayStyle !== 'none' && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundColor:
              overlayStyle === 'dark'
                ? 'rgba(0, 0, 0, 0.3)'
                : overlayStyle === 'light'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.15)',
          }}
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-8">
        {badge && (
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            {BadgeIcon && <BadgeIcon className="text-amber-300" />}
            <span>{badge}</span>
          </div>
        )}
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-sm"
          style={{ color: theme?.heroPaginasTextoTitulo || '#ffffff' }}
        >
          {titulo}
        </h1>
        {subtitulo && (
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: theme?.heroPaginasTextoSubtitulo || '#f3f4f6' }}
          >
            {subtitulo}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>

      {/* Bottom Wave/Curve Divider */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">{renderCurveSVG()}</div>
    </section>
  );
}
