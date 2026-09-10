import React, { useState } from 'react';
import { 
  Users, DollarSign, Phone, MessageSquare, Mail, Calendar, 
  TrendingUp, Plus, Search, Filter, CheckCircle2, Clock, 
  AlertCircle, ChevronRight, ExternalLink, ArrowRight, ShieldCheck, 
  Sparkles, X, MessageCircle
} from 'lucide-react';
import { CrmLead, CrmStage, SportCode } from '../../types';
import { INITIAL_CRM_LEADS } from '../../data/mockCrmData';
import { SPORT_THEMES } from '../Navbar';

const STAGE_CONFIG: Record<CrmStage, { label: string; color: string; badgeBg: string; border: string }> = {
  NUEVO_LEAD: { label: '1. Nuevo Lead', color: 'text-blue-400', badgeBg: 'bg-blue-500/10 text-blue-300', border: 'border-blue-500/30' },
  CONTACTADO: { label: '2. Contactado', color: 'text-cyan-400', badgeBg: 'bg-cyan-500/10 text-cyan-300', border: 'border-cyan-500/30' },
  DEMO_AGENDADA: { label: '3. Demo Agendada', color: 'text-purple-400', badgeBg: 'bg-purple-500/10 text-purple-300', border: 'border-purple-500/30' },
  EN_NEGOCIACION: { label: '4. En Negociación', color: 'text-amber-400', badgeBg: 'bg-amber-500/10 text-amber-300', border: 'border-amber-500/30' },
  PAGADO_ACTIVO: { label: '5. Pagado / Activo', color: 'text-emerald-400', badgeBg: 'bg-emerald-500/10 text-emerald-300', border: 'border-emerald-500/30' },
  RENOVACION: { label: '6. Por Renovar', color: 'text-rose-400', badgeBg: 'bg-rose-500/10 text-rose-300', border: 'border-rose-500/30' }
};

