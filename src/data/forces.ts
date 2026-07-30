/* Multi-force rank & trade registry for the C.V Builder.
   Bilingual labels live here so both dictionaries stay lean.
   `suffix` maps a rank to its civilian seniority level, and each trade
   carries a corporate domain plus HR-friendly competencies. */

export interface RankDef {
  id: string;
  en: string;
  hi: string;
  suffix: string;
}

export interface TradeDef {
  id: string;
  en: string;
  hi: string;
  domain: string;
  skills: string[];
}

export interface ForceDef {
  id: string;
  en: string;
  hi: string;
  short: string;
  ranks: RankDef[];
  trades: TradeDef[];
}

/* ---------------- Army ---------------- */
const ARMY_RANKS: RankDef[] = [
  { id: 'sepoy', en: 'Sepoy', hi: 'सिपाही', suffix: 'Executive' },
  { id: 'naik', en: 'Naik', hi: 'नायक', suffix: 'Team Lead' },
  { id: 'havildar', en: 'Havildar', hi: 'हवलदार', suffix: 'Senior Supervisor' },
  { id: 'naibsubedar', en: 'Naib Subedar', hi: 'नायब सूबेदार', suffix: 'Assistant Manager' },
  { id: 'subedar', en: 'Subedar', hi: 'सूबेदार', suffix: 'Manager' },
  { id: 'subedarmajor', en: 'Subedar Major', hi: 'सूबेदार मेजर', suffix: 'Senior Manager' },
  { id: 'lieutenant', en: 'Lieutenant', hi: 'लेफ्टिनेंट', suffix: 'Executive' },
  { id: 'captain', en: 'Captain', hi: 'कैप्टन', suffix: 'Manager' },
  { id: 'major', en: 'Major', hi: 'मेजर', suffix: 'Senior Manager' },
  { id: 'colonel', en: 'Colonel', hi: 'कर्नल', suffix: 'Director' },
];

const ARMY_TRADES: TradeDef[] = [
  {
    id: 'signals',
    en: 'Signals',
    hi: 'सिग्नल',
    domain: 'Telecom & Network Operations',
    skills: ['Telecom & IT Infrastructure', 'Secure Communications Ops', 'NOC / Control-Room Management', 'Technical Team Leadership'],
  },
  {
    id: 'infantry',
    en: 'Infantry',
    hi: 'पैदल सेना',
    domain: 'Security & Field Operations',
    skills: ['Security Ops & Surveillance', 'Disciplined Team Leadership', 'Field Craft & Crisis Response', 'Physical Endurance Programs'],
  },
  {
    id: 'eme',
    en: 'EME (Mechanical)',
    hi: 'ईएमई (मैकेनिकल)',
    domain: 'Maintenance & Technical Operations',
    skills: ['Preventive & Corrective Maintenance', 'Workshop & Fleet Management', 'Equipment Lifecycle Planning', 'Quality & Safety Compliance'],
  },
  {
    id: 'asc',
    en: 'ASC (Supply)',
    hi: 'एएससी (आपूर्ति)',
    domain: 'Logistics & Supply Chain',
    skills: ['Supply Chain & Inventory Control', 'Convoy & Transport Planning', 'Warehouse Management', 'Vendor Coordination'],
  },
  {
    id: 'engineers',
    en: 'Corps of Engineers',
    hi: 'इंजीनियर कोर',
    domain: 'Project & Infrastructure Execution',
    skills: ['Site & Project Execution', 'Technical Drawing Interpretation', 'Resource & Labour Planning', 'HSE Compliance'],
  },
  {
    id: 'artillery',
    en: 'Artillery',
    hi: 'तोपखाना',
    domain: 'Precision Operations & Analytics',
    skills: ['Precision Operations', 'Data Recording & Analysis', 'Crew Coordination', 'Instrument Calibration'],
  },
  {
    id: 'ordnance',
    en: 'Army Ordnance Corps',
    hi: 'आर्मी ऑर्डनेंस कोर',
    domain: 'Inventory & Stores Management',
    skills: ['Stores & Inventory Management', 'Procurement Support', 'Documentation & Audits', 'Record-Keeping Systems'],
  },
  {
    id: 'mp',
    en: 'Military Police',
    hi: 'मिलिटरी पुलिस',
    domain: 'Security, Law & Compliance',
    skills: ['Security & Access Control', 'Investigation Support', 'Traffic & Crowd Management', 'Discipline & Compliance'],
  },
  {
    id: 'mns',
    en: 'Military Nursing (MNS)',
    hi: 'मिलिटरी नर्सिंग (MNS)',
    domain: 'Healthcare Administration',
    skills: ['Patient Care Management', 'Ward Administration', 'Emergency Response', 'Health Records & Hygiene'],
  },
];

