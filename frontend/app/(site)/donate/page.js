'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { donations } from '@/lib/api';
import {
  FaHandHoldingHeart,
  FaCreditCard,
  FaUniversity,
  FaMobileAlt,
  FaCopy,
  FaCheck
} from 'react-icons/fa';

const VALORES_SUGERIDOS = [1000, 2500, 5000, 10000, 25000, 50000];

const TIPOS_CONTRIBUICAO = [
  { id: 'dizimo', label: 'Dízimo' },
  { id: 'oferta', label: 'Oferta Geral' },
  { id: 'missoes', label: 'Missões e Evangelismo' },
  { id: 'construcao', label: 'Obras / Construção' }
];

export default function Donate() {
  const [form, setForm] = useState({
    valor: '',
    tipoContribuicao: 'dizimo',
    nome: '',
    email: '',
    telefone: '',
    anonimo: false,
    metodoPagamento: 'multicaixa',
    referenciaComprovativo: '',
    observacoes: ''
  });
  const [mensagem, setMensagem] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState('');

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem({ text: '', type: '' });
    try {
      await donations.create({
        valor: Number(form.valor),
        tipoContribuicao: form.tipoContribuicao,
        metodoPagamento: form.metodoPagamento,
        referenciaComprovativo: form.referenciaComprovativo,
        observacoes: form.observacoes,
        doador: {
          nome: form.anonimo ? 'Anônimo' : form.nome || 'Anônimo',
          email: form.email,
          telefone: form.telefone,
          anonimo: form.anonimo
        }
      });
      setMensagem({
        text: 'Muito obrigado pela sua contribuição! O registro foi enviado para a tesouraria da Igreja MIR. Que Deus abençoe ricamente a sua vida.',
        type: 'success'
      });
      setForm({
        valor: '',
        tipoContribuicao: 'dizimo',
        nome: '',
        email: '',
        telefone: '',
        anonimo: false,
        metodoPagamento: 'multicaixa',
        referenciaComprovativo: '',
        observacoes: ''
      });
    } catch (err) {
      setMensagem({
        text:
          err.message ||
          'Erro ao processar contribuição. Verifique os dados e tente novamente.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <PageHero
        badge="Generosidade e Fidelidade"
        badgeIcon={FaHandHoldingHeart}
        titulo="Dízimos e Ofertas"
        subtitulo="“Cada um contribua segundo propôs no seu coração; não com tristeza, ou por necessidade; porque Deus ama ao que dá com alegria.” (2 Coríntios 9:7)"
      />
      <div className="min-h-screen bg-gray-50 py-12 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6"
          >
            {/* Finalidade / Tipo de Contribuição */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Finalidade da Contribuição *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TIPOS_CONTRIBUICAO.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, tipoContribuicao: t.id }))}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      form.tipoContribuicao === t.id
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-purple-400'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Valor */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Escolha ou digite o valor (Kz) *
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                {VALORES_SUGERIDOS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, valor: String(v) }))}
                    className={`py-2 px-3 rounded-lg text-sm font-semibold border transition-colors ${
                      Number(form.valor) === v
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-purple-400'
                    }`}
                  >
                    {v.toLocaleString('pt-AO')}
                  </button>
                ))}
              </div>
              <input
                name="valor"
                value={form.valor}
                onChange={handleChange}
                required
                min="1"
                placeholder="Outro valor em Kwanzas (Kz)"
                type="number"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Método de Pagamento */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Método de Pagamento
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'multicaixa', label: 'Multicaixa Express', icon: FaMobileAlt },
                  { id: 'transferencia', label: 'Transferência / IBAN', icon: FaUniversity },
                  { id: 'cartao', label: 'Cartão', icon: FaCreditCard }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, metodoPagamento: id }))}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border font-medium text-sm transition-all ${
                      form.metodoPagamento === id
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {/* Dados Bancários / Multicaixa */}
              {form.metodoPagamento === 'transferencia' && (
                <div className="mt-4 p-4 rounded-xl bg-purple-50 border border-purple-200 text-sm text-purple-950 space-y-2">
                  <p className="font-bold text-purple-900">
                    Coordenadas Bancárias — Igreja MIR:
                  </p>
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-purple-100">
                    <div>
                      <span className="text-xs text-gray-500 block">IBAN (BAI / BFA)</span>
                      <span className="font-mono font-bold text-sm">
                        AO06 0040 0000 1234 5678 9012 3
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy('AO06004000001234567890123', 'iban')
                      }
                      className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded text-xs font-semibold flex items-center gap-1"
                    >
                      {copiedField === 'iban' ? <FaCheck /> : <FaCopy />}
                      {copiedField === 'iban' ? 'Copiado' : 'Copiar IBAN'}
                    </button>
                  </div>
                </div>
              )}

              {form.metodoPagamento === 'multicaixa' && (
                <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-950 space-y-2">
                  <p className="font-bold">Transferência Express / Referência:</p>
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-amber-100">
                    <div>
                      <span className="text-xs text-gray-500 block">
                        Nº Associado ao Multicaixa Express (Tesouraria MIR)
                      </span>
                      <span className="font-mono font-bold text-sm">+244 923 000 000</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('923000000', 'mcx')}
                      className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded text-xs font-semibold flex items-center gap-1"
                    >
                      {copiedField === 'mcx' ? <FaCheck /> : <FaCopy />}
                      {copiedField === 'mcx' ? 'Copiado' : 'Copiar Nº'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Comprovativo / Referência */}
            {(form.metodoPagamento === 'transferencia' ||
              form.metodoPagamento === 'multicaixa') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nº de Operação / Referência do Comprovativo (opcional)
                </label>
                <input
                  name="referenciaComprovativo"
                  value={form.referenciaComprovativo}
                  onChange={handleChange}
                  placeholder="Ex: Nº da transação bancária ou Multicaixa Express"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm"
                />
              </div>
            )}

            {/* Dados do Contribuinte */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  disabled={form.anonimo}
                  placeholder="Seu nome completo"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg disabled:bg-gray-100 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone / WhatsApp
                </label>
                <input
                  name="telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  disabled={form.anonimo}
                  placeholder="+244 923 000 000"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg disabled:bg-gray-100 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="anonimo"
                name="anonimo"
                type="checkbox"
                checked={form.anonimo}
                onChange={handleChange}
                className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="anonimo" className="ml-2 text-sm text-gray-700">
                Desejo fazer uma contribuição anônima
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3.5 rounded-lg font-bold transition-colors disabled:opacity-50"
            >
              {loading ? 'Processando...' : 'Registrar Contribuição'}
            </button>

            {mensagem.text && (
              <div
                className={`p-4 rounded-lg text-center font-medium ${
                  mensagem.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {mensagem.text}
              </div>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
