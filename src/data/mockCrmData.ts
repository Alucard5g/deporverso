import { CrmLead } from '../types';

export const INITIAL_CRM_LEADS: CrmLead[] = [
  {
    id: 'crm-1',
    organizationName: 'Liga Parroquial Calderón',
    contactName: 'Carlos M. Morales',
    contactRole: 'Presidente de Liga',
    email: 'carlos.morales@ligacalderon.ec',
    phone: '+593987654321',
    sportCode: 'FUTBOL',
    country: 'Ecuador',
    city: 'Quito',
    stage: 'EN_NEGOCIACION',
    estimatedValueUsd: 125.00,
    planTier: 'PRO_5',
    priority: 'ALTA',
    nextFollowUpDate: '2026-09-10',
    notes: 'Interesados en la Vocalía Digital PWA y el generador de crónicas IA. Tienen 32 equipos en primera categoría.',
    activities: [
      {
        id: 'act-1',
        type: 'DEMO',
        date: '2026-09-05',
        notes: 'Demostración en vivo de la mesa de control y cédula digital ante el directorio de la liga.',
        agentName: 'SEO-Agent CIG'
      },
      {
        id: 'act-2',
        type: 'WHATSAPP',
        date: '2026-09-06',
        notes: 'Se envió propuesta formal del plan PRO $5/mes con subdominio calderon.deporverso.com',
        agentName: 'Soporte Comercial'
      }
    ],
    createdAt: '2026-09-01'
  },
  {
    id: 'crm-2',
    organizationName: 'Circuito Pádel Golden Indoor',
    contactName: 'Valeria Rivas',
    contactRole: 'Directora de Torneos',
    email: 'torneos@padelgolden.com',
    phone: '+593991234567',
    sportCode: 'PADEL',
    country: 'Ecuador',
    city: 'Cumbayá',
    stage: 'PAGADO_ACTIVO',
    estimatedValueUsd: 96.00,
    planTier: 'ENTERPRISE_8',
    priority: 'ALTA',
    nextFollowUpDate: '2026-10-01',
    notes: 'Licencia anual de $25 USD pagada con Stripe. Subdominio padelgolden.deporverso.com activo.',
    activities: [
      {
        id: 'act-3',
        type: 'PAGO_REGISTRADO',
        date: '2026-09-04',
        notes: 'Pago completado con éxito de tarifa de onboarding $25 USD + Plan Anual.',
        agentName: 'Sistema Automático'
      }
    ],
    createdAt: '2026-08-28'
  },
  {
    id: 'crm-3',
    organizationName: 'Torneo Nacional Ecuavoley El Chota',
    contactName: 'Manuel Chalá',
    contactRole: 'Coordinador General',
    email: 'manuel.chala@ecuavoleypro.ec',
    phone: '+593984321098',
    sportCode: 'ECUAVOLEY',
    country: 'Ecuador',
    city: 'Ibarra',
    stage: 'DEMO_AGENDADA',
    estimatedValueUsd: 60.00,
    planTier: 'PRO_5',
    priority: 'ALTA',
    nextFollowUpDate: '2026-09-09',
    notes: 'Requieren reglas de Ecuavoley (15 puntos por cambio, colocador y volador). Gran entusiasmo por la transmisión en vivo.',
    activities: [
      {
        id: 'act-4',
        type: 'LLAMADA',
        date: '2026-09-06',
        notes: 'Llamada telefónica acordando demo por Google Meet para este miércoles a las 19:00.',
        agentName: 'SEO-Agent CIG'
      }
    ],
    createdAt: '2026-09-03'
  },
  {
    id: 'crm-4',
    organizationName: 'Asociación de Fútsal Metropolitano',
    contactName: 'Diego Alvear',
    contactRole: 'Secretario Técnico',
    email: 'futsal.metro@deportes.org',
    phone: '+573109876543',
    sportCode: 'FUTSAL',
    country: 'Colombia',
    city: 'Bogotá',
    stage: 'CONTACTADO',
    estimatedValueUsd: 85.00,
    planTier: 'PRO_5',
    priority: 'MEDIA',
    nextFollowUpDate: '2026-09-12',
    notes: 'Pidieron información de la función VAR A la Carta y conteo de faltas acumulativas.',
    activities: [
      {
        id: 'act-5',
        type: 'WHATSAPP',
        date: '2026-09-07',
        notes: 'Se compartieron videos tutoriales del módulo VAR en celulares y tablets.',
        agentName: 'Soporte Comercial'
      }
    ],
    createdAt: '2026-09-05'
  },
  {
    id: 'crm-5',
    organizationName: 'Liga Intercolegial de Baloncesto Andina',
    contactName: 'Patricia Guzmán',
    contactRole: 'Presidenta del Comité Técnico',
    email: 'patricia@intercolegialbasket.edu.ec',
    phone: '+593976543210',
    sportCode: 'BALONCESTO',
    country: 'Ecuador',
    city: 'Ambato',
    stage: 'NUEVO_LEAD',
    estimatedValueUsd: 50.00,
    planTier: 'BASIC_3',
    priority: 'MEDIA',
    nextFollowUpDate: '2026-09-11',
    notes: 'Registraron formulario web solicitando cotización para 18 colegios afiliados.',
    activities: [],
    createdAt: '2026-09-07'
  },
  {
    id: 'crm-6',
    organizationName: 'Club Deportivo & Social Oriente',
    contactName: 'Jorge Zambrano',
    contactRole: 'Tesorero',
    email: 'oriente.club@gmail.com',
    phone: '+593985551234',
    sportCode: 'FUTBOL',
    country: 'Ecuador',
    city: 'Puyo',
    stage: 'RENOVACION',
    estimatedValueUsd: 25.00,
    planTier: 'BASIC_3',
    priority: 'BAJA',
    nextFollowUpDate: '2026-09-15',
    notes: 'Licencia anual próxima a vencer en 30 días. Requiere enlace de pago de renovación de $25 USD.',
    activities: [
      {
        id: 'act-6',
        type: 'EMAIL',
        date: '2026-09-02',
        notes: 'Notificación automática de renovación de subdominio oriente.deporverso.com enviada.',
        agentName: 'Sistema Automático'
      }
    ],
    createdAt: '2025-09-15'
  }
];
