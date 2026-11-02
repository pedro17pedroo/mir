"use client";
import { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useSiteStore from '../store/useSiteStore';
import { livestreams } from '../lib/api';
import { FaChevronDown, FaBars, FaTimes, FaWhatsapp, FaCircle } from 'react-icons/fa';

const isValidCssColor = (val) => {
  if (typeof val !== 'string') return false;
  const s = val.trim();
  if (!s) return false;
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(s)) return true;
  if (/^(rgb|hsl)a?\(.+\)$/i.test(s)) return true;
  const namedColors = ['transparent', 'white', 'black', 'inherit', 'initial', 'currentcolor'];
  return namedColors.includes(s.toLowerCase());
};

const safeColor = (color, fallback) => (isValidCssColor(color) ? color.trim() : fallback);

export default function Navbar() {
  const allMenus = useSiteStore(state => state.menus);
  const menusLoaded = useSiteStore(state => state.menusLoaded);
  const storeTheme = useSiteStore(state => state.theme);
  const loadMenus = useSiteStore(state => state.loadMenus);
  const loadTheme = useSiteStore(state => state.loadTheme);

  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(null);
  const [liveNowStream, setLiveNowStream] = useState(null);
  const closeTimeoutRef = useRef(null);
  const pathname = usePathname();
  const storeSettings = useSiteStore(state => state.settings);
  const loadSettings = useSiteStore(state => state.loadSettings);

  const theme = useMemo(() => ({
    nomeIgreja: storeTheme?.nomeIgreja || 'Igreja MIR',
    logoUrl: storeTheme?.logoUrl || '/logo.png',
    logoAltura: storeTheme?.logoAltura || 'normal',
    corPrimaria: storeTheme?.corPrimaria || '#6D28D9',
    topBarAtivo: storeTheme?.topBarAtivo || false,
    topBarTexto: storeTheme?.topBarTexto || '🔴 Culto de Celebração Ao Vivo todos os Domingos às 10h e 18h!',
    topBarLinkTexto: storeTheme?.topBarLinkTexto || 'Assistir Agora',
    topBarLinkUrl: storeTheme?.topBarLinkUrl || '/livestream',
    topBarCorFundo: storeTheme?.topBarCorFundo || '#581c87',
    topBarCorTexto: storeTheme?.topBarCorTexto || '#ffffff',
    whatsappFlutuanteAtivo: storeTheme?.whatsappFlutuanteAtivo !== false,
    whatsappNumero: storeTheme?.whatsappNumero || '',
    whatsappMensagem: storeTheme?.whatsappMensagem || 'A Paz do Senhor! Gostaria de mais informações sobre a Igreja MIR.',
    whatsappTextoTooltip: storeTheme?.whatsappTextoTooltip || 'Fale Connosco',
    navbarCorFundo: storeTheme?.navbarCorFundo || '#ffffff',
    navbarCorTexto: storeTheme?.navbarCorTexto || '#1f2937',
    navbarCorTextoHover: storeTheme?.navbarCorTextoHover || '#9333ea',
    navbarCorTextoAtivo: storeTheme?.navbarCorTextoAtivo || '#9333ea',
    navbarFonteTamanho: storeTheme?.navbarFonteTamanho || 'normal',
    navbarFontePeso: storeTheme?.navbarFontePeso || 'semibold',
    navbarMaiusculas: storeTheme?.navbarMaiusculas || false,
    navbarEspacamentoItens: storeTheme?.navbarEspacamentoItens || 'normal',
    navbarEstiloAtivo: storeTheme?.navbarEstiloAtivo || 'underline',
    navbarBotaoDestaqueAtivo: storeTheme?.navbarBotaoDestaqueAtivo || false,
    navbarBotaoDestaqueTexto: storeTheme?.navbarBotaoDestaqueTexto || 'Contribuir',
    navbarBotaoDestaqueUrl: storeTheme?.navbarBotaoDestaqueUrl || '/donate',
    navbarBotaoDestaqueCor: storeTheme?.navbarBotaoDestaqueCor || '#9333ea',
    navbarBotaoDestaqueCorTexto: storeTheme?.navbarBotaoDestaqueCorTexto || '#ffffff',
    navbarTransparente: storeTheme?.navbarTransparente || false,
    navbarTransparenciaScroll: storeTheme?.navbarTransparenciaScroll !== false,
    navbarSombra: storeTheme?.navbarSombra !== false,
    navbarBorda: storeTheme?.navbarBorda || false,
    navbarCorBorda: storeTheme?.navbarCorBorda || '#e5e7eb',
    navbarAltura: storeTheme?.navbarAltura || 'normal',
    navbarPosicao: storeTheme?.navbarPosicao || 'fixed',
    navbarBlur: storeTheme?.navbarBlur || false,
    dropdownCorFundo: safeColor(storeTheme?.dropdownCorFundo, '#ffffff'),
    dropdownCorTexto: safeColor(storeTheme?.dropdownCorTexto, '#1f2937'),
    dropdownCorTextoHover: safeColor(storeTheme?.dropdownCorTextoHover, '#9333ea'),
    dropdownCorFundoHover: safeColor(storeTheme?.dropdownCorFundoHover, '#f5f3ff'),
    dropdownFonteTamanho: storeTheme?.dropdownFonteTamanho || 'normal',
    dropdownArredondamento: storeTheme?.dropdownArredondamento || 'medium',
    dropdownLargura: storeTheme?.dropdownLargura || 'normal',
    dropdownSombra: storeTheme?.dropdownSombra !== false,
    dropdownBorda: storeTheme?.dropdownBorda !== false,
    dropdownCorBorda: safeColor(storeTheme?.dropdownCorBorda, '#e5e7eb')
  }), [storeTheme]);

  const menus = useMemo(() => {
    const list = Array.isArray(allMenus) ? allMenus : [];
    const activeParents = list
      .filter(m => m.ativo && !m.parentId)
      .sort((a, b) => a.ordem - b.ordem)
      .map(parent => ({
        ...parent,
        submenus: list
          .filter(m => m.ativo && m.parentId === parent._id)
          .sort((a, b) => a.ordem - b.ordem)
      }));

    if (activeParents.length > 0) return activeParents;

    // Menu padrão caso o banco de dados ainda não tenha menus configurados
    return [
      { _id: 'default-home', titulo: 'Início', url: '/', submenus: [] },
      {
        _id: 'default-sobre',
        titulo: 'Sobre',
        url: '',
        submenus: [
          { _id: 'default-sobre-min', titulo: 'Ministério', url: '/sobre/ministerio' },
          { _id: 'default-sobre-cremos', titulo: 'No que Cremos', url: '/sobre/no-que-cremos' },
          { _id: 'default-sobre-lider', titulo: 'Presidente do MIR', url: '/sobre/presidente' },
          { _id: 'default-sobre-cels', titulo: 'Ministérios e Células', url: '/ministerios' },
          { _id: 'default-sounovo', titulo: 'Sou Novo Aqui', url: '/sou-novo' }
        ]
      },
      { _id: 'default-servicos', titulo: 'Serviços', url: '/servicos', submenus: [] },
      {
        _id: 'default-ensino',
        titulo: 'Ensino',
        url: '',
        submenus: [
          { _id: 'default-audio', titulo: 'Áudios', url: '/ensino/audio' },
          { _id: 'default-video', titulo: 'Vídeos', url: '/ensino/video' },
          { _id: 'default-cursos', titulo: 'Escola Bíblica e Cursos', url: '/ensino/cursos' },
          { _id: 'default-devocional', titulo: 'Devocional & Palavra Pastoral', url: '/devocional' }
        ]
      },
      {
        _id: 'default-plataforma',
        titulo: 'Plataforma de ensino',
        url: '',
        submenus: [
          { _id: 'default-plat-fe', titulo: 'Conferência de Fé', url: '/conferencia-fe' },
          { _id: 'default-plat-fund', titulo: 'Escola de Fundação', url: '/escola-fundacao' },
          { _id: 'default-plat-min', titulo: 'Conferência de Ministros', url: '/conferencia-ministros' },
          { _id: 'default-plat-mulh', titulo: 'Conferência de Mulheres', url: '/conferencia-mulheres' },
          { _id: 'default-plat-jov', titulo: 'Conferência dos Jovens', url: '/conferencia-jovens' },
          { _id: 'default-plat-transf', titulo: 'Mulheres Transformadas', url: '/mulheres-transformadas' },
          { _id: 'default-plat-reis', titulo: 'Reis e Sacerdotes', url: '/reis-sacerdotes' }
        ]
      },
      { _id: 'default-eventos', titulo: 'Eventos', url: '/eventos', submenus: [] },
      { _id: 'default-contato', titulo: 'Contacto', url: '/contato', submenus: [] }
    ];
  }, [allMenus]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileDropdownOpen(null);
  }, [pathname]);

  useEffect(() => {
    loadMenus();
    loadTheme();
    if (loadSettings) loadSettings();

    livestreams
      .getAll()
      .then((res) => {
        const list = res.data || [];
        const live = list.find((s) => s.aoVivo === true && s.ativa !== false);
        setLiveNowStream(live || null);
      })
      .catch(() => {});

    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [loadMenus, loadTheme, loadSettings]);

  // Fechar menu mobile ao mudar de rota
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileDropdownOpen(null);
  }, [pathname]);

  const handleMouseEnter = (menuId) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdown(menuId);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  const isTransparent = theme.navbarTransparente && !scrolled;

  const getNavbarHeight = () => {
    switch (theme.navbarAltura) {
      case 'compact': return 'py-2';
      case 'large': return 'py-6';
      default: return 'py-4';
    }
  };

  const getNavbarPosition = () => {
    switch (theme.navbarPosicao) {
      case 'sticky': return 'sticky';
      case 'static': return 'relative';
      default: return 'fixed';
    }
  };

  const getNavbarStyles = () => {
    const styles = {};
    if (isTransparent) {
      styles.background = 'transparent';
    } else {
      styles.backgroundColor = theme.navbarCorFundo;
      if (theme.navbarBlur) {
        styles.backdropFilter = 'blur(10px)';
        styles.backgroundColor = `${theme.navbarCorFundo}cc`;
      }
    }
    if (theme.navbarBorda && !isTransparent) {
      styles.borderBottom = `3px solid ${theme.navbarCorBorda}`;
    }
    return styles;
  };

  const getNavbarClasses = () => {
    const classes = ['w-full', 'z-50', 'transition-all', 'duration-300', getNavbarPosition(), 'top-0', 'left-0'];
    if (theme.navbarSombra && !isTransparent) {
      classes.push('shadow-md');
    }
    return classes.join(' ');
  };

  const getTextColor = (isActive = false, itemCustomColor = '') => {
    if (itemCustomColor && !isTransparent) {
      return itemCustomColor;
    }
    if (isTransparent) {
      return '#ffffff';
    }
    if (isActive) {
      return theme.navbarCorTextoAtivo;
    }
    return theme.navbarCorTexto;
  };

  const getTextHoverColor = () => {
    if (isTransparent) {
      return '#fef3c7';
    }
    return theme.navbarCorTextoHover;
  };

  // Classes tipográficas e de espaçamento dos itens do menu principal
  const getMenuFontClasses = () => {
    const sizeClass =
      theme.navbarFonteTamanho === 'small'
        ? 'text-sm'
        : theme.navbarFonteTamanho === 'large'
        ? 'text-lg'
        : 'text-base';
    const weightClass =
      theme.navbarFontePeso === 'medium'
        ? 'font-medium'
        : theme.navbarFontePeso === 'bold'
        ? 'font-bold'
        : 'font-semibold';
    const caseClass = theme.navbarMaiusculas ? 'uppercase tracking-wider text-xs' : '';
    return `${sizeClass} ${weightClass} ${caseClass}`.trim();
  };

  const getMenuGapClass = () => {
    switch (theme.navbarEspacamentoItens) {
      case 'compact':
        return 'gap-4 lg:gap-6';
      case 'wide':
        return 'gap-8 lg:gap-12';
      default:
        return 'gap-6 lg:gap-9';
    }
  };

  // Estilos e classes do dropdown (Submenus)
  const getDropdownStyles = () => {
    const styles = {
      backgroundColor: theme.dropdownCorFundo,
      minWidth:
        theme.dropdownLargura === 'compact'
          ? '200px'
          : theme.dropdownLargura === 'wide'
          ? '290px'
          : '240px'
    };
    if (theme.dropdownBorda) {
      styles.border = `1px solid ${theme.dropdownCorBorda}`;
    }
    return styles;
  };

  const getDropdownClasses = () => {
    const radiusClass =
      theme.dropdownArredondamento === 'small'
        ? 'rounded-lg'
        : theme.dropdownArredondamento === 'large'
        ? 'rounded-2xl'
        : theme.dropdownArredondamento === 'xlarge'
        ? 'rounded-3xl'
        : 'rounded-xl';
    const classes = [
      'absolute',
      'top-full',
      'left-0',
      'mt-2',
      radiusClass,
      'p-1.5',
      'z-[60]',
      'bg-white'
    ];
    if (theme.dropdownSombra) {
      classes.push('shadow-2xl');
    }
    return classes.join(' ');
  };

  const getSubmenuFontSizeClass = () => {
    switch (theme.dropdownFonteTamanho) {
      case 'small':
        return 'text-xs';
      case 'large':
        return 'text-base';
      default:
        return 'text-sm';
    }
  };

  const rawWhatsappPhone = (theme.whatsappNumero || storeSettings?.telefone || '+244923000000').replace(/\D/g, '');
  const whatsappUrl = rawWhatsappPhone
    ? `https://wa.me/${rawWhatsappPhone}?text=${encodeURIComponent(theme.whatsappMensagem)}`
    : '';

  return (
    <>
    <nav className={getNavbarClasses()} style={getNavbarStyles()}>
      {/* Barra de Topo de Anúncio ou Alerta de Transmissão Ao Vivo */}
      {(theme.topBarAtivo || liveNowStream) && (
        <div
          className="w-full py-1.5 px-4 text-center text-xs sm:text-sm font-medium transition-colors"
          style={{
            backgroundColor: liveNowStream ? '#dc2626' : theme.topBarCorFundo,
            color: liveNowStream ? '#ffffff' : theme.topBarCorTexto,
          }}
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {liveNowStream ? (
              <>
                <span className="inline-flex items-center gap-1.5 font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full text-[11px]">
                  <FaCircle className="text-[8px] text-white animate-ping" />
                  AO VIVO AGORA
                </span>
                <span className="font-semibold">{liveNowStream.titulo}</span>
                <Link
                  href="/livestream"
                  className="underline font-bold hover:opacity-90 ml-1"
                >
                  Assistir Culto →
                </Link>
              </>
            ) : (
              <>
                <span>{theme.topBarTexto}</span>
                {theme.topBarLinkTexto && theme.topBarLinkUrl && (
                  <Link
                    href={theme.topBarLinkUrl}
                    className="underline font-bold hover:opacity-90"
                  >
                    {theme.topBarLinkTexto} →
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <div className={`max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 ${getNavbarHeight()}`}>
        <Link href="/" className="flex items-center gap-3 mr-4 md:mr-8 flex-shrink-0">
          <img
            src={theme.logoUrl || '/logo.png'}
            alt={theme.nomeIgreja || 'Logo MIR'}
            className={`${
              theme.logoAltura === 'compact'
                ? 'h-8'
                : theme.logoAltura === 'large'
                ? 'h-14'
                : 'h-10'
            } w-auto object-contain drop-shadow-lg`}
          />
        </Link>

        {!menusLoaded ? (
          <div className="hidden md:flex flex-1 justify-center gap-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <ul className={`hidden md:flex flex-1 justify-center items-center ${getMenuGapClass()}`}>
            {menus.map(menu => {
              const isActive =
                pathname === menu.url ||
                (menu.submenus?.some(sub => pathname === sub.url));
              const isPillHighlight = Boolean(menu.destaque);

              // Estilo do item ativo (underline ou pill)
              const activeItemStyle = {};
              if (isPillHighlight) {
                activeItemStyle.backgroundColor = menu.corFundo || theme.corPrimaria || '#9333ea';
                activeItemStyle.color = menu.corTexto || '#ffffff';
              } else {
                activeItemStyle.color = getTextColor(isActive, menu.corTexto);
                if (menu.corFundo && !isTransparent) {
                  activeItemStyle.backgroundColor = menu.corFundo;
                } else if (isActive && theme.navbarEstiloAtivo === 'pill' && !isTransparent) {
                  activeItemStyle.backgroundColor = `${theme.navbarCorTextoAtivo}18`;
                }
                if (isActive && theme.navbarEstiloAtivo === 'underline') {
                  activeItemStyle.borderBottom = `2px solid ${
                    isTransparent ? '#ffffff' : theme.navbarCorTextoAtivo
                  }`;
                }
              }

              return (
                <li
                  key={menu._id}
                  className="relative"
                  onMouseEnter={() => menu.submenus?.length > 0 && handleMouseEnter(menu._id)}
                  onMouseLeave={handleMouseLeave}
                >
                  {menu.submenus?.length > 0 ? (
                    <div>
                      <button
                        type="button"
                        className={`${getMenuFontClasses()} transition-all flex items-center gap-1.5 ${
                          isPillHighlight
                            ? 'px-4 py-2 rounded-full shadow-sm hover:opacity-95'
                            : isActive && theme.navbarEstiloAtivo === 'pill'
                            ? 'px-3 py-1.5 rounded-full'
                            : 'py-1'
                        }`}
                        style={{
                          ...activeItemStyle,
                          textShadow: isTransparent && !isPillHighlight ? '0 2px 4px rgba(0,0,0,0.5)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (!isPillHighlight) {
                            e.currentTarget.style.color = getTextHoverColor();
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isPillHighlight) {
                            e.currentTarget.style.color = getTextColor(isActive, menu.corTexto);
                          }
                        }}
                      >
                        <span>{menu.titulo}</span>
                        {menu.badge && (
                          <span
                            className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full text-white leading-none"
                            style={{ backgroundColor: menu.corBadge || '#ef4444' }}
                          >
                            {menu.badge}
                          </span>
                        )}
                        <FaChevronDown className="text-xs opacity-80" />
                      </button>

                      {/* Dropdown Submenus */}
                      {openDropdown === menu._id && (
                        <div
                          className={getDropdownClasses()}
                          style={getDropdownStyles()}
                          onMouseEnter={() => handleMouseEnter(menu._id)}
                          onMouseLeave={handleMouseLeave}
                        >
                          {menu.submenus.map(submenu => {
                            const isSubActive = pathname === submenu.url;
                            const baseSubTextColor =
                              submenu.corTexto ||
                              (isSubActive ? theme.dropdownCorTextoHover : theme.dropdownCorTexto);
                            const baseSubBgColor =
                              submenu.corFundo ||
                              (isSubActive ? theme.dropdownCorFundoHover : 'transparent');

                            return (
                              <Link
                                key={submenu._id}
                                href={submenu.url || '#'}
                                target={submenu.abrirNovaAba ? '_blank' : undefined}
                                rel={submenu.abrirNovaAba ? 'noopener noreferrer' : undefined}
                                className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg font-medium transition-all duration-150 ${getSubmenuFontSizeClass()}`}
                                style={{
                                  color: baseSubTextColor,
                                  backgroundColor: baseSubBgColor
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = theme.dropdownCorTextoHover;
                                  e.currentTarget.style.backgroundColor = theme.dropdownCorFundoHover;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color = baseSubTextColor;
                                  e.currentTarget.style.backgroundColor = baseSubBgColor;
                                }}
                              >
                                <span>{submenu.titulo}</span>
                                {submenu.badge && (
                                  <span
                                    className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-full text-white leading-none"
                                    style={{ backgroundColor: submenu.corBadge || '#ef4444' }}
                                  >
                                    {submenu.badge}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={menu.url || '/'}
                      target={menu.abrirNovaAba ? '_blank' : undefined}
                      rel={menu.abrirNovaAba ? 'noopener noreferrer' : undefined}
                      className={`${getMenuFontClasses()} transition-all inline-flex items-center gap-1.5 ${
                        isPillHighlight
                          ? 'px-4 py-2 rounded-full shadow-sm hover:opacity-95'
                          : isActive && theme.navbarEstiloAtivo === 'pill'
                          ? 'px-3 py-1.5 rounded-full'
                          : menu.corFundo
                          ? 'px-3 py-1.5 rounded-lg'
                          : 'py-1'
                      }`}
                      style={{
                        ...activeItemStyle,
                        textShadow: isTransparent && !isPillHighlight ? '0 2px 4px rgba(0,0,0,0.5)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!isPillHighlight) {
                          e.currentTarget.style.color = getTextHoverColor();
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isPillHighlight) {
                          e.currentTarget.style.color = getTextColor(isActive, menu.corTexto);
                        }
                      }}
                    >
                      <span>{menu.titulo}</span>
                      {menu.badge && (
                        <span
                          className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full text-white leading-none"
                          style={{ backgroundColor: menu.corBadge || '#ef4444' }}
                        >
                          {menu.badge}
                        </span>
                      )}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* Botão CTA Opcional na Direita da Navbar */}
        {theme.navbarBotaoDestaqueAtivo && (
          <div className="hidden md:block ml-4">
            <Link
              href={theme.navbarBotaoDestaqueUrl || '/donate'}
              className="px-5 py-2.5 rounded-full font-bold text-sm shadow-sm hover:opacity-95 transition-all inline-block"
              style={{
                backgroundColor: theme.navbarBotaoDestaqueCor || '#9333ea',
                color: theme.navbarBotaoDestaqueCorTexto || '#ffffff'
              }}
            >
              {theme.navbarBotaoDestaqueTexto || 'Contribuir'}
            </Link>
          </div>
        )}

        {/* Botão Hamburger para Mobile */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(prev => !prev)}
          className="md:hidden p-2 rounded-lg focus:outline-none transition-colors"
          style={{ color: getTextColor(false) }}
          aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
        >
          {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
        </button>
      </div>

      {/* Menu Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t shadow-lg px-4 pt-3 pb-6 space-y-1 max-h-[80vh] overflow-y-auto"
          style={{
            backgroundColor: theme.navbarCorFundo || '#ffffff',
            borderColor: theme.navbarCorBorda || '#e5e7eb'
          }}
        >
          {menus.map(menu => {
            const isActive = pathname === menu.url || (menu.submenus?.some(sub => pathname === sub.url));
            const isSubOpen = mobileDropdownOpen === menu._id;

            if (menu.submenus?.length > 0) {
              return (
                <div key={menu._id} className="border-b border-gray-100 last:border-none py-1">
                  <button
                    type="button"
                    onClick={() => setMobileDropdownOpen(isSubOpen ? null : menu._id)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-semibold text-left"
                    style={{
                      color: menu.corTexto || (isActive ? theme.navbarCorTextoAtivo : theme.navbarCorTexto),
                      backgroundColor: menu.corFundo || 'transparent'
                    }}
                  >
                    <span className="flex items-center gap-2">
                      {menu.titulo}
                      {menu.badge && (
                        <span
                          className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-full text-white"
                          style={{ backgroundColor: menu.corBadge || '#ef4444' }}
                        >
                          {menu.badge}
                        </span>
                      )}
                    </span>
                    <FaChevronDown className={`text-xs transition-transform ${isSubOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isSubOpen && (
                    <div
                      className="pl-3 pr-2 py-2 space-y-1 rounded-xl mt-1.5 border"
                      style={{
                        backgroundColor:
                          theme.dropdownCorFundo === '#ffffff' ? '#f9fafb' : theme.dropdownCorFundo,
                        borderColor: theme.dropdownCorBorda
                      }}
                    >
                      {menu.submenus.map(submenu => {
                        const isSubActive = pathname === submenu.url;
                        return (
                          <Link
                            key={submenu._id}
                            href={submenu.url || '#'}
                            target={submenu.abrirNovaAba ? '_blank' : undefined}
                            rel={submenu.abrirNovaAba ? 'noopener noreferrer' : undefined}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                            style={{
                              color:
                                submenu.corTexto ||
                                (isSubActive ? theme.dropdownCorTextoHover : theme.dropdownCorTexto),
                              backgroundColor:
                                submenu.corFundo ||
                                (isSubActive ? theme.dropdownCorFundoHover : 'transparent')
                            }}
                          >
                            <span>{submenu.titulo}</span>
                            {submenu.badge && (
                              <span
                                className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-full text-white"
                                style={{ backgroundColor: submenu.corBadge || '#ef4444' }}
                              >
                                {submenu.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={menu._id}
                href={menu.url || '/'}
                target={menu.abrirNovaAba ? '_blank' : undefined}
                rel={menu.abrirNovaAba ? 'noopener noreferrer' : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg font-semibold border-b border-gray-100 last:border-none ${
                  menu.destaque ? 'my-1 text-center justify-center rounded-full shadow-sm' : ''
                }`}
                style={{
                  color: menu.destaque
                    ? menu.corTexto || '#ffffff'
                    : menu.corTexto || (isActive ? theme.navbarCorTextoAtivo : theme.navbarCorTexto),
                  backgroundColor: menu.destaque
                    ? menu.corFundo || theme.corPrimaria || '#9333ea'
                    : menu.corFundo || 'transparent'
                }}
              >
                <span>{menu.titulo}</span>
                {menu.badge && (
                  <span
                    className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-full text-white"
                    style={{ backgroundColor: menu.corBadge || '#ef4444' }}
                  >
                    {menu.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {theme.navbarBotaoDestaqueAtivo && (
            <div className="pt-3">
              <Link
                href={theme.navbarBotaoDestaqueUrl || '/donate'}
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-3 rounded-full font-bold text-sm shadow-sm"
                style={{
                  backgroundColor: theme.navbarBotaoDestaqueCor || '#9333ea',
                  color: theme.navbarBotaoDestaqueCorTexto || '#ffffff'
                }}
              >
                {theme.navbarBotaoDestaqueTexto || 'Contribuir'}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>

    {/* Botão Flutuante de WhatsApp / Atendimento Pastoral */}
    {theme.whatsappFlutuanteAtivo && whatsappUrl && (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-40 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 active:scale-95 text-white w-12 h-12 sm:w-auto sm:h-auto sm:px-4 sm:py-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 group focus:ring-4 focus:ring-green-300"
        title={theme.whatsappTextoTooltip || 'Fale Connosco no WhatsApp'}
      >
        <FaWhatsapp className="text-2xl" />
        <span className="hidden sm:inline text-sm font-bold pr-1">
          {theme.whatsappTextoTooltip || 'Fale Connosco'}
        </span>
      </a>
    )}
    </>
  );
}