export const AdminCRM: React.FC = () => {
  const [leads, setLeads] = useState<CrmLead[]>(INITIAL_CRM_LEADS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [selectedSport, setSelectedSport] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'pipeline' | 'list'>('pipeline');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeLeadForActivity, setActiveLeadForActivity] = useState<CrmLead | null>(null);

  // New Lead Form State
  const [newOrg, setNewOrg] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newRole, setNewRole] = useState('Presidente de Liga');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSport, setNewSport] = useState<SportCode>('FUTBOL');
  const [newCity, setNewCity] = useState('');
  const [newEstimatedValue, setNewEstimatedValue] = useState('25');
  const [newPlanTier, setNewPlanTier] = useState<'BASIC_3' | 'PRO_5' | 'ENTERPRISE_8' | 'LICENCIA_25'>('PRO_5');
  const [newPriority, setNewPriority] = useState<'ALTA' | 'MEDIA' | 'BAJA'>('ALTA');
  const [newNotes, setNewNotes] = useState('');

  // Activity Log State
  const [activityType, setActivityType] = useState<'LLAMADA' | 'WHATSAPP' | 'EMAIL' | 'DEMO' | 'PAGO_REGISTRADO'>('WHATSAPP');
  const [activityNotes, setActivityNotes] = useState('');

  // Metrics
  const totalLeads = leads.length;
  const pipelineValue = leads.reduce((acc, lead) => acc + lead.estimatedValueUsd, 0);
  const closedWon = leads.filter(l => l.stage === 'PAGADO_ACTIVO').length;
  const conversionRate = totalLeads > 0 ? Math.round((closedWon / totalLeads) * 100) : 0;
  const highPriorityCount = leads.filter(l => l.priority === 'ALTA').length;

  // Filtered Leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStage = selectedStage === 'ALL' || lead.stage === selectedStage;
    const matchesSport = selectedSport === 'ALL' || lead.sportCode === selectedSport;

    return matchesSearch && matchesStage && matchesSport;
  });

  const handleStageChange = (leadId: string, newStage: CrmStage) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: newStage } : l));
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrg || !newContact) return;

    const newLeadItem: CrmLead = {
      id: `crm-${Date.now()}`,
      organizationName: newOrg,
      contactName: newContact,
      contactRole: newRole,
      email: newEmail,
      phone: newPhone,
      sportCode: newSport,
      country: 'Ecuador',
      city: newCity || 'Quito',
      stage: 'NUEVO_LEAD',
      estimatedValueUsd: parseFloat(newEstimatedValue) || 25,
      planTier: newPlanTier,
      priority: newPriority,
      notes: newNotes,
      activities: [
        {
          id: `act-${Date.now()}`,
          type: 'WHATSAPP',
          date: new Date().toISOString().split('T')[0],
          notes: 'Registro inicial de prospecto en CRM Deporverso.',
          agentName: 'SEO-Agent CIG'
        }
      ],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setLeads(prev => [newLeadItem, ...prev]);
    setShowAddModal(false);
    // Reset
    setNewOrg('');
    setNewContact('');
    setNewEmail('');
    setNewPhone('');
    setNewCity('');
    setNewNotes('');
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLeadForActivity || !activityNotes) return;

    const newAct = {
      id: `act-${Date.now()}`,
      type: activityType,
      date: new Date().toISOString().split('T')[0],
      notes: activityNotes,
      agentName: 'SuperAdmin CIG'
    };

    setLeads(prev => prev.map(l => {
      if (l.id === activeLeadForActivity.id) {
        return {
          ...l,
          activities: [newAct, ...l.activities]
        };
      }
      return l;
    }));

    setActivityNotes('');
    setActiveLeadForActivity(null);
  };

  const generateWhatsAppLink = (lead: CrmLead) => {
    const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hola ${lead.contactName}, un saludo desde la Dirección Comercial de Deporverso. ` +
      `Nos ponemos en contacto para coordinar la activación del portal oficial y la vocalía digital para ${lead.organizationName}. ` +
      `¿Tendrías 5 minutos para una breve videollamada de demostración?`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  return (
    <div className="space-y-6">
      {/* CRM HEADER & ACTIONS */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950/40 p-6 rounded-2xl border border-indigo-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Módulo CRM Confidencial (Oculto al Usuario)
            </span>
            <span className="text-slate-400 text-xs font-medium">Gestión de Prospectos & Afiliaciones</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            CRM de Ligas, Clubes & Ventas
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Pipeline comercial para seguimiento de directivos, cobranza de licencias anuales de $25 USD, activación de planes recurrentes ($3, $5 y $8) y contacto directo por WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Nuevo Prospecto de Liga
          </button>
        </div>
      </div>

      {/* CRM METRICS DASHBOARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0b0f17] p-5 rounded-xl border border-indigo-500/20 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Prospectos Activos</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalLeads} Ligas</div>
          <p className="text-xs text-indigo-400 mt-1 font-medium">{highPriorityCount} con prioridad ALTA</p>
        </div>

        <div className="bg-[#0b0f17] p-5 rounded-xl border border-indigo-500/20 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Pipeline Valorizado</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">${pipelineValue.toFixed(2)} USD</div>
          <p className="text-xs text-slate-400 mt-1">Suma de onboarding y licencias anuales</p>
        </div>

        <div className="bg-[#0b0f17] p-5 rounded-xl border border-indigo-500/20 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Tasa de Conversión</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">{conversionRate}%</div>
          <p className="text-xs text-slate-400 mt-1">{closedWon} ligas en estado Pagado/Activo</p>
        </div>

        <div className="bg-[#0b0f17] p-5 rounded-xl border border-indigo-500/20 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Canal Predilecto</span>
            <MessageCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">WhatsApp Directo</div>
          <p className="text-xs text-slate-400 mt-1">Conexión directa 1-clic con directivos</p>
        </div>
      </div>

      {/* FILTER BAR & CONTROLS */}
      <div className="bg-[#090d14] p-4 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por liga, directivo, ciudad o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#121824] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="bg-[#121824] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="ALL">Todas las Etapas</option>
              {Object.entries(STAGE_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>

            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="bg-[#121824] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="ALL">Todos los Deportes</option>
              <option value="FUTBOL">Fútbol</option>
              <option value="ECUAVOLEY">Ecuavoley</option>
              <option value="BALONCESTO">Baloncesto</option>
              <option value="PADEL">Pádel</option>
              <option value="FUTSAL">Fútsal</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#121824] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setViewMode('pipeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'pipeline' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tablero Pipeline
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'list' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Lista de Contactos
          </button>
        </div>
      </div>

      {/* PIPELINE KANBAN VIEW */}
      {viewMode === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {(Object.keys(STAGE_CONFIG) as CrmStage[]).map((stageKey) => {
            const stageLeads = filteredLeads.filter(l => l.stage === stageKey);
            const stageConfig = STAGE_CONFIG[stageKey];
            const stageTotalValue = stageLeads.reduce((acc, l) => acc + l.estimatedValueUsd, 0);

            return (
              <div
                key={stageKey}
                className="bg-[#090d14] rounded-2xl border border-white/10 p-3.5 flex flex-col h-full min-w-[260px] shadow-md"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/10">
                  <div>
                    <h3 className={`text-xs font-black uppercase tracking-wider ${stageConfig.color}`}>
                      {stageConfig.label}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ${stageTotalValue.toFixed(0)} USD
                    </span>
                  </div>
                  <span className="bg-white/10 text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded-full">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 flex-1">
                  {stageLeads.length === 0 ? (
                    <div className="text-center py-6 text-slate-600 text-xs italic">
                      Sin prospectos en esta etapa
                    </div>
                  ) : (
                    stageLeads.map((lead) => {
                      const theme = SPORT_THEMES[lead.sportCode] || SPORT_THEMES.FUTBOL;
                      return (
                        <div
                          key={lead.id}
                          className="bg-[#121824] hover:bg-[#161f30] border border-white/10 hover:border-indigo-500/50 rounded-xl p-3.5 transition-all shadow-sm group"
                        >
                          {/* Card Header: Sport & Priority */}
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${theme.badgeClass}`}>
                              <span>{theme.icon}</span>
                              <span>{theme.name}</span>
                            </span>
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                              lead.priority === 'ALTA' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                              lead.priority === 'MEDIA' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                              'bg-slate-700 text-slate-300'
                            }`}>
                              {lead.priority}
                            </span>
                          </div>

                          {/* Organization Name */}
                          <h4 className="text-sm font-black text-white group-hover:text-indigo-300 transition-colors">
                            {lead.organizationName}
                          </h4>

                          {/* Contact person */}
                          <div className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                            <span className="font-semibold">{lead.contactName}</span>
                            <span className="text-slate-500 text-[11px]">({lead.contactRole})</span>
                          </div>

                          <div className="text-[11px] text-slate-400 mt-1 font-medium">
                            📍 {lead.city}, {lead.country}
                          </div>

                          {/* Value & Plan */}
                          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                            <span className="text-emerald-400 font-mono font-bold">
                              ${lead.estimatedValueUsd} USD
                            </span>
                            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              {lead.planTier}
                            </span>
                          </div>

                          {/* Quick Actions: WhatsApp & Notes */}
                          <div className="mt-3 grid grid-cols-2 gap-1.5">
                            <a
                              href={generateWhatsAppLink(lead)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg py-1 px-2 text-[10px] font-bold transition-all"
                            >
                              <MessageCircle className="w-3 h-3" />
                              WhatsApp
                            </a>
                            <button
                              onClick={() => setActiveLeadForActivity(lead)}
                              className="inline-flex items-center justify-center gap-1 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-lg py-1 px-2 text-[10px] font-bold transition-all cursor-pointer"
                            >
                              <Clock className="w-3 h-3" />
                              Actividad ({lead.activities.length})
                            </button>
                          </div>

                          {/* Stage Transition Selector */}
                          <div className="mt-2 pt-2 border-t border-white/5">
                            <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">
                              Mover Etapa:
                            </label>
                            <select
                              value={lead.stage}
                              onChange={(e) => handleStageChange(lead.id, e.target.value as CrmStage)}
                              className="w-full bg-[#0d121c] border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-200 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
                            >
                              {Object.entries(STAGE_CONFIG).map(([k, cfg]) => (
                                <option key={k} value={k}>{cfg.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST DIRECTORY VIEW */}
      {viewMode === 'list' && (
        <div className="bg-[#090d14] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#121824] text-slate-400 font-bold border-b border-white/10 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Organización / Deporte</th>
                  <th className="py-3 px-4">Directivo Contacto</th>
                  <th className="py-3 px-4">Ubicación</th>
                  <th className="py-3 px-4">Etapa Pipeline</th>
                  <th className="py-3 px-4">Valor Estimado</th>
                  <th className="py-3 px-4">Prioridad</th>
                  <th className="py-3 px-4 text-right">Acciones Rápidas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLeads.map((lead) => {
                  const theme = SPORT_THEMES[lead.sportCode] || SPORT_THEMES.FUTBOL;
                  const stageConfig = STAGE_CONFIG[lead.stage];
                  return (
                    <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <span>{theme.icon}</span>
                          <div>
                            <div>{lead.organizationName}</div>
                            <span className="text-[10px] text-slate-400 font-normal">{lead.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">{lead.contactName}</div>
                        <div className="text-[10px] text-slate-500">{lead.contactRole}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {lead.city}, {lead.country}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${stageConfig.badgeBg} ${stageConfig.border}`}>
                          {stageConfig.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        ${lead.estimatedValueUsd.toFixed(2)} USD
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                          lead.priority === 'ALTA' ? 'bg-rose-500/20 text-rose-300' :
                          lead.priority === 'MEDIA' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-slate-700 text-slate-300'
                        }`}>
                          {lead.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <a
                            href={generateWhatsAppLink(lead)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg transition-colors"
                            title="Chat WhatsApp Directo"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => setActiveLeadForActivity(lead)}
                            className="px-2 py-1 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            Ver Notas
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: NUEVO LEAD DE LIGA */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e131f] border border-indigo-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-wider">
              <Plus className="w-4 h-4" />
              Nuevo Prospecto / Liga Comercial
            </div>
            <h3 className="text-xl font-black text-white">Registrar Liga en CRM</h3>

            <form onSubmit={handleCreateLead} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Nombre de Liga / Organización *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Liga San Roque"
                    value={newOrg}
                    onChange={(e) => setNewOrg(e.target.value)}
                    className="w-full bg-[#161f30] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Disciplina Deportiva *</label>
                  <select
                    value={newSport}
                    onChange={(e) => setNewSport(e.target.value as SportCode)}
                    className="w-full bg-[#161f30] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="FUTBOL">Fútbol 11</option>
                    <option value="ECUAVOLEY">Ecuavoley</option>
                    <option value="BALONCESTO">Baloncesto</option>
                    <option value="PADEL">Pádel</option>
                    <option value="FUTSAL">Fútsal / Indor</option>
                    <option value="VOLEIBOL">Voleibol</option>
                    <option value="BEISBOL">Béisbol</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Nombre Directivo / Contacto *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Ing. Roberto Gómez"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    className="w-full bg-[#161f30] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Cargo Directivo</label>
                  <input
                    type="text"
                    placeholder="Ej. Presidente / Tesorero"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-[#161f30] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="+593 9..."
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-[#161f30] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Ciudad / País</label>
                  <input
                    type="text"
                    placeholder="Quito, Ecuador"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full bg-[#161f30] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Valor Estimado ($ USD)</label>
                  <input
                    type="number"
                    value={newEstimatedValue}
                    onChange={(e) => setNewEstimatedValue(e.target.value)}
                    className="w-full bg-[#161f30] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Plan Proyectado</label>
                  <select
                    value={newPlanTier}
                    onChange={(e) => setNewPlanTier(e.target.value as any)}
                    className="w-full bg-[#161f30] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="LICENCIA_25">Licencia Anual ($25)</option>
                    <option value="BASIC_3">Plan Básico ($3/mes)</option>
                    <option value="PRO_5">Plan Pro ($5/mes)</option>
                    <option value="ENTERPRISE_8">Plan Enterprise ($8/mes)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Prioridad</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-[#161f30] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ALTA">Alta</option>
                    <option value="MEDIA">Media</option>
                    <option value="BAJA">Baja</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Notas de Oportunidad</label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre número de canchas, categorías, requerimientos especiales..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-[#161f30] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Guardar Prospecto en CRM
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: HISTORIAL DE ACTIVIDADES & NOTAS */}
      {activeLeadForActivity && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e131f] border border-indigo-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveLeadForActivity(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                Historial de Gestión
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                {activeLeadForActivity.organizationName}
              </h3>
              <p className="text-xs text-slate-400">
                Contacto: {activeLeadForActivity.contactName} ({activeLeadForActivity.phone})
              </p>
            </div>

            {/* Formulario de nueva actividad */}
            <form onSubmit={handleAddActivity} className="space-y-3 bg-[#121824] p-3.5 rounded-xl border border-white/10">
              <span className="text-xs font-bold text-white block">Registrar Nueva Interacción:</span>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value as any)}
                  className="bg-[#161f30] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="WHATSAPP">Mensaje WhatsApp</option>
                  <option value="LLAMADA">Llamada Telefónica</option>
                  <option value="DEMO">Demo Zoom / Meet</option>
                  <option value="EMAIL">Correo Formal</option>
                  <option value="PAGO_REGISTRADO">Pago Recibido</option>
                </select>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg py-1.5 px-3 transition-colors cursor-pointer"
                >
                  Guardar Nota
                </button>
              </div>
              <textarea
                rows={2}
                required
                placeholder="Resumen del acuerdo o respuesta del cliente..."
                value={activityNotes}
                onChange={(e) => setActivityNotes(e.target.value)}
                className="w-full bg-[#161f30] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </form>

            {/* Listado de actividades previas */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Historial de Actividades ({activeLeadForActivity.activities.length}):
              </span>
              {activeLeadForActivity.activities.map((act) => (
                <div key={act.id} className="bg-[#141b29] p-3 rounded-xl border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                      {act.type}
                    </span>
                    <span className="text-slate-500 font-mono">{act.date} • {act.agentName}</span>
                  </div>
                  <p className="text-xs text-slate-300">{act.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
