"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaYoutube, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import useSiteStore from '../store/useSiteStore';
import { newsletters } from '../lib/api';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const contactInfo = useSiteStore(state => state.contactInfo);
  const loadContactInfo = useSiteStore(state => state.loadContactInfo);
  const theme = useSiteStore(state => state.theme);
  const loadTheme = useSiteStore(state => state.loadTheme);

  const [emailNewsletter, setEmailNewsletter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ text: '', isError: false });

  useEffect(() => {
    loadContactInfo();
    loadTheme();
  }, [loadContactInfo, loadTheme]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!emailNewsletter.trim()) return;
    try {
      setSubmitting(true);
      setFeedback({ text: '', isError: false });
      const res = await newsletters.subscribe(emailNewsletter);
      setFeedback({ text: res.data?.message || 'Inscrição realizada com sucesso!', isError: false });
      setEmailNewsletter('');
    } catch (err) {
      setFeedback({ text: err.message || 'Erro ao realizar inscrição.', isError: true });
    } finally {
      setSubmitting(false);
    }
  };

  const endereco = contactInfo?.endereco;
  const enderecoFormatado = endereco
    ? [endereco.rua, endereco.bairro, [endereco.cidade, endereco.estado].filter(Boolean).join(' - '), endereco.pais]
        .filter(Boolean)
    : ['Luanda, Angola'];

  const emailPrincipal = contactInfo?.emails?.[0]?.email || 'contato@igrejamir.com';
  const telefonePrincipal = contactInfo?.telefones?.[0]?.numero || '(+244) 900 000 000';
  const telHref = `tel:${telefonePrincipal.replace(/[^\d+]/g, '')}`;
  const whatsappNumero = (contactInfo?.redesSociais?.whatsapp || telefonePrincipal).replace(/\D/g, '');

  const footerBg = theme?.footerCorFundo || '#111827';
  const footerText = theme?.footerCorTexto || '#9ca3af';
  const footerTitle = theme?.footerCorTitulo || '#ffffff';
  const footerAccent = theme?.footerCorDestaque || '#facc15';
  const nomeIgreja = theme?.nomeIgreja || 'Igreja MIR';
  const logoUrl = theme?.logoUrl || '/logo.png';

  return (
    <footer style={{ backgroundColor: footerBg, color: footerTitle }}>
      {/* Seção Principal */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sobre a Igreja */}
          <div>
            <img src={logoUrl} alt={nomeIgreja} className="h-12 w-auto object-contain mb-4" />
            <h3 className="text-xl font-bold mb-4" style={{ color: footerTitle }}>{nomeIgreja}</h3>
            <p className="text-sm leading-relaxed" style={{ color: footerText }}>
              {contactInfo?.mensagemBemVindo || 'Uma comunidade de fé, amor e esperança. Venha nos visitar e fazer parte desta família!'}
            </p>
          </div>

          {/* Links Rápidos */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-4" style={{ color: footerTitle }}>Links Rápidos</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                { href: '/', label: 'Início' },
                { href: '/servicos', label: 'Cultos' },
                { href: '/sou-novo', label: 'Sou Novo' },
                { href: '/ministerios', label: 'Ministérios' },
                { href: '/ensino/cursos', label: 'Cursos & Fé' },
                { href: '/devocional', label: 'Devocional' },
                { href: '/galeria', label: 'Galeria' },
                { href: '/avisos', label: 'Avisos' },
                { href: '/escalas', label: 'Escalas' },
                { href: '/oracao', label: 'Oração' },
                { href: '/donate', label: 'Contribuir' },
                { href: '/eventos', label: 'Eventos' },
                { href: '/contato', label: 'Contato' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="transition-colors text-sm hover:underline"
                    style={{ color: footerText }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = footerAccent; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = footerText; }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ color: footerTitle }}>Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start text-sm" style={{ color: footerText }}>
                <FaMapMarkerAlt className="mr-3 mt-1 flex-shrink-0" style={{ color: footerAccent }} />
                <span>
                  {enderecoFormatado.map((linha, idx) => (
                    <span key={idx} className="block">{linha}</span>
                  ))}
                </span>
              </li>
              <li className="flex items-center text-sm" style={{ color: footerText }}>
                <FaEnvelope className="mr-3 flex-shrink-0" style={{ color: footerAccent }} />
                <a
                  href={`mailto:${emailPrincipal}`}
                  className="hover:underline transition-colors"
                  style={{ color: footerText }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = footerAccent; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = footerText; }}
                >
                  {emailPrincipal}
                </a>
              </li>
              <li className="flex items-center text-sm" style={{ color: footerText }}>
                <FaPhone className="mr-3 flex-shrink-0" style={{ color: footerAccent }} />
                <a
                  href={telHref}
                  className="hover:underline transition-colors"
                  style={{ color: footerText }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = footerAccent; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = footerText; }}
                >
                  {telefonePrincipal}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ color: footerTitle }}>Boletim Informativo</h3>
            <p className="text-sm mb-4" style={{ color: footerText }}>
              Receba novidades, mensagens e avisos da igreja
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input 
                type="email"
                required
                value={emailNewsletter}
                onChange={(e) => setEmailNewsletter(e.target.value)}
                placeholder="O seu melhor e-mail" 
                className="w-full px-4 py-2.5 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none text-sm transition-all"
                style={{
                  focusRingColor: footerAccent
                }}
              />
              <button 
                type="submit"
                disabled={submitting}
                className="w-full font-bold px-4 py-2.5 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md disabled:opacity-50 text-sm"
                style={{
                  backgroundColor: footerAccent,
                  color: '#111827'
                }}
              >
                {submitting ? 'Inscrevendo...' : 'Subscrever Boletim'}
              </button>
              {feedback.text && (
                <p className={`text-xs mt-1.5 font-medium ${feedback.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                  {feedback.text}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Redes Sociais */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm" style={{ color: footerText }}>
              © {currentYear} {nomeIgreja}. Todos os direitos reservados.
            </p>
            
            <div className="flex gap-4">
              <a 
                href={contactInfo?.redesSociais?.facebook || "https://facebook.com"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:opacity-90 text-white p-3 rounded-full transition-all duration-300"
                style={{ '--tw-bg-opacity': 0.1 }}
                aria-label="Facebook"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a 
                href={contactInfo?.redesSociais?.instagram || "https://instagram.com"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:opacity-90 text-white p-3 rounded-full transition-all duration-300"
                aria-label="Instagram"
              >
                <FaInstagram className="text-xl" />
              </a>
              {contactInfo?.redesSociais?.youtube && (
                <a 
                  href={contactInfo.redesSociais.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:opacity-90 text-white p-3 rounded-full transition-all duration-300"
                  aria-label="YouTube"
                >
                  <FaYoutube className="text-xl" />
                </a>
              )}
              <a 
                href={`https://wa.me/${whatsappNumero || '244900000000'}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:opacity-90 text-white p-3 rounded-full transition-all duration-300"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="text-xl" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
