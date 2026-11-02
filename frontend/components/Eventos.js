"use client";
import useSiteStore from '../store/useSiteStore';
import { useEffect } from 'react';
import Link from 'next/link';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

export default function Eventos() {
  const eventos = useSiteStore(state => state.eventos);
  const loadEventos = useSiteStore(state => state.loadEventos);
  const theme = useSiteStore(state => state.theme);
  
  useEffect(() => {
    if (!eventos.length) {
      loadEventos();
    }
  }, []);
  
  if (!eventos.length) return null;

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <section
      id="eventos"
      className="py-20 transition-colors"
      style={{ backgroundColor: theme?.homeSecaoEventosCorFundo || '#f9fafb' }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {theme?.homeSecaoEventosTitulo || 'Próximos Eventos'}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {theme?.homeSecaoEventosSubtitulo || 'Participe dos nossos eventos e faça parte de momentos especiais de comunhão e crescimento espiritual'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventos.map((evento, i) => (
            <div 
              key={i} 
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {evento.imagem && (
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={evento.imagem} 
                    alt={evento.titulo} 
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-full shadow-lg">
                    {new Date(evento.dataInicio).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {evento.titulo}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <FaCalendarAlt className="mr-3 text-purple-600" />
                    <span className="text-sm">{formatarData(evento.dataInicio)}</span>
                  </div>
                  
                  {evento.local && (
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-3 text-purple-600" />
                      <span className="text-sm line-clamp-1">{evento.local}</span>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {evento.descricao}
                </p>
                
                <Link
                  href={evento.slug ? `/eventos/${evento.slug}` : '/eventos'}
                  className="block text-center w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  Saiba Mais
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a 
            href="/eventos" 
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Ver Todos os Eventos
          </a>
        </div>
      </div>
    </section>
  );
}
