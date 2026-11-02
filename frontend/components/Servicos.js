"use client";
import { useEffect, useState } from 'react';
import api from '../lib/api';
import useSiteStore from '../store/useSiteStore';
import { FaChurch, FaPray, FaBible, FaUsers, FaHeart, FaMusic, FaChild, FaClock } from 'react-icons/fa';

const iconMap = {
  FaChurch,
  FaPray,
  FaBible,
  FaUsers,
  FaHeart,
  FaMusic,
  FaChild,
  FaClock
};

export default function Servicos() {
  const [dados, setDados] = useState(null);
  const theme = useSiteStore((state) => state.theme);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get('/servicos');
        setDados(res.data);
      } catch(e) {
        setDados(null);
      }
    }
    fetchData();
  }, []);

  if (!dados) return null;

  // Filtrar apenas serviços que devem aparecer na landing
  const servicosLanding = dados.servicos.filter(s => s.exibirNaLanding !== false);

  if (servicosLanding.length === 0) return null;

  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || FaChurch;
    return <IconComponent className="text-5xl" />;
  };

  return (
    <section
      id="horarios"
      className="py-20 transition-colors"
      style={{ backgroundColor: theme?.homeSecaoServicosCorFundo || '#ffffff' }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {dados.titulo || 'Horários de Cultos'}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {theme?.homeSecaoServicosSubtitulo || 'Venha nos visitar! Temos cultos e atividades durante toda a semana'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {servicosLanding.map((servico, i) => (
            <div 
              key={i} 
              className="relative rounded-2xl shadow-xl p-8 flex flex-col items-center text-center overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              style={{backgroundColor: servico.cor || '#FEF6E7'}}
            >
              {/* Efeito de fundo */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Ícone */}
              <div className="relative z-10 mb-6 text-white transform group-hover:scale-110 transition-transform duration-300">
                {getIcon(servico.icone)}
              </div>
              
              {/* Conteúdo */}
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {servico.titulo}
                </h3>
                <p className="text-lg text-gray-700 mb-3">
                  {servico.descricao}
                </p>
                <div className="inline-flex items-center bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full">
                  <FaClock className="mr-2 text-gray-900" />
                  <span className="font-semibold text-gray-900">
                    {servico.horario}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-12 text-white shadow-2xl">
          <h3 className="text-3xl font-bold mb-4">
            Primeira Vez?
          </h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Ficaremos felizes em recebê-lo! Venha como está e sinta-se em casa.
          </p>
          <a 
            href="/contato" 
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Planejar Minha Visita
          </a>
        </div>
      </div>
    </section>
  );
}