/* ---------------- Navy ---------------- */
const NAVY_RANKS: RankDef[] = [
  { id: 'seaman', en: 'Seaman', hi: 'सीमैन', suffix: 'Executive' },
  { id: 'leadingseaman', en: 'Leading Seaman', hi: 'लीडिंग सीमैन', suffix: 'Team Lead' },
  { id: 'pettyofficer', en: 'Petty Officer', hi: 'पेटी ऑफिसर', suffix: 'Senior Supervisor' },
  { id: 'chiefpetty', en: 'Chief Petty Officer', hi: 'चीफ पेटी ऑफिसर', suffix: 'Assistant Manager' },
  { id: 'mcpo2', en: 'Master Chief Petty Officer II', hi: 'मास्टर चीफ पेटी ऑफिसर II', suffix: 'Manager' },
  { id: 'mcpo1', en: 'Master Chief Petty Officer I', hi: 'मास्टर चीफ पेटी ऑफिसर I', suffix: 'Senior Manager' },
  { id: 'sublt', en: 'Sub Lieutenant', hi: 'सब लेफ्टिनेंट', suffix: 'Executive' },
  { id: 'ltin', en: 'Lieutenant', hi: 'लेफ्टिनेंट', suffix: 'Manager' },
  { id: 'ltcdr', en: 'Lieutenant Commander', hi: 'लेफ्टिनेंट कमांडर', suffix: 'Senior Manager' },
  { id: 'commander', en: 'Commander', hi: 'कमांडर', suffix: 'Director' },
  { id: 'captainin', en: 'Captain (IN)', hi: 'कैप्टन (नौसेना)', suffix: 'Senior Director' },
];

const NAVY_TRADES: TradeDef[] = [
  {
    id: 'executive',
    en: 'Executive / Seaman Branch',
    hi: 'एग्जीक्यूटिव / सीमैन शाखा',
    domain: 'Maritime Operations & Security',
    skills: ['Watchkeeping & Bridge Ops', 'Navigation & Route Planning', 'Crew Command & Discipline', 'Emergency Drill Management'],
  },
  {
    id: 'navengg',
    en: 'Engineering Branch',
    hi: 'इंजीनियरिंग शाखा',
    domain: 'Marine Engineering & Plant Maintenance',
    skills: ['Propulsion & Machinery Upkeep', 'Preventive Maintenance Planning', 'Boiler & Pump Systems', 'Technical Documentation'],
  },
  {
    id: 'navelec',
    en: 'Electrical Branch',
    hi: 'इलेक्ट्रिकल शाखा',
    domain: 'Electrical & Control Systems',
    skills: ['Power Distribution Systems', 'Radar & Sensor Upkeep', 'Fault Diagnosis & Repair', 'Instrumentation Calibration'],
  },
  {
    id: 'navlog',
    en: 'Logistics Branch',
    hi: 'लॉजिस्टिक्स शाखा',
    domain: 'Logistics & Materials Management',
    skills: ['Stores & Provisioning', 'Contract & Vendor Handling', 'Budget & Audit Support', 'Inventory Systems'],
  },
  {
    id: 'navav',
    en: 'Naval Aviation',
    hi: 'नौसेना उड्डयन',
    domain: 'Aviation Operations & Safety',
    skills: ['Flight Line Operations', 'Aviation Safety Compliance', 'Ground Handling Coordination', 'Maintenance Scheduling'],
  },
  {
    id: 'submarine',
    en: 'Submarine Arm',
    hi: 'पनडुब्बी शाखा',
    domain: 'Critical Systems & Confined-Space Operations',
    skills: ['High-Risk Systems Operation', 'Confined-Space Safety', 'Endurance Under Pressure', 'Precision Checklists'],
  },
  {
    id: 'hydro',
    en: 'Hydrography',
    hi: 'हाइड्रोग्राफी',
    domain: 'Survey, GIS & Data Analysis',
    skills: ['Survey & Charting', 'GIS / Data Plotting', 'Report Preparation', 'Instrument Handling'],
  },
  {
    id: 'navmed',
    en: 'Medical Assistant',
    hi: 'मेडिकल असिस्टेंट',
    domain: 'Healthcare Administration',
    skills: ['Patient Care Management', 'Medical Stores Control', 'Emergency Response', 'Health Records & Hygiene'],
  },
];

