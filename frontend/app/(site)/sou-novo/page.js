'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { visitantes as visitantesApi } from '@/lib/api';
import {
  FaHeart,
  FaCheckCircle,
  FaExclamationCircle,
  FaHandsHelping,
  FaHome,
  FaPrayingHands
} from 'react-icons/fa';

const INITIAL_FORM = {
  nome: '',
  telefone: '',
  email: '',
  bairro: '',
  faixaEtaria: 'adulto',
  tipoVisita: 'primeira_vez',
  comoConheceu: '',
  desejaVisitaPastoral: false,
  desejaCelula: true,
  desejaBatismo: false,
  observacoes: ''
};

export default function SouNovoPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setSucesso('');
    setErro('');
    try {
      const res = await visitantesApi.create(form);
      setSucesso(res.data?.message || 'Cadastro enviado com sucesso!');
      setForm(INITIAL_FORM);
    } catch (err) {
      setErro(err.response?.data?.message || err.message || 'Erro ao enviar os seus dados. Por favor, verifique os campos.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <Navbar />
      <PageHero
        badge="Acolhimento e Integração"
        badgeIcon={FaHeart}
        titulo="Seja Muito Bem-Vindo à Família MIR!"
        subtitulo="Estamos felizes pela sua presença! Se nos visitou pela primeira vez ou entregou a sua vida a Jesus hoje, preencha o Cartão de Boas-Vindas Digital abaixo."
      />
      <main className="min-h-screen bg-gray-50 py-12 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {sucesso ? (
            <div className="bg-white rounded-2xl shadow-lg p-10 text-center border border-green-100">
              <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Alegria em Receber Você!
              </h2>
              <p className="text-gray-600 max-w-lg mx-auto mb-6">{sucesso}</p>
              <button
                onClick={() => setSucesso('')}
                className="px-6 py-3 bg-purple-700 text-white rounded-xl font-semibold text-sm hover:bg-purple-800"
              >
                Preencher Outro Cartão
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-10 space-y-6"
            >
              {erro && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-sm animate-fade-in">
                  <FaExclamationCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>{erro}</span>
                </div>
              )}
              {/* Motivo */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  Qual o seu momento conosco hoje? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'primeira_vez',
                      title: 'Sou Visitante de 1ª Vez',
                      desc: 'Estou visitando a Igreja MIR e quero conhecer mais'
                    },
                    {
                      id: 'novo_convertido',
                      title: 'Aceitei a Jesus Hoje! 🙌',
                      desc: 'Tomei a decisão de entregar a minha vida a Cristo'
                    },
                    {
                      id: 'reconciliacao',
                      title: 'Reconciliação',
                      desc: 'Estou voltando para os caminhos do Senhor'
                    },
                    {
                      id: 'mudanca_igreja',
                      title: 'Quero Congregar Aqui',
                      desc: 'Desejo tornar-me membro da Igreja MIR'
                    }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setForm({ ...form, tipoVisita: opt.id })}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        form.tipoVisita === opt.id
                          ? 'border-purple-600 bg-purple-50 text-purple-950 shadow-sm'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="font-bold text-sm mb-0.5">{opt.title}</div>
                      <div className="text-xs opacity-80">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    placeholder="Seu nome completo"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm"
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
                    placeholder="+244 923 000 000"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Bairro / Município
                  </label>
                  <input
                    type="text"
                    value={form.bairro}
                    onChange={(e) => setForm({ ...form, bairro: e.target.value })}
                    placeholder="Onde reside?"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Faixa Etária
                  </label>
                  <select
                    value={form.faixaEtaria}
                    onChange={(e) => setForm({ ...form, faixaEtaria: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm"
                  >
                    <option value="adolescente">Adolescente (12–17 anos)</option>
                    <option value="jovem">Jovem (18–30 anos)</option>
                    <option value="adulto">Adulto (31–59 anos)</option>
                    <option value="idoso">Sénior (60+ anos)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    E-mail (opcional)
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="seu@email.com"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Interesses de Discipulado */}
              <div className="bg-purple-50/70 rounded-xl p-4 space-y-3 border border-purple-100">
                <p className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                  Como podemos caminhar consigo?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-800">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.desejaCelula}
                      onChange={(e) => setForm({ ...form, desejaCelula: e.target.checked })}
                      className="rounded text-purple-600"
                    />
                    <FaHome className="text-purple-600" />
                    <span>Participar de uma Célula perto de casa</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.desejaVisitaPastoral}
                      onChange={(e) =>
                        setForm({ ...form, desejaVisitaPastoral: e.target.checked })
                      }
                      className="rounded text-purple-600"
                    />
                    <FaPrayingHands className="text-purple-600" />
                    <span>Receber oração / visita pastoral</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.desejaBatismo}
                      onChange={(e) => setForm({ ...form, desejaBatismo: e.target.checked })}
                      className="rounded text-purple-600"
                    />
                    <FaHandsHelping className="text-purple-600" />
                    <span>Quero preparar-me para o Batismo</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Quem o(a) convidou ou como conheceu a Igreja MIR? / Pedido de Oração
                </label>
                <textarea
                  rows={3}
                  value={form.observacoes}
                  onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
                  placeholder="Deixe aqui uma observação ou motivo de oração..."
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={enviando}
                className="w-full py-4 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FaHeart className="text-pink-300" />
                <span>{enviando ? 'Enviando...' : 'Enviar Cartão de Boas-Vindas'}</span>
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

