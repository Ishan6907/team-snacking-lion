import { ProjectRow } from '@/data/inventoryData';

export interface StateGeodeticProfile {
  state: string;
  baseLat: number;
  baseLon: number;
  utmZone: string;
  utmBaseE: number;
  utmBaseN: number;
  baseElevation: number;
  surveyTerm: string;
  khasraTerm: string;
  sampleOwners: string[];
}

export const STATE_GEODETIC_MAP: Record<string, StateGeodeticProfile> = {
  'Andhra Pradesh': {
    state: 'Andhra Pradesh',
    baseLat: 15.9129,
    baseLon: 79.7400,
    utmZone: '44N',
    utmBaseE: 365200,
    utmBaseN: 1759400,
    baseElevation: 48.2,
    surveyTerm: 'Survey No.',
    khasraTerm: 'Patta',
    sampleOwners: ['Shri K. Venkata Reddy & Heirs', 'M/s Coastal Infra Logistics', 'AP Land Bank Society', 'Smt. Lakshmi Devi & Co-Sharers'],
  },
  'Arunachal Pradesh': {
    state: 'Arunachal Pradesh',
    baseLat: 28.2180,
    baseLon: 94.7278,
    utmZone: '46R',
    utmBaseE: 669800,
    utmBaseN: 3122100,
    baseElevation: 1420.5,
    surveyTerm: 'Plot ID',
    khasraTerm: 'Customary Tenure',
    sampleOwners: ['Tai Bida Clan Land Council', 'Arunachal Forest Range Board', 'Shri Wangchu Lowang', 'Village Community Land Trust'],
  },
  'Assam': {
    state: 'Assam',
    baseLat: 26.2006,
    baseLon: 92.9376,
    utmZone: '46R',
    utmBaseE: 493700,
    utmBaseN: 2898400,
    baseElevation: 55.4,
    surveyTerm: 'Dag No.',
    khasraTerm: 'Khatian',
    sampleOwners: ['Shri Bhaben Kalita & Brothers', 'Assam Tea Plantation Corp', 'Brahmaputra Floodway Authority', 'Smt. Runumi Barua'],
  },
  'Bihar': {
    state: 'Bihar',
    baseLat: 25.0961,
    baseLon: 85.3131,
    utmZone: '45R',
    utmBaseE: 329800,
    utmBaseN: 2776400,
    baseElevation: 58.6,
    surveyTerm: 'Khasra No.',
    khasraTerm: 'Khatauni',
    sampleOwners: ['Shri Chandrashekhar Yadav', 'M/s Magadh Agro Warehousing', 'Bihar State Highway Authority', 'Darbhanga Co-Sharers Trust'],
  },
  'Chhattisgarh': {
    state: 'Chhattisgarh',
    baseLat: 21.2787,
    baseLon: 81.8661,
    utmZone: '44Q',
    utmBaseE: 590200,
    utmBaseN: 2353100,
    baseElevation: 298.0,
    surveyTerm: 'Khasra No.',
    khasraTerm: 'Khata',
    sampleOwners: ['Shri Khemraj Sahu & Family', 'Chhattisgarh Power Trans Co', 'Bastar Tribal Cooperative', 'M/s Raipur Industrial Landbank'],
  },
  'Goa': {
    state: 'Goa',
    baseLat: 15.2993,
    baseLon: 74.1240,
    utmZone: '43P',
    utmBaseE: 405900,
    utmBaseN: 1692100,
    baseElevation: 24.5,
    surveyTerm: 'Survey No.',
    khasraTerm: 'Sub-Div',
    sampleOwners: ['Comunidade of Mormugao', 'Shri Antonio D\'Souza & Legal Heirs', 'Goa Coastal Zone Board', 'M/s Mandovi Riverfront Logistics'],
  },
  'Gujarat': {
    state: 'Gujarat',
    baseLat: 22.2587,
    baseLon: 71.1924,
    utmZone: '43Q',
    utmBaseE: 313800,
    utmBaseN: 2462300,
    baseElevation: 38.4,
    surveyTerm: 'Survey No.',
    khasraTerm: 'Block / Hissa',
    sampleOwners: ['Shri Ramchandra Verma & Co-Sharers', 'M/s Bharat Agri Logistics', 'Western DFC Land Bank', 'Smt. Kokilaben Patel & Heirs'],
  },
  'Haryana': {
    state: 'Haryana',
    baseLat: 29.0588,
    baseLon: 76.0856,
    utmZone: '43R',
    utmBaseE: 605700,
    utmBaseN: 3215200,
    baseElevation: 224.0,
    surveyTerm: 'Killa No.',
    khasraTerm: 'Murabba',
    sampleOwners: ['Chaudhary Virender Singh & Sons', 'Haryana State Industrial Dev Corp', 'M/s NCR Logistics Hub', 'Shri Dalbir Ahlawat'],
  },
  'Himachal Pradesh': {
    state: 'Himachal Pradesh',
    baseLat: 31.1048,
    baseLon: 77.1734,
    utmZone: '43R',
    utmBaseE: 706800,
    utmBaseN: 3443100,
    baseElevation: 1850.2,
    surveyTerm: 'Khasra No.',
    khasraTerm: 'Khatauni',
    sampleOwners: ['Shri Thakur Jagat Singh', 'H.P. State Forest Development', 'Kinnaur Apple Orchard Holdings', 'Smt. Sushila Devi'],
  },
  'Jharkhand': {
    state: 'Jharkhand',
    baseLat: 23.6102,
    baseLon: 85.2799,
    utmZone: '45Q',
    utmBaseE: 324500,
    utmBaseN: 2611900,
    baseElevation: 651.0,
    surveyTerm: 'Plot No.',
    khasraTerm: 'Khata',
    sampleOwners: ['Shri Birsa Munda Descendants Trust', 'Coal India Buffer Land', 'Jharkhand Industrial Area Dev Board', 'Shri Rameshwar Mahto'],
  },
  'Karnataka': {
    state: 'Karnataka',
    baseLat: 15.3173,
    baseLon: 75.7139,
    utmZone: '43P',
    utmBaseE: 576700,
    utmBaseN: 1693700,
    baseElevation: 840.5,
    surveyTerm: 'Survey No.',
    khasraTerm: 'Hissa',
    sampleOwners: ['Shri Mallikarjun Gowda & Brothers', 'KIADB Industrial Board', 'M/s Deccan Logistics Hub', 'Smt. Parvathamma & Legal Heirs'],
  },
  'Kerala': {
    state: 'Kerala',
    baseLat: 10.8505,
    baseLon: 76.2711,
    utmZone: '43P',
    utmBaseE: 639000,
    utmBaseN: 1200000,
    baseElevation: 32.0,
    surveyTerm: 'Re-Survey No.',
    khasraTerm: 'Block / Thandapper',
    sampleOwners: ['Shri K.P. Raghavan Nair', 'Cochin Port Land Bank', 'Rubber Board Cooperative', 'Smt. Mariamma Varghese'],
  },
  'Madhya Pradesh': {
    state: 'Madhya Pradesh',
    baseLat: 22.9734,
    baseLon: 78.6569,
    utmZone: '44Q',
    utmBaseE: 259000,
    utmBaseN: 2542000,
    baseElevation: 492.0,
    surveyTerm: 'Khasra No.',
    khasraTerm: 'Bahi Khata',
    sampleOwners: ['Shri Digvijay Singh Tomar', 'Narmada Valley Dev Authority', 'MP Warehousing Logistics', 'Shri Shivcharan Kushwaha'],
  },
  'Maharashtra': {
    state: 'Maharashtra',
    baseLat: 19.7515,
    baseLon: 75.7139,
    utmZone: '43Q',
    utmBaseE: 365200,
    utmBaseN: 2184500,
    baseElevation: 560.8,
    surveyTerm: 'Gat No.',
    khasraTerm: 'Hissa / Ferfar',
    sampleOwners: ['Shri Balasaheb Deshmukh & Co-Sharers', 'MIDC Industrial Corridor', 'Maharashtra State Road Dev Corp', 'Smt. Sunita Jadhav'],
  },
  'Manipur': {
    state: 'Manipur',
    baseLat: 24.6637,
    baseLon: 93.9063,
    utmZone: '46Q',
    utmBaseE: 591700,
    utmBaseN: 2728400,
    baseElevation: 785.0,
    surveyTerm: 'Dag No.',
    khasraTerm: 'Jamabandi',
    sampleOwners: ['Shri N. Biren Singh Family Land', 'Imphal Valley Development Board', 'Village Authority Council', 'Smt. Memcha Devi'],
  },
  'Meghalaya': {
    state: 'Meghalaya',
    baseLat: 25.4670,
    baseLon: 91.3662,
    utmZone: '46R',
    utmBaseE: 335800,
    utmBaseN: 2817800,
    baseElevation: 1496.0,
    surveyTerm: 'Clan Plot',
    khasraTerm: 'Syiemship Deed',
    sampleOwners: ['Khasi Hills Autonomous Council', 'Nongstoin Syiemship Clan Holdings', 'Shri P.H. Ryntathiang', 'Mawlai Community Land Board'],
  },
  'Mizoram': {
    state: 'Mizoram',
    baseLat: 23.1645,
    baseLon: 92.9376,
    utmZone: '46Q',
    utmBaseE: 493600,
    utmBaseN: 2561900,
    baseElevation: 1132.0,
    surveyTerm: 'Land Pass No.',
    khasraTerm: 'Village Council Pass',
    sampleOwners: ['Aizawl District Land Settlement Board', 'Shri Laldinpuia & Heirs', 'Mizoram PWD RoW Holdings', 'Tuirial River Valley Society'],
  },
  'Nagaland': {
    state: 'Nagaland',
    baseLat: 26.1584,
    baseLon: 94.5624,
    utmZone: '46R',
    utmBaseE: 656100,
    utmBaseN: 2893800,
    baseElevation: 1444.0,
    surveyTerm: 'Khel Plot',
    khasraTerm: 'Tribal Title',
    sampleOwners: ['Kohima Village Council (T-Khel)', 'Shri Kevichusa Angami', 'Nagaland State Land Board', 'Dimapur Chümoukedima Trust'],
  },
  'Odisha': {
    state: 'Odisha',
    baseLat: 20.9517,
    baseLon: 85.0985,
    utmZone: '45Q',
    utmBaseE: 302100,
    utmBaseN: 2317800,
    baseElevation: 125.0,
    surveyTerm: 'Plot No.',
    khasraTerm: 'Khata',
    sampleOwners: ['Shri Niranjan Mohapatra & Brothers', 'IDCO Industrial Infrastructure', 'Mahanadi Basin Water Board', 'Smt. Manorama Das'],
  },
  'Punjab': {
    state: 'Punjab',
    baseLat: 31.1471,
    baseLon: 75.3412,
    utmZone: '43R',
    utmBaseE: 532500,
    utmBaseN: 3445800,
    baseElevation: 235.0,
    surveyTerm: 'Khasra No.',
    khasraTerm: 'Murabba / Killa',
    sampleOwners: ['Sardar Gurpreet Singh Dhillon & Heirs', 'Punjab Agro Industries Corp', 'M/s Malwa Freight Terminal', 'Shri Harjinder Gill'],
  },
  'Rajasthan': {
    state: 'Rajasthan',
    baseLat: 27.0238,
    baseLon: 74.2179,
    utmZone: '43R',
    utmBaseE: 422500,
    utmBaseN: 2989500,
    baseElevation: 320.0,
    surveyTerm: 'Khasra No.',
    khasraTerm: 'Khatauni',
    sampleOwners: ['Shri Ratanlal Rathore & Sons', 'RIICO Industrial Area Landbank', 'Rajasthan Solar Park Board', 'Smt. Bhanwari Devi'],
  },
  'Sikkim': {
    state: 'Sikkim',
    baseLat: 27.5330,
    baseLon: 88.5122,
    utmZone: '45R',
    utmBaseE: 649200,
    utmBaseN: 3046200,
    baseElevation: 1650.0,
    surveyTerm: 'Plot No.',
    khasraTerm: 'Khatian',
    sampleOwners: ['Shri Tashi Bhutia & Co-Sharers', 'Teesta Hydro Power Project Trust', 'Sikkim Forest & Environment Dept', 'Smt. Pemba Lepcha'],
  },
  'Tamil Nadu': {
    state: 'Tamil Nadu',
    baseLat: 11.1271,
    baseLon: 78.6569,
    utmZone: '44P',
    utmBaseE: 244100,
    utmBaseN: 1230800,
    baseElevation: 145.0,
    surveyTerm: 'Survey No.',
    khasraTerm: 'Patta',
    sampleOwners: ['Shri S. Karuppasamy & Legal Heirs', 'SIPCOT Industrial Park', 'TIDCO Infrastructure Corp', 'Smt. Meenakshi Sundaram'],
  },
  'Telangana': {
    state: 'Telangana',
    baseLat: 18.1124,
    baseLon: 79.0193,
    utmZone: '44Q',
    utmBaseE: 290500,
    utmBaseN: 2003800,
    baseElevation: 485.0,
    surveyTerm: 'Survey No.',
    khasraTerm: 'Pahani / Passbook',
    sampleOwners: ['Shri G. Rajeshwar Rao & Sons', 'TSIIC Industrial Infrastructure', 'Kaleshwaram Lift Project Board', 'Smt. Sunitha Reddy'],
  },
  'Tripura': {
    state: 'Tripura',
    baseLat: 23.9408,
    baseLon: 91.9882,
    utmZone: '46Q',
    utmBaseE: 397100,
    utmBaseN: 2648500,
    baseElevation: 42.0,
    surveyTerm: 'Dag No.',
    khasraTerm: 'Khatian',
    sampleOwners: ['Shri Manindra Debbarma', 'Tripura Industrial Dev Corp', 'Agartala Rail Corridor Board', 'Smt. Bimala Chakraborty'],
  },
  'Uttar Pradesh': {
    state: 'Uttar Pradesh',
    baseLat: 26.8467,
    baseLon: 80.9462,
    utmZone: '43R',
    utmBaseE: 494600,
    utmBaseN: 2969400,
    baseElevation: 123.5,
    surveyTerm: 'Gata / Khasra No.',
    khasraTerm: 'Khatauni',
    sampleOwners: ['Shri Ram Sewak Maurya & Heirs', 'UPEIDA Expressway Land Bank', 'Jal Nigam Bundelkhand Division', 'Smt. Kunti Devi & Co-Sharers'],
  },
  'Uttarakhand': {
    state: 'Uttarakhand',
    baseLat: 30.0668,
    baseLon: 79.0193,
    utmZone: '43R',
    utmBaseE: 790500,
    utmBaseN: 3330800,
    baseElevation: 1580.0,
    surveyTerm: 'Khasra No.',
    khasraTerm: 'Khatauni',
    sampleOwners: ['Shri Birendra Singh Rawat', 'Char Dham Highway Authority', 'Alaknanda Riverine Forest Circle', 'Smt. Geeta Devi Joshi'],
  },
  'West Bengal': {
    state: 'West Bengal',
    baseLat: 22.9868,
    baseLon: 87.8550,
    utmZone: '45Q',
    utmBaseE: 587800,
    utmBaseN: 2542200,
    baseElevation: 22.0,
    surveyTerm: 'Dag No.',
    khasraTerm: 'Khatian / Mouza',
    sampleOwners: ['Shri Debashis Banerjee & Brothers', 'WBIDC Industrial Infrastructure', 'Kolkata Port Trust Landbank', 'Smt. Shampa Mukherjee'],
  },
  'Delhi': {
    state: 'Delhi',
    baseLat: 28.7041,
    baseLon: 77.1025,
    utmZone: '43R',
    utmBaseE: 716500,
    utmBaseN: 3165900,
    baseElevation: 216.0,
    surveyTerm: 'Khasra No.',
    khasraTerm: 'Khatauni',
    sampleOwners: ['Delhi Development Authority (DDA)', 'NCRTC Transport Land Bank', 'Shri Satish Chand & Sons', 'Northern Railway RoW Cell'],
  },
  'Jammu & Kashmir': {
    state: 'Jammu & Kashmir',
    baseLat: 33.7782,
    baseLon: 76.5762,
    utmZone: '43S',
    utmBaseE: 645800,
    utmBaseN: 3738900,
    baseElevation: 1620.0,
    surveyTerm: 'Khasra No.',
    khasraTerm: 'Intikhab / Jamabandi',
    sampleOwners: ['Shri Ghulam Mohammad Bhat', 'Northern Railway Udhampur Cell', 'Kashmir Saffron Land Cooperative', 'Smt. Parveena Akhtar'],
  },
  'Ladakh': {
    state: 'Ladakh',
    baseLat: 34.1526,
    baseLon: 77.5771,
    utmZone: '43S',
    utmBaseE: 737800,
    utmBaseN: 3782400,
    baseElevation: 3520.0,
    surveyTerm: 'Plot ID',
    khasraTerm: 'Revenue Register',
    sampleOwners: ['Leh Hill Development Council', 'Border Roads Organisation (BRO)', 'Zanskar Valley Community Land', 'Shri Rigzin Dorjey'],
  },
  'Chandigarh': {
    state: 'Chandigarh',
    baseLat: 30.7333,
    baseLon: 76.7794,
    utmZone: '43R',
    utmBaseE: 670600,
    utmBaseN: 3401500,
    baseElevation: 321.0,
    surveyTerm: 'Sector Plot',
    khasraTerm: 'Estate Office Record',
    sampleOwners: ['Chandigarh Administration UT', 'GMADA Corridor Authority', 'Shri Amarjit Singh & Heirs', 'Smt. Balwinder Kaur'],
  },
  'Puducherry': {
    state: 'Puducherry',
    baseLat: 11.9416,
    baseLon: 79.8083,
    utmZone: '44P',
    utmBaseE: 370200,
    utmBaseN: 1320400,
    baseElevation: 12.0,
    surveyTerm: 'Cadastre No.',
    khasraTerm: 'Pattadaye',
    sampleOwners: ['Puducherry Port Authority', 'Shri V. Subramanian & Family', 'Coastal Aquaculture Board', 'Smt. Jayalakshmi Ammal'],
  },
};

