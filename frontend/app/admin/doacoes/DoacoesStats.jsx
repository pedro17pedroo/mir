'use client';

import { useState, useMemo } from 'react';
import {
  FaArrowUp,
  FaArrowDown,
  FaBalanceScale,
  FaClock,
  FaChartPie,
  FaChartBar,
  FaShieldAlt,
  FaCoins,
  FaReceipt,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import { formatCurrency } from '@/utils';

const LABELS_TIPO = {
  dizimo: 'Dízimos',
  oferta: 'Ofertas de Culto',
  missoes: 'Missões & Evangelismo',
  construcao: 'Obras & Construção',
  outro: 'Outras Contribuições'
};

const CORES_TIPO = {
  dizimo: 'bg-emerald-500',
  oferta: 'bg-teal-500',
  missoes: 'bg-blue-500',
  construcao: 'bg-indigo-500',
  outro: 'bg-purple-500'
};

const LABELS_DESPESA = {
  energia_agua: 'Energia e Água',
  renda_instalacoes: 'Renda / Instalações',
  som_midia: 'Som, Multimédia e Internet',
  acao_social: 'Ação Social e Diaconia',
  manutencao: 'Manutenção e Limpeza',
  subsidios_pessoal: 'Subsídios / Apoio Obreiros',
  eventos_cultos: 'Logística de Cultos / Eventos',
  missoes: 'Apoio Missionário',
  outro: 'Outras Despesas'
};

const CORES_DESPESA = {
  energia_agua: 'bg-amber-500',
  renda_instalacoes: 'bg-rose-500',
  som_midia: 'bg-cyan-500',
  acao_social: 'bg-pink-500',
  manutencao: 'bg-orange-500',
  subsidios_pessoal: 'bg-violet-500',
  eventos_cultos: 'bg-yellow-500',
  missoes: 'bg-blue-600',
  outro: 'bg-gray-500'
};

export const DoacoesStats = ({ doacoes = [] }) => {
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Totais principais
  const entradasConfirmadas = useMemo(() => {
    return doacoes
      .filter((d) => (d.natureza || 'entrada') === 'entrada' && d.status === 'concluido')
      .reduce((sum, d) => sum + (d.valor || 0), 0);
  }, [doacoes]);

  const saidasConfirmadas = useMemo(() => {
    return doacoes
      .filter((d) => d.natureza === 'saida' && d.status !== 'falhou')
      .reduce((sum, d) => sum + (d.valor || 0), 0);
  }, [doacoes]);

  const saldoLiquido = entradasConfirmadas - saidasConfirmadas;

  const pendentes = useMemo(() => {
    return doacoes.filter(
      (d) => (d.natureza || 'entrada') === 'entrada' && d.status === 'pendente'
    );
  }, [doacoes]);

  const pendentesCount = pendentes.length;
  const pendentesValor = pendentes.reduce((sum, d) => sum + (d.valor || 0), 0);

  // Taxa de cobertura e percentual de saídas
  const totalVolume = entradasConfirmadas + saidasConfirmadas;
  const pctEntradas = totalVolume > 0 ? Math.round((entradasConfirmadas / totalVolume) * 100) : 0;
  const pctSaidas = totalVolume > 0 ? 100 - pctEntradas : 0;
  const taxaCobertura = saidasConfirmadas > 0 ? Math.round((entradasConfirmadas / saidasConfirmadas) * 100) : 100;

  // Distribuição por Tipo de Entrada
  const tiposEntrada = useMemo(() => {
    const counts = {};
    const valores = {};
    doacoes
      .filter((d) => (d.natureza || 'entrada') === 'entrada' && d.status === 'concluido')
      .forEach((d) => {
        const t = d.tipoContribuicao || 'outro';
        counts[t] = (counts[t] || 0) + 1;
        valores[t] = (valores[t] || 0) + (d.valor || 0);
      });

    return Object.keys(valores)
      .map((key) => ({
        key,
        label: LABELS_TIPO[key] || key,
        valor: valores[key],
        count: counts[key],
        pct: entradasConfirmadas > 0 ? Math.round((valores[key] / entradasConfirmadas) * 100) : 0,
        colorClass: CORES_TIPO[key] || 'bg-purple-500'
      }))
      .sort((a, b) => b.valor - a.valor);
  }, [doacoes, entradasConfirmadas]);

  // Distribuição por Categoria de Despesa
  const categoriasDespesa = useMemo(() => {
    const counts = {};
    const valores = {};
    doacoes
      .filter((d) => d.natureza === 'saida' && d.status !== 'falhou')
      .forEach((d) => {
        const cat = d.categoriaDespesa || 'outro';
        counts[cat] = (counts[cat] || 0) + 1;
        valores[cat] = (valores[cat] || 0) + (d.valor || 0);
      });

    return Object.keys(valores)
      .map((key) => ({
        key,
        label: LABELS_DESPESA[key] || key,
        valor: valores[key],
        count: counts[key],
        pct: saidasConfirmadas > 0 ? Math.round((valores[key] / saidasConfirmadas) * 100) : 0,
        colorClass: CORES_DESPESA[key] || 'bg-gray-500'
      }))
      .sort((a, b) => b.valor - a.valor);
  }, [doacoes, saidasConfirmadas]);

  // Agrupamento Mensal dos últimos 6 meses para Gráfico SVG
  const fluxoMensal = useMemo(() => {
    const monthsMap = {};
    const now = new Date();

    // Preenche últimos 6 meses com zeros
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('pt-AO', { month: 'short', year: '2-digit' });
      monthsMap[key] = { key, label, entradas: 0, saidas: 0 };
    }

    // Acumula movimentos confirmados
    doacoes.forEach((d) => {
      const rawDate = d.data || d.createdAt;
      if (!rawDate) return;
      const dateObj = new Date(rawDate);
      if (Number.isNaN(dateObj.getTime())) return;
      const key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;

      if (monthsMap[key]) {
        const isEntrada = (d.natureza || 'entrada') === 'entrada';
        if (isEntrada && d.status === 'concluido') {
          monthsMap[key].entradas += d.valor || 0;
        } else if (!isEntrada && d.status !== 'falhou') {
          monthsMap[key].saidas += d.valor || 0;
        }
      }
    });

    return Object.values(monthsMap);
  }, [doacoes]);

  // Encontra o valor máximo para a escala do gráfico
  const maxMensal = useMemo(() => {
    let max = 1000;
    fluxoMensal.forEach((m) => {
      if (m.entradas > max) max = m.entradas;
      if (m.saidas > max) max = m.saidas;
    });
    return max;
  }, [fluxoMensal]);

  return (
    <div className="space-y-6 mb-8">
      {/* 4 Cards de KPI com Borda Colorida */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Entradas */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-emerald-500 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Entradas Confirmadas
              </p>
              <p className="text-2xl font-black text-emerald-600 tracking-tight">
                {formatCurrency(entradasConfirmadas)}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700">
                  {pctEntradas}% do volume
                </span>
                <span className="text-[11px] text-gray-400">Dízimos e Ofertas</span>
              </div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shadow-inner">
              <FaArrowUp className="text-xl" />
            </div>
          </div>
        </div>

        {/* Despesas */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-rose-500 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Despesas / Saídas
              </p>
              <p className="text-2xl font-black text-rose-600 tracking-tight">
                {formatCurrency(saidasConfirmadas)}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700">
                  {pctSaidas}% do volume
                </span>
                <span className="text-[11px] text-gray-400">Custos operacionais</span>
              </div>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl text-rose-600 shadow-inner">
              <FaArrowDown className="text-xl" />
            </div>
          </div>
        </div>

        {/* Saldo Líquido */}
        <div
          className={`bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 ${
            saldoLiquido >= 0 ? 'border-l-purple-600' : 'border-l-red-600'
          } hover:shadow-md transition`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Saldo Líquido em Caixa
              </p>
              <p
                className={`text-2xl font-black tracking-tight ${
                  saldoLiquido >= 0 ? 'text-purple-700' : 'text-red-600'
                }`}
              >
                {formatCurrency(saldoLiquido)}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold ${
                    saldoLiquido >= 0
                      ? 'bg-purple-50 text-purple-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {taxaCobertura}% cobertura
                </span>
                <span className="text-[11px] text-gray-400">Entradas vs. Saídas</span>
              </div>
            </div>
            <div
              className={`p-3 rounded-xl shadow-inner ${
                saldoLiquido >= 0
                  ? 'bg-purple-50 text-purple-600'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              <FaBalanceScale className="text-xl" />
            </div>
          </div>
        </div>

        {/* Aguardando Validação */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-amber-500 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Aguardando Validação
              </p>
              <p className="text-2xl font-black text-amber-600 tracking-tight">
                {formatCurrency(pendentesValor)}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800">
                  {pendentesCount} {pendentesCount === 1 ? 'pendência' : 'pendências'}
                </span>
                <span className="text-[11px] text-gray-400">Comprovativos</span>
              </div>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600 shadow-inner">
              <FaClock className="text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Proporção do Fluxo e Botão de Alternância de Gráficos */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <FaChartPie className="text-purple-600" />
            <h3 className="font-bold text-gray-800 text-sm">
              Relação de Fluxo de Caixa (Entradas vs. Saídas)
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 transition"
          >
            <FaChartBar />
            {showAnalytics ? 'Ocultar Análise Detalhada' : 'Ver Análise Visual Completa'}
            {showAnalytics ? <FaChevronUp className="text-[10px]" /> : <FaChevronDown className="text-[10px]" />}
          </button>
        </div>

        {/* Barra Proporcional */}
        <div className="space-y-1.5">
          <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${pctEntradas}%` }}
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
              title={`Entradas: ${pctEntradas}%`}
            />
            <div
              style={{ width: `${pctSaidas}%` }}
              className="bg-gradient-to-r from-rose-400 to-rose-600 h-full transition-all duration-500"
              title={`Despesas: ${pctSaidas}%`}
            />
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Entradas: {pctEntradas}% ({formatCurrency(entradasConfirmadas)})
            </span>
            <span className="flex items-center gap-1.5 text-rose-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              Saídas: {pctSaidas}% ({formatCurrency(saidasConfirmadas)})
            </span>
          </div>
        </div>

        {/* Painel Analítico Expandido */}
        {showAnalytics && (
          <div className="mt-6 pt-6 border-t border-gray-100 space-y-6">
            {/* Gráfico de Barras Mensal Nativo (SVG / CSS) */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                    <FaChartBar className="text-purple-600" />
                    Evolução Mensal do Fluxo de Caixa (Últimos 6 Meses)
                  </h4>
                  <p className="text-xs text-gray-500">
                    Comparativo direto entre arrecadações e despesas operacionais da Igreja MIR
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
                    Entradas
                  </span>
                  <span className="flex items-center gap-1 text-rose-700 font-semibold">
                    <span className="w-3 h-3 rounded bg-rose-500 inline-block" />
                    Saídas
                  </span>
                </div>
              </div>

              {/* Grid de Barras */}
              <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2">
                  {fluxoMensal.map((item, idx) => {
                    const hEntrada = maxMensal > 0 ? Math.max(8, Math.round((item.entradas / maxMensal) * 140)) : 8;
                    const hSaida = maxMensal > 0 ? Math.max(8, Math.round((item.saidas / maxMensal) * 140)) : 8;
                    const isHovered = activeTooltip === idx;

                    return (
                      <div
                        key={item.key}
                        className="flex-1 flex flex-col items-center h-full justify-end relative group"
                        onMouseEnter={() => setActiveTooltip(idx)}
                        onMouseLeave={() => setActiveTooltip(null)}
                      >
                        {/* Tooltip ao passar o cursor */}
                        {isHovered && (
                          <div className="absolute -top-16 z-20 bg-gray-900 text-white text-[11px] rounded-lg p-2 shadow-xl pointer-events-none whitespace-nowrap min-w-[140px] text-center border border-gray-700">
                            <p className="font-bold capitalize text-amber-300">{item.label}</p>
                            <p className="text-emerald-400">Entradas: {formatCurrency(item.entradas)}</p>
                            <p className="text-rose-400">Saídas: {formatCurrency(item.saidas)}</p>
                          </div>
                        )}

                        {/* Par de Barras */}
                        <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                          {/* Barra Entradas */}
                          <div
                            style={{ height: `${hEntrada}px` }}
                            className="w-1/2 max-w-[28px] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md hover:brightness-110 transition-all cursor-pointer relative"
                          />
                          {/* Barra Saídas */}
                          <div
                            style={{ height: `${hSaida}px` }}
                            className="w-1/2 max-w-[28px] bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-md hover:brightness-110 transition-all cursor-pointer relative"
                          />
                        </div>

                        {/* Rótulo do Mês */}
                        <span className="text-[11px] font-semibold text-gray-600 capitalize mt-2 truncate w-full text-center">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Categorias e Tipos (2 Colunas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Coluna 1: Origem das Entradas */}
              <div className="bg-gray-50/70 p-5 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <FaCoins className="text-emerald-600" />
                    Origem das Entradas ({tiposEntrada.length})
                  </h5>
                  <span className="text-xs font-bold text-emerald-700">
                    {formatCurrency(entradasConfirmadas)}
                  </span>
                </div>

                {tiposEntrada.length === 0 ? (
                  <p className="text-xs text-gray-400 py-4 text-center">
                    Nenhuma entrada confirmada registada
                  </p>
                ) : (
                  <div className="space-y-3">
                    {tiposEntrada.map((t) => (
                      <div key={t.key} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-gray-700">{t.label}</span>
                          <span className="text-gray-900 font-bold">
                            {formatCurrency(t.valor)}{' '}
                            <span className="text-gray-400 font-normal">({t.pct}%)</span>
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${t.pct}%` }}
                            className={`h-full ${t.colorClass} rounded-full transition-all`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Coluna 2: Destino das Despesas */}
              <div className="bg-gray-50/70 p-5 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <FaReceipt className="text-rose-600" />
                    Destino das Despesas ({categoriasDespesa.length})
                  </h5>
                  <span className="text-xs font-bold text-rose-700">
                    {formatCurrency(saidasConfirmadas)}
                  </span>
                </div>

                {categoriasDespesa.length === 0 ? (
                  <p className="text-xs text-gray-400 py-4 text-center">
                    Nenhuma despesa operacional registada
                  </p>
                ) : (
                  <div className="space-y-3">
                    {categoriasDespesa.map((cat) => (
                      <div key={cat.key} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-gray-700">{cat.label}</span>
                          <span className="text-gray-900 font-bold">
                            {formatCurrency(cat.valor)}{' '}
                            <span className="text-gray-400 font-normal">({cat.pct}%)</span>
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${cat.pct}%` }}
                            className={`h-full ${cat.colorClass} rounded-full transition-all`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Banner de Saúde Financeira */}
            <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 p-4 rounded-xl border border-purple-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-600 text-white rounded-lg shadow-sm">
                  <FaShieldAlt className="text-base" />
                </div>
                <div>
                  <p className="font-bold text-purple-950">Indicadores de Saúde Financeira da Igreja</p>
                  <p className="text-purple-700">
                    {saldoLiquido >= 0
                      ? 'Operação sustentável: As entradas cobrem 100% dos custos correntes da igreja com margem de segurança.'
                      : 'Atenção ministerial: As despesas do período superam as entradas arrecadadas. Recomenda-se revisão orçamental.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">Taxa de Cobertura</span>
                  <span className={`font-black text-sm ${taxaCobertura >= 100 ? 'text-emerald-700' : 'text-red-600'}`}>
                    {taxaCobertura}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">Margem Líquida</span>
                  <span className="font-black text-sm text-purple-800">
                    {entradasConfirmadas > 0 ? Math.round((saldoLiquido / entradasConfirmadas) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
