import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRightLeft, ShieldCheck, CheckCircle2, Clock, FileText,
  Printer, QrCode, Search, Filter, Plus, X, PenTool, AlertCircle,
  UserCheck, Trophy, Building2, ExternalLink, FileCheck2, User,
  DollarSign, Award, Sparkles, ChevronRight, Check
} from 'lucide-react';
import { Tenant, Sport, Team, Player, PlayerTransfer, TransferType, TransferStatus } from '../../types';
import { syncTransferToFirebase, fetchTransfersFromFirebase, subscribeToTransfers } from '../../services/firebaseService';

interface PlayerTransfersManagerProps {
  tenant: Tenant;
  sport?: Sport;
  teams: Team[];
  players: Player[];
  onPlayerTransferred?: (playerId: string, newTeamId: string, newJerseyNumber?: number) => void;
  onRequestTransferForPlayer?: Player | null;
  onCloseRequestModal?: () => void;
}

export const PlayerTransfersManager: React.FC<PlayerTransfersManagerProps> = ({
  tenant,
  sport,
  teams,
  players,
  onPlayerTransferred,
  onRequestTransferForPlayer,
  onCloseRequestModal
}) => {
  // Transfer state
  const [transfers, setTransfers] = useState<PlayerTransfer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [showNewTransferModal, setShowNewTransferModal] = useState<boolean>(false);
  const [showSignModal, setShowSignModal] = useState<boolean>(false);
  const [activeTransferForSign, setActiveTransferForSign] = useState<{
    transfer: PlayerTransfer;
    roleType: 'ORIGIN' | 'DESTINATION' | 'LEAGUE';
  } | null>(null);
  const [selectedCertificateTransfer, setSelectedCertificateTransfer] = useState<PlayerTransfer | null>(null);

  // Form states for new transfer
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  const [selectedDestinationTeamId, setSelectedDestinationTeamId] = useState<string>('');
  const [transferType, setTransferType] = useState<TransferType>('DEFINITIVO');
  const [transferFee, setTransferFee] = useState<number>(35);
  const [newJerseyNumber, setNewJerseyNumber] = useState<string>('');
  const [transferNotes, setTransferNotes] = useState<string>('');
  const [playerAgreed, setPlayerAgreed] = useState<boolean>(true);

  // Signature canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasSignatureDrawn, setHasSignatureDrawn] = useState<boolean>(false);
  const [signerName, setSignerName] = useState<string>('');
  const [signerComments, setSignerComments] = useState<string>('');
  const [resolutionCode, setResolutionCode] = useState<string>('');

  // Initial Seed & Subscription
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    const loadTransfers = async () => {
      setLoading(true);
      const cloudTransfers = await fetchTransfersFromFirebase(tenant.id);

      if (cloudTransfers && cloudTransfers.length > 0) {
        setTransfers(cloudTransfers);
      } else {
        // Generar trámites semilla iniciales demostrativos
        const teamA = teams[0] || { id: 'team-1', name: 'Barcelona S.C.' };
        const teamB = teams[1] || { id: 'team-2', name: 'Liga de Quito' };
        const teamC = teams[2] || { id: 'team-3', name: 'Aucas' };
        const p1 = players[0] || { id: 'p-1', full_name: 'Mateo Cárdenas', cedula: '1724890123', position: 'DEL', photo_url: '' };
        const p2 = players[1] || { id: 'p-2', full_name: 'Santiago Morales', cedula: '1719283746', position: 'MED', photo_url: '' };

        const seedTransfers: PlayerTransfer[] = [
          {
            id: 'tr-001',
            tenant_id: tenant.id,
            player_id: p1.id,
            player_name: p1.full_name,
            player_cedula: p1.cedula || '1724890123',
            player_photo: p1.photo_url,
            player_position: p1.position || 'DEL',
            origin_team_id: teamA.id,
            origin_team_name: teamA.name,
            destination_team_id: teamB.id,
            destination_team_name: teamB.name,
            transfer_type: 'DEFINITIVO',
            status: 'APROBADO',
            request_date: '2026-09-08T10:30:00Z',
            approval_date: '2026-09-10T16:45:00Z',
            transfer_fee: 50,
            origin_approval: {
              approved: true,
              approved_by: 'Carlos Benítez (Pdte. ' + teamA.name + ')',
              role: 'Presidente Club Cedente',
              approved_at: '2026-09-08T14:20:00Z',
              comments: 'Pase libre otorgado de mutuo acuerdo, sin deuda económica ni sanción pendiente.'
            },
            destination_approval: {
              approved: true,
              approved_by: 'Luis Fernando Vega (Delegado ' + teamB.name + ')',
              role: 'Delegado Club Cesionario',
              approved_at: '2026-09-09T11:10:00Z',
              comments: 'Aceptado en nómina oficial con dorsal #10 para la temporada 2026.'
            },
            league_approval: {
              approved: true,
              approved_by: 'Comisión de Calificaciones y Fichajes Deporverso',
              role: 'Secretaría General de la Liga',
              approved_at: '2026-09-10T16:45:00Z',
              comments: 'Revisado el expediente reglamentario, se expide habilitación definitiva y carnet QR actualizado.'
            },
            resolution_number: 'RES-2026-TR-042',
            certificate_code: 'CERT-DEP-2026-98214',
            new_jersey_number: 10,
            notes: 'Transferencia completada dentro del período ordinario de pases.'
          },
          {
            id: 'tr-002',
            tenant_id: tenant.id,
            player_id: p2.id,
            player_name: p2.full_name,
            player_cedula: p2.cedula || '1719283746',
            player_photo: p2.photo_url,
            player_position: p2.position || 'MED',
            origin_team_id: teamB.id,
            origin_team_name: teamB.name,
            destination_team_id: teamC.id,
            destination_team_name: teamC.name,
            transfer_type: 'PRESTAMO',
            status: 'PENDIENTE_LIGA',
            request_date: '2026-09-14T09:15:00Z',
            transfer_fee: 30,
            origin_approval: {
              approved: true,
              approved_by: 'Patricio Alvear (Secretario ' + teamB.name + ')',
              role: 'Directiva Club Origen',
              approved_at: '2026-09-14T17:00:00Z',
              comments: 'Préstamo acordado por el Torneo Apertura 2026.'
            },
            destination_approval: {
              approved: true,
              approved_by: 'Ramiro Játiva (Pdte. ' + teamC.name + ')',
              role: 'Directiva Club Receptor',
              approved_at: '2026-09-15T12:30:00Z',
              comments: 'Incorporación confirmada en nómina categoría Máxima.'
            },
            league_approval: {
              approved: false,
              role: 'Comisión Calificadora'
            },
            resolution_number: 'EN TRAMITE',
            new_jersey_number: 8,
            notes: 'Pendiente de dictamen final de la Comisión de la Liga en reunión de delegados.'
          }
        ];

        setTransfers(seedTransfers);
        seedTransfers.forEach(t => syncTransferToFirebase(t));
      }
      setLoading(false);
    };

    loadTransfers();

    // Subscribe to Firestore updates
    unsubscribe = subscribeToTransfers(tenant.id, (cloudData) => {
      if (cloudData && cloudData.length > 0) {
        setTransfers(cloudData);
      }
    });

    return () => unsubscribe();
  }, [tenant.id, teams, players]);

  // If a player was passed from outside to initiate transfer
  useEffect(() => {
    if (onRequestTransferForPlayer) {
      setSelectedPlayerId(onRequestTransferForPlayer.id);
      const currentTeam = teams.find(t => t.id === onRequestTransferForPlayer.team_id);
      const remainingTeams = teams.filter(t => t.id !== onRequestTransferForPlayer.team_id);
      if (remainingTeams.length > 0) {
        setSelectedDestinationTeamId(remainingTeams[0].id);
      }
      setShowNewTransferModal(true);
    }
  }, [onRequestTransferForPlayer, teams]);

  // Selected player object
  const selectedPlayer = players.find(p => p.id === selectedPlayerId);
  const originTeamOfSelectedPlayer = teams.find(t => t.id === selectedPlayer?.team_id);

  // Filtered transfers list
  const filteredTransfers = transfers.filter(t => {
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    const matchesType = filterType === 'ALL' || t.transfer_type === filterType;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      t.player_name.toLowerCase().includes(query) ||
      t.origin_team_name.toLowerCase().includes(query) ||
      t.destination_team_name.toLowerCase().includes(query) ||
      (t.player_cedula && t.player_cedula.includes(query)) ||
      (t.resolution_number && t.resolution_number.toLowerCase().includes(query));

    return matchesStatus && matchesType && matchesSearch;
  });

  // KPI Metrics
  const totalCount = transfers.length;
  const approvedCount = transfers.filter(t => t.status === 'APROBADO').length;
  const pendingCount = transfers.filter(t => t.status.startsWith('PENDIENTE')).length;

  // Handle Canvas Drawing for Signature
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignatureDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.strokeStyle = '#00ffcc';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignatureDrawn(false);
  };

  // Open Sign Modal
  const handleOpenSignModal = (transfer: PlayerTransfer, roleType: 'ORIGIN' | 'DESTINATION' | 'LEAGUE') => {
    setActiveTransferForSign({ transfer, roleType });
    setSignerName(
      roleType === 'ORIGIN' ? `Presidente ${transfer.origin_team_name}` :
      roleType === 'DESTINATION' ? `Directiva ${transfer.destination_team_name}` :
      'Secretaría de Calificaciones Deporverso'
    );
    setSignerComments(
      roleType === 'ORIGIN' ? 'Se concede visto bueno formal de pase sin objeciones.' :
      roleType === 'DESTINATION' ? 'Confirmamos recepción del jugador e inclusión en lista de buena fe.' :
      'Expediente conforme a estatutos. Se autoriza la habilitación oficial en el sistema.'
    );
    setResolutionCode(`RES-2026-TR-${Math.floor(100 + Math.random() * 900)}`);
    setShowSignModal(true);
    setHasSignatureDrawn(false);
  };

  // Submit Approval Signature
  const handleSubmitApproval = async () => {
    if (!activeTransferForSign) return;
    const { transfer, roleType } = activeTransferForSign;

    const now = new Date().toISOString();
    const signatureImage = canvasRef.current ? canvasRef.current.toDataURL('image/png') : '';

    const updated: PlayerTransfer = { ...transfer };

    if (roleType === 'ORIGIN') {
      updated.origin_approval = {
        approved: true,
        approved_by: signerName,
        role: 'Club Cedente',
        approved_at: now,
        signature_data: signatureImage,
        comments: signerComments
      };
      // Pasa al siguiente escalón
      updated.status = updated.destination_approval.approved ? 'PENDIENTE_LIGA' : 'PENDIENTE_DESTINO';
    } else if (roleType === 'DESTINATION') {
      updated.destination_approval = {
        approved: true,
        approved_by: signerName,
        role: 'Club Cesionario',
        approved_at: now,
        signature_data: signatureImage,
        comments: signerComments
      };
      updated.status = 'PENDIENTE_LIGA';
    } else if (roleType === 'LEAGUE') {
      updated.league_approval = {
        approved: true,
        approved_by: signerName,
        role: 'Comisión de Calificaciones',
        approved_at: now,
        signature_data: signatureImage,
        comments: signerComments
      };
      updated.status = 'APROBADO';
      updated.approval_date = now;
      updated.resolution_number = resolutionCode || `RES-2026-TR-${Math.floor(100 + Math.random() * 900)}`;
      updated.certificate_code = `CERT-DEP-2026-${Math.floor(10000 + Math.random() * 90000)}`;

      // EJECUTAR TRANSFERENCIA ATÓMICA EN EL JUGADOR
      if (onPlayerTransferred) {
        onPlayerTransferred(
          transfer.player_id, 
          transfer.destination_team_id, 
          transfer.new_jersey_number
        );
      }
    }

    // Persist
    await syncTransferToFirebase(updated);

    // Update state locally
    setTransfers(prev => prev.map(t => t.id === updated.id ? updated : t));
    setShowSignModal(false);
    setActiveTransferForSign(null);

    // Si fue aprobado por la liga, sugerir ver el certificado
    if (roleType === 'LEAGUE') {
      setSelectedCertificateTransfer(updated);
    }
  };

  // Create New Transfer Request
  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayer || !selectedDestinationTeamId) {
      alert('Por favor selecciona un jugador y el club de destino.');
      return;
    }

    const destinationTeam = teams.find(t => t.id === selectedDestinationTeamId);
    if (!destinationTeam) return;

    if (destinationTeam.id === selectedPlayer.team_id) {
      alert('El club de destino debe ser diferente al club actual del jugador.');
      return;
    }

    const newTransfer: PlayerTransfer = {
      id: `tr-${Date.now()}`,
      tenant_id: tenant.id,
      player_id: selectedPlayer.id,
      player_name: selectedPlayer.full_name,
      player_cedula: selectedPlayer.cedula || '1700000000',
      player_photo: selectedPlayer.photo_url,
      player_position: selectedPlayer.position || 'MED',
      origin_team_id: selectedPlayer.team_id || 'unassigned',
      origin_team_name: originTeamOfSelectedPlayer?.name || 'Club Libre / Sin Asignar',
      destination_team_id: destinationTeam.id,
      destination_team_name: destinationTeam.name,
      transfer_type: transferType,
      status: transferType === 'LIBRE' ? 'PENDIENTE_DESTINO' : 'PENDIENTE_ORIGEN',
      request_date: new Date().toISOString(),
      transfer_fee: transferFee,
      new_jersey_number: newJerseyNumber ? parseInt(newJerseyNumber) : undefined,
      origin_approval: {
        approved: transferType === 'LIBRE',
        role: 'Club Origen',
        comments: transferType === 'LIBRE' ? 'Jugador en condición de pase libre reglamentario.' : undefined
      },
      destination_approval: {
        approved: false,
        role: 'Club Destino'
      },
      league_approval: {
        approved: false,
        role: 'Comisión de Calificaciones'
      },
      notes: transferNotes || `Solicitud tramitada digitalmente por portal ${tenant.name}.`
    };

    await syncTransferToFirebase(newTransfer);
    setTransfers(prev => [newTransfer, ...prev]);
    setShowNewTransferModal(false);
    if (onCloseRequestModal) onCloseRequestModal();

    // Reset fields
    setSelectedPlayerId('');
    setSelectedDestinationTeamId('');
    setTransferNotes('');
  };

  return (
    <div className="space-y-6">
      {/* ==================== HEADER INSTITUCIONAL ==================== */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-white/10 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 font-mono">
                <ArrowRightLeft className="w-3 h-3 text-cyan-400" /> Libro Oficial de Pases & Habilitaciones
              </span>
              <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono">
                Triple Visto Bueno Digital
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              Gestión y Registro Digital de Transferencias de Jugadores
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl font-normal leading-relaxed">
              Trámite 100% digital con visto bueno del club cedente, aceptación del club cesionario y dictamen de la Comisión de Calificaciones de la Liga. Al ser aprobado, actualiza automáticamente la nómina del club y el carnet con código QR.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedPlayerId(players[0]?.id || '');
                if (teams.length > 1) setSelectedDestinationTeamId(teams[1].id);
                setShowNewTransferModal(true);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Solicitud de Pase</span>
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-5">
          <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-3.5">
            <span className="text-[11px] text-slate-400 font-medium block">Total Trámites Registrados</span>
            <span className="text-2xl font-black text-white font-mono mt-0.5 block">{totalCount}</span>
          </div>
          <div className="bg-slate-950/70 border border-amber-500/20 rounded-2xl p-3.5">
            <span className="text-[11px] text-amber-300/80 font-medium block">En Trámite / Firmas</span>
            <span className="text-2xl font-black text-amber-400 font-mono mt-0.5 block">{pendingCount}</span>
          </div>
          <div className="bg-slate-950/70 border border-emerald-500/20 rounded-2xl p-3.5">
            <span className="text-[11px] text-emerald-300/80 font-medium block">Pases Oficializados</span>
            <span className="text-2xl font-black text-emerald-400 font-mono mt-0.5 block">{approvedCount}</span>
          </div>
          <div className="bg-slate-950/70 border border-cyan-500/20 rounded-2xl p-3.5">
            <span className="text-[11px] text-cyan-300/80 font-medium block">Aranceles Recaudados</span>
            <span className="text-2xl font-black text-cyan-400 font-mono mt-0.5 block">
              ${transfers.filter(t => t.status === 'APROBADO').reduce((acc, t) => acc + (t.transfer_fee || 0), 0)}
            </span>
          </div>
        </div>
      </div>

      {/* ==================== BARRA DE BÚSQUEDA Y FILTROS ==================== */}
      <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por jugador, club, cédula o resolución..."
            className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition-colors font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Filtro Estado */}
          <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-white/10 text-xs">
            <span className="text-[10px] text-slate-400 px-2 font-mono uppercase font-bold">Estado:</span>
            {[
              { id: 'ALL', label: 'Todos' },
              { id: 'PENDIENTE_ORIGEN', label: 'Club Origen' },
              { id: 'PENDIENTE_DESTINO', label: 'Club Destino' },
              { id: 'PENDIENTE_LIGA', label: 'Dictamen Liga' },
              { id: 'APROBADO', label: 'Aprobados' }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setFilterStatus(st.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  filterStatus === st.id
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Filtro Modalidad */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-950/60 border border-white/10 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="ALL">Todas las Modalidades</option>
            <option value="DEFINITIVO">Pase Definitivo</option>
            <option value="PRESTAMO">Préstamo Temporal</option>
            <option value="LIBRE">Jugador Libre</option>
            <option value="INTERLIGA">Inter-Ligas</option>
          </select>
        </div>
      </div>

      {/* ==================== LISTA DE TRANSFERENCIAS & TRÁMITES ==================== */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <Clock className="w-8 h-8 animate-spin mx-auto text-cyan-400 mb-2" />
          <p className="text-xs">Sincronizando trámites con Firestore...</p>
        </div>
      ) : filteredTransfers.length === 0 ? (
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-12 text-center space-y-3">
          <ArrowRightLeft className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">No se encontraron trámites de pases con este filtro</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Puedes iniciar una nueva solicitud de transferencia para cualquier jugador habilitado en la liga.
          </p>
          <button
            onClick={() => setShowNewTransferModal(true)}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            Crear Solicitud de Pase
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTransfers.map((tr) => {
            const isApproved = tr.status === 'APROBADO';
            const originApproved = tr.origin_approval?.approved;
            const destApproved = tr.destination_approval?.approved;
            const leagueApproved = tr.league_approval?.approved;

            return (
              <div
                key={tr.id}
                className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all p-5 sm:p-6 space-y-5 shadow-lg relative overflow-hidden"
              >
                {/* TOP BAR OF TRANSFER CARD */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 border border-white/10 flex items-center justify-center font-bold text-white text-base font-mono shrink-0">
                      {tr.player_photo ? (
                        <img src={tr.player_photo} alt={tr.player_name} className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        <User className="w-5 h-5 text-cyan-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-white">{tr.player_name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                          {tr.player_position || 'JUGADOR'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          CI: {tr.player_cedula || '17...'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                        <span>Trámite #{tr.id}</span>
                        <span>•</span>
                        <span>Solicitado: {new Date(tr.request_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold px-3 py-1 rounded-xl border flex items-center gap-1.5 ${
                      tr.transfer_type === 'DEFINITIVO' ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' :
                      tr.transfer_type === 'PRESTAMO' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                      'bg-purple-500/10 text-purple-300 border-purple-500/30'
                    }`}>
                      {tr.transfer_type === 'DEFINITIVO' && 'Pase Definitivo'}
                      {tr.transfer_type === 'PRESTAMO' && 'Préstamo de Temporada'}
                      {tr.transfer_type === 'LIBRE' && 'Pase Libre'}
                      {tr.transfer_type === 'INTERLIGA' && 'Pase Inter-Liga'}
                    </span>

                    <span className={`text-xs font-bold px-3 py-1 rounded-xl border flex items-center gap-1.5 ${
                      isApproved ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' :
                      tr.status === 'RECHAZADO' ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' :
                      'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}>
                      {isApproved ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Habilitado Oficialmente</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          <span>
                            {tr.status === 'PENDIENTE_ORIGEN' && 'Falta Visto Bueno Origen'}
                            {tr.status === 'PENDIENTE_DESTINO' && 'Falta Aceptación Destino'}
                            {tr.status === 'PENDIENTE_LIGA' && 'Falta Dictamen de Liga'}
                          </span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* TRANSFER TEAMS BRIDGE */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center bg-slate-950/60 p-4 rounded-2xl border border-white/5">
                  {/* Origin Team */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {tr.origin_team_name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono block font-medium">Club Cedente (Origen)</span>
                      <span className="text-sm font-bold text-white">{tr.origin_team_name}</span>
                    </div>
                  </div>

                  {/* Bridge Indicator */}
                  <div className="flex flex-col items-center justify-center text-center py-1">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                      <span>Traspaso</span>
                      <ArrowRightLeft className="w-4 h-4" />
                      <span>{tr.transfer_fee ? `$${tr.transfer_fee} USD` : 'Sin Costo'}</span>
                    </div>
                    {tr.new_jersey_number && (
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">Dorsal Asignado: #{tr.new_jersey_number}</span>
                    )}
                  </div>

                  {/* Destination Team */}
                  <div className="flex items-center gap-3 md:justify-end">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block font-medium">Club Cesionario (Destino)</span>
                      <span className="text-sm font-bold text-emerald-300">{tr.destination_team_name}</span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-300 shrink-0">
                      {tr.destination_team_name.charAt(0)}
                    </div>
                  </div>
                </div>

                {/* STEPPER: 3-TIER APPROVAL FLOW */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 font-mono uppercase tracking-wider block">
                    Secuencia de Vistos Buenos y Resolución Reglamentaria:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* 1. Origin Approval */}
                    <div className={`p-3.5 rounded-xl border transition-all ${
                      originApproved ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' :
                      tr.status === 'PENDIENTE_ORIGEN' ? 'bg-amber-950/20 border-amber-500/40 text-amber-300' :
                      'bg-slate-950/40 border-white/5 text-slate-400'
                    }`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold flex items-center gap-1.5">
                          {originApproved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4 text-amber-400" />}
                          1. Club Origen
                        </span>
                        <span className="text-[10px] font-mono opacity-80">
                          {originApproved ? 'FIRMADO' : 'PENDIENTE'}
                        </span>
                      </div>
                      <p className="text-[11px] opacity-90 line-clamp-2">
                        {originApproved ? tr.origin_approval.approved_by || 'Visto bueno concedido' : 'Requiere carta de no adeudo / firma'}
                      </p>
                      {!originApproved && (
                        <button
                          onClick={() => handleOpenSignModal(tr, 'ORIGIN')}
                          className="mt-2.5 w-full py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <PenTool className="w-3 h-3" /> Firmar Visto Bueno
                        </button>
                      )}
                    </div>

                    {/* 2. Destination Approval */}
                    <div className={`p-3.5 rounded-xl border transition-all ${
                      destApproved ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' :
                      tr.status === 'PENDIENTE_DESTINO' ? 'bg-amber-950/20 border-amber-500/40 text-amber-300' :
                      'bg-slate-950/40 border-white/5 text-slate-400'
                    }`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold flex items-center gap-1.5">
                          {destApproved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4 text-amber-400" />}
                          2. Club Destino
                        </span>
                        <span className="text-[10px] font-mono opacity-80">
                          {destApproved ? 'FIRMADO' : 'PENDIENTE'}
                        </span>
                      </div>
                      <p className="text-[11px] opacity-90 line-clamp-2">
                        {destApproved ? tr.destination_approval.approved_by || 'Cupo aceptado en nómina' : 'Pendiente de aceptación de directiva'}
                      </p>
                      {originApproved && !destApproved && (
                        <button
                          onClick={() => handleOpenSignModal(tr, 'DESTINATION')}
                          className="mt-2.5 w-full py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <PenTool className="w-3 h-3" /> Aceptar Fichaje
                        </button>
                      )}
                    </div>

                    {/* 3. League Committee Resolution */}
                    <div className={`p-3.5 rounded-xl border transition-all ${
                      leagueApproved ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' :
                      tr.status === 'PENDIENTE_LIGA' ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-300' :
                      'bg-slate-950/40 border-white/5 text-slate-400'
                    }`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold flex items-center gap-1.5">
                          {leagueApproved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4 text-cyan-400" />}
                          3. Comisión Liga
                        </span>
                        <span className="text-[10px] font-mono opacity-80">
                          {leagueApproved ? 'HABILITADO' : 'EN ESPERA'}
                        </span>
                      </div>
                      <p className="text-[11px] opacity-90 line-clamp-2">
                        {leagueApproved ? `${tr.resolution_number || 'Resolución Emitida'}` : 'Comisión Calificadora'}
                      </p>
                      {originApproved && destApproved && !leagueApproved && (
                        <button
                          onClick={() => handleOpenSignModal(tr, 'LEAGUE')}
                          className="mt-2.5 w-full py-1.5 bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20"
                        >
                          <ShieldCheck className="w-3 h-3" /> Dictaminar & Habilitar
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* FOOTER ACTION BUTTONS */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs">
                  <div className="text-slate-400 text-[11px] flex items-center gap-2">
                    <span>Certificado QR:</span>
                    <span className="font-mono text-cyan-300 font-semibold">{tr.certificate_code || 'Por asignar'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedCertificateTransfer(tr)}
                      className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Ver Ficha Oficial de Pase</span>
                    </button>

                    {isApproved && (
                      <button
                        onClick={() => setSelectedCertificateTransfer(tr)}
                        className="px-3.5 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Imprimir Carnet Habilitado</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ==================== MODAL DE NUEVA SOLICITUD DE TRANSFERENCIA ==================== */}
      {showNewTransferModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0b121e] border border-white/15 rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 p-0.5">
                  <div className="w-full h-full bg-[#0b121e] rounded-[10px] flex items-center justify-center">
                    <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Solicitud de Transferencia y Pase</h3>
                  <p className="text-xs text-slate-400">Trámite federativo para cambio de club oficial</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowNewTransferModal(false);
                  if (onCloseRequestModal) onCloseRequestModal();
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTransfer} className="space-y-4">
              {/* Seleccionar Jugador */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Jugador Solicitante:</span>
                  {selectedPlayer && (
                    <span className="text-[11px] text-cyan-400 font-mono">
                      Club Actual: {originTeamOfSelectedPlayer?.name || 'Libre'}
                    </span>
                  )}
                </label>
                <select
                  value={selectedPlayerId}
                  onChange={(e) => setSelectedPlayerId(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="">Selecciona un jugador...</option>
                  {players.map((p) => {
                    const pTeam = teams.find(t => t.id === p.team_id);
                    return (
                      <option key={p.id} value={p.id}>
                        {p.full_name} ({p.position || 'JUG'} — {pTeam?.name || 'Libre'}) — CI: {p.cedula || 'N/A'}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Club Destino */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Club de Destino (Cesionario):</label>
                <select
                  value={selectedDestinationTeamId}
                  onChange={(e) => setSelectedDestinationTeamId(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="">Selecciona el club que incorpora...</option>
                  {teams.filter(t => t.id !== selectedPlayer?.team_id).map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.city || 'Liga Local'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Modalidad y Arancel */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300">Modalidad de Pase:</label>
                  <select
                    value={transferType}
                    onChange={(e) => setTransferType(e.target.value as TransferType)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="DEFINITIVO">Pase Definitivo (Carta de Libertad)</option>
                    <option value="PRESTAMO">Préstamo por 1 Temporada</option>
                    <option value="LIBRE">Pase Libre por Inactividad Reglamentaria</option>
                    <option value="INTERLIGA">Transferencia Inter-Ligas</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Arancel ($ USD):</label>
                  <input
                    type="number"
                    min="0"
                    value={transferFee}
                    onChange={(e) => setTransferFee(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              {/* Dorsal Deseado y Consentimiento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Dorsal en Nuevo Club:</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    placeholder="Ej. 10"
                    value={newJerseyNumber}
                    onChange={(e) => setNewJerseyNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={playerAgreed}
                    onChange={(e) => setPlayerAgreed(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500/20"
                  />
                  <label htmlFor="consent" className="text-xs text-slate-300 cursor-pointer">
                    Consentimiento expreso firmado por el jugador
                  </label>
                </div>
              </div>

              {/* Observaciones */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Observaciones reglamentarias:</label>
                <textarea
                  rows={2}
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  placeholder="Detalles sobre acuerdo entre clubes, constancia de paz y salvo o antecedentes..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowNewTransferModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!playerAgreed}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  Radicar Solicitud Oficial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL DE FIRMA DIGITAL & VISTO BUENO ==================== */}
      {showSignModal && activeTransferForSign && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0b121e] border border-white/15 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <PenTool className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    {activeTransferForSign.roleType === 'ORIGIN' && 'Visto Bueno — Club Cedente'}
                    {activeTransferForSign.roleType === 'DESTINATION' && 'Aceptación de Fichaje — Club Cesionario'}
                    {activeTransferForSign.roleType === 'LEAGUE' && 'Dictamen Oficial — Comisión de Calificaciones'}
                  </h3>
                  <p className="text-xs text-slate-400">Pase de {activeTransferForSign.transfer.player_name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowSignModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Nombre del Responsable / Firmante:</label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {activeTransferForSign.roleType === 'LEAGUE' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Número de Resolución Oficial:</label>
                  <input
                    type="text"
                    value={resolutionCode}
                    onChange={(e) => setResolutionCode(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Comentarios o Fundamentación:</label>
                <textarea
                  rows={2}
                  value={signerComments}
                  onChange={(e) => setSignerComments(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Interactive Signature Canvas */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Lienzo de Firma Digital (Dibuja con ratón o touch):</span>
                  </label>
                  {hasSignatureDrawn && (
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="text-[11px] text-rose-400 hover:text-rose-300 underline"
                    >
                      Limpiar Firma
                    </button>
                  )}
                </div>

                <div className="bg-slate-950 border border-white/15 rounded-xl p-1 relative">
                  <canvas
                    ref={canvasRef}
                    width={440}
                    height={120}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-28 bg-[#050b14] rounded-lg cursor-crosshair touch-none"
                  />
                  {!hasSignatureDrawn && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-slate-500">
                      Dibuja tu firma digital aquí
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowSignModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmitApproval}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                >
                  Registrar Firma Oficial
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== CERTIFICADO OFICIAL DE HABILITACIÓN (MODAL & PRINTABLE) ==================== */}
      {selectedCertificateTransfer && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-bold text-white">Certificado Oficial de Habilitación y Transferencia</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-cyan-500/30 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Certificado</span>
                </button>
                <button
                  onClick={() => setSelectedCertificateTransfer(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CERTIFICADO BODY (ESTILO DOCUMENTAL OFICIAL) */}
            <div className="bg-white text-slate-950 p-6 sm:p-8 rounded-2xl shadow-inner space-y-6 font-sans border-2 border-slate-300">
              {/* Membrete Oficial */}
              <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                <span className="text-[11px] font-mono tracking-widest text-slate-600 uppercase font-bold block">
                  REPÚBLICA DEL ECUADOR • FEDERACIÓN DEPORTIVA
                </span>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 uppercase">
                  {tenant.name || 'LIGA DEPORTIVA BARRIAL Y PARROQUIAL'}
                </h1>
                <p className="text-xs font-medium text-slate-600">
                  COMISIÓN TÉCNICA, CALIFICACIONES Y LIBRO DE PASES DIGITAL
                </p>
                <div className="pt-2 flex items-center justify-center gap-4 text-[11px] font-mono text-slate-700">
                  <span>Resolución: <strong>{selectedCertificateTransfer.resolution_number || 'EN TRAMITE'}</strong></span>
                  <span>•</span>
                  <span>Código Único: <strong>{selectedCertificateTransfer.certificate_code || 'PENDIENTE'}</strong></span>
                </div>
              </div>

              {/* Título Central */}
              <div className="text-center py-1">
                <span className="text-sm font-black uppercase tracking-wider bg-slate-100 border border-slate-300 px-4 py-1.5 rounded-full inline-block">
                  CONSTANCIA DE HABILITACIÓN Y PASE DE DEPORTISTA
                </span>
              </div>

              {/* Cuerpo del Documento */}
              <div className="text-xs leading-relaxed text-slate-800 space-y-3">
                <p>
                  Por medio del presente instrumento, la <strong>Secretaría de Calificaciones de {tenant.name}</strong> certifica que el deportista:
                </p>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-lg font-mono shrink-0 overflow-hidden">
                    {selectedCertificateTransfer.player_photo ? (
                      <img src={selectedCertificateTransfer.player_photo} alt={selectedCertificateTransfer.player_name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                    <div><span className="text-slate-500">Nombre Completo:</span> <strong className="text-slate-950 block">{selectedCertificateTransfer.player_name}</strong></div>
                    <div><span className="text-slate-500">Cédula de Identidad:</span> <strong className="text-slate-950 block font-mono">{selectedCertificateTransfer.player_cedula || '17...'}</strong></div>
                    <div><span className="text-slate-500">Posición / Función:</span> <strong className="text-slate-950 block">{selectedCertificateTransfer.player_position || 'DEL'}</strong></div>
                    <div><span className="text-slate-500">Dorsal Oficial:</span> <strong className="text-slate-950 block font-mono">#{selectedCertificateTransfer.new_jersey_number || '0'}</strong></div>
                  </div>
                </div>

                <p>
                  Ha cumplido satisfactoriamente los requisitos reglamentarios para el traspaso en calidad de <strong>{selectedCertificateTransfer.transfer_type}</strong> desde el club cedente <strong>{selectedCertificateTransfer.origin_team_name}</strong> hacia el club cesionario <strong>{selectedCertificateTransfer.destination_team_name}</strong>.
                </p>
                <p className="text-[11px] text-slate-600">
                  El jugador queda habilitado en la plataforma informática Deporverso para disputar los encuentros oficiales del calendario regular a partir de la presente fecha.
                </p>
              </div>

              {/* Cuadro de Firmas y Validación QR */}
              <div className="pt-4 border-t border-slate-300 grid grid-cols-3 gap-3 text-center">
                {/* Firma 1 */}
                <div className="space-y-1">
                  <div className="h-12 flex items-center justify-center border-b border-dashed border-slate-400">
                    <span className="text-[10px] font-serif italic text-slate-600">
                      {selectedCertificateTransfer.origin_approval?.approved ? '✓ Firma Digital Club Cedente' : 'Pendiente'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold block text-slate-800">CLUB CEDENTE</span>
                  <span className="text-[9px] text-slate-500 block truncate">{selectedCertificateTransfer.origin_team_name}</span>
                </div>

                {/* Firma 2 */}
                <div className="space-y-1">
                  <div className="h-12 flex items-center justify-center border-b border-dashed border-slate-400">
                    <span className="text-[10px] font-serif italic text-slate-600">
                      {selectedCertificateTransfer.destination_approval?.approved ? '✓ Firma Digital Club Cesionario' : 'Pendiente'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold block text-slate-800">CLUB CESIONARIO</span>
                  <span className="text-[9px] text-slate-500 block truncate">{selectedCertificateTransfer.destination_team_name}</span>
                </div>

                {/* Firma 3 y Sello */}
                <div className="space-y-1">
                  <div className="h-12 flex items-center justify-center border-b border-dashed border-slate-400">
                    <span className="text-[10px] font-serif italic text-emerald-700 font-bold">
                      {selectedCertificateTransfer.league_approval?.approved ? '✓ SELLO COMISIÓN LIGA' : 'En Dictamen'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold block text-slate-800">SECRETARÍA DE LIGA</span>
                  <span className="text-[9px] text-slate-500 block">Deporverso Verified</span>
                </div>
              </div>

              {/* QR Code Bar */}
              <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-300 flex items-center justify-between text-[10px] font-mono text-slate-600">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-slate-900" />
                  <span>Validación Criptográfica QR: deporverso.app/verify/{selectedCertificateTransfer.certificate_code}</span>
                </div>
                <span>Validez: Temporada 2026</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