// Fallback profile
export const DEFAULT_GEODETIC_PROFILE: StateGeodeticProfile = {
  state: 'National Corridor',
  baseLat: 22.5000,
  baseLon: 78.0000,
  utmZone: '43Q',
  utmBaseE: 400000,
  utmBaseN: 2500000,
  baseElevation: 350.0,
  surveyTerm: 'Survey No.',
  khasraTerm: 'Record of Rights',
  sampleOwners: ['National Highways Authority of India', 'State Revenue Land Bank', 'Private Land Owners & Co-Sharers', 'Central Corridor SPV'],
};

// Deterministic string hasher to get stable numbers for any project
export function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
}

export interface CadastralParcel {
  id: string;
  surveyNo: string;
  khasraNo: string;
  owner: string;
  areaAcres: number;
  acquisitionStatus: 'acquired' | 'in_progress' | 'disputed' | 'compensation_pending';
  landType: 'Agricultural' | 'Non-Agricultural' | 'Forest/Govt' | 'Commercial';
  estimatedCostCr: number;
  center: { x: number; y: number };
  points: string;
}

export interface HighwayCadastralLayout {
  profile: StateGeodeticProfile;
  projectLat: number;
  projectLon: number;
  corridorAngleDeg: number;
  alignmentPathD: string;
  alignmentDashPathD: string;
  alignmentLabel: string;
  chainageMarkers: { km: string; x: number; y: number }[];
  parcels: CadastralParcel[];
}