/* ---------------- Air Force ---------------- */
const IAF_RANKS: RankDef[] = [
  { id: 'aircraftman', en: 'Aircraftman / LAC', hi: 'एयरक्राफ्टमैन / LAC', suffix: 'Executive' },
  { id: 'corporal', en: 'Corporal', hi: 'कॉर्पोरल', suffix: 'Team Lead' },
  { id: 'sergeant', en: 'Sergeant', hi: 'सार्जेंट', suffix: 'Senior Supervisor' },
  { id: 'jwo', en: 'Junior Warrant Officer', hi: 'जूनियर वारंट ऑफिसर', suffix: 'Assistant Manager' },
  { id: 'wo', en: 'Warrant Officer', hi: 'वारंट ऑफिसर', suffix: 'Manager' },
  { id: 'mwo', en: 'Master Warrant Officer', hi: 'मास्टर वारंट ऑफिसर', suffix: 'Senior Manager' },
  { id: 'flyingofficer', en: 'Flying Officer', hi: 'फ्लाइंग ऑफिसर', suffix: 'Executive' },
  { id: 'fltlt', en: 'Flight Lieutenant', hi: 'फ्लाइट लेफ्टिनेंट', suffix: 'Manager' },
  { id: 'sqnldr', en: 'Squadron Leader', hi: 'स्क्वाड्रन लीडर', suffix: 'Senior Manager' },
  { id: 'wgcdr', en: 'Wing Commander', hi: 'विंग कमांडर', suffix: 'Director' },
  { id: 'gpcapt', en: 'Group Captain', hi: 'ग्रुप कैप्टन', suffix: 'Senior Director' },
];

const IAF_TRADES: TradeDef[] = [
  {
    id: 'flying',
    en: 'Flying Branch',
    hi: 'फ्लाइंग शाखा',
    domain: 'Aviation Operations & Safety',
    skills: ['Mission Planning & Execution', 'Crew Resource Management', 'Risk & Safety Assessment', 'Decision-Making Under Pressure'],
  },
  {
    id: 'techmech',
    en: 'Technical — Mechanical',
    hi: 'तकनीकी — मैकेनिकल',
    domain: 'Aircraft Maintenance & Reliability',
    skills: ['Airframe & Engine Servicing', 'Reliability-Centred Maintenance', 'Snag Rectification', 'Airworthiness Documentation'],
  },
  {
    id: 'techelec',
    en: 'Technical — Electronics',
    hi: 'तकनीकी — इलेक्ट्रॉनिक्स',
    domain: 'Avionics & Electronics Maintenance',
    skills: ['Avionics Systems Upkeep', 'Radar & Communication Sets', 'Fault Tracing & Repair', 'Test Equipment Handling'],
  },
  {
    id: 'iaflog',
    en: 'Logistics Branch',
    hi: 'लॉजिस्टिक्स शाखा',
    domain: 'Supply Chain & Inventory Management',
    skills: ['Provisioning & Procurement', 'Warehouse & Stock Control', 'Vendor Management', 'Audit & Compliance'],
  },
  {
    id: 'iafadmin',
    en: 'Administration',
    hi: 'प्रशासन',
    domain: 'Administration & HR Operations',
    skills: ['Personnel Administration', 'Discipline & Welfare', 'Records & Correspondence', 'Event & Facility Coordination'],
  },
  {
    id: 'atc',
    en: 'Air Traffic Control',
    hi: 'एयर ट्रैफिक कंट्रोल',
    domain: 'Air Traffic & Control-Room Operations',
    skills: ['Traffic Sequencing & Control', 'Radio Telephony', 'Situational Awareness', 'Incident Coordination'],
  },
  {
    id: 'garud',
    en: 'Garud Commando',
    hi: 'गरुड़ कमांडो',
    domain: 'Security & Field Operations',
    skills: ['Close Protection & Security', 'Tactical Team Leadership', 'Crisis Response', 'Physical Training Programs'],
  },
  {
    id: 'iafmed',
    en: 'Medical Assistant',
    hi: 'मेडिकल असिस्टेंट',
    domain: 'Healthcare Administration',
    skills: ['Patient Care Management', 'Medical Inventory Control', 'Emergency Response', 'Health Records & Hygiene'],
  },
];

