'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaFileAlt, 
  FaDonate, 
  FaEnvelope,
  FaUserPlus,
  FaPlus,
  FaPrayingHands,
  FaBirthdayCake,
  FaWhatsapp
} from 'react-icons/fa';
import useAuthStore from '@/store/useAuthStore';
import { membros, eventos, pages, donations, newsletters, contact, oracoes } from '@/lib/api';
import { formatCurrency } from '@/utils';

// Componente de card de estatística
const StatCard = ({ title, value, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    yellow: 'bg-amber-50 text-amber-600 border-amber-100',
    red: 'bg-red-50 text-red-600 border-red-100'
  };

  return (
    <div className="bg-white overflow-hidden shadow-sm hover:shadow-md rounded-xl transition-all duration-200 border border-gray-100 p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          {title}
        </span>
        <div className={`rounded-lg p-2 border ${colorClasses[color] || colorClasses.blue}`}>
          {React.cloneElement(icon, { className: 'h-4 w-4' })}
        </div>
      </div>
      <div className="text-xl font-bold text-gray-900 leading-tight">
        {value}
      </div>
    </div>
  );
};

// Componente de atividade recente
const ActivityItem = ({ title, description, time, icon }) => (
  <div className="relative pb-8">
    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
    <div className="relative flex space-x-3">
      <div>
        <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center ring-8 ring-white">
          {React.cloneElement(icon, { className: 'h-4 w-4 text-blue-500' })}
        </span>
      </div>
      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
        <div>
          <p className="text-sm text-gray-800">
            {description} <span className="font-medium text-gray-900">{title}</span>
          </p>
        </div>
        <div className="text-right text-sm whitespace-nowrap text-gray-500">
          <time dateTime={time}>{time}</time>
        </div>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuthStore();
  const [stats, setStats] = useState({
    totalMembers: 0,
    eventsThisMonth: 0,
    totalPages: 0,
    totalDonations: 0,
    pendingPrayers: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [aniversariantesMes, setAniversariantesMes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const [
          membersRes,
          eventsRes,
          pagesRes,
          donationsRes,
          newsletterRes,
          messagesRes,
          prayersRes
        ] = await Promise.allSettled([
          membros.getAll(),
          eventos.getAll(),
          pages.getAll(),
          donations.getAll(),
          newsletters.getAll(),
          contact.getMessages(),
          oracoes.getAll()
        ]);

        const membersList = membersRes.status === 'fulfilled' ? (membersRes.value.data || []) : [];
        const eventsList = eventsRes.status === 'fulfilled' ? (eventsRes.value.data || []) : [];
        const pagesList = pagesRes.status === 'fulfilled' ? (pagesRes.value.data || []) : [];
        const donationsList = donationsRes.status === 'fulfilled' ? (donationsRes.value.data || []) : [];
        const messagesList = messagesRes.status === 'fulfilled' ? (messagesRes.value.data || []) : [];
        const prayersList = prayersRes.status === 'fulfilled' ? (prayersRes.value.data || []) : [];

        const now = new Date();
        const mesAtual = now.getMonth();
        const eventsThisMonth = eventsList.filter((ev) => {
          if (!ev.dataInicio) return false;
          const d = new Date(ev.dataInicio);
          return d.getMonth() === mesAtual && d.getFullYear() === now.getFullYear();
        }).length;

        const totalDonations = donationsList.reduce((acc, d) => acc + (Number(d.valor) || 0), 0);
        const pendingPrayers = prayersList.filter((p) => p.status === 'novo').length;

        setStats({
          totalMembers: membersList.length,
          eventsThisMonth: eventsThisMonth || eventsList.length,
          totalPages: pagesList.length,
          totalDonations,
          pendingPrayers
        });

        // Aniversariantes do mês atual
        const bdays = membersList.filter((m) => {
          if (!m.dataNascimento) return false;
          const d = new Date(m.dataNascimento);
          return !Number.isNaN(d.getTime()) && d.getUTCMonth() === mesAtual;
        });
        setAniversariantesMes(bdays);

        // Próximos eventos ordenados por dataInicio
        const nextEvents = [...eventsList]
          .filter((ev) => !ev.dataInicio || new Date(ev.dataInicio) >= new Date(now.setHours(0, 0, 0, 0)))
          .sort((a, b) => new Date(a.dataInicio || 0) - new Date(b.dataInicio || 0))
          .slice(0, 4);
        setUpcomingEvents(nextEvents.length > 0 ? nextEvents : eventsList.slice(0, 3));

        // Construir feed de atividades reais
        const activities = [];
        prayersList.slice(0, 2).forEach((pr) => {
          activities.push({
            id: `prayer-${pr._id}`,
            title: pr.nome,
            description: 'Pedido de oração recebido:',
            date: new Date(pr.createdAt || Date.now()),
            icon: <FaPrayingHands />
          });
        });
        membersList.slice(0, 2).forEach((m) => {
          activities.push({
            id: `member-${m._id}`,
            title: m.nome,
            description: 'Membro cadastrado:',
            date: new Date(m.createdAt || m.dataIngresso || Date.now()),
            icon: <FaUserPlus />
          });
        });
        donationsList.slice(0, 2).forEach((d) => {
          const nomeDoador = d.doador?.anonimo ? 'Anônimo' : (d.doador?.nome || d.nome || 'Anônimo');
          activities.push({
            id: `donation-${d._id}`,
            title: `${formatCurrency(d.valor || 0)} (${nomeDoador})`,
            description: 'Contribuição registrada:',
            date: new Date(d.createdAt || d.data || Date.now()),
            icon: <FaDonate />
          });
        });
        messagesList.slice(0, 2).forEach((msg) => {
          activities.push({
            id: `msg-${msg._id}`,
            title: `${msg.assunto || 'Contato'} — ${msg.nome}`,
            description: 'Mensagem recebida:',
            date: new Date(msg.createdAt || Date.now()),
            icon: <FaEnvelope />
          });
        });

        activities.sort((a, b) => b.date - a.date);
        setRecentActivities(
          activities.slice(0, 6).map((item) => ({
            ...item,
            time: item.date.toLocaleDateString('pt-AO', { day: '2-digit', month: 'short' })
          }))
        );
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Visão Geral</h1>
        
        {/* Estatísticas */}
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <StatCard 
              title="Total de Membros" 
              value={stats.totalMembers.toLocaleString('pt-AO')} 
              icon={<FaUsers />} 
              color="blue"
            />
            <StatCard 
              title="Eventos Ativos" 
              value={stats.eventsThisMonth} 
              icon={<FaCalendarAlt />} 
              color="green"
            />
            <StatCard 
              title="Páginas CMS" 
              value={stats.totalPages} 
              icon={<FaFileAlt />} 
              color="purple"
            />
            <StatCard 
              title="Dízimos e Ofertas" 
              value={formatCurrency(stats.totalDonations)} 
              icon={<FaDonate />} 
              color="yellow"
            />
            <StatCard 
              title="Orações Pendentes" 
              value={stats.pendingPrayers} 
              icon={<FaPrayingHands />} 
              color="red"
            />
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Atividades Recentes */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Atividades Recentes</h2>
                <Link
                  href="/admin/oracoes"
                  className="text-xs font-semibold text-purple-600 hover:text-purple-800"
                >
                  Ver Pedidos de Oração →
                </Link>
              </div>
              <div className="px-6 py-4">
                {recentActivities.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">Nenhuma atividade recente encontrada.</p>
                ) : (
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {recentActivities.map((activity) => (
                        <li key={activity.id}>
                          <ActivityItem 
                            title={activity.title} 
                            description={activity.description} 
                            time={activity.time}
                            icon={activity.icon}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Aniversariantes do Mês */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <FaBirthdayCake className="text-pink-500" />
                  Aniversariantes deste Mês ({aniversariantesMes.length})
                </h2>
                <Link
                  href="/admin/membros"
                  className="text-xs font-semibold text-purple-600 hover:text-purple-800"
                >
                  Gerir Membros →
                </Link>
              </div>
              <div className="px-6 py-4">
                {aniversariantesMes.length === 0 ? (
                  <p className="text-sm text-gray-500 py-2">
                    Nenhum aniversariante registado para este mês.
                  </p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {aniversariantesMes.slice(0, 6).map((m) => {
                      const d = new Date(m.dataNascimento);
                      const cleanPhone = (m.telefone || '').replace(/\D/g, '');
                      return (
                        <div key={m._id} className="py-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{m.nome}</p>
                            <p className="text-xs text-gray-500">
                              Dia {d.getUTCDate()} • {m.ministerio || 'Membro'}
                            </p>
                          </div>
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                `Feliz aniversário, ${m.nome}! 🎉 Que o Senhor continue abençoando ricamente a sua vida. Com carinho, Igreja MIR.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-green-700"
                            >
                              <FaWhatsapp /> Felicitar
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Próximos Eventos */}
          <div>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Próximos Eventos</h2>
              </div>
              <div className="px-6 py-4">
                {upcomingEvents.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">Nenhum evento agendado.</p>
                ) : (
                  <div className="space-y-6">
                    {upcomingEvents.map((event) => (
                      <div key={event._id} className="flex items-start">
                        <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                          <FaCalendarAlt className="h-6 w-6 text-purple-600" aria-hidden="true" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900">{event.titulo}</h3>
                          <p className="text-sm text-gray-500">
                            {event.dataInicio
                              ? new Date(event.dataInicio).toLocaleDateString('pt-AO', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric'
                                })
                              : 'Data a definir'}
                          </p>
                          {event.local && (
                            <p className="mt-1 text-sm text-gray-700">{event.local}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-6">
                  <Link
                    href="/admin/eventos"
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                  >
                    <FaPlus className="-ml-1 mr-2 h-4 w-4" />
                    Gerir Eventos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
