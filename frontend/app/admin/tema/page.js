'use client';

import { useState, useEffect } from 'react';
import { FaSave, FaPalette, FaImage, FaFileAlt, FaBars, FaChurch, FaHeart, FaColumns, FaFont } from 'react-icons/fa';
import { theme } from '@/lib/api';
import { Button, Loading, ImageUploader } from '@/components/common';
import useSiteStore from '@/store/useSiteStore';
import Swal from 'sweetalert2';

// Componente reutilizável para configuração do Hero
function HeroConfigSection({ formData, setFormData, prefix, title, description }) {
  const curvaEstilos = [
    { value: 'wave', label: 'Onda', svg: 'M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z' },
    { value: 'curve', label: 'Curva', svg: 'M0,160L1440,96L1440,320L0,320Z' },
    { value: 'triangle', label: 'Triângulo', svg: 'M0,320L720,96L1440,320Z' },
    { value: 'tilt', label: 'Inclinado', svg: 'M0,224L1440,96L1440,320L0,320Z' },
    { value: 'none', label: 'Sem Curva', svg: '' }
  ];

  const gradienteDirecoes = [
    { value: 'to right', label: 'Horizontal →' },
    { value: 'to left', label: 'Horizontal ←' },
    { value: 'to bottom', label: 'Vertical ↓' },
    { value: 'to top', label: 'Vertical ↑' },
    { value: 'to bottom right', label: 'Diagonal ↘' },
    { value: 'to bottom left', label: 'Diagonal ↙' }
  ];

  const alturas = [
    { value: 'small', label: 'Pequeno', height: '300px' },
    { value: 'medium', label: 'Médio', height: '400px' },
    { value: 'large', label: 'Grande', height: '500px' },
    { value: 'xlarge', label: 'Extra Grande', height: '600px' },
    { value: 'fullscreen', label: 'Tela Cheia', height: '100vh' }
  ];

  const overlays = [
    { value: 'none', label: 'Sem Overlay' },
    { value: 'gradient', label: 'Gradiente' },
    { value: 'dark', label: 'Escuro' },
    { value: 'light', label: 'Claro' }
  ];

  const getOverlayStyle = (overlay) => {
    switch (overlay) {
      case 'gradient':
        return 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.1))';
      case 'dark':
        return 'rgba(0,0,0,0.4)';
      case 'light':
        return 'rgba(255,255,255,0.2)';
      default:
        return 'none';
    }
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [`${prefix}${field}`]: value });
  };

  const getField = (field) => formData[`${prefix}${field}`];

  return (
    <div className="space-y-8">
      {/* Título e Descrição */}
      <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
        <h3 className="text-lg font-medium text-purple-900 mb-1">{title}</h3>
        <p className="text-sm text-purple-700">{description}</p>
      </div>

      {/* Preview do Hero */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <p className="text-sm text-gray-600 mb-3">Pré-visualização do Hero:</p>
        <div 
          className="relative rounded-lg overflow-hidden"
          style={{ 
            height: alturas.find(a => a.value === getField('Altura'))?.height || '400px',
            background: `linear-gradient(${getField('GradienteDirecao')}, ${getField('GradienteInicio')}, ${getField('GradienteFim')})`
          }}
        >
          {getField('Imagem') && (
            <img
              src={getField('Imagem')}
              alt="Hero Preview"
              style={{ objectPosition: getField('PosicaoImagem') || 'center' }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {/* Overlay */}
          {getField('Overlay') !== 'none' && (
            <div 
              className="absolute inset-0"
              style={{ background: getOverlayStyle(getField('Overlay')) }}
            />
          )}
          
          {/* Conteúdo */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
            <h1 
              className="text-4xl md:text-5xl font-bold mb-4 drop-shadow"
              style={{ color: getField('TextoTitulo') }}
            >
              Título do Hero
            </h1>
            <p 
              className="text-lg md:text-xl max-w-2xl drop-shadow"
              style={{ color: getField('TextoSubtitulo') }}
            >
              Subtítulo ou descrição do hero banner
            </p>
          </div>

          {/* Curva */}
          {getField('CurvaEstilo') !== 'none' && (
            <div className="absolute bottom-0 left-0 w-full">
              <svg 
                viewBox="0 0 1440 320" 
                preserveAspectRatio="none"
                className="w-full h-24"
              >
                <path 
                  fill={getField('CurvaCor')}
                  d={curvaEstilos.find(c => c.value === getField('CurvaEstilo'))?.svg}
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Imagem de Fundo Padrão do Hero */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Imagem de Fundo Padrão (Opcional)</h3>
        <ImageUploader
          label="Imagem de Fundo do Hero (se vazia, exibe apenas o gradiente configurado abaixo)"
          value={getField('Imagem') || ''}
          onChange={(val) => updateField('Imagem', val)}
          aspectRatio="banner"
          maxWidth={1920}
          showPositionControl={true}
          positionValue={getField('PosicaoImagem') || 'center'}
          onPositionChange={(pos) => updateField('PosicaoImagem', pos)}
        />
      </div>

      {/* Gradiente */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Gradiente de Fundo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cor Inicial
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={getField('GradienteInicio')}
                onChange={(e) => updateField('GradienteInicio', e.target.value)}
                className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={getField('GradienteInicio')}
                onChange={(e) => updateField('GradienteInicio', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cor Final
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={getField('GradienteFim')}
                onChange={(e) => updateField('GradienteFim', e.target.value)}
                className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={getField('GradienteFim')}
                onChange={(e) => updateField('GradienteFim', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Direção do Gradiente
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {gradienteDirecoes.map((dir) => (
              <button
                key={dir.value}
                type="button"
                onClick={() => updateField('GradienteDirecao', dir.value)}
                className={`px-4 py-3 rounded-lg border-2 transition-all ${
                  getField('GradienteDirecao') === dir.value
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {dir.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cores do Texto */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Cores do Texto</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cor do Título
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={getField('TextoTitulo')}
                onChange={(e) => updateField('TextoTitulo', e.target.value)}
                className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={getField('TextoTitulo')}
                onChange={(e) => updateField('TextoTitulo', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cor do Subtítulo
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={getField('TextoSubtitulo')}
                onChange={(e) => updateField('TextoSubtitulo', e.target.value)}
                className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={getField('TextoSubtitulo')}
                onChange={(e) => updateField('TextoSubtitulo', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Curva */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Curva Inferior</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          {curvaEstilos.map((curva) => (
            <button
              key={curva.value}
              type="button"
              onClick={() => updateField('CurvaEstilo', curva.value)}
              className={`p-4 rounded-lg border-2 transition-all ${
                getField('CurvaEstilo') === curva.value
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-sm font-medium mb-2">{curva.label}</div>
              {curva.svg && (
                <svg viewBox="0 0 1440 320" className="w-full h-8">
                  <path fill="currentColor" d={curva.svg} />
                </svg>
              )}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cor da Curva
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={getField('CurvaCor')}
              onChange={(e) => updateField('CurvaCor', e.target.value)}
              className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={getField('CurvaCor')}
              onChange={(e) => updateField('CurvaCor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Altura */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Altura do Hero</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {alturas.map((altura) => (
            <button
              key={altura.value}
              type="button"
              onClick={() => updateField('Altura', altura.value)}
              className={`px-4 py-3 rounded-lg border-2 transition-all ${
                getField('Altura') === altura.value
                  ? 'border-purple-600 bg-purple-50 text-purple-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-medium text-sm">{altura.label}</div>
              <div className="text-xs text-gray-500 mt-1">{altura.height}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Overlay */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Overlay (Camada)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {overlays.map((overlay) => (
            <button
              key={overlay.value}
              type="button"
              onClick={() => updateField('Overlay', overlay.value)}
              className={`px-4 py-3 rounded-lg border-2 transition-all ${
                getField('Overlay') === overlay.value
                  ? 'border-purple-600 bg-purple-50 text-purple-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {overlay.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

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

export default function TemaAdmin() {
  const loadThemeStore = useSiteStore((s) => s.loadTheme);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('identidade');
  const [dropdownPreviewBg, setDropdownPreviewBg] = useState('light');
  const [dropdownHoverSample, setDropdownHoverSample] = useState(null);

  const applyDropdownPreset = (presetKey) => {
    if (presetKey === 'mir_light') {
      setFormData((prev) => ({
        ...prev,
        dropdownCorFundo: '#ffffff',
        dropdownCorTexto: '#1f2937',
        dropdownCorTextoHover: '#9333ea',
        dropdownCorFundoHover: '#f5f3ff',
        dropdownCorBorda: '#e5e7eb',
        dropdownBorda: true,
        dropdownSombra: true
      }));
    } else if (presetKey === 'mir_dark') {
      setFormData((prev) => ({
        ...prev,
        dropdownCorFundo: '#18181b',
        dropdownCorTexto: '#f9fafb',
        dropdownCorTextoHover: '#eab308',
        dropdownCorFundoHover: '#27272a',
        dropdownCorBorda: '#3f3f46',
        dropdownBorda: true,
        dropdownSombra: true
      }));
    } else if (presetKey === 'mir_purple') {
      setFormData((prev) => ({
        ...prev,
        dropdownCorFundo: '#4c1d95',
        dropdownCorTexto: '#ffffff',
        dropdownCorTextoHover: '#fde047',
        dropdownCorFundoHover: '#6b21a8',
        dropdownCorBorda: '#7c3aed',
        dropdownBorda: true,
        dropdownSombra: true
      }));
    }
  };
  const [formData, setFormData] = useState({
    // Identidade Visual
    nomeIgreja: 'Ministério Internacional da Restauração',
    logoUrl: '/logo.png',
    logoAltura: 'normal',

    // Tipografia & Estilo Global
    fonteTitulos: 'Playfair Display',
    fonteCorpo: 'Inter',
    tamanhoFonteBase: 'normal',
    pesoTitulos: 'bold',
    estiloBotoes: 'rounded',
    arredondamentoCards: 'large',

    // Cores gerais
    corPrimaria: '#9333ea',
    corSecundaria: '#ec4899',
    corTexto: '#1f2937',
    corFundo: '#ffffff',
    corFundoPaginas: '#ffffff',
    corLink: '#9333ea',
    corLinkHover: '#7c3aed',
    corBotaoPrimaria: '#9333ea',
    corBotaoSecundaria: '#ec4899',
    corSucesso: '#10b981',
    corErro: '#ef4444',
    corAviso: '#f59e0b',
    corInfo: '#3b82f6',
    
    // Hero Landing Page (Home)
    heroHomeImagem: '',
    heroHomePosicaoImagem: 'center',
    heroHomeGradienteInicio: '#9333ea',
    heroHomeGradienteFim: '#ec4899',
    heroHomeGradienteDirecao: 'to right',
    heroHomeTextoTitulo: '#ffffff',
    heroHomeTextoSubtitulo: '#f3f4f6',
    heroHomeCurvaEstilo: 'wave',
    heroHomeCurvaCor: '#ffffff',
    heroHomeAltura: 'medium',
    heroHomeOverlay: 'gradient',
    
    // Hero Páginas Internas
    heroPaginasImagem: '',
    heroPaginasPosicaoImagem: 'center',
    heroPaginasGradienteInicio: '#9333ea',
    heroPaginasGradienteFim: '#ec4899',
    heroPaginasGradienteDirecao: 'to right',
    heroPaginasTextoTitulo: '#ffffff',
    heroPaginasTextoSubtitulo: '#f3f4f6',
    heroPaginasCurvaEstilo: 'wave',
    heroPaginasCurvaCor: '#ffffff',
    heroPaginasAltura: 'medium',
    heroPaginasOverlay: 'gradient',

    // Boas-Vindas & Pilares
    boasVindasAtivo: true,
    boasVindasTitulo: 'Seja Bem-Vindo!',
    boasVindasSubtitulo: 'Somos uma família que ama a Deus e deseja compartilhar Seu amor com você. Venha nos visitar e fazer parte desta comunidade!',
    boasVindasCorFundo: '#f9fafb',
    card1Titulo: 'Nossa Fé',
    card1Texto: 'Fundamentados na Palavra de Deus, buscamos viver uma fé autêntica e transformadora.',
    card2Titulo: 'Nosso Amor',
    card2Texto: 'Amamos a Deus sobre todas as coisas e ao próximo como a nós mesmos.',
    card3Titulo: 'Nossa Comunhão',
    card3Texto: 'Valorizamos os relacionamentos e a vida em comunidade, crescendo juntos na fé.',
    
    // Navbar/Menu
    navbarCorFundo: '#ffffff',
    navbarCorTexto: '#1f2937',
    navbarCorTextoHover: '#9333ea',
    navbarCorTextoAtivo: '#9333ea',
    navbarFonteTamanho: 'normal',
    navbarFontePeso: 'semibold',
    navbarMaiusculas: false,
    navbarEspacamentoItens: 'normal',
    navbarEstiloAtivo: 'underline',
    navbarBotaoDestaqueAtivo: false,
    navbarBotaoDestaqueTexto: 'Contribuir',
    navbarBotaoDestaqueUrl: '/donate',
    navbarBotaoDestaqueCor: '#9333ea',
    navbarBotaoDestaqueCorTexto: '#ffffff',
    navbarTransparente: false,
    navbarTransparenciaScroll: true,
    navbarSombra: true,
    navbarBorda: false,
    navbarCorBorda: '#e5e7eb',
    navbarAltura: 'normal',
    navbarPosicao: 'fixed',
    navbarBlur: false,
    
    // Dropdown Menu
    dropdownCorFundo: '#ffffff',
    dropdownCorTexto: '#1f2937',
    dropdownCorTextoHover: '#9333ea',
    dropdownCorFundoHover: '#f3f4f6',
    dropdownFonteTamanho: 'normal',
    dropdownArredondamento: 'medium',
    dropdownLargura: 'normal',
    dropdownSombra: true,
    dropdownBorda: true,
    dropdownCorBorda: '#e5e7eb',

    // Rodapé
    footerCorFundo: '#111827',
    footerCorTexto: '#9ca3af',
    footerCorTitulo: '#ffffff',
    footerCorDestaque: '#facc15',

    // Barra de Topo & WhatsApp Flutuante
    topBarAtivo: false,
    topBarTexto: '🔴 Culto de Celebração Ao Vivo todos os Domingos às 10h e 18h!',
    topBarLinkTexto: 'Assistir Agora',
    topBarLinkUrl: '/livestream',
    topBarCorFundo: '#581c87',
    topBarCorTexto: '#ffffff',
    whatsappFlutuanteAtivo: true,
    whatsappNumero: '',
    whatsappMensagem: 'A Paz do Senhor! Gostaria de mais informações sobre a Igreja MIR.',
    whatsappTextoTooltip: 'Fale Connosco',

    // Construtor das Secções da Home
    homeOrdemSecoes: ['pastor', 'servicos', 'mensagem', 'testemunhos', 'eventos'],
    homeSecaoPastorAtivo: true,
    homeSecaoServicosAtivo: true,
    homeSecaoServicosCorFundo: '#ffffff',
    homeSecaoServicosSubtitulo: 'Venha nos visitar! Temos cultos e atividades durante toda a semana',
    homeSecaoMensagemAtivo: true,
    homeSecaoMensagemGradInicio: '#a855f7',
    homeSecaoMensagemGradFim: '#ec4899',
    homeSecaoMensagemCorTexto: '#ffffff',
    homeSecaoMensagemMostrarCurva: true,
    homeSecaoMensagemCurvaCor: '',
    homeSecaoTestemunhosAtivo: true,
    homeSecaoTestemunhosCorFundo: '#faf5ff',
    homeSecaoTestemunhosTitulo: 'Testemunhos',
    homeSecaoTestemunhosSubtitulo: 'Vidas transformadas pelo poder de Deus',
    homeSecaoTestemunhosCorTitulo: '#111827',
    homeSecaoTestemunhosCorSubtitulo: '#4b5563',
    homeSecaoTestemunhosCorCardFundo: '#ffffff',
    homeSecaoTestemunhosCorCardTexto: '#374151',
    homeSecaoTestemunhosCorCardAutor: '#111827',
    homeSecaoTestemunhosCorCardLocal: '#7e22ce',
    homeSecaoTestemunhosCorAspas: '#facc15',
    homeSecaoTestemunhosCorBotao: '#7e22ce',
    homeSecaoTestemunhosCorBotaoTexto: '#ffffff',
    homeSecaoEventosAtivo: true,
    homeSecaoEventosCorFundo: '#f9fafb',
    homeSecaoEventosTitulo: 'Próximos Eventos',
    homeSecaoEventosSubtitulo: 'Participe dos nossos eventos e faça parte de momentos especiais de comunhão e crescimento espiritual'
  });

  useEffect(() => {
    loadTema();
  }, []);

  const loadTema = async () => {
    try {
      setLoading(true);
      const response = await theme.get();
      if (response.data) {
        setFormData({
          nomeIgreja: response.data.nomeIgreja || 'Ministério Internacional da Restauração',
          logoUrl: response.data.logoUrl || '/logo.png',
          logoAltura: response.data.logoAltura || 'normal',

          // Tipografia & Estilo Global
          fonteTitulos: response.data.fonteTitulos || 'Playfair Display',
          fonteCorpo: response.data.fonteCorpo || 'Inter',
          tamanhoFonteBase: response.data.tamanhoFonteBase || 'normal',
          pesoTitulos: response.data.pesoTitulos || 'bold',
          estiloBotoes: response.data.estiloBotoes || 'rounded',
          arredondamentoCards: response.data.arredondamentoCards || 'large',

          // Cores gerais
          corPrimaria: response.data.corPrimaria || '#9333ea',
          corSecundaria: response.data.corSecundaria || '#ec4899',
          corTexto: response.data.corTexto || '#1f2937',
          corFundo: response.data.corFundo || '#ffffff',
          corFundoPaginas: response.data.corFundoPaginas || '#ffffff',
          corLink: response.data.corLink || '#9333ea',
          corLinkHover: response.data.corLinkHover || '#7c3aed',
          corBotaoPrimaria: response.data.corBotaoPrimaria || '#9333ea',
          corBotaoSecundaria: response.data.corBotaoSecundaria || '#ec4899',
          corSucesso: response.data.corSucesso || '#10b981',
          corErro: response.data.corErro || '#ef4444',
          corAviso: response.data.corAviso || '#f59e0b',
          corInfo: response.data.corInfo || '#3b82f6',
          
          // Hero Landing Page (Home)
          heroHomeImagem: response.data.heroHomeImagem || '',
          heroHomePosicaoImagem: response.data.heroHomePosicaoImagem || 'center',
          heroHomeGradienteInicio: response.data.heroHomeGradienteInicio || '#9333ea',
          heroHomeGradienteFim: response.data.heroHomeGradienteFim || '#ec4899',
          heroHomeGradienteDirecao: response.data.heroHomeGradienteDirecao || 'to right',
          heroHomeTextoTitulo: response.data.heroHomeTextoTitulo || '#ffffff',
          heroHomeTextoSubtitulo: response.data.heroHomeTextoSubtitulo || '#f3f4f6',
          heroHomeCurvaEstilo: response.data.heroHomeCurvaEstilo || 'wave',
          heroHomeCurvaCor: response.data.heroHomeCurvaCor || '#ffffff',
          heroHomeAltura: response.data.heroHomeAltura || 'medium',
          heroHomeOverlay: response.data.heroHomeOverlay || 'gradient',
          
          // Hero Páginas Internas
          heroPaginasImagem: response.data.heroPaginasImagem || '',
          heroPaginasPosicaoImagem: response.data.heroPaginasPosicaoImagem || 'center',
          heroPaginasGradienteInicio: response.data.heroPaginasGradienteInicio || '#9333ea',
          heroPaginasGradienteFim: response.data.heroPaginasGradienteFim || '#ec4899',
          heroPaginasGradienteDirecao: response.data.heroPaginasGradienteDirecao || 'to right',
          heroPaginasTextoTitulo: response.data.heroPaginasTextoTitulo || '#ffffff',
          heroPaginasTextoSubtitulo: response.data.heroPaginasTextoSubtitulo || '#f3f4f6',
          heroPaginasCurvaEstilo: response.data.heroPaginasCurvaEstilo || 'wave',
          heroPaginasCurvaCor: response.data.heroPaginasCurvaCor || '#ffffff',
          heroPaginasAltura: response.data.heroPaginasAltura || 'medium',
          heroPaginasOverlay: response.data.heroPaginasOverlay || 'gradient',

          // Boas-Vindas & Pilares
          boasVindasAtivo: response.data.boasVindasAtivo !== false,
          boasVindasTitulo: response.data.boasVindasTitulo || 'Seja Bem-Vindo!',
          boasVindasSubtitulo: response.data.boasVindasSubtitulo || 'Somos uma família que ama a Deus e deseja compartilhar Seu amor com você. Venha nos visitar e fazer parte desta comunidade!',
          boasVindasCorFundo: response.data.boasVindasCorFundo || '#f9fafb',
          card1Titulo: response.data.card1Titulo || 'Nossa Fé',
          card1Texto: response.data.card1Texto || 'Fundamentados na Palavra de Deus, buscamos viver uma fé autêntica e transformadora.',
          card2Titulo: response.data.card2Titulo || 'Nosso Amor',
          card2Texto: response.data.card2Texto || 'Amamos a Deus sobre todas as coisas e ao próximo como a nós mesmos.',
          card3Titulo: response.data.card3Titulo || 'Nossa Comunhão',
          card3Texto: response.data.card3Texto || 'Valorizamos os relacionamentos e a vida em comunidade, crescendo juntos na fé.',
          
          // Navbar/Menu
          navbarCorFundo: response.data.navbarCorFundo || '#ffffff',
          navbarCorTexto: response.data.navbarCorTexto || '#1f2937',
          navbarCorTextoHover: response.data.navbarCorTextoHover || '#9333ea',
          navbarCorTextoAtivo: response.data.navbarCorTextoAtivo || '#9333ea',
          navbarFonteTamanho: response.data.navbarFonteTamanho || 'normal',
          navbarFontePeso: response.data.navbarFontePeso || 'semibold',
          navbarMaiusculas: Boolean(response.data.navbarMaiusculas),
          navbarEspacamentoItens: response.data.navbarEspacamentoItens || 'normal',
          navbarEstiloAtivo: response.data.navbarEstiloAtivo || 'underline',
          navbarBotaoDestaqueAtivo: Boolean(response.data.navbarBotaoDestaqueAtivo),
          navbarBotaoDestaqueTexto: response.data.navbarBotaoDestaqueTexto || 'Contribuir',
          navbarBotaoDestaqueUrl: response.data.navbarBotaoDestaqueUrl || '/donate',
          navbarBotaoDestaqueCor: response.data.navbarBotaoDestaqueCor || '#9333ea',
          navbarBotaoDestaqueCorTexto: response.data.navbarBotaoDestaqueCorTexto || '#ffffff',
          navbarTransparente: response.data.navbarTransparente || false,
          navbarTransparenciaScroll: response.data.navbarTransparenciaScroll !== false,
          navbarSombra: response.data.navbarSombra !== false,
          navbarBorda: response.data.navbarBorda || false,
          navbarCorBorda: response.data.navbarCorBorda || '#e5e7eb',
          navbarAltura: response.data.navbarAltura || 'normal',
          navbarPosicao: response.data.navbarPosicao || 'fixed',
          navbarBlur: response.data.navbarBlur || false,
          
          // Dropdown Menu
          dropdownCorFundo: safeColor(response.data.dropdownCorFundo, '#ffffff'),
          dropdownCorTexto: safeColor(response.data.dropdownCorTexto, '#1f2937'),
          dropdownCorTextoHover: safeColor(response.data.dropdownCorTextoHover, '#9333ea'),
          dropdownCorFundoHover: safeColor(response.data.dropdownCorFundoHover, '#f5f3ff'),
          dropdownFonteTamanho: response.data.dropdownFonteTamanho || 'normal',
          dropdownArredondamento: response.data.dropdownArredondamento || 'medium',
          dropdownLargura: response.data.dropdownLargura || 'normal',
          dropdownSombra: response.data.dropdownSombra !== false,
          dropdownBorda: response.data.dropdownBorda !== false,
          dropdownCorBorda: safeColor(response.data.dropdownCorBorda, '#e5e7eb'),

          // Rodapé
          footerCorFundo: response.data.footerCorFundo || '#111827',
          footerCorTexto: response.data.footerCorTexto || '#9ca3af',
          footerCorTitulo: response.data.footerCorTitulo || '#ffffff',
          footerCorDestaque: response.data.footerCorDestaque || '#facc15',

          // Barra de Topo & WhatsApp Flutuante
          topBarAtivo: Boolean(response.data.topBarAtivo),
          topBarTexto: response.data.topBarTexto || '🔴 Culto de Celebração Ao Vivo todos os Domingos às 10h e 18h!',
          topBarLinkTexto: response.data.topBarLinkTexto || 'Assistir Agora',
          topBarLinkUrl: response.data.topBarLinkUrl || '/livestream',
          topBarCorFundo: response.data.topBarCorFundo || '#581c87',
          topBarCorTexto: response.data.topBarCorTexto || '#ffffff',
          whatsappFlutuanteAtivo: response.data.whatsappFlutuanteAtivo !== false,
          whatsappNumero: response.data.whatsappNumero || '',
          whatsappMensagem: response.data.whatsappMensagem || 'A Paz do Senhor! Gostaria de mais informações sobre a Igreja MIR.',
          whatsappTextoTooltip: response.data.whatsappTextoTooltip || 'Fale Connosco',

          // Construtor das Secções da Home
          homeOrdemSecoes:
            Array.isArray(response.data.homeOrdemSecoes) && response.data.homeOrdemSecoes.length > 0
              ? response.data.homeOrdemSecoes
              : ['pastor', 'servicos', 'mensagem', 'testemunhos', 'eventos'],
          homeSecaoPastorAtivo: response.data.homeSecaoPastorAtivo !== false,
          homeSecaoServicosAtivo: response.data.homeSecaoServicosAtivo !== false,
          homeSecaoServicosCorFundo: response.data.homeSecaoServicosCorFundo || '#ffffff',
          homeSecaoServicosSubtitulo: response.data.homeSecaoServicosSubtitulo || 'Venha nos visitar! Temos cultos e atividades durante toda a semana',
          homeSecaoMensagemAtivo: response.data.homeSecaoMensagemAtivo !== false,
          homeSecaoMensagemGradInicio: response.data.homeSecaoMensagemGradInicio || '#a855f7',
          homeSecaoMensagemGradFim: response.data.homeSecaoMensagemGradFim || '#ec4899',
          homeSecaoMensagemCorTexto: response.data.homeSecaoMensagemCorTexto || '#ffffff',
          homeSecaoMensagemMostrarCurva: response.data.homeSecaoMensagemMostrarCurva !== false,
          homeSecaoMensagemCurvaCor: response.data.homeSecaoMensagemCurvaCor || '',
          homeSecaoTestemunhosAtivo: response.data.homeSecaoTestemunhosAtivo !== false,
          homeSecaoTestemunhosCorFundo: response.data.homeSecaoTestemunhosCorFundo || '#faf5ff',
          homeSecaoTestemunhosTitulo: response.data.homeSecaoTestemunhosTitulo || 'Testemunhos',
          homeSecaoTestemunhosSubtitulo: response.data.homeSecaoTestemunhosSubtitulo || 'Vidas transformadas pelo poder de Deus',
          homeSecaoTestemunhosCorTitulo: response.data.homeSecaoTestemunhosCorTitulo || '#111827',
          homeSecaoTestemunhosCorSubtitulo: response.data.homeSecaoTestemunhosCorSubtitulo || '#4b5563',
          homeSecaoTestemunhosCorCardFundo: response.data.homeSecaoTestemunhosCorCardFundo || '#ffffff',
          homeSecaoTestemunhosCorCardTexto: response.data.homeSecaoTestemunhosCorCardTexto || '#374151',
          homeSecaoTestemunhosCorCardAutor: response.data.homeSecaoTestemunhosCorCardAutor || '#111827',
          homeSecaoTestemunhosCorCardLocal: response.data.homeSecaoTestemunhosCorCardLocal || '#7e22ce',
          homeSecaoTestemunhosCorAspas: response.data.homeSecaoTestemunhosCorAspas || '#facc15',
          homeSecaoTestemunhosCorBotao: response.data.homeSecaoTestemunhosCorBotao || '#7e22ce',
          homeSecaoTestemunhosCorBotaoTexto: response.data.homeSecaoTestemunhosCorBotaoTexto || '#ffffff',
          homeSecaoEventosAtivo: response.data.homeSecaoEventosAtivo !== false,
          homeSecaoEventosCorFundo: response.data.homeSecaoEventosCorFundo || '#f9fafb',
          homeSecaoEventosTitulo: response.data.homeSecaoEventosTitulo || 'Próximos Eventos',
          homeSecaoEventosSubtitulo: response.data.homeSecaoEventosSubtitulo || 'Participe dos nossos eventos e faça parte de momentos especiais de comunhão e crescimento espiritual'
        });
      }
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const dataToSave = {
        ...formData,
        dropdownCorFundo: safeColor(formData.dropdownCorFundo, '#ffffff'),
        dropdownCorTexto: safeColor(formData.dropdownCorTexto, '#1f2937'),
        dropdownCorTextoHover: safeColor(formData.dropdownCorTextoHover, '#9333ea'),
        dropdownCorFundoHover: safeColor(formData.dropdownCorFundoHover, '#f5f3ff'),
        dropdownCorBorda: safeColor(formData.dropdownCorBorda, '#e5e7eb'),
      };
      await theme.update(dataToSave);
      await loadThemeStore(true);
      await Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Tema atualizado com sucesso!',
        confirmButtonColor: '#9333ea',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: error.message || 'Erro ao salvar tema',
        confirmButtonColor: '#9333ea'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading text="Carregando tema..." />;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tema e Personalização</h2>
        <p className="text-gray-600 mt-1">Personalize cores, hero e estilos do site</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex -mb-px min-w-max">
            <button
              type="button"
              onClick={() => setActiveTab('identidade')}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'identidade'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaChurch className="inline mr-2" />
              Identidade & Marca
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cores')}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'cores'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaPalette className="inline mr-2" />
              Cores Gerais
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tipografia')}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'tipografia'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaFont className="inline mr-2" />
              Tipografia & Letras
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('heroHome')}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'heroHome'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaImage className="inline mr-2" />
              Hero Landing Page
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('boasVindas')}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'boasVindas'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaHeart className="inline mr-2" />
              Boas-Vindas & Pilares
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('heroPaginas')}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'heroPaginas'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaFileAlt className="inline mr-2" />
              Hero Páginas Internas
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('navbar')}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'navbar'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaBars className="inline mr-2" />
              Navbar/Menu
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('rodape')}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'rodape'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaColumns className="inline mr-2" />
              Rodapé
            </button>
          </nav>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tab: Identidade & Marca */}
          {activeTab === 'identidade' && (
            <div className="space-y-8">
              <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
                <h3 className="text-lg font-medium text-purple-900 mb-1">Identidade Visual da Igreja</h3>
                <p className="text-sm text-purple-700">
                  Configure o nome oficial, o logótipo exibido na barra de navegação e no rodapé, e o seu tamanho.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Oficial da Igreja / Ministério
                  </label>
                  <input
                    type="text"
                    value={formData.nomeIgreja}
                    onChange={(e) => setFormData({ ...formData, nomeIgreja: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Ministério Internacional da Restauração"
                  />
                </div>

                <div>
                  <ImageUploader
                    label="Logótipo Principal (Navbar e Rodapé)"
                    value={formData.logoUrl}
                    onChange={(val) => setFormData({ ...formData, logoUrl: val || '/logo.png' })}
                    aspectRatio="logo"
                    maxWidth={600}
                    helperText="Recomendado: PNG com fundo transparente ou SVG."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamanho do Logótipo no Menu
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'compact', label: 'Compacto (32px)' },
                      { value: 'normal', label: 'Normal (40px)' },
                      { value: 'large', label: 'Grande (56px)' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, logoAltura: opt.value })}
                        className={`px-3 py-3 rounded-lg border-2 text-sm font-medium transition ${
                          formData.logoAltura === opt.value
                            ? 'border-purple-600 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Barra de Topo de Anúncio (Top Bar) */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-base font-bold text-gray-900">Barra de Topo de Anúncio (Top Bar)</h4>
                    <p className="text-xs text-gray-500">
                      Faixa opcional exibida no topo do site (ex: aviso de campanha, conferência ou culto). Nota: Quando uma transmissão é marcada como &ldquo;Ao Vivo Agora&rdquo;, o alerta de direto aparece automaticamente.
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-2 cursor-pointer bg-purple-50 px-4 py-2 rounded-lg border border-purple-200">
                    <input
                      type="checkbox"
                      checked={formData.topBarAtivo}
                      onChange={(e) => setFormData({ ...formData, topBarAtivo: e.target.checked })}
                      className="w-5 h-5 text-purple-600 rounded"
                    />
                    <span className="text-sm font-semibold text-purple-900">Ativar Top Bar</span>
                  </label>
                </div>

                {formData.topBarAtivo && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Mensagem do Anúncio</label>
                      <input
                        type="text"
                        value={formData.topBarTexto}
                        onChange={(e) => setFormData({ ...formData, topBarTexto: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Texto do Link (Opcional)</label>
                      <input
                        type="text"
                        value={formData.topBarLinkTexto}
                        onChange={(e) => setFormData({ ...formData, topBarLinkTexto: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Destino do Link (URL)</label>
                      <input
                        type="text"
                        value={formData.topBarLinkUrl}
                        onChange={(e) => setFormData({ ...formData, topBarLinkUrl: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Cor de Fundo da Faixa</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.topBarCorFundo}
                          onChange={(e) => setFormData({ ...formData, topBarCorFundo: e.target.value })}
                          className="h-9 w-14 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.topBarCorFundo}
                          onChange={(e) => setFormData({ ...formData, topBarCorFundo: e.target.value })}
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Cor da Letra da Faixa</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.topBarCorTexto}
                          onChange={(e) => setFormData({ ...formData, topBarCorTexto: e.target.value })}
                          className="h-9 w-14 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.topBarCorTexto}
                          onChange={(e) => setFormData({ ...formData, topBarCorTexto: e.target.value })}
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Botão Flutuante de WhatsApp */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-base font-bold text-gray-900">Botão Flutuante de WhatsApp / Atendimento Pastoral</h4>
                    <p className="text-xs text-gray-500">
                      Botão rápido no canto inferior direito para que visitantes e membros falem com a secretaria ou equipa pastoral.
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-2 cursor-pointer bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                    <input
                      type="checkbox"
                      checked={formData.whatsappFlutuanteAtivo}
                      onChange={(e) => setFormData({ ...formData, whatsappFlutuanteAtivo: e.target.checked })}
                      className="w-5 h-5 text-green-600 rounded"
                    />
                    <span className="text-sm font-semibold text-green-900">Exibir WhatsApp</span>
                  </label>
                </div>

                {formData.whatsappFlutuanteAtivo && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Número WhatsApp (vazio = usa o geral)
                      </label>
                      <input
                        type="text"
                        value={formData.whatsappNumero}
                        onChange={(e) => setFormData({ ...formData, whatsappNumero: e.target.value })}
                        placeholder="Ex: +244923000000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Texto do Botão</label>
                      <input
                        type="text"
                        value={formData.whatsappTextoTooltip}
                        onChange={(e) => setFormData({ ...formData, whatsappTextoTooltip: e.target.value })}
                        placeholder="Fale Connosco"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Mensagem Inicial Automática</label>
                      <input
                        type="text"
                        value={formData.whatsappMensagem}
                        onChange={(e) => setFormData({ ...formData, whatsappMensagem: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab: Tipografia & Letras */}
          {activeTab === 'tipografia' && (
            <div className="space-y-8">
              <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
                <h3 className="text-lg font-medium text-purple-900 mb-1">Tipografia, Fontes (Letras) & Estilos Globais</h3>
                <p className="text-sm text-purple-700">
                  Escolha as famílias de fontes para títulos e corpo do texto, o tamanho base de leitura, o peso dos títulos e o formato padrão dos botões e cartões em todo o site.
                </p>
              </div>

              {/* Pré-visualização ao Vivo */}
              <div
                className="p-8 border-2 border-purple-100 shadow-inner transition-all"
                style={{
                  backgroundColor: formData.corFundo || '#FFFFFF',
                  color: formData.corTexto || '#1F2937',
                  fontFamily: `'${formData.fonteCorpo}', sans-serif`,
                  fontSize: formData.tamanhoFonteBase === 'compact' ? '15px' : formData.tamanhoFonteBase === 'large' ? '18px' : '16px',
                  borderRadius: formData.arredondamentoCards === 'small' ? '8px' : formData.arredondamentoCards === 'medium' ? '12px' : formData.arredondamentoCards === 'xlarge' ? '24px' : '16px',
                }}
              >
                <span className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3 bg-purple-100 text-purple-700">
                  Pré-visualização Tipográfica ao Vivo
                </span>
                <h2
                  className="text-3xl md:text-4xl mb-3"
                  style={{
                    fontFamily: `'${formData.fonteTitulos}', serif`,
                    fontWeight: formData.pesoTitulos === 'semibold' ? 600 : formData.pesoTitulos === 'extrabold' ? 800 : 700,
                    color: formData.corPrimaria,
                  }}
                >
                  {formData.nomeIgreja || 'Ministério Internacional da Restauração'}
                </h2>
                <p className="leading-relaxed mb-5 max-w-3xl opacity-90">
                  Assim ficarão os títulos, parágrafos, cartões e botões em todas as páginas do website. Experimente combinar uma fonte clássica nos títulos (como Playfair Display ou Cinzel) com uma fonte moderna e legível no corpo (como Inter ou Poppins).
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    style={{
                      backgroundColor: formData.corBotaoPrimaria,
                      color: '#FFFFFF',
                      borderRadius: formData.estiloBotoes === 'pill' ? '9999px' : formData.estiloBotoes === 'square' ? '6px' : '12px',
                    }}
                    className="px-6 py-2.5 font-semibold text-sm shadow-sm"
                  >
                    Botão Principal ({formData.estiloBotoes})
                  </button>
                  <button
                    type="button"
                    style={{
                      backgroundColor: formData.corBotaoSecundaria,
                      color: '#FFFFFF',
                      borderRadius: formData.estiloBotoes === 'pill' ? '9999px' : formData.estiloBotoes === 'square' ? '6px' : '12px',
                    }}
                    className="px-6 py-2.5 font-semibold text-sm shadow-sm"
                  >
                    Botão Secundário
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fonte dos Títulos e Cabeçalhos (H1 a H6)
                  </label>
                  <select
                    value={formData.fonteTitulos}
                    onChange={(e) => setFormData({ ...formData, fonteTitulos: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Playfair Display">Playfair Display (Clássica & Solene - Padrão)</option>
                    <option value="Cinzel">Cinzel (Majestosa / Institucional)</option>
                    <option value="Merriweather">Merriweather (Editorial Elegante)</option>
                    <option value="Lora">Lora (Contemporânea com Serifa)</option>
                    <option value="Montserrat">Montserrat (Moderna & Geométrica)</option>
                    <option value="Poppins">Poppins (Limpa & Acolhedora)</option>
                    <option value="Inter">Inter (Minimalista Sans-Serif)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fonte do Corpo de Texto, Parágrafos e Menus
                  </label>
                  <select
                    value={formData.fonteCorpo}
                    onChange={(e) => setFormData({ ...formData, fonteCorpo: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Inter">Inter (Alta Legibilidade - Padrão)</option>
                    <option value="Poppins">Poppins (Suave & Moderna)</option>
                    <option value="Open Sans">Open Sans (Humanista & Clara)</option>
                    <option value="Lato">Lato (Equilibrada & Acolhedora)</option>
                    <option value="Nunito">Nunito (Arredondada & Amigável)</option>
                    <option value="Roboto">Roboto (Clássica Digital)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamanho Base das Letras no Site
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'compact', label: 'Compacto (15px)' },
                      { value: 'normal', label: 'Normal (16px)' },
                      { value: 'large', label: 'Amplo (18px)' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, tamanhoFonteBase: opt.value })}
                        className={`px-3 py-3 rounded-lg border-2 text-sm font-medium transition ${
                          formData.tamanhoFonteBase === opt.value
                            ? 'border-purple-600 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Espessura (Peso) dos Títulos
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'semibold', label: 'Semi-Negrito (600)' },
                      { value: 'bold', label: 'Negrito (700)' },
                      { value: 'extrabold', label: 'Extra-Forte (800)' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, pesoTitulos: opt.value })}
                        className={`px-3 py-3 rounded-lg border-2 text-sm font-medium transition ${
                          formData.pesoTitulos === opt.value
                            ? 'border-purple-600 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Formato Global dos Botões
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'pill', label: 'Pílula (Arredondado)' },
                      { value: 'rounded', label: 'Suave (12px)' },
                      { value: 'square', label: 'Reto (6px)' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, estiloBotoes: opt.value })}
                        className={`px-3 py-3 rounded-lg border-2 text-sm font-medium transition ${
                          formData.estiloBotoes === opt.value
                            ? 'border-purple-600 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arredondamento dos Cartões (Cards)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 'small', label: '8px' },
                      { value: 'medium', label: '12px' },
                      { value: 'large', label: '16px' },
                      { value: 'xlarge', label: '24px' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, arredondamentoCards: opt.value })}
                        className={`px-3 py-3 rounded-lg border-2 text-sm font-medium transition ${
                          formData.arredondamentoCards === opt.value
                            ? 'border-purple-600 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Boas-Vindas & Pilares */}
          {activeTab === 'boasVindas' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
                <div>
                  <h3 className="text-lg font-medium text-purple-900 mb-1">Secção Boas-Vindas & 3 Pilares (Home)</h3>
                  <p className="text-sm text-purple-700">
                    Personalize os textos e títulos exibidos logo abaixo do Carrossel Principal na Página Inicial.
                  </p>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-lg border border-purple-200">
                  <input
                    type="checkbox"
                    checked={formData.boasVindasAtivo}
                    onChange={(e) => setFormData({ ...formData, boasVindasAtivo: e.target.checked })}
                    className="w-5 h-5 text-purple-600 rounded"
                  />
                  <span className="text-sm font-semibold text-gray-800">Secção Visível</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título Principal de Boas-Vindas</label>
                  <input
                    type="text"
                    value={formData.boasVindasTitulo}
                    onChange={(e) => setFormData({ ...formData, boasVindasTitulo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cor de Fundo da Secção</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.boasVindasCorFundo}
                      onChange={(e) => setFormData({ ...formData, boasVindasCorFundo: e.target.value })}
                      className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.boasVindasCorFundo}
                      onChange={(e) => setFormData({ ...formData, boasVindasCorFundo: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtítulo / Mensagem de Acolhimento</label>
                  <textarea
                    rows={2}
                    value={formData.boasVindasSubtitulo}
                    onChange={(e) => setFormData({ ...formData, boasVindasSubtitulo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                  <h4 className="font-semibold text-gray-800">Card 1 (Ícone Igreja)</h4>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Título</label>
                    <input
                      type="text"
                      value={formData.card1Titulo}
                      onChange={(e) => setFormData({ ...formData, card1Titulo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Descrição</label>
                    <textarea
                      rows={3}
                      value={formData.card1Texto}
                      onChange={(e) => setFormData({ ...formData, card1Texto: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                  <h4 className="font-semibold text-gray-800">Card 2 (Ícone Coração)</h4>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Título</label>
                    <input
                      type="text"
                      value={formData.card2Titulo}
                      onChange={(e) => setFormData({ ...formData, card2Titulo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Descrição</label>
                    <textarea
                      rows={3}
                      value={formData.card2Texto}
                      onChange={(e) => setFormData({ ...formData, card2Texto: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                  <h4 className="font-semibold text-gray-800">Card 3 (Ícone Oração)</h4>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Título</label>
                    <input
                      type="text"
                      value={formData.card3Titulo}
                      onChange={(e) => setFormData({ ...formData, card3Titulo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Descrição</label>
                    <textarea
                      rows={3}
                      value={formData.card3Texto}
                      onChange={(e) => setFormData({ ...formData, card3Texto: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Construtor e Ordem das Secções da Página Inicial */}
              <div className="pt-8 border-t border-gray-200 space-y-6">
                <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
                  <h3 className="text-lg font-bold text-indigo-950 mb-1">
                    Construtor e Ordem das Secções da Página Inicial (Home Builder)
                  </h3>
                  <p className="text-sm text-indigo-800">
                    Ative ou oculte cada secção da Home, reordene a sequência com as setas (↑ / ↓) e personalize as cores de fundo, títulos e subtítulos de cada bloco.
                  </p>
                </div>

                <div className="space-y-4">
                  {(formData.homeOrdemSecoes || ['pastor', 'servicos', 'mensagem', 'testemunhos', 'eventos']).map((secaoKey, idx, arr) => {
                    const metaMap = {
                      pastor: {
                        nome: 'Conheça Nosso Pastor (Sobre o Pastor)',
                        desc: 'Secção institucional com foto e mensagem do Pastor Presidente (conteúdo editável em /admin/pastor)',
                        activeField: 'homeSecaoPastorAtivo',
                      },
                      servicos: {
                        nome: 'Horários de Cultos & Serviços',
                        desc: 'Cartões com os dias e horários dos cultos (itens editáveis em /admin/servicos)',
                        activeField: 'homeSecaoServicosAtivo',
                        bgField: 'homeSecaoServicosCorFundo',
                        subField: 'homeSecaoServicosSubtitulo',
                      },
                      mensagem: {
                        nome: 'Faixa Palavra Pastoral / Devocional em Destaque',
                        desc: 'Citação pastoral e versículo em destaque (editável em /admin/mensagens)',
                        activeField: 'homeSecaoMensagemAtivo',
                      },
                      testemunhos: {
                        nome: 'Mural de Testemunhos',
                        desc: 'Testemunhos aprovados e botão para membros enviarem o seu testemunho',
                        activeField: 'homeSecaoTestemunhosAtivo',
                        bgField: 'homeSecaoTestemunhosCorFundo',
                        titleField: 'homeSecaoTestemunhosTitulo',
                        subField: 'homeSecaoTestemunhosSubtitulo',
                      },
                      eventos: {
                        nome: 'Próximos Eventos & Agenda',
                        desc: 'Grelha com os próximos eventos e conferências da igreja',
                        activeField: 'homeSecaoEventosAtivo',
                        bgField: 'homeSecaoEventosCorFundo',
                        titleField: 'homeSecaoEventosTitulo',
                        subField: 'homeSecaoEventosSubtitulo',
                      },
                    };

                    const info = metaMap[secaoKey];
                    if (!info) return null;

                    const moveSection = (dir) => {
                      const next = [...arr];
                      const targetIdx = idx + dir;
                      if (targetIdx < 0 || targetIdx >= next.length) return;
                      const temp = next[idx];
                      next[idx] = next[targetIdx];
                      next[targetIdx] = temp;
                      setFormData({ ...formData, homeOrdemSecoes: next });
                    };

                    const isVisible = formData[info.activeField] !== false;

                    return (
                      <div
                        key={secaoKey}
                        className={`p-5 rounded-xl border-2 transition ${
                          isVisible
                            ? 'bg-white border-gray-200 shadow-sm'
                            : 'bg-gray-50 border-dashed border-gray-300 opacity-70'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => moveSection(-1)}
                                className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-purple-100 text-gray-700 rounded disabled:opacity-30 font-bold"
                                title="Mover para cima"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                disabled={idx === arr.length - 1}
                                onClick={() => moveSection(1)}
                                className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-purple-100 text-gray-700 rounded disabled:opacity-30 font-bold"
                                title="Mover para baixo"
                              >
                                ↓
                              </button>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                                  #{idx + 1}
                                </span>
                                <h4 className="font-bold text-gray-900">{info.nome}</h4>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">{info.desc}</p>
                            </div>
                          </div>

                          <label className="inline-flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                            <input
                              type="checkbox"
                              checked={isVisible}
                              onChange={(e) =>
                                setFormData({ ...formData, [info.activeField]: e.target.checked })
                              }
                              className="w-4 h-4 text-purple-600 rounded"
                            />
                            <span className="text-xs font-semibold text-gray-800">
                              {isVisible ? 'Visível na Home' : 'Oculto'}
                            </span>
                          </label>
                        </div>

                        {isVisible && (info.bgField || info.titleField || info.subField) && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                            {info.bgField && (
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Cor de Fundo da Secção
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={formData[info.bgField] || '#ffffff'}
                                    onChange={(e) =>
                                      setFormData({ ...formData, [info.bgField]: e.target.value })
                                    }
                                    className="h-9 w-12 rounded border border-gray-300 cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={formData[info.bgField] || '#ffffff'}
                                    onChange={(e) =>
                                      setFormData({ ...formData, [info.bgField]: e.target.value })
                                    }
                                    className="flex-1 px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
                                  />
                                </div>
                              </div>
                            )}

                            {info.titleField && (
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Título da Secção
                                </label>
                                <input
                                  type="text"
                                  value={formData[info.titleField] || ''}
                                  onChange={(e) =>
                                    setFormData({ ...formData, [info.titleField]: e.target.value })
                                  }
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                                />
                              </div>
                            )}

                            {info.subField && (
                              <div className={info.titleField ? '' : 'md:col-span-2'}>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Subtítulo da Secção
                                </label>
                                <input
                                  type="text"
                                  value={formData[info.subField] || ''}
                                  onChange={(e) =>
                                    setFormData({ ...formData, [info.subField]: e.target.value })
                                  }
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Controlos Especializados para a Faixa de Palavra Pastoral / Mensagem */}
                        {isVisible && secaoKey === 'mensagem' && (
                          <div className="mt-4 pt-4 border-t border-purple-100 bg-purple-50/50 p-4 rounded-xl space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h5 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                                Cores do Texto Bíblico & Enquadramento da Curva
                              </h5>
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData({
                                    ...formData,
                                    homeSecaoMensagemCurvaCor:
                                      formData.homeSecaoTestemunhosCorFundo || '#faf5ff'
                                  })
                                }
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-200 text-purple-900 hover:bg-purple-300 transition"
                              >
                                ⚡ Sincronizar Curva com Fundo dos Testemunhos (
                                {formData.homeSecaoTestemunhosCorFundo || '#faf5ff'})
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                  Gradiente Início
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={formData.homeSecaoMensagemGradInicio || '#a855f7'}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        homeSecaoMensagemGradInicio: e.target.value
                                      })
                                    }
                                    className="h-8 w-10 rounded border border-gray-300 cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={formData.homeSecaoMensagemGradInicio || '#a855f7'}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        homeSecaoMensagemGradInicio: e.target.value
                                      })
                                    }
                                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                  Gradiente Fim
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={formData.homeSecaoMensagemGradFim || '#ec4899'}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        homeSecaoMensagemGradFim: e.target.value
                                      })
                                    }
                                    className="h-8 w-10 rounded border border-gray-300 cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={formData.homeSecaoMensagemGradFim || '#ec4899'}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        homeSecaoMensagemGradFim: e.target.value
                                      })
                                    }
                                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                  Cor do Texto Bíblico / Citação
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={formData.homeSecaoMensagemCorTexto || '#ffffff'}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        homeSecaoMensagemCorTexto: e.target.value
                                      })
                                    }
                                    className="h-8 w-10 rounded border border-gray-300 cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={formData.homeSecaoMensagemCorTexto || '#ffffff'}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        homeSecaoMensagemCorTexto: e.target.value
                                      })
                                    }
                                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-purple-200/60">
                              <div className="flex items-center">
                                <label className="inline-flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={formData.homeSecaoMensagemMostrarCurva !== false}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        homeSecaoMensagemMostrarCurva: e.target.checked
                                      })
                                    }
                                    className="h-4 w-4 text-purple-600 rounded"
                                  />
                                  Exibir Curva Ondulada Inferior
                                </label>
                              </div>

                              {formData.homeSecaoMensagemMostrarCurva !== false && (
                                <div>
                                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Cor da Curva Inferior (Para encaixe com a secção de baixo)
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="color"
                                      value={
                                        formData.homeSecaoMensagemCurvaCor ||
                                        formData.homeSecaoTestemunhosCorFundo ||
                                        '#faf5ff'
                                      }
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          homeSecaoMensagemCurvaCor: e.target.value
                                        })
                                      }
                                      className="h-8 w-10 rounded border border-gray-300 cursor-pointer"
                                    />
                                    <input
                                      type="text"
                                      value={
                                        formData.homeSecaoMensagemCurvaCor ||
                                        formData.homeSecaoTestemunhosCorFundo ||
                                        '#faf5ff'
                                      }
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          homeSecaoMensagemCurvaCor: e.target.value
                                        })
                                      }
                                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Controlos Especializados e Paletas para Testemunhos */}
                        {isVisible && secaoKey === 'testemunhos' && (
                          <div className="mt-4 pt-4 border-t border-purple-100 bg-purple-50/50 p-4 rounded-xl space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h5 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                                Paleta Completa de Cores dos Testemunhos
                              </h5>

                              {/* Paletas Rápidas com 1 clique */}
                              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                                <span className="font-bold text-gray-600 mr-1">Predefinições:</span>
                                {[
                                  {
                                    nome: 'Lilás Suave (Padrão)',
                                    fundo: '#faf5ff',
                                    card: '#ffffff',
                                    texto: '#374151',
                                    titulo: '#111827',
                                    botao: '#7e22ce'
                                  },
                                  {
                                    nome: 'Branco Puro',
                                    fundo: '#ffffff',
                                    card: '#f9fafb',
                                    texto: '#1f2937',
                                    titulo: '#111827',
                                    botao: '#9333ea'
                                  },
                                  {
                                    nome: 'Cinza Minimalista',
                                    fundo: '#f3f4f6',
                                    card: '#ffffff',
                                    texto: '#374151',
                                    titulo: '#111827',
                                    botao: '#4f46e5'
                                  },
                                  {
                                    nome: 'Dark Noturno',
                                    fundo: '#0f172a',
                                    card: '#1e293b',
                                    texto: '#e2e8f0',
                                    titulo: '#f8fafc',
                                    botao: '#8b5cf6'
                                  }
                                ].map((preset) => (
                                  <button
                                    key={preset.nome}
                                    type="button"
                                    onClick={() =>
                                      setFormData({
                                        ...formData,
                                        homeSecaoTestemunhosCorFundo: preset.fundo,
                                        homeSecaoTestemunhosCorCardFundo: preset.card,
                                        homeSecaoTestemunhosCorCardTexto: preset.texto,
                                        homeSecaoTestemunhosCorTitulo: preset.titulo,
                                        homeSecaoTestemunhosCorBotao: preset.botao,
                                        // Auto sincroniza a curva da mensagem
                                        homeSecaoMensagemCurvaCor: preset.fundo
                                      })
                                    }
                                    className="px-2 py-0.5 rounded bg-white hover:bg-purple-100 text-purple-900 border border-purple-200 font-semibold transition shadow-sm"
                                  >
                                    {preset.nome}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {/* Cor do Título */}
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                                  Cor do Título Principal
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={formData.homeSecaoTestemunhosCorTitulo || '#111827'}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        homeSecaoTestemunhosCorTitulo: e.target.value
                                      })
                                    }
                                    className="h-8 w-9 rounded border border-gray-300 cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={formData.homeSecaoTestemunhosCorTitulo || '#111827'}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        homeSecaoTestemunhosCorTitulo: e.target.value
                                      })
                                    }
                                    className="flex-1 px-1.5 py-1 text-[11px] border border-gray-300 rounded bg-white"
                                  />
                                </div>
                              </div>

                              {/* Cor do Subtítulo */}
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                                  Cor do Subtítulo
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={formData.homeSecaoTestemunhosCorSubtitulo || '#4b5563'}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        homeSecaoTestemunhosCorSubtitulo: e.target.value
                                      })
                                    }
                                    className="h-8 w-9 rounded border border-gray-300 cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={formData.homeSecaoTestemunhosCorSubtitulo || '#4b5563'}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        homeSecaoTestemunhosCorSubtitulo: e.target.value
                                      })
                                    }
                                    className="flex-1 px-1.5 py-1 text-[11px] border border-gray-300 rounded bg-white"
                                  />
                                </div>
                              </div>

                              {/* Fundo do Card */}
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                                  Fundo dos Cartões
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={formData.homeSecaoTestemunhosCorCardFundo || '#ffffff'}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        homeSecaoTestemunhosCorCardFundo: e.target.value
                                      })
                                    }
                                    className="h-8 w-9 rounded border border-gray-300 cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={formData.homeSecaoTestemunhosCorCardFundo || '#ffffff'}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        homeSecaoTestemunhosCorCardFundo: e.target.value
                                      })
                                    }
                                    className="flex-1 px-1.5 py-1 text-[11px] border border-gray-300 rounded bg-white"
                                  />
                                </div>
                              </div>

                              {/* Texto do Card */}
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                                  Texto do Depoimento
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={formData.homeSecaoTestemunhosCorCardTexto || '#374151'}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        homeSecaoTestemunhosCorCardTexto: e.target.value
                                      })
                                    }
                                    className="h-8 w-9 rounded border border-gray-300 cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={formData.homeSecaoTestemunhosCorCardTexto || '#374151'}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        homeSecaoTestemunhosCorCardTexto: e.target.value
                                      })
                                    }
                                    className="flex-1 px-1.5 py-1 text-[11px] border border-gray-300 rounded bg-white"
                                  />
                                </div>
                              </div>

                              {/* Nome do Autor */}
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                                  Nome do Membro (Autor)
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={formData.homeSecaoTestemunhosCorCardAutor || '#111827'}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        homeSecaoTestemunhosCorCardAutor: e.target.value
                                      })
                                    }
                                    className="h-8 w-9 rounded border border-gray-300 cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={formData.homeSecaoTestemunhosCorCardAutor || '#111827'}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        homeSecaoTestemunhosCorCardAutor: e.target.value
                                      })
                                    }
                                    className="flex-1 px-1.5 py-1 text-[11px] border border-gray-300 rounded bg-white"
                                  />
                                </div>
                              </div>

                              {/* Local / Congregação */}
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                                  Localidade / Ministério
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={formData.homeSecaoTestemunhosCorCardLocal || '#7e22ce'}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        homeSecaoTestemunhosCorCardLocal: e.target.value
                                      })
                                    }
                                    className="h-8 w-9 rounded border border-gray-300 cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={formData.homeSecaoTestemunhosCorCardLocal || '#7e22ce'}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        homeSecaoTestemunhosCorCardLocal: e.target.value
                                      })
                                    }
                                    className="flex-1 px-1.5 py-1 text-[11px] border border-gray-300 rounded bg-white"
                                  />
                                </div>
                              </div>

                              {/* Aspas Decorativas */}
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                                  Aspas Decorativas
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={formData.homeSecaoTestemunhosCorAspas || '#facc15'}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        homeSecaoTestemunhosCorAspas: e.target.value
                                      })
                                    }
                                    className="h-8 w-9 rounded border border-gray-300 cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={formData.homeSecaoTestemunhosCorAspas || '#facc15'}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        homeSecaoTestemunhosCorAspas: e.target.value
                                      })
                                    }
                                    className="flex-1 px-1.5 py-1 text-[11px] border border-gray-300 rounded bg-white"
                                  />
                                </div>
                              </div>

                              {/* Cor do Botão */}
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                                  Botão &ldquo;Partilhar&rdquo;
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={formData.homeSecaoTestemunhosCorBotao || '#7e22ce'}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        homeSecaoTestemunhosCorBotao: e.target.value
                                      })
                                    }
                                    className="h-8 w-9 rounded border border-gray-300 cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={formData.homeSecaoTestemunhosCorBotao || '#7e22ce'}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        homeSecaoTestemunhosCorBotao: e.target.value
                                      })
                                    }
                                    className="flex-1 px-1.5 py-1 text-[11px] border border-gray-300 rounded bg-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Rodapé */}
          {activeTab === 'rodape' && (
            <div className="space-y-8">
              <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
                <h3 className="text-lg font-medium text-purple-900 mb-1">Personalização do Rodapé (Footer)</h3>
                <p className="text-sm text-purple-700">
                  Ajuste as cores de fundo e tipografia do rodapé exibido em todas as páginas.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cor de Fundo do Rodapé</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.footerCorFundo}
                      onChange={(e) => setFormData({ ...formData, footerCorFundo: e.target.value })}
                      className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.footerCorFundo}
                      onChange={(e) => setFormData({ ...formData, footerCorFundo: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cor dos Títulos do Rodapé</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.footerCorTitulo}
                      onChange={(e) => setFormData({ ...formData, footerCorTitulo: e.target.value })}
                      className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.footerCorTitulo}
                      onChange={(e) => setFormData({ ...formData, footerCorTitulo: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cor dos Textos e Links</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.footerCorTexto}
                      onChange={(e) => setFormData({ ...formData, footerCorTexto: e.target.value })}
                      className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.footerCorTexto}
                      onChange={(e) => setFormData({ ...formData, footerCorTexto: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cor de Destaque (Ícones e Botão Newsletter)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.footerCorDestaque}
                      onChange={(e) => setFormData({ ...formData, footerCorDestaque: e.target.value })}
                      className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.footerCorDestaque}
                      onChange={(e) => setFormData({ ...formData, footerCorDestaque: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Cores Gerais */}
          {activeTab === 'cores' && (
            <div className="space-y-8">
              {/* Paletas de Temas Prontos (1-Click Presets) */}
              <div className="bg-purple-50/70 p-5 rounded-xl border border-purple-200">
                <h3 className="text-base font-bold text-purple-950 mb-1">
                  Paletas de Identidade Visual Prontas (1 Clique)
                </h3>
                <p className="text-xs text-purple-800 mb-4">
                  Aplique instantaneamente uma combinação harmoniosa de cores para todo o site, menus, botões e banners (pode ajustar qualquer cor individualmente depois).
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    {
                      nome: 'Roxo Real & Rosa MIR (Padrão)',
                      colors: ['#9333ea', '#ec4899', '#111827'],
                      patch: {
                        corPrimaria: '#9333ea',
                        corSecundaria: '#ec4899',
                        corBotaoPrimaria: '#9333ea',
                        corBotaoSecundaria: '#ec4899',
                        corLink: '#9333ea',
                        corLinkHover: '#7c3aed',
                        navbarCorTextoHover: '#9333ea',
                        navbarCorTextoAtivo: '#9333ea',
                        heroHomeGradienteInicio: '#9333ea',
                        heroHomeGradienteFim: '#ec4899',
                        heroPaginasGradienteInicio: '#9333ea',
                        heroPaginasGradienteFim: '#ec4899',
                        footerCorFundo: '#111827',
                        footerCorDestaque: '#a855f7',
                      },
                    },
                    {
                      nome: 'Azul Celestial & Dourado',
                      colors: ['#1e40af', '#d97706', '#0f172a'],
                      patch: {
                        corPrimaria: '#1e40af',
                        corSecundaria: '#d97706',
                        corBotaoPrimaria: '#1e40af',
                        corBotaoSecundaria: '#d97706',
                        corLink: '#1d4ed8',
                        corLinkHover: '#1e3a8a',
                        navbarCorTextoHover: '#1e40af',
                        navbarCorTextoAtivo: '#1e40af',
                        heroHomeGradienteInicio: '#1e3a8a',
                        heroHomeGradienteFim: '#2563eb',
                        heroPaginasGradienteInicio: '#1e3a8a',
                        heroPaginasGradienteFim: '#2563eb',
                        footerCorFundo: '#0f172a',
                        footerCorDestaque: '#f59e0b',
                      },
                    },
                    {
                      nome: 'Solene Editorial & Ouro',
                      colors: ['#78350f', '#b45309', '#1c1917'],
                      patch: {
                        corPrimaria: '#92400e',
                        corSecundaria: '#d97706',
                        corBotaoPrimaria: '#92400e',
                        corBotaoSecundaria: '#b45309',
                        corLink: '#92400e',
                        corLinkHover: '#78350f',
                        navbarCorTextoHover: '#b45309',
                        navbarCorTextoAtivo: '#92400e',
                        heroHomeGradienteInicio: '#451a03',
                        heroHomeGradienteFim: '#b45309',
                        heroPaginasGradienteInicio: '#451a03',
                        heroPaginasGradienteFim: '#b45309',
                        footerCorFundo: '#1c1917',
                        footerCorDestaque: '#f59e0b',
                      },
                    },
                    {
                      nome: 'Esmeralda Vida & Paz',
                      colors: ['#065f46', '#0d9488', '#064e3b'],
                      patch: {
                        corPrimaria: '#047857',
                        corSecundaria: '#0d9488',
                        corBotaoPrimaria: '#047857',
                        corBotaoSecundaria: '#0d9488',
                        corLink: '#047857',
                        corLinkHover: '#065f46',
                        navbarCorTextoHover: '#047857',
                        navbarCorTextoAtivo: '#047857',
                        heroHomeGradienteInicio: '#064e3b',
                        heroHomeGradienteFim: '#0d9488',
                        heroPaginasGradienteInicio: '#064e3b',
                        heroPaginasGradienteFim: '#0d9488',
                        footerCorFundo: '#022c22',
                        footerCorDestaque: '#34d399',
                      },
                    },
                  ].map((preset) => (
                    <button
                      key={preset.nome}
                      type="button"
                      onClick={() => setFormData({ ...formData, ...preset.patch })}
                      className="flex flex-col justify-between p-3.5 bg-white hover:bg-purple-50 rounded-xl border border-gray-200 hover:border-purple-400 shadow-sm transition text-left"
                    >
                      <span className="text-xs font-bold text-gray-800 mb-2">{preset.nome}</span>
                      <div className="flex items-center gap-1.5">
                        {preset.colors.map((c, idx) => (
                          <span
                            key={idx}
                            className="w-6 h-6 rounded-full border border-white shadow"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cores Principais */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Cores Principais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor Primária
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.corPrimaria}
                        onChange={(e) => setFormData({ ...formData, corPrimaria: e.target.value })}
                        className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.corPrimaria}
                        onChange={(e) => setFormData({ ...formData, corPrimaria: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div 
                      className="mt-2 h-12 rounded-lg"
                      style={{ backgroundColor: formData.corPrimaria }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor Secundária
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.corSecundaria}
                        onChange={(e) => setFormData({ ...formData, corSecundaria: e.target.value })}
                        className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.corSecundaria}
                        onChange={(e) => setFormData({ ...formData, corSecundaria: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div 
                      className="mt-2 h-12 rounded-lg"
                      style={{ backgroundColor: formData.corSecundaria }}
                    />
                  </div>
                </div>
              </div>

              {/* Cores de Texto e Fundo */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Texto e Fundo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor do Texto
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.corTexto}
                        onChange={(e) => setFormData({ ...formData, corTexto: e.target.value })}
                        className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.corTexto}
                        onChange={(e) => setFormData({ ...formData, corTexto: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div 
                      className="mt-2 h-12 rounded-lg border"
                      style={{ backgroundColor: formData.corTexto }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor de Fundo (Landing Page)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.corFundo}
                        onChange={(e) => setFormData({ ...formData, corFundo: e.target.value })}
                        className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.corFundo}
                        onChange={(e) => setFormData({ ...formData, corFundo: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div 
                      className="mt-2 h-12 rounded-lg border"
                      style={{ backgroundColor: formData.corFundo }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor de Fundo Padrão (Páginas)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.corFundoPaginas}
                        onChange={(e) => setFormData({ ...formData, corFundoPaginas: e.target.value })}
                        className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.corFundoPaginas}
                        onChange={(e) => setFormData({ ...formData, corFundoPaginas: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div 
                      className="mt-2 h-12 rounded-lg border"
                      style={{ backgroundColor: formData.corFundoPaginas }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Cor padrão para páginas (pode ser sobrescrita individualmente)
                    </p>
                  </div>
                </div>
              </div>

              {/* Cores de Links */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor do Link
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.corLink}
                        onChange={(e) => setFormData({ ...formData, corLink: e.target.value })}
                        className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.corLink}
                        onChange={(e) => setFormData({ ...formData, corLink: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div 
                      className="mt-2 h-12 rounded-lg"
                      style={{ backgroundColor: formData.corLink }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor do Link (Hover)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.corLinkHover}
                        onChange={(e) => setFormData({ ...formData, corLinkHover: e.target.value })}
                        className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.corLinkHover}
                        onChange={(e) => setFormData({ ...formData, corLinkHover: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div 
                      className="mt-2 h-12 rounded-lg"
                      style={{ backgroundColor: formData.corLinkHover }}
                    />
                  </div>
                </div>
              </div>

              {/* Cores de Botões */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Botões</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Botão Primário
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.corBotaoPrimaria}
                        onChange={(e) => setFormData({ ...formData, corBotaoPrimaria: e.target.value })}
                        className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.corBotaoPrimaria}
                        onChange={(e) => setFormData({ ...formData, corBotaoPrimaria: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div 
                      className="mt-2 h-12 rounded-lg flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: formData.corBotaoPrimaria }}
                    >
                      Botão Primário
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Botão Secundário
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.corBotaoSecundaria}
                        onChange={(e) => setFormData({ ...formData, corBotaoSecundaria: e.target.value })}
                        className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.corBotaoSecundaria}
                        onChange={(e) => setFormData({ ...formData, corBotaoSecundaria: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div 
                      className="mt-2 h-12 rounded-lg flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: formData.corBotaoSecundaria }}
                    >
                      Botão Secundário
                    </div>
                  </div>
                </div>
              </div>

              {/* Cores de Estado */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Estados e Alertas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor de Sucesso
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.corSucesso}
                        onChange={(e) => setFormData({ ...formData, corSucesso: e.target.value })}
                        className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.corSucesso}
                        onChange={(e) => setFormData({ ...formData, corSucesso: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div 
                      className="mt-2 h-12 rounded-lg flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: formData.corSucesso }}
                    >
                      ✓ Sucesso
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor de Erro
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.corErro}
                        onChange={(e) => setFormData({ ...formData, corErro: e.target.value })}
                        className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.corErro}
                        onChange={(e) => setFormData({ ...formData, corErro: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div 
                      className="mt-2 h-12 rounded-lg flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: formData.corErro }}
                    >
                      ✕ Erro
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor de Aviso
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.corAviso}
                        onChange={(e) => setFormData({ ...formData, corAviso: e.target.value })}
                        className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.corAviso}
                        onChange={(e) => setFormData({ ...formData, corAviso: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div 
                      className="mt-2 h-12 rounded-lg flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: formData.corAviso }}
                    >
                      ⚠ Aviso
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor de Informação
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.corInfo}
                        onChange={(e) => setFormData({ ...formData, corInfo: e.target.value })}
                        className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.corInfo}
                        onChange={(e) => setFormData({ ...formData, corInfo: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div 
                      className="mt-2 h-12 rounded-lg flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: formData.corInfo }}
                    >
                      ℹ Informação
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Hero Landing Page */}
          {activeTab === 'heroHome' && (
            <HeroConfigSection 
              formData={formData}
              setFormData={setFormData}
              prefix="heroHome"
              title="Hero da Landing Page (Home)"
              description="Configure o hero que aparece na página inicial com o carousel"
            />
          )}

          {/* Tab: Hero Páginas Internas */}
          {activeTab === 'heroPaginas' && (
            <HeroConfigSection 
              formData={formData}
              setFormData={setFormData}
              prefix="heroPaginas"
              title="Hero das Páginas Internas"
              description="Configure o hero que aparece nas páginas internas (Sobre, Ministérios, etc)"
            />
          )}

          {/* Tab: Navbar/Menu */}
          {activeTab === 'navbar' && (
            <div className="space-y-8">
              {/* Título e Descrição */}
              <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
                <h3 className="text-lg font-medium text-purple-900 mb-1">Configurações da Navbar/Menu</h3>
                <p className="text-sm text-purple-700">Personalize a aparência e comportamento da barra de navegação</p>
              </div>

              {/* Cores da Navbar */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Cores da Navbar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor de Fundo
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.navbarCorFundo}
                        onChange={(e) => setFormData({ ...formData, navbarCorFundo: e.target.value })}
                        className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.navbarCorFundo}
                        onChange={(e) => setFormData({ ...formData, navbarCorFundo: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div 
                      className="mt-2 h-12 rounded-lg border"
                      style={{ backgroundColor: formData.navbarCorFundo }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor do Texto
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.navbarCorTexto}
                        onChange={(e) => setFormData({ ...formData, navbarCorTexto: e.target.value })}
                        className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.navbarCorTexto}
                        onChange={(e) => setFormData({ ...formData, navbarCorTexto: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div 
                      className="mt-2 h-12 rounded-lg border"
                      style={{ backgroundColor: formData.navbarCorTexto }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor do Texto (Hover)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.navbarCorTextoHover}
                        onChange={(e) => setFormData({ ...formData, navbarCorTextoHover: e.target.value })}
                        className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.navbarCorTextoHover}
                        onChange={(e) => setFormData({ ...formData, navbarCorTextoHover: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div 
                      className="mt-2 h-12 rounded-lg"
                      style={{ backgroundColor: formData.navbarCorTextoHover }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor do Texto (Ativo)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.navbarCorTextoAtivo}
                        onChange={(e) => setFormData({ ...formData, navbarCorTextoAtivo: e.target.value })}
                        className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.navbarCorTextoAtivo}
                        onChange={(e) => setFormData({ ...formData, navbarCorTextoAtivo: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div 
                      className="mt-2 h-12 rounded-lg"
                      style={{ backgroundColor: formData.navbarCorTextoAtivo }}
                    />
                  </div>
                </div>
              </div>

              {/* Comportamento da Navbar */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Comportamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Posição
                    </label>
                    <select
                      value={formData.navbarPosicao}
                      onChange={(e) => setFormData({ ...formData, navbarPosicao: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="fixed">Fixa (sempre visível)</option>
                      <option value="sticky">Sticky (fixa ao rolar)</option>
                      <option value="static">Estática (rola com a página)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Altura
                    </label>
                    <select
                      value={formData.navbarAltura}
                      onChange={(e) => setFormData({ ...formData, navbarAltura: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="compact">Compacta</option>
                      <option value="normal">Normal</option>
                      <option value="large">Grande</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="navbarTransparente"
                      checked={formData.navbarTransparente}
                      onChange={(e) => setFormData({ ...formData, navbarTransparente: e.target.checked })}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="navbarTransparente" className="text-sm font-medium text-gray-700">
                      Navbar Transparente (no topo)
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="navbarTransparenciaScroll"
                      checked={formData.navbarTransparenciaScroll}
                      onChange={(e) => setFormData({ ...formData, navbarTransparenciaScroll: e.target.checked })}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="navbarTransparenciaScroll" className="text-sm font-medium text-gray-700">
                      Opaca ao Rolar (scroll)
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="navbarSombra"
                      checked={formData.navbarSombra}
                      onChange={(e) => setFormData({ ...formData, navbarSombra: e.target.checked })}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="navbarSombra" className="text-sm font-medium text-gray-700">
                      Mostrar Sombra
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="navbarBlur"
                      checked={formData.navbarBlur}
                      onChange={(e) => setFormData({ ...formData, navbarBlur: e.target.checked })}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="navbarBlur" className="text-sm font-medium text-gray-700">
                      Efeito Blur no Fundo
                    </label>
                  </div>
                </div>
              </div>

              {/* Borda da Navbar */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Borda</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="navbarBorda"
                      checked={formData.navbarBorda}
                      onChange={(e) => setFormData({ ...formData, navbarBorda: e.target.checked })}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="navbarBorda" className="text-sm font-medium text-gray-700">
                      Mostrar Borda Inferior
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor da Borda
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.navbarCorBorda}
                        onChange={(e) => setFormData({ ...formData, navbarCorBorda: e.target.value })}
                        className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.navbarCorBorda}
                        onChange={(e) => setFormData({ ...formData, navbarCorBorda: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div 
                      className="mt-2 h-12 rounded-lg border"
                      style={{ backgroundColor: formData.navbarCorBorda }}
                    />
                  </div>
                </div>
              </div>

              {/* Dropdown Menu (Submenus) */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-gray-900">Menu Dropdown (Submenus de Navegação)</h3>
                      <span className="px-2.5 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
                        Personalização Global
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Controle a aparência de todas as caixas suspensas do site (ex: <em>Sobre</em>, <em>Ensino</em>, <em>Plataforma de ensino</em>).
                    </p>
                  </div>
                </div>

                {/* Banner de Boas Práticas / Alerta UI */}
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-start gap-3">
                  <span className="p-2 bg-purple-100 text-purple-700 rounded-lg text-lg flex-shrink-0">💡</span>
                  <div className="text-sm text-purple-900 space-y-1">
                    <p className="font-semibold">
                      Garantia de Legibilidade e Contraste Sólido
                    </p>
                    <p className="text-xs text-purple-700 leading-relaxed">
                      Utilize sempre uma cor de fundo <strong>100% sólida/opaca</strong> (ex: Branco ou Escuro) e com alto contraste em relação ao texto. Fundos transparentes dificultam a leitura quando o menu abre sobre fotos, carrosséis ou textos da página.
                    </p>
                  </div>
                </div>

                {/* Paletas / Presets Rápidos */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Estilos Rápidos Prontos (Clique para aplicar)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => applyDropdownPreset('mir_light')}
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white hover:border-purple-500 hover:shadow-md transition-all text-left group"
                    >
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-purple-700 flex items-center gap-1.5">
                          <span>🌟</span> MIR Padrão Claro
                        </p>
                        <p className="text-xs text-gray-500">Fundo Branco • Texto Grafite • Hover Roxo</p>
                      </div>
                      <div className="flex gap-1">
                        <span className="w-4 h-4 rounded-full border border-gray-300 bg-white" title="#ffffff" />
                        <span className="w-4 h-4 rounded-full bg-purple-600" title="#9333ea" />
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => applyDropdownPreset('mir_dark')}
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-700 bg-zinc-900 hover:border-amber-400 hover:shadow-md transition-all text-left group"
                    >
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-amber-400 flex items-center gap-1.5">
                          <span>🌙</span> Modo Noturno
                        </p>
                        <p className="text-xs text-zinc-400">Fundo Grafite • Texto Claro • Hover Dourado</p>
                      </div>
                      <div className="flex gap-1">
                        <span className="w-4 h-4 rounded-full bg-zinc-900 border border-zinc-700" title="#18181b" />
                        <span className="w-4 h-4 rounded-full bg-amber-500" title="#eab308" />
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => applyDropdownPreset('mir_purple')}
                      className="flex items-center justify-between p-3 rounded-xl border border-purple-300 bg-purple-900 hover:border-yellow-400 hover:shadow-md transition-all text-left group"
                    >
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-yellow-300 flex items-center gap-1.5">
                          <span>👑</span> Roxo & Ouro Real
                        </p>
                        <p className="text-xs text-purple-200">Fundo Roxo MIR • Hover Dourado</p>
                      </div>
                      <div className="flex gap-1">
                        <span className="w-4 h-4 rounded-full bg-purple-900 border border-purple-700" title="#4c1d95" />
                        <span className="w-4 h-4 rounded-full bg-yellow-400" title="#fde047" />
                      </div>
                    </button>
                  </div>
                </div>

                {/* Campos de Configuração de Cores */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor de Fundo da Caixa Suspensa
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={isValidCssColor(formData.dropdownCorFundo) ? formData.dropdownCorFundo : '#ffffff'}
                        onChange={(e) => setFormData({ ...formData, dropdownCorFundo: e.target.value })}
                        className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.dropdownCorFundo}
                        onChange={(e) => setFormData({ ...formData, dropdownCorFundo: e.target.value })}
                        placeholder="#ffffff"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                      />
                    </div>
                    <div 
                      className="mt-2 h-8 rounded-lg border flex items-center px-3 text-xs font-medium"
                      style={{ 
                        backgroundColor: formData.dropdownCorFundo || '#ffffff',
                        color: formData.dropdownCorTexto || '#1f2937'
                      }}
                    >
                      Amostra de Fundo
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor do Texto dos Itens
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={isValidCssColor(formData.dropdownCorTexto) ? formData.dropdownCorTexto : '#1f2937'}
                        onChange={(e) => setFormData({ ...formData, dropdownCorTexto: e.target.value })}
                        className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.dropdownCorTexto}
                        onChange={(e) => setFormData({ ...formData, dropdownCorTexto: e.target.value })}
                        placeholder="#1f2937"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                      />
                    </div>
                    <div 
                      className="mt-2 h-8 rounded-lg border flex items-center px-3 text-xs font-semibold"
                      style={{ 
                        backgroundColor: formData.dropdownCorFundo || '#ffffff',
                        color: formData.dropdownCorTexto || '#1f2937'
                      }}
                    >
                      Exemplo de Texto
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor do Texto ao Passar o Rato (Hover)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={isValidCssColor(formData.dropdownCorTextoHover) ? formData.dropdownCorTextoHover : '#9333ea'}
                        onChange={(e) => setFormData({ ...formData, dropdownCorTextoHover: e.target.value })}
                        className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.dropdownCorTextoHover}
                        onChange={(e) => setFormData({ ...formData, dropdownCorTextoHover: e.target.value })}
                        placeholder="#9333ea"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                      />
                    </div>
                    <div 
                      className="mt-2 h-8 rounded-lg border flex items-center px-3 text-xs font-bold"
                      style={{ 
                        backgroundColor: formData.dropdownCorFundoHover || '#f5f3ff',
                        color: formData.dropdownCorTextoHover || '#9333ea'
                      }}
                    >
                      Exemplo Texto Hover
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor de Fundo do Item ao Passar o Rato (Hover)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={isValidCssColor(formData.dropdownCorFundoHover) ? formData.dropdownCorFundoHover : '#f5f3ff'}
                        onChange={(e) => setFormData({ ...formData, dropdownCorFundoHover: e.target.value })}
                        className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.dropdownCorFundoHover}
                        onChange={(e) => setFormData({ ...formData, dropdownCorFundoHover: e.target.value })}
                        placeholder="#f5f3ff"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                      />
                    </div>
                    <div 
                      className="mt-2 h-8 rounded-lg border flex items-center px-3 text-xs font-medium"
                      style={{ backgroundColor: formData.dropdownCorFundoHover || '#f5f3ff' }}
                    >
                      Amostra Fundo Hover
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="dropdownSombra"
                      checked={formData.dropdownSombra}
                      onChange={(e) => setFormData({ ...formData, dropdownSombra: e.target.checked })}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="dropdownSombra" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Ativar Sombra Profunda (Elevação visual 3D sobre o fundo)
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="dropdownBorda"
                      checked={formData.dropdownBorda}
                      onChange={(e) => setFormData({ ...formData, dropdownBorda: e.target.checked })}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="dropdownBorda" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Exibir Contorno / Borda Sutil
                    </label>
                  </div>

                  {formData.dropdownBorda && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cor do Contorno / Borda
                      </label>
                      <div className="flex items-center gap-3 max-w-md">
                        <input
                          type="color"
                          value={isValidCssColor(formData.dropdownCorBorda) ? formData.dropdownCorBorda : '#e5e7eb'}
                          onChange={(e) => setFormData({ ...formData, dropdownCorBorda: e.target.value })}
                          className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.dropdownCorBorda}
                          onChange={(e) => setFormData({ ...formData, dropdownCorBorda: e.target.value })}
                          placeholder="#e5e7eb"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tamanho da Letra nos Submenus
                    </label>
                    <select
                      value={formData.dropdownFonteTamanho}
                      onChange={(e) => setFormData({ ...formData, dropdownFonteTamanho: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="small">Pequeno (12px)</option>
                      <option value="normal">Normal (14px) — Recomendado</option>
                      <option value="large">Grande (16px)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arredondamento da Caixa de Submenus
                    </label>
                    <select
                      value={formData.dropdownArredondamento}
                      onChange={(e) => setFormData({ ...formData, dropdownArredondamento: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="small">Suave (8px)</option>
                      <option value="medium">Médio (12px) — Recomendado</option>
                      <option value="large">Arredondado (16px)</option>
                      <option value="xlarge">Extra Arredondado (24px)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Largura Mínima da Caixa
                    </label>
                    <select
                      value={formData.dropdownLargura}
                      onChange={(e) => setFormData({ ...formData, dropdownLargura: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="compact">Compacta (200px)</option>
                      <option value="normal">Normal (240px) — Recomendado</option>
                      <option value="wide">Larga (290px)</option>
                    </select>
                  </div>
                </div>

                {/* Simulador Interativo em Tempo Real */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                        <span>👁️</span> Simulador Interativo em Tempo Real
                      </h4>
                      <p className="text-xs text-gray-500">
                        Passe o cursor sobre os itens para testar o efeito hover e teste a legibilidade em diferentes fundos:
                      </p>
                    </div>
                    <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setDropdownPreviewBg('light')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                          dropdownPreviewBg === 'light'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        ☀️ Fundo Claro (Página)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDropdownPreviewBg('hero')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                          dropdownPreviewBg === 'hero'
                            ? 'bg-purple-900 text-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        🌌 Banner / Foto Hero
                      </button>
                    </div>
                  </div>

                  <div
                    className="p-8 rounded-2xl border transition-all flex flex-col items-center justify-center relative min-h-[300px]"
                    style={{
                      background:
                        dropdownPreviewBg === 'light'
                          ? '#f9fafb'
                          : 'linear-gradient(135deg, #7e22ce 0%, #ec4899 100%)',
                      borderColor: dropdownPreviewBg === 'light' ? '#e5e7eb' : '#7e22ce'
                    }}
                  >
                    {/* Botão de Menu Simulado */}
                    <div className="mb-2">
                      <div
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-sm shadow-sm"
                        style={{
                          backgroundColor: dropdownPreviewBg === 'light' ? '#ffffff' : 'rgba(255,255,255,0.15)',
                          color: dropdownPreviewBg === 'light' ? '#1f2937' : '#ffffff',
                          backdropFilter: 'blur(8px)',
                          border: dropdownPreviewBg === 'light' ? '1px solid #e5e7eb' : '1px solid rgba(255,255,255,0.2)'
                        }}
                      >
                        <span>Ensino</span>
                        <span className="text-xs">⌵</span>
                      </div>
                    </div>

                    {/* Caixa Dropdown Simulada */}
                    <div
                      className={`p-1.5 transition-all duration-200 ${
                        formData.dropdownSombra ? 'shadow-2xl' : 'shadow-sm'
                      }`}
                      style={{
                        backgroundColor: formData.dropdownCorFundo || '#ffffff',
                        border: formData.dropdownBorda ? `1px solid ${formData.dropdownCorBorda || '#e5e7eb'}` : 'none',
                        borderRadius:
                          formData.dropdownArredondamento === 'small'
                            ? '8px'
                            : formData.dropdownArredondamento === 'large'
                            ? '16px'
                            : formData.dropdownArredondamento === 'xlarge'
                            ? '24px'
                            : '12px',
                        minWidth:
                          formData.dropdownLargura === 'compact'
                            ? '200px'
                            : formData.dropdownLargura === 'wide'
                            ? '290px'
                            : '240px'
                      }}
                    >
                      {[
                        { id: 1, title: 'Áudios' },
                        { id: 2, title: 'Vídeos' },
                        { id: 3, title: 'Escola Bíblica e Cursos' },
                        { id: 4, title: 'Devocional & Palavra Pastoral' }
                      ].map((item) => {
                        const isHovered = dropdownHoverSample === item.id;
                        return (
                          <div
                            key={item.id}
                            onMouseEnter={() => setDropdownHoverSample(item.id)}
                            onMouseLeave={() => setDropdownHoverSample(null)}
                            className="px-3.5 py-2.5 rounded-lg cursor-pointer transition-all duration-150 flex items-center justify-between"
                            style={{
                              color: isHovered
                                ? formData.dropdownCorTextoHover || '#9333ea'
                                : formData.dropdownCorTexto || '#1f2937',
                              backgroundColor: isHovered
                                ? formData.dropdownCorFundoHover || '#f5f3ff'
                                : 'transparent',
                              fontSize:
                                formData.dropdownFonteTamanho === 'small'
                                  ? '12px'
                                  : formData.dropdownFonteTamanho === 'large'
                                  ? '16px'
                                  : '14px',
                              fontWeight: isHovered ? 600 : 500
                            }}
                          >
                            <span>{item.title}</span>
                            {item.id === 3 && (
                              <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-full bg-purple-600 text-white">
                                Novo
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tipografia e Estilo dos Itens do Menu */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Tipografia, Letras e Estilo dos Menus</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tamanho da Letra no Menu Principal
                    </label>
                    <select
                      value={formData.navbarFonteTamanho}
                      onChange={(e) => setFormData({ ...formData, navbarFonteTamanho: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="small">Pequeno (12px)</option>
                      <option value="normal">Normal (14px)</option>
                      <option value="large">Grande (16px)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Espessura (Peso) da Letra
                    </label>
                    <select
                      value={formData.navbarFontePeso}
                      onChange={(e) => setFormData({ ...formData, navbarFontePeso: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="normal">Normal (400)</option>
                      <option value="medium">Médio (500)</option>
                      <option value="semibold">Semi-Negrito (600)</option>
                      <option value="bold">Negrito (700)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Espaçamento entre os Itens do Menu
                    </label>
                    <select
                      value={formData.navbarEspacamentoItens}
                      onChange={(e) => setFormData({ ...formData, navbarEspacamentoItens: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="compact">Compacto</option>
                      <option value="normal">Normal</option>
                      <option value="wide">Amplo / Espaçado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Indicador de Página Ativa
                    </label>
                    <select
                      value={formData.navbarEstiloAtivo}
                      onChange={(e) => setFormData({ ...formData, navbarEstiloAtivo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="underline">Linha Sublinhada (Underline)</option>
                      <option value="pill">Fundo Arredondado (Pílula)</option>
                      <option value="color">Apenas Mudança de Cor</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 md:col-span-2">
                    <input
                      type="checkbox"
                      id="navbarMaiusculas"
                      checked={formData.navbarMaiusculas}
                      onChange={(e) => setFormData({ ...formData, navbarMaiusculas: e.target.checked })}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="navbarMaiusculas" className="text-sm font-medium text-gray-700">
                      Exibir todos os itens do menu em LETRAS MAIÚSCULAS (CAIXA ALTA)
                    </label>
                  </div>
                </div>
              </div>

              {/* Botão de Destaque (CTA) na Navbar */}
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Botão de Destaque (CTA) à Direita do Menu</h3>
                    <p className="text-xs text-gray-500">Botão opcional de ação rápida (ex: &ldquo;Contribuir&rdquo;, &ldquo;Sou Novo&rdquo;, &ldquo;Ao Vivo&rdquo;)</p>
                  </div>
                  <label className="inline-flex items-center gap-2 cursor-pointer bg-purple-50 px-4 py-2 rounded-lg border border-purple-200">
                    <input
                      type="checkbox"
                      checked={formData.navbarBotaoDestaqueAtivo}
                      onChange={(e) => setFormData({ ...formData, navbarBotaoDestaqueAtivo: e.target.checked })}
                      className="w-5 h-5 text-purple-600 rounded"
                    />
                    <span className="text-sm font-semibold text-purple-900">Exibir Botão CTA</span>
                  </label>
                </div>

                {formData.navbarBotaoDestaqueAtivo && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Texto do Botão</label>
                      <input
                        type="text"
                        value={formData.navbarBotaoDestaqueTexto}
                        onChange={(e) => setFormData({ ...formData, navbarBotaoDestaqueTexto: e.target.value })}
                        placeholder="Ex: Contribuir"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Link / Destino (URL)</label>
                      <input
                        type="text"
                        value={formData.navbarBotaoDestaqueUrl}
                        onChange={(e) => setFormData({ ...formData, navbarBotaoDestaqueUrl: e.target.value })}
                        placeholder="Ex: /donate ou /sou-novo"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cor de Fundo do Botão</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={formData.navbarBotaoDestaqueCor}
                          onChange={(e) => setFormData({ ...formData, navbarBotaoDestaqueCor: e.target.value })}
                          className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.navbarBotaoDestaqueCor}
                          onChange={(e) => setFormData({ ...formData, navbarBotaoDestaqueCor: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cor da Letra do Botão</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={formData.navbarBotaoDestaqueCorTexto}
                          onChange={(e) => setFormData({ ...formData, navbarBotaoDestaqueCorTexto: e.target.value })}
                          className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.navbarBotaoDestaqueCorTexto}
                          onChange={(e) => setFormData({ ...formData, navbarBotaoDestaqueCorTexto: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-6 border-t">
            <Button
              type="submit"
              variant="primary"
              icon={<FaSave />}
              loading={saving}
            >
              Salvar Tema
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