/* ---------------- CAPF (shared base) ---------------- */
const CAPF_RANKS: RankDef[] = [
  { id: 'constable', en: 'Constable', hi: 'कांस्टेबल', suffix: 'Executive' },
  { id: 'headconstable', en: 'Head Constable', hi: 'हेड कांस्टेबल', suffix: 'Team Lead' },
  { id: 'asi', en: 'Assistant Sub Inspector', hi: 'सहायक उप निरीक्षक', suffix: 'Senior Supervisor' },
  { id: 'si', en: 'Sub Inspector', hi: 'उप निरीक्षक', suffix: 'Assistant Manager' },
  { id: 'inspector', en: 'Inspector', hi: 'निरीक्षक', suffix: 'Manager' },
  { id: 'ac', en: 'Assistant Commandant', hi: 'सहायक कमांडेंट', suffix: 'Senior Manager' },
  { id: 'dc', en: 'Deputy Commandant', hi: 'उप कमांडेंट', suffix: 'Director' },
  { id: 'commandant', en: 'Commandant', hi: 'कमांडेंट', suffix: 'Senior Director' },
];

const CAPF_BASE_TRADES: TradeDef[] = [
  {
    id: 'gd',
    en: 'General Duty',
    hi: 'जनरल ड्यूटी',
    domain: 'Security & Field Operations',
    skills: ['Security Ops & Surveillance', 'Disciplined Team Leadership', 'Patrol & Post Management', 'Crisis Response'],
  },
  {
    id: 'capfcomm',
    en: 'Signals / Communication',
    hi: 'सिग्नल / संचार',
    domain: 'Telecom & Network Operations',
    skills: ['Radio & Network Operations', 'Control-Room Management', 'Equipment Upkeep', 'Secure Communications'],
  },
  {
    id: 'capfmt',
    en: 'Motor Transport',
    hi: 'मोटर ट्रांसपोर्ट',
    domain: 'Fleet & Transport Management',
    skills: ['Fleet Scheduling & Upkeep', 'Convoy Movement Planning', 'Driver Team Supervision', 'Fuel & Log Records'],
  },
  {
    id: 'capfmin',
    en: 'Ministerial / Administration',
    hi: 'मंत्रालयिक / प्रशासन',
    domain: 'Administration & Records Management',
    skills: ['Office Administration', 'Records & Correspondence', 'Pay & Establishment Work', 'Data Entry & MIS'],
  },
  {
    id: 'capfengg',
    en: 'Works / Engineering',
    hi: 'निर्माण / इंजीनियरिंग',
    domain: 'Project & Infrastructure Execution',
    skills: ['Site & Works Execution', 'Resource & Labour Planning', 'Estimation & Measurement', 'HSE Compliance'],
  },
  {
    id: 'capfmed',
    en: 'Medical / Nursing Assistant',
    hi: 'मेडिकल / नर्सिंग असिस्टेंट',
    domain: 'Healthcare Administration',
    skills: ['Patient Care Management', 'Medical Stores Control', 'Emergency Response', 'Health Records & Hygiene'],
  },
];

const capfTrades = (specialities: TradeDef[]): TradeDef[] => [...CAPF_BASE_TRADES, ...specialities];

