'use client';

import { useState, useEffect } from 'react';
import { FaClock, FaChurch, FaBible, FaPray, FaUsers, FaHeart, FaMusic, FaChild } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import useSiteStore from '@/store/useSiteStore';

const iconMap = {
  FaClock,
  FaChurch,
  FaBible,
  FaPray,
  FaUsers,
  FaHeart,
  FaMusic,
  FaChild
};

export default function ServicosPage() {
  const [servicos, setServicos] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useSiteStore(state => state.theme);
  const loadTheme = useSiteStore(state => state.loadTheme);

  useEffect(() => {
    if (!theme || !theme.corPrimaria) {
      loadTheme();
    }
    loadServicos();
  }, []);

  const loadServicos = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/servicos`);
      if (response.ok) {
        const data = await response.json();
        setServicos(data);
      }
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || FaChurch;
    return <IconComponent className="text-5xl" />;
  };

  // Configurações do hero do tema (Páginas Internas)
  const heroConfig = {
    gradienteInicio: theme?.heroPaginasGradienteInicio || '#9333ea',
    gradienteFim: theme?.heroPaginasGradienteFim || '#ec4899',
    gradienteDirecao: theme?.heroPaginasGradienteDirecao || 'to right',
    textoTitulo: theme?.heroPaginasTextoTitulo || '#ffffff',
    textoSubtitulo: theme?.heroPaginasTextoSubtitulo || '#f3f4f6',
    curvaEstilo: theme?.heroPaginasCurvaEstilo || 'wave',
    curvaCor: theme?.heroPaginasCurvaCor || '#ffffff',
    altura: theme?.heroPaginasAltura || 'medium',
    overlay: theme?.heroPaginasOverlay || 'gradient'
  };

  const alturaMap = {
    small: 'py-12',
    medium: 'py-20',
    large: 'py-28',
    xlarge: 'py-36'
  };

  const curvasPaths = {
    wave: 'M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
    curve: 'M0,160L1440,96L1440,320L0,320Z',
    triangle: 'M0,320L720,96L1440,320Z',
    tilt: 'M0,224L1440,96L1440,320L0,320Z',
    none: ''
  };

  const getOverlayStyle = () => {
    switch (heroConfig.overlay) {
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageHero
        title={servicos?.titulo || 'Nossos Serviços'}
        subtitle="Conheça os horários e atividades da nossa igreja"
      />

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {servicos?.servicos && servicos.servicos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicos.servicos.map((servico, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                {/* Icon Header */}
                <div 
                  className="p-8 text-white flex items-center justify-center"
                  style={{
                    background: servico.cor || theme?.corPrimaria || '#9333ea'
                  }}
                >
                  <div className="transform group-hover:scale-110 transition-transform duration-300">
                    {getIcon(servico.icone)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {servico.titulo}
                  </h3>
                  
                  {servico.horario && (
                    <div className="flex items-center gap-2 mb-4 text-gray-600">
                      <FaClock className="text-purple-600" />
                      <span className="font-medium">{servico.horario}</span>
                    </div>
                  )}
                  
                  <p className="text-gray-600 leading-relaxed">
                    {servico.descricao}
                  </p>
                </div>

                {/* Bottom Accent */}
                <div 
                  className="h-1"
                  style={{
                    background: servico.cor || theme?.corPrimaria || '#9333ea'
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FaChurch className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Nenhum serviço cadastrado
            </h3>
            <p className="text-gray-600">
              Os serviços da igreja serão exibidos aqui em breve.
            </p>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div 
        className="py-16"
        style={{
          background: `linear-gradient(135deg, ${theme?.corPrimaria || '#9333ea'}, ${theme?.corSecundaria || '#ec4899'})`
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Venha nos Visitar!
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Você é sempre bem-vindo em nossa igreja. Estamos ansiosos para recebê-lo!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/contato"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              <FaChurch />
              Entre em Contato
            </a>
            <a
              href="/eventos"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors inline-flex items-center gap-2"
            >
              <FaUsers />
              Ver Eventos
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
