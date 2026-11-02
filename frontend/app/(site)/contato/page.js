'use client';

import { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaYoutube, FaPaperPlane } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import dynamic from 'next/dynamic';
import Swal from 'sweetalert2';
import useSiteStore from '@/store/useSiteStore';

const MapDisplay = dynamic(() => import('@/components/MapDisplay'), { ssr: false });

export default function ContatoPage() {
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  });
  const theme = useSiteStore(state => state.theme);
  const loadTheme = useSiteStore(state => state.loadTheme);

  useEffect(() => {
    if (!theme || !theme.corPrimaria) {
      loadTheme();
    }
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/info`);
      if (response.ok) {
        const data = await response.json();
        setContactInfo(data);
      }
    } catch (error) {
      console.error('Erro ao carregar informações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Mensagem Enviada!',
          text: 'Obrigado pelo contato. Responderemos em breve!',
          confirmButtonColor: '#9333ea'
        });
        
        setFormData({
          nome: '',
          email: '',
          telefone: '',
          assunto: '',
          mensagem: ''
        });
      } else {
        throw new Error('Erro ao enviar mensagem');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível enviar sua mensagem. Tente novamente.',
        confirmButtonColor: '#9333ea'
      });
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
        title="Entre em Contato"
        subtitle={contactInfo?.mensagemBemVindo || 'Estamos à disposição para tirar suas dúvidas e orar por você.'}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            {/* Endereço */}
            {contactInfo?.endereco && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Endereço</h3>
                    <p className="text-gray-600">
                      {contactInfo.endereco.rua}<br />
                      {contactInfo.endereco.cidade} - {contactInfo.endereco.estado}<br />
                      CEP: {contactInfo.endereco.cep}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Telefones */}
            {contactInfo?.telefones && contactInfo.telefones.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaPhone className="text-purple-600 text-xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">Telefones</h3>
                    {contactInfo.telefones.map((tel, index) => (
                      <div key={index} className="mb-2">
                        <p className="text-sm text-gray-500 capitalize">{tel.tipo}</p>
                        <a href={`tel:${tel.numero}`} className="text-purple-600 hover:text-purple-700 font-medium">
                          {tel.numero}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Emails */}
            {contactInfo?.emails && contactInfo.emails.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="text-purple-600 text-xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">E-mails</h3>
                    {contactInfo.emails.map((email, index) => (
                      <div key={index} className="mb-2">
                        <p className="text-sm text-gray-500 capitalize">{email.tipo}</p>
                        <a href={`mailto:${email.email}`} className="text-purple-600 hover:text-purple-700 font-medium break-all">
                          {email.email}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Horários */}
            {contactInfo?.horariosFuncionamento && contactInfo.horariosFuncionamento.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaClock className="text-purple-600 text-xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">Horários</h3>
                    {contactInfo.horariosFuncionamento.map((horario, index) => (
                      <div key={index} className="mb-2">
                        <p className="font-medium text-gray-900">{horario.dia}</p>
                        <p className="text-gray-600">{horario.horario}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Redes Sociais */}
            {contactInfo?.redesSociais && Object.values(contactInfo.redesSociais).some(v => v) && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4">Redes Sociais</h3>
                <div className="flex gap-3">
                  {contactInfo.redesSociais.facebook && (
                    <a href={contactInfo.redesSociais.facebook} target="_blank" rel="noopener noreferrer" 
                       className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                      <FaFacebook className="text-xl" />
                    </a>
                  )}
                  {contactInfo.redesSociais.instagram && (
                    <a href={contactInfo.redesSociais.instagram} target="_blank" rel="noopener noreferrer"
                       className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity">
                      <FaInstagram className="text-xl" />
                    </a>
                  )}
                  {contactInfo.redesSociais.youtube && (
                    <a href={contactInfo.redesSociais.youtube} target="_blank" rel="noopener noreferrer"
                       className="w-12 h-12 bg-red-600 text-white rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors">
                      <FaYoutube className="text-xl" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Envie sua Mensagem</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      name="nome"
                      required
                      value={formData.nome}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Seu nome"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assunto *
                    </label>
                    <input
                      type="text"
                      name="assunto"
                      required
                      value={formData.assunto}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Assunto da mensagem"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    name="mensagem"
                    required
                    value={formData.mensagem}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Digite sua mensagem aqui..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Enviar Mensagem
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        {contactInfo?.localizacao && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">Nossa Localização</h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '500px' }}>
              <MapDisplay
                latitude={contactInfo.localizacao.latitude}
                longitude={contactInfo.localizacao.longitude}
                address={`${contactInfo.endereco.rua}, ${contactInfo.endereco.cidade}`}
                showDirections={true}
              />
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