/* ---------------- Registry ---------------- */
export const FORCES: ForceDef[] = [
  { id: 'army', en: 'Indian Army', hi: 'भारतीय थल सेना', short: 'Indian Army', ranks: ARMY_RANKS, trades: ARMY_TRADES },
  { id: 'navy', en: 'Indian Navy', hi: 'भारतीय नौसेना', short: 'Indian Navy', ranks: NAVY_RANKS, trades: NAVY_TRADES },
  { id: 'airforce', en: 'Indian Air Force', hi: 'भारतीय वायु सेना', short: 'Indian Air Force', ranks: IAF_RANKS, trades: IAF_TRADES },
  {
    id: 'crpf',
    en: 'CRPF (CAPF)',
    hi: 'सीआरपीएफ (CAPF)',
    short: 'CRPF',
    ranks: CAPF_RANKS,
    trades: capfTrades([
      {
        id: 'cobra',
        en: 'CoBRA / Anti-Naxal Operations',
        hi: 'कोबरा / नक्सल-रोधी अभियान',
        domain: 'Risk Assessment & Crisis Response',
        skills: ['Threat & Risk Assessment', 'Tactical Team Leadership', 'Jungle & Field Craft', 'Rapid Crisis Response'],
      },
      {
        id: 'raf',
        en: 'Rapid Action Force (Riot Control)',
        hi: 'रैपिड एक्शन फोर्स (दंगा नियंत्रण)',
        domain: 'Crowd & Public Safety Management',
        skills: ['Crowd Management', 'Public Liaison & De-escalation', 'Rapid Deployment Planning', 'Incident Reporting'],
      },
    ]),
  },
  {
    id: 'bsf',
    en: 'BSF (CAPF)',
    hi: 'बीएसएफ (CAPF)',
    short: 'BSF',
    ranks: CAPF_RANKS,
    trades: capfTrades([
      {
        id: 'border',
        en: 'Border Guarding Operations',
        hi: 'सीमा सुरक्षा अभियान',
        domain: 'Perimeter Security & Surveillance',
        skills: ['Perimeter Security Management', 'Surveillance & Observation', 'Border Post Administration', 'Coordination with Agencies'],
      },
      {
        id: 'water',
        en: 'Water Wing / Boat Operations',
        hi: 'वाटर विंग / नौका संचालन',
        domain: 'Marine Transport Operations',
        skills: ['Boat Handling & Navigation', 'Waterway Patrolling', 'Craft Maintenance', 'Rescue Operations'],
      },
    ]),
  },
  {
    id: 'itbp',
    en: 'ITBP (CAPF)',
    hi: 'आईटीबीपी (CAPF)',
    short: 'ITBP',
    ranks: CAPF_RANKS,
    trades: capfTrades([
      {
        id: 'highalt',
        en: 'High Altitude / Mountaineering',
        hi: 'उच्च तुंगता / पर्वतारोहण',
        domain: 'Extreme-Environment Operations',
        skills: ['High-Altitude Operations', 'Mountaineering & Rope Work', 'Expedition Logistics', 'Survival & Safety Training'],
      },
      {
        id: 'sar',
        en: 'Search & Rescue',
        hi: 'खोज एवं बचाव',
        domain: 'Emergency Response & Rescue',
        skills: ['Disaster Response', 'Search & Rescue Coordination', 'First Response Medical Aid', 'Team Safety Protocols'],
      },
    ]),
  },
  {
    id: 'cisf',
    en: 'CISF (CAPF)',
    hi: 'सीआईएसएफ (CAPF)',
    short: 'CISF',
    ranks: CAPF_RANKS,
    trades: capfTrades([
      {
        id: 'fire',
        en: 'Fire Services Wing',
        hi: 'अग्निशमन सेवा विंग',
        domain: 'Fire Safety & Emergency Management',
        skills: ['Fire Safety Systems', 'Emergency Evacuation Drills', 'Hazard Audits', 'Safety Training Delivery'],
      },
      {
        id: 'airport',
        en: 'Airport / Industrial Security',
        hi: 'एयरपोर्ट / औद्योगिक सुरक्षा',
        domain: 'Aviation & Industrial Security',
        skills: ['Access Control & Screening', 'Industrial Site Security', 'Regulatory Compliance', 'Customer-Facing Security'],
      },
    ]),
  },
];

export const findForce = (id: string): ForceDef => FORCES.find((f) => f.id === id) ?? FORCES[0];
export const findRank = (force: ForceDef, id: string): RankDef => force.ranks.find((r) => r.id === id) ?? force.ranks[0];
export const findTrade = (force: ForceDef, id: string): TradeDef => force.trades.find((tr) => tr.id === id) ?? force.trades[0];

/* C.V template catalogue — layout implemented in lib/pdf.ts */
export const CV_TEMPLATES = ['modern', 'classic', 'tactical'] as const;
export type CvTemplate = (typeof CV_TEMPLATES)[number];