/**
 * Generates an authentic, completely unique Cadastral Layout and Geodetic Profile for ANY project
 */
export function getProjectCadastralLayout(project: ProjectRow): HighwayCadastralLayout {
  const profile = STATE_GEODETIC_MAP[project.state] || DEFAULT_GEODETIC_PROFILE;
  const hash = hashString(project.id);

  // Derive stable offsets so each highway has unique coordinates within its state
  const latOffset = ((hash % 1000) / 1000 - 0.5) * 1.2; // +/- 0.6 degrees
  const lonOffset = (((hash >> 3) % 1000) / 1000 - 0.5) * 1.2;
  const projectLat = profile.baseLat + latOffset;
  const projectLon = profile.baseLon + lonOffset;

  // Derive corridor orientation angle (-45 deg to +45 deg)
  const angleVariation = ((hash % 6) - 2.5) * 18; // -45, -27, -9, +9, +27, +45
  const corridorAngleDeg = angleVariation;

  // Center points of alignment trajectory
  const startY = 520 - angleVariation * 3.5;
  const endY = 160 + angleVariation * 3.5;
  const curveBendY = ((hash % 50) - 25) * 2; // subtle curvature

  const alignmentPathD = `M 20 ${startY} Q 450 ${340 + curveBendY} 880 ${endY}`;
  const alignmentDashPathD = `M 20 ${startY} Q 450 ${340 + curveBendY} 880 ${endY}`;
  const alignmentLabel = `ALIGNMENT ROW: 60M GAZETTED CORRIDOR • ${project.chainage}`;

  // Extract starting km number from chainage (e.g. "Ch. 182+000" -> 182)
  const kmMatch = project.chainage.match(/Ch\.\s*(\d+)/i) || project.chainage.match(/(\d+)/);
  const startKmNum = kmMatch ? parseInt(kmMatch[1], 10) : (hash % 200) + 20;

  const chainageMarkers = [
    { km: `Ch. ${startKmNum}+000`, x: 140, y: Math.round(startY * 0.8 + 340 * 0.2) },
    { km: `Ch. ${startKmNum + 4}+500`, x: 440, y: Math.round(340 + curveBendY - 18) },
    { km: `Ch. ${startKmNum + 9}+200`, x: 740, y: Math.round(endY * 0.8 + 340 * 0.2) },
  ];

  // Generate 5 distinct, geometrically rich parcels surrounding this corridor
  const statuses: CadastralParcel['acquisitionStatus'][] = [
    'in_progress',
    'acquired',
    'disputed',
    'compensation_pending',
    'acquired',
  ];
  const landTypes: CadastralParcel['landType'][] = [
    'Agricultural',
    'Commercial',
    'Agricultural',
    'Forest/Govt',
    'Non-Agricultural',
  ];

  // Base polygon archetypes with rotations applied based on corridor angle
  const rad = (corridorAngleDeg * Math.PI) / 180;
  const cosA = Math.cos(rad);
  const sinA = Math.sin(rad);

  const rotateAround = (x: number, y: number, cx: number, cy: number) => {
    const dx = x - cx;
    const dy = y - cy;
    return {
      x: Math.round(cx + dx * cosA - dy * sinA),
      y: Math.round(cy + dx * sinA + dy * cosA),
    };
  };

  // Base raw polygons in coordinate space (cx, cy are centers)
  const rawPolygons = [
    {
      cx: 320,
      cy: 220,
      rawPoints: [
        [240, 160], [410, 140], [430, 280], [230, 290]
      ],
      area: 4.85 + ((hash % 30) / 10),
      cost: 3.45 + ((hash % 40) / 10),
    },
    {
      cx: 510,
      cy: 200,
      rawPoints: [
        [410, 140], [610, 120], [630, 260], [430, 280]
      ],
      area: 7.20 + (((hash >> 2) % 40) / 10),
      cost: 8.15 + (((hash >> 2) % 50) / 10),
    },
    {
      cx: 330,
      cy: 360,
      rawPoints: [
        [230, 290], [430, 280], [440, 430], [210, 440]
      ],
      area: 3.10 + (((hash >> 3) % 25) / 10),
      cost: 2.80 + (((hash >> 3) % 30) / 10),
    },
    {
      cx: 530,
      cy: 350,
      rawPoints: [
        [430, 280], [630, 260], [640, 420], [440, 430]
      ],
      area: 5.60 + (((hash >> 4) % 35) / 10),
      cost: 4.20 + (((hash >> 4) % 45) / 10),
    },
    {
      cx: 720,
      cy: 320,
      rawPoints: [
        [630, 260], [830, 230], [840, 390], [640, 420]
      ],
      area: 8.90 + (((hash >> 5) % 50) / 10),
      cost: 6.90 + (((hash >> 5) % 60) / 10),
    },
  ];

  const parcels: CadastralParcel[] = rawPolygons.map((poly, idx) => {
    // Unique survey number incorporating state revenue nomenclature
    const surveyBase = ((hash + idx * 37) % 450) + 40;
    const subDiv = String.fromCharCode(65 + ((idx + (hash % 5)) % 6));
    const surveyNo = `${profile.surveyTerm} ${surveyBase}/${subDiv}`;
    const khasraNo = `${profile.khasraTerm.slice(0, 2).toUpperCase()}-${8000 + ((hash * 7 + idx * 83) % 1999)}`;
    const owner = profile.sampleOwners[idx % profile.sampleOwners.length];

    // Rotate points slightly to align with highway trajectory
    const rotatedPoints = poly.rawPoints.map(([x, y]) => {
      const pt = rotateAround(x, y, 450, 330);
      return `${pt.x},${pt.y}`;
    }).join(' ');

    const centerRotated = rotateAround(poly.cx, poly.cy, 450, 330);

    return {
      id: `${project.id}-p${idx + 1}`,
      surveyNo,
      khasraNo,
      owner,
      areaAcres: Math.round(poly.area * 100) / 100,
      acquisitionStatus: statuses[idx % statuses.length],
      landType: landTypes[idx % landTypes.length],
      estimatedCostCr: Math.round(poly.cost * 100) / 100,
      center: centerRotated,
      points: rotatedPoints,
    };
  });

  return {
    profile,
    projectLat,
    projectLon,
    corridorAngleDeg,
    alignmentPathD,
    alignmentDashPathD,
    alignmentLabel,
    chainageMarkers,
    parcels,
  };
}
