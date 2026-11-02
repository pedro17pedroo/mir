'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { ministerios as ministeriosApi } from '@/lib/api';
import {
  FaChurch,
  FaHome,
  FaClock,
  FaMapMarkerAlt,
  FaUserTie,
  FaHandsHelping,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes
} from 'react-icons/fa';

export default function MinisteriosPublicPage() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState('todos');
  const [selecionado, setSelecionado] = useState(null);
  const [form, setForm] = useState({ nome: '', telefone: '', email: '', mensagem: '' });
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    const carregar = async () => {
      try {
        const res = await ministeriosApi.getAll({ ativo: true });
        setLista(res.data || []);
      } catch (err) {
        console.error('Erro ao carregar ministérios:', err);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  const itensFiltrados = lista.filter((item) => {
    if (abaAtiva === 'todos') return true;
    return item.tipo === abaAtiva;
  });

  const handleInscrever = async (e) => {
    e.preventDefault();
    if (!selecionado) return;
    setEnviando(true);
    setSucesso('');
    setErro('');
    try {
      const res = await ministeriosApi.inscrever(selecionado._id, form);
      setSucesso(res.data?.message || 'Inscrição realizada com sucesso!');
      setForm({ nome: '', telefone: '', email: '', mensagem: '' });
    } catch (err) {
      setErro(err.response?.data?.message || err.message || 'Não foi possível enviar sua inscrição.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <Navbar />
      <PageHero
        badge="Comunhão, Serviço e Discipulado"
        badgeIcon={FaHandsHelping}
        titulo="Ministérios e Células"
        subtitulo="Descubra onde usar os seus dons para servir a Deus ou encontre uma célula perto da sua casa para crescer em comunhão durante a semana."
      />
      <main className="min-h-screen bg-gray-50 py-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              { id: 'todos', label: 'Todos', icon: FaHandsHelping },
              { id: 'ministerio', label: 'Ministérios e Departamentos', icon: FaChurch },
              { id: 'celula', label: 'Células / Grupos Caseiros', icon: FaHome }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setAbaAtiva(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    abaAtiva === tab.id
                      ? 'bg-purple-700 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-500">Carregando ministérios e células...</div>
          ) : itensFiltrados.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-xl mx-auto">
              <FaChurch className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Em breve novos grupos disponíveis
              </h3>
              <p className="text-gray-600">
                Entre em contato com a secretaria da igreja para saber mais sobre como se integrar nos departamentos.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {itensFiltrados.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {item.imagem ? (
                      <div className="relative h-44 w-full overflow-hidden">
                        <img
                          src={item.imagem}
                          alt={item.nome}
                          className="w-full h-full object-cover"
                        />
                        <div
                          className="absolute bottom-0 left-0 right-0 h-1.5"
                          style={{ backgroundColor: item.cor || '#7c3aed' }}
                        />
                      </div>
                    ) : (
                      <div
                        className="h-3 w-full"
                        style={{ backgroundColor: item.cor || '#7c3aed' }}
                      />
                    )}
                    <div className="p-6">
                      <span
                        className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 ${
                          item.tipo === 'celula'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {item.tipo === 'celula' ? 'Célula / Grupo Caseiro' : 'Ministério'}
                      </span>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{item.nome}</h2>
                      <p className="text-gray-600 text-sm leading-relaxed mb-5">
                        {item.descricao}
                      </p>

                      <div className="space-y-2.5 text-sm text-gray-700 bg-gray-50 rounded-xl p-4">
                        {item.lider && (
                          <div className="flex items-center gap-2.5">
                            <FaUserTie className="text-purple-600 flex-shrink-0" />
                            <span>
                              <strong>{item.cargoLider || 'Líder'}:</strong> {item.lider}
                            </span>
                          </div>
                        )}
                        {(item.diaReuniao || item.horarioReuniao) && (
                          <div className="flex items-center gap-2.5">
                            <FaClock className="text-purple-600 flex-shrink-0" />
                            <span>
                              {[item.diaReuniao, item.horarioReuniao].filter(Boolean).join(' às ')}
                            </span>
                          </div>
                        )}
                        {(item.local || item.bairro) && (
                          <div className="flex items-center gap-2.5">
                            <FaMapMarkerAlt className="text-purple-600 flex-shrink-0" />
                            <span>{[item.local, item.bairro].filter(Boolean).join(' — ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <button
                      onClick={() => {
                        setSelecionado(item);
                        setSucesso('');
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm transition-colors shadow-sm"
                    >
                      Quero Participar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de Inscrição */}
        {selecionado && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
              <button
                onClick={() => setSelecionado(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-5 h-5" />
              </button>

              {sucesso ? (
                <div className="text-center py-6">
                  <FaCheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Inscrição Recebida!</h3>
                  <p className="text-gray-600 text-sm mb-6">{sucesso}</p>
                  <button
                    onClick={() => setSelecionado(null)}
                    className="px-6 py-2.5 bg-purple-700 text-white rounded-xl font-semibold text-sm"
                  >
                    Fechar
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Participar de {selecionado.nome}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Preencha os seus dados para que a liderança entre em contato consigo.
                  </p>
                  {erro && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-800 text-xs animate-fade-in">
                      <FaExclamationCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>{erro}</span>
                    </div>
                  )}
                  <form onSubmit={handleInscrever} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Seu Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.nome}
                        onChange={(e) => setForm({ ...form, nome: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Ex: João Manuel"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Telefone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.telefone}
                        onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Ex: +244 923 000 000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        E-mail (opcional)
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Observação ou disponibilidade (opcional)
                      </label>
                      <textarea
                        rows={2}
                        value={form.mensagem}
                        onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Conte-nos como gostaria de participar..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={enviando}
                      className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-50"
                    >
                      {enviando ? 'Enviando...' : 'Confirmar Inscrição'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

