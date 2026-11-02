import mongoose from 'mongoose';

const ThemeSchema = new mongoose.Schema({
  // Identidade Visual & Marca
  nomeIgreja: { type: String, default: 'Ministério Internacional da Restauração' },
  logoUrl: { type: String, default: '/logo.png' },
  logoAltura: { type: String, default: 'normal' }, // compact, normal, large
  faviconUrl: { type: String, default: '' },

  // Tipografia & Estilo Global
  fonteTitulos: { type: String, default: 'Playfair Display' }, // Playfair Display, Montserrat, Poppins, Merriweather, Cinzel, Lora, Inter
  fonteCorpo: { type: String, default: 'Inter' }, // Inter, Poppins, Open Sans, Lato, Nunito, Roboto
  tamanhoFonteBase: { type: String, default: 'normal' }, // compact (15px), normal (16px), large (18px)
  pesoTitulos: { type: String, default: 'bold' }, // semibold (600), bold (700), extrabold (800)
  estiloBotoes: { type: String, default: 'rounded' }, // pill (9999px), rounded (12px), square (4px)
  arredondamentoCards: { type: String, default: 'large' }, // small (8px), medium (12px), large (16px), xlarge (24px)

  // Cores gerais
  corPrimaria: { type: String, default: '#9333ea' },
  corSecundaria: { type: String, default: '#ec4899' },
  corTexto: { type: String, default: '#1f2937' },
  corFundo: { type: String, default: '#ffffff' },
  corFundoPaginas: { type: String, default: '#ffffff' }, // Cor de fundo padrão para páginas
  corLink: { type: String, default: '#9333ea' },
  corLinkHover: { type: String, default: '#7c3aed' },
  corBotaoPrimaria: { type: String, default: '#9333ea' },
  corBotaoSecundaria: { type: String, default: '#ec4899' },
  corSucesso: { type: String, default: '#10b981' },
  corErro: { type: String, default: '#ef4444' },
  corAviso: { type: String, default: '#f59e0b' },
  corInfo: { type: String, default: '#3b82f6' },
  
  // Hero Landing Page (Home)
  heroHomeImagem: { type: String, default: '' },
  heroHomePosicaoImagem: { type: String, default: 'center' },
  heroHomeGradienteInicio: { type: String, default: '#9333ea' },
  heroHomeGradienteFim: { type: String, default: '#ec4899' },
  heroHomeGradienteDirecao: { type: String, default: 'to right' },
  heroHomeTextoTitulo: { type: String, default: '#ffffff' },
  heroHomeTextoSubtitulo: { type: String, default: '#f3f4f6' },
  heroHomeCurvaEstilo: { type: String, default: 'wave' },
  heroHomeCurvaCor: { type: String, default: '#ffffff' },
  heroHomeAltura: { type: String, default: 'medium' },
  heroHomeOverlay: { type: String, default: 'gradient' },
  
  // Hero Páginas Internas
  heroPaginasImagem: { type: String, default: '' },
  heroPaginasPosicaoImagem: { type: String, default: 'center' },
  heroPaginasGradienteInicio: { type: String, default: '#9333ea' },
  heroPaginasGradienteFim: { type: String, default: '#ec4899' },
  heroPaginasGradienteDirecao: { type: String, default: 'to right' },
  heroPaginasTextoTitulo: { type: String, default: '#ffffff' },
  heroPaginasTextoSubtitulo: { type: String, default: '#f3f4f6' },
  heroPaginasCurvaEstilo: { type: String, default: 'wave' },
  heroPaginasCurvaCor: { type: String, default: '#ffffff' },
  heroPaginasAltura: { type: String, default: 'medium' },
  heroPaginasOverlay: { type: String, default: 'gradient' },

  // Secção Boas-Vindas & Pilares (Home)
  boasVindasAtivo: { type: Boolean, default: true },
  boasVindasTitulo: { type: String, default: 'Bem-vindo à Nossa Igreja' },
  boasVindasSubtitulo: { type: String, default: 'Um lugar de fé, esperança e amor onde todos são bem-vindos para crescer espiritualmente e fazer parte de uma comunidade acolhedora.' },
  boasVindasCorFundo: { type: String, default: '#f9fafb' },
  card1Titulo: { type: String, default: 'Nossa Fé' },
  card1Texto: { type: String, default: 'Baseada nos ensinamentos de Cristo, compartilhamos a palavra de Deus com amor e dedicação.' },
  card2Titulo: { type: String, default: 'Nosso Amor' },
  card2Texto: { type: String, default: 'Acolhemos a todos com braços abertos, criando um ambiente de paz e comunhão fraterna.' },
  card3Titulo: { type: String, default: 'Nossa Comunhão' },
  card3Texto: { type: String, default: 'Unidos em oração e propósito, fortalecemos uns aos outros na caminhada espiritual.' },
  
  // Navbar/Menu
  navbarCorFundo: { type: String, default: '#ffffff' },
  navbarCorTexto: { type: String, default: '#1f2937' },
  navbarCorTextoHover: { type: String, default: '#9333ea' },
  navbarCorTextoAtivo: { type: String, default: '#9333ea' },
  navbarFonteTamanho: { type: String, default: 'normal' }, // small, normal, large
  navbarFontePeso: { type: String, default: 'semibold' }, // medium, semibold, bold
  navbarMaiusculas: { type: Boolean, default: false },
  navbarEspacamentoItens: { type: String, default: 'normal' }, // compact, normal, wide
  navbarEstiloAtivo: { type: String, default: 'underline' }, // color, underline, pill
  navbarBotaoDestaqueAtivo: { type: Boolean, default: false },
  navbarBotaoDestaqueTexto: { type: String, default: 'Contribuir' },
  navbarBotaoDestaqueUrl: { type: String, default: '/donate' },
  navbarBotaoDestaqueCor: { type: String, default: '#9333ea' },
  navbarBotaoDestaqueCorTexto: { type: String, default: '#ffffff' },
  navbarTransparente: { type: Boolean, default: false },
  navbarTransparenciaScroll: { type: Boolean, default: true },
  navbarSombra: { type: Boolean, default: true },
  navbarBorda: { type: Boolean, default: false },
  navbarCorBorda: { type: String, default: '#e5e7eb' },
  navbarAltura: { type: String, default: 'normal' }, // compact, normal, large
  navbarPosicao: { type: String, default: 'fixed' }, // fixed, sticky, static
  navbarBlur: { type: Boolean, default: false },
  
  // Dropdown Menu (Submenus)
  dropdownCorFundo: { type: String, default: '#ffffff' },
  dropdownCorTexto: { type: String, default: '#1f2937' },
  dropdownCorTextoHover: { type: String, default: '#9333ea' },
  dropdownCorFundoHover: { type: String, default: '#f3f4f6' },
  dropdownFonteTamanho: { type: String, default: 'normal' }, // small, normal, large
  dropdownArredondamento: { type: String, default: 'medium' }, // small, medium, large
  dropdownLargura: { type: String, default: 'normal' }, // compact (200px), normal (240px), wide (290px)
  dropdownSombra: { type: Boolean, default: true },
  dropdownBorda: { type: Boolean, default: true },
  dropdownCorBorda: { type: String, default: '#e5e7eb' },

  // Rodapé (Footer)
  footerCorFundo: { type: String, default: '#111827' },
  footerCorTexto: { type: String, default: '#9ca3af' },
  footerCorTitulo: { type: String, default: '#ffffff' },
  footerCorDestaque: { type: String, default: '#a855f7' },

  // Barra de Topo de Anúncio (Top Announcement Bar)
  topBarAtivo: { type: Boolean, default: false },
  topBarTexto: { type: String, default: '🔴 Culto de Celebração Ao Vivo todos os Domingos às 10h e 18h!' },
  topBarLinkTexto: { type: String, default: 'Assistir Agora' },
  topBarLinkUrl: { type: String, default: '/livestream' },
  topBarCorFundo: { type: String, default: '#581c87' },
  topBarCorTexto: { type: String, default: '#ffffff' },

  // Botão Flutuante de WhatsApp / Atendimento Pastoral
  whatsappFlutuanteAtivo: { type: Boolean, default: true },
  whatsappNumero: { type: String, default: '' },
  whatsappMensagem: { type: String, default: 'A Paz do Senhor! Gostaria de mais informações sobre a Igreja MIR.' },
  whatsappTextoTooltip: { type: String, default: 'Fale Connosco' },

  // Construtor e Personalização das Secções da Home (Landing Page Builder)
  homeOrdemSecoes: {
    type: [String],
    default: ['pastor', 'servicos', 'mensagem', 'testemunhos', 'eventos']
  },
  homeSecaoPastorAtivo: { type: Boolean, default: true },
  homeSecaoServicosAtivo: { type: Boolean, default: true },
  homeSecaoServicosCorFundo: { type: String, default: '#ffffff' },
  homeSecaoServicosSubtitulo: { type: String, default: 'Venha nos visitar! Temos cultos e atividades durante toda a semana' },
  homeSecaoMensagemAtivo: { type: Boolean, default: true },
  homeSecaoMensagemGradInicio: { type: String, default: '#a855f7' },
  homeSecaoMensagemGradFim: { type: String, default: '#ec4899' },
  homeSecaoMensagemCorTexto: { type: String, default: '#ffffff' },
  homeSecaoMensagemMostrarCurva: { type: Boolean, default: true },
  homeSecaoMensagemCurvaCor: { type: String, default: '' },
  homeSecaoTestemunhosAtivo: { type: Boolean, default: true },
  homeSecaoTestemunhosCorFundo: { type: String, default: '#faf5ff' },
  homeSecaoTestemunhosTitulo: { type: String, default: 'Testemunhos' },
  homeSecaoTestemunhosSubtitulo: { type: String, default: 'Vidas transformadas pelo poder de Deus' },
  homeSecaoTestemunhosCorTitulo: { type: String, default: '#111827' },
  homeSecaoTestemunhosCorSubtitulo: { type: String, default: '#4b5563' },
  homeSecaoTestemunhosCorCardFundo: { type: String, default: '#ffffff' },
  homeSecaoTestemunhosCorCardTexto: { type: String, default: '#374151' },
  homeSecaoTestemunhosCorCardAutor: { type: String, default: '#111827' },
  homeSecaoTestemunhosCorCardLocal: { type: String, default: '#7e22ce' },
  homeSecaoTestemunhosCorAspas: { type: String, default: '#facc15' },
  homeSecaoTestemunhosCorBotao: { type: String, default: '#7e22ce' },
  homeSecaoTestemunhosCorBotaoTexto: { type: String, default: '#ffffff' },
  homeSecaoEventosAtivo: { type: Boolean, default: true },
  homeSecaoEventosCorFundo: { type: String, default: '#f9fafb' },
  homeSecaoEventosTitulo: { type: String, default: 'Próximos Eventos' },
  homeSecaoEventosSubtitulo: { type: String, default: 'Participe dos nossos eventos e faça parte de momentos especiais de comunhão e crescimento espiritual' }
}, { timestamps: true });

export default mongoose.model('Theme', ThemeSchema);
