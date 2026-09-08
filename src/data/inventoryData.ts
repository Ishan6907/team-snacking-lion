export interface ProjectRow {
  id: string;
  name: string;
  agency: string;
  ministry: string;
  state: string;
  chainage: string;
  outlayCr: number;
  contractMode: string;
  actualPct: number;
  plannedPct: number;
  progressDiff: number;
  progressDiffLabel: string;
  predictedDelayDays: number;
  riskSeverity: 'critical' | 'moderate' | 'nominal' | 'severe' | 'low';
  confidencePct: number;
  criticalBlocker: string;
  contractor: string;
  sector: 'Highways' | 'Railways' | 'Power' | 'Water' | 'Urban Development';
}

export const ALL_INDIAN_STATES_AND_UTS = [
  // 28 States
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  // 8 Union Territories
  'Andaman & Nicobar',
  'Chandigarh',
  'Dadra & Nagar Haveli',
  'Delhi',
  'Jammu & Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

// Initial 7 Marquee Seed Projects (Page 1)
const SEED_PROJECTS: ProjectRow[] = [
  {
    id: 'NHAI-DEL-MUM-P4',
    name: 'Delhi-Mumbai Expressway (Vadodara–Kim Stretch Pkg 4)',
    agency: 'NHAI',
    ministry: 'Ministry of Road Transport',
    state: 'Gujarat',
    chainage: 'Ch. 182+000 to 248+400',
    outlayCr: 2840.0,
    contractMode: 'EPC HAM Mode',
    actualPct: 58.6,
    plannedPct: 74.2,
    progressDiff: -15.6,
    progressDiffLabel: '-15.6% PHYSICAL LAG',
    predictedDelayDays: 145,
    riskSeverity: 'critical',
    confidencePct: 88,
    criticalBlocker: 'MoEFCC Stage II Clear. Ch. 214+000',
    contractor: 'Dilip Buildcon Ltd.',
    sector: 'Highways',
  },
  {
    id: 'DFCCIL-EDFC-PKG-201',
    name: 'Eastern Dedicated Freight Corridor (Khurja–Ludhiana)',
    agency: 'DFCCIL',
    ministry: 'Ministry of Railways',
    state: 'Uttar Pradesh',
    chainage: 'Ch. 0+000 to 175+000',
    outlayCr: 4310.0,
    contractMode: 'World Bank Loan',
    actualPct: 68.2,
    plannedPct: 76.0,
    progressDiff: -7.8,
    progressDiffLabel: '-7.8% track pace',
    predictedDelayDays: 42,
    riskSeverity: 'moderate',
    confidencePct: 84,
    criticalBlocker: 'Power Grid Relocation Crossing 4 sites',
    contractor: 'L&T Construction',
    sector: 'Railways',
  },
  {
    id: 'PGCIL-HVDC-RAIGARH',
    name: 'Raigarh-Pugalur 800kV HVDC Dipole Transmission Line',
    agency: 'POWERGRID',
    ministry: 'Ministry of Power',
    state: 'Chhattisgarh',
    chainage: '1,843 ckm route',
    outlayCr: 1980.0,
    contractMode: 'TBCB Tariff',
    actualPct: 94.0,
    plannedPct: 94.0,
    progressDiff: 0.0,
    progressDiffLabel: 'Nominal synchrony',
    predictedDelayDays: 0,
    riskSeverity: 'nominal',
    confidencePct: 92,
    criticalBlocker: 'NR / Substation Testing Ready for commissioning',
    contractor: 'Kalpataru Power Transmission',
    sector: 'Power',
  },
  {
    id: 'JJM-UP-BUND-08',
    name: 'Bundelkhand Surface Water Distribution Pipeline Pkg 8',
    agency: 'Jal Nigam',
    ministry: 'Ministry of Jal Shakti',
    state: 'Uttar Pradesh',
    chainage: 'Banda & Chitrakoot Dists',
    outlayCr: 890.0,
    contractMode: 'State Grant + Central',
    actualPct: 44.0,
    plannedPct: 69.0,
    progressDiff: -25.0,
    progressDiffLabel: '-25.0% heavy deficit',
    predictedDelayDays: 120,
    riskSeverity: 'severe',
    confidencePct: 81,
    criticalBlocker: 'State Tranche Hold (₹131 Cr unreleased)',
    contractor: 'NCC Limited',
    sector: 'Water',
  },
  {
    id: 'NHAI-BLR-CHE-EXP-02',
    name: 'Bengaluru-Chennai Expressway (Bangarapet to Malur Pkg 2)',
    agency: 'NHAI',
    ministry: 'MoRTH Central',
    state: 'Karnataka',
    chainage: 'Ch. 27+000 to 71+000',
    outlayCr: 1780.0,
    contractMode: 'EPC Pure Item Rate',
    actualPct: 66.0,
    plannedPct: 70.8,
    progressDiff: -4.8,
    progressDiffLabel: '-4.8% slippage',
    predictedDelayDays: 28,
    riskSeverity: 'low',
    confidencePct: 89,
    criticalBlocker: 'ROB Clearance SWR GAD approval pending',
    contractor: 'Tata Projects',
    sector: 'Highways',
  },
  {
    id: 'NHAI-VR-EXP-PKG-01',
    name: 'Varanasi-Ranchi-Kolkata Economic Corridor Section 1',
    agency: 'NHAI / Bharatmala',
    ministry: 'MoRTH',
    state: 'Jharkhand',
    chainage: 'Ch. 0+000 to 52+000',
    outlayCr: 3160.0,
    contractMode: 'Central CapEx',
    actualPct: 31.0,
    plannedPct: 48.0,
    progressDiff: -17.0,
    progressDiffLabel: '-17.0% severe delay',
    predictedDelayDays: 180,
    riskSeverity: 'critical',
    confidencePct: 92,
    criticalBlocker: '3A/3D Land Acq Gazette CALA Dhanbad stalled',
    contractor: 'Afcons Infrastructure',
    sector: 'Highways',
  },
  {
    id: 'MMRDA-MUM-LINE-4',
    name: 'Mumbai Metro Line 4 (Wadala–Ghatkopar–Kasarvadavali)',
    agency: 'MMRDA',
    ministry: 'Urban Transit PWD',
    state: 'Maharashtra',
    chainage: '32.3 km elevated',
    outlayCr: 3480.0,
    contractMode: 'SPV Multi-Tranche',
    actualPct: 44.0,
    plannedPct: 44.8,
    progressDiff: -0.8,
    progressDiffLabel: '-0.8% civil progress',
    predictedDelayDays: 55,
    riskSeverity: 'moderate',
    confidencePct: 86,
    criticalBlocker: 'Depot Land Possession Mogharpada litigation',
    contractor: 'Reliance Infra - Astaldi JV',
    sector: 'Urban Development',
  },
];

// Comprehensive State & Corridor Archetypes covering all 36 States/UTs
interface StateCorridorSpec {
  state: string;
  projects: Array<{
    prefix: string;
    name: string;
    agency: string;
    ministry: string;
    sector: ProjectRow['sector'];
    contractor: string;
    blocker: string;
  }>;
}

const STATE_CORRIDOR_SPECS: StateCorridorSpec[] = [
  // 1. Andhra Pradesh
  {
    state: 'Andhra Pradesh',
    projects: [
      { prefix: 'PPA-POLA-DAM', name: 'Polavaram Multipurpose Dam & Spillway', agency: 'PPA / CWC', ministry: 'Ministry of Jal Shakti', sector: 'Water', contractor: 'Megha Engineering (MEIL)', blocker: 'Diaphragm wall CWC technical concurrence' },
      { prefix: 'NHAI-VIZ-CHE', name: 'Visakhapatnam-Chennai Industrial Corridor (VCIC)', agency: 'NHAI', ministry: 'MoRTH', sector: 'Highways', contractor: 'KNR Constructions', blocker: 'Section 3D CALA land arbitration in High Court' },
      { prefix: 'SCR-NAD-SKL', name: 'Nadikudi-Srikalahasti New Railway Line', agency: 'South Central Railway', ministry: 'Ministry of Railways', sector: 'Railways', contractor: 'L&T Construction', blocker: 'Forest Diversion Stage-II clearance' },
    ],
  },
  // 2. Arunachal Pradesh
  {
    state: 'Arunachal Pradesh',
    projects: [
      { prefix: 'NHPC-DIB-HYD', name: 'Dibang Multipurpose Hydroelectric Project (2,880 MW)', agency: 'NHPC', ministry: 'Ministry of Power', sector: 'Power', contractor: 'L&T Construction', blocker: 'Gram Sabha compensatory afforestation nod' },
      { prefix: 'MORTH-ARN-FNT', name: 'Arunachal Frontier Highway (NH-913 Mago-Thingbu)', agency: 'BRO / NHIDCL', ministry: 'MoRTH', sector: 'Highways', contractor: 'Patel Engineering', blocker: 'Geotechnical slope stabilization at elevation 3,800m' },
    ],
  },
  // 3. Assam
  {
    state: 'Assam',
    projects: [
      { prefix: 'NRL-EXP-NUM', name: 'Numaligarh Refinery Expansion Project (10 MMTPA)', agency: 'NRL / MoPNG', ministry: 'Ministry of Petroleum', sector: 'Power', contractor: 'Tata Projects', blocker: 'Heavy equipment movement over Brahmaputra jetties' },
      { prefix: 'NHPC-SUB-LOW', name: 'Subansiri Lower Hydroelectric (2,000 MW Gerukamukh)', agency: 'NHPC', ministry: 'Ministry of Power', sector: 'Power', contractor: 'L&T Construction', blocker: 'Dam crest spillway slope reinforcement' },
      { prefix: 'NFR-BOG-DBL', name: 'Bogibeel Rail-cum-Road 2nd Line & Terminal', agency: 'Northeast Frontier Railway', ministry: 'Ministry of Railways', sector: 'Railways', contractor: 'Hindustan Construction Co.', blocker: 'River training guide bund siltation checks' },
      { prefix: 'NHAI-GWH-RNG', name: 'Guwahati Ring Expressway & Deepor Beel Bypass', agency: 'NHAI', ministry: 'MoRTH', sector: 'Highways', contractor: 'Dilip Buildcon Ltd.', blocker: 'Eco-Sensitive Zone (ESZ) NBWL clearance' },
    ],
  },
  // 4. Bihar
  {
    state: 'Bihar',
    projects: [
      { prefix: 'NTPC-BARH-STP', name: 'Barh Super Thermal Power Station Phase II (3,300 MW)', agency: 'NTPC', ministry: 'Ministry of Power', sector: 'Power', contractor: 'BHEL & Doosan', blocker: 'Coal rake unloader line commissioning' },
      { prefix: 'PMRC-PAT-PH1', name: 'Patna Metro Rail Priority Corridor (Danapur-Khemnichak)', agency: 'PMRC / DMRC', ministry: 'MoHUA / Bihar PWD', sector: 'Urban Development', contractor: 'NCC Limited', blocker: 'Mithapur utility corridor shifting' },
      { prefix: 'NHAI-PAT-GAY', name: 'Patna-Gaya-Dobhi 4-Lane Highway (NH-83)', agency: 'NHAI', ministry: 'MoRTH', sector: 'Highways', contractor: 'KNR Constructions', blocker: 'Land possession handover in Jehanabad district' },
      { prefix: 'NHAI-VLM-TR', name: 'NH-727 Valmiki Tiger Reserve Eco-Sensitive Corridor', agency: 'NHAI', ministry: 'MoRTH', sector: 'Highways', contractor: 'Dilip Buildcon Ltd.', blocker: 'MoEFCC Stage-II Forest Diversion & NBWL Wildlife Clearance' },
    ],
  },
  // 5. Chhattisgarh
  {
    state: 'Chhattisgarh',
    projects: [
      { prefix: 'NHAI-RAI-VIZ', name: 'Raipur-Visakhapatnam Economic Corridor (Dhamtari Leg)', agency: 'NHAI', ministry: 'MoRTH', sector: 'Highways', contractor: 'Dilip Buildcon Ltd.', blocker: 'Udanti Sitanadi Tiger Reserve eco-ducts' },
      { prefix: 'SECR-BIL-USL', name: 'Bilaspur-Uslapur 4th Line & Yard Modernization', agency: 'South East Central Railway', ministry: 'Ministry of Railways', sector: 'Railways', contractor: 'L&T Construction', blocker: 'Overhead Traction power shutdown clearances' },
    ],
  },
  // 6. Goa
  {
    state: 'Goa',
    projects: [
      { prefix: 'MORTH-ZUA-BRG', name: 'New Zuari 8-Lane Cable-Stayed Bridge & Observatory', agency: 'MoRTH / Goa PWD', ministry: 'MoRTH', sector: 'Highways', contractor: 'Dilip Buildcon Ltd.', blocker: 'Navigational safety radar beacon sync' },
      { prefix: 'KRCL-GOA-DBL', name: 'Konkan Railway Madgaon-Majorda Doubling', agency: 'Konkan Railway Corp', ministry: 'Ministry of Railways', sector: 'Railways', contractor: 'L&T Construction', blocker: 'Private orchard land acquisition appeals' },
      { prefix: 'NHAI-MOP-AIR', name: 'Mopa International Airport Expressway Link', agency: 'NHAI', ministry: 'MoRTH', sector: 'Highways', contractor: 'Ashoka Buildcon', blocker: 'Forest clearing permissions in Pernem' },
    ],
  },
  // 7. Gujarat
  {
    state: 'Gujarat',
    projects: [
      { prefix: 'NHSRCL-MAHSR', name: 'Mumbai-Ahmedabad High Speed Rail Bullet Train', agency: 'NHSRCL', ministry: 'Ministry of Railways', sector: 'Railways', contractor: 'L&T Construction', blocker: 'Sabarmati multimodal hub integration' },
      { prefix: 'GMRC-AHM-PH2', name: 'Ahmedabad Metro Phase II (Motera-Gandhinagar)', agency: 'GMRC', ministry: 'MoHUA / Gujarat PWD', sector: 'Urban Development', contractor: 'Afcons Infrastructure', blocker: 'CMRS speed trial certificate' },
      { prefix: 'NHAI-AHM-DHO', name: 'Ahmedabad-Dholera Expressway (SIR Greenfield)', agency: 'NHAI', ministry: 'MoRTH', sector: 'Highways', contractor: 'Sadbhav Engineering', blocker: 'Saline marshland soil stabilization' },
    ],
  },
  // 8. Haryana
  {
    state: 'Haryana',
    projects: [
      { prefix: 'NHAI-DWR-EXP', name: 'Dwarka Expressway Gurugram Sector 84-113', agency: 'NHAI', ministry: 'MoRTH', sector: 'Highways', contractor: 'L&T Construction', blocker: 'CPCB air quality winter construction ban' },
      { prefix: 'DFCCIL-WDFC', name: 'Western DFC Rewari-Palwal Overpass Section', agency: 'DFCCIL', ministry: 'Ministry of Railways', sector: 'Railways', contractor: 'L&T Construction', blocker: 'Western Peripheral Expressway crossing GAD' },
    ],
  },
  // 9. Himachal Pradesh
  {
    state: 'Himachal Pradesh',
    projects: [
      { prefix: 'RVNL-BHN-BIL', name: 'Bhanupali-Bilaspur-Beri New Rail Line (63 km)', agency: 'RVNL', ministry: 'Ministry of Railways', sector: 'Railways', contractor: 'Megha Engineering (MEIL)', blocker: 'Tunnel-7 portal slope instability and seepage' },
      { prefix: 'NHAI-KLK-SHM', name: 'Kalka-Shimla 4-Laning (NH-5 Parwanoo-Solan)', agency: 'NHAI', ministry: 'MoRTH', sector: 'Highways', contractor: 'GR Infraprojects', blocker: 'Debris dumping site environmental clearance' },
      { prefix: 'SJVN-LUH-HYD', name: 'Luhri Hydro Electric Project (210 MW Nirath)', agency: 'SJVN Limited', ministry: 'Ministry of Power', sector: 'Power', contractor: 'Patel Engineering', blocker: 'Submergence compensation court settlement' },
    ],
  },
  // 10. Jharkhand
  {
    state: 'Jharkhand',
    projects: [
      { prefix: 'NTPC-N-KARAN', name: 'North Karanpura Super Thermal Power Project (1,980 MW)', agency: 'NTPC', ministry: 'Ministry of Power', sector: 'Power', contractor: 'BHEL & L&T', blocker: 'Ash pond environmental compliance audit' },
      { prefix: 'NHAI-RNC-JSR', name: 'Ranchi-Jamshedpur 4-Laning (NH-33 Saherbera)', agency: 'NHAI', ministry: 'MoRTH', sector: 'Highways', contractor: 'Madhucon Infra', blocker: 'Forest diversion Stage-II in Khunti district' },
    ],
  },
  // 11. Karnataka
  {
    state: 'Karnataka',
    projects: [
      { prefix: 'BMRCL-SUB-RL', name: 'Bengaluru Suburban Rail Project (Mallige Corridor)', agency: 'K-RIDE', ministry: 'Ministry of Railways', sector: 'Railways', contractor: 'L&T Construction', blocker: 'Defence land alienation in Jalahalli' },
      { prefix: 'BMRCL-PH2-RT', name: 'Bengaluru Namma Metro Phase 2 Airport Line (Blue Line)', agency: 'BMRCL', ministry: 'MoHUA / Karnataka', sector: 'Urban Development', contractor: 'Afcons Infrastructure', blocker: 'Yelahanka flyover pier redesign' },
      { prefix: 'KNNL-UPP-BHA', name: 'Upper Bhadra National Irrigation Scheme', agency: 'KNNL / CWC', ministry: 'Ministry of Jal Shakti', sector: 'Water', contractor: 'Megha Engineering (MEIL)', blocker: 'Central capital assistance tranche release' },
      { prefix: 'NHAI-WGH-BAN', name: 'NH-766 Bandipur Tiger Reserve & Western Ghats Forest Corridor', agency: 'NHAI', ministry: 'MoRTH', sector: 'Highways', contractor: 'Dilip Buildcon Ltd.', blocker: 'MoEFCC Stage-II Forest Diversion & Eco-Ducts' },
    ],
  },
  // 12. Kerala
  {
    state: 'Kerala',
    projects: [
      { prefix: 'KMRL-KOC-PH2', name: 'Kochi Metro Phase II Pink Line (JLN-Kakkanad Infopark)', agency: 'KMRL', ministry: 'MoHUA / Kerala PWD', sector: 'Urban Development', contractor: 'Afcons Infrastructure', blocker: 'Civil road widening land compensation' },
      { prefix: 'NHAI-KAS-KNK', name: 'NH-66 6-Laning Thalassery-Mahe Bypass', agency: 'NHAI', ministry: 'MoRTH', sector: 'Highways', contractor: 'EKK Infrastructure', blocker: 'Coastal wetland reclamation buffer' },
      { prefix: 'VIST-VIZ-PRT', name: 'Vizhinjam International Seaport Dedicated Rail Link', agency: 'KRCL / Adani Ports', ministry: 'Ministry of Ports & Railways', sector: 'Railways', contractor: 'Konkan Railway Corp', blocker: 'Tunnel boring machine shaft breakthrough' },
    ],
  },
  // 13. Madhya Pradesh
  {
    state: 'Madhya Pradesh',
    projects: [
      { prefix: 'NWDA-KEN-BET', name: 'Ken-Betwa River Interlinking Link Canal & Daudhan Dam', agency: 'NWDA / KBLPA', ministry: 'Ministry of Jal Shakti', sector: 'Water', contractor: 'L&T Construction', blocker: 'Panna Tiger Reserve landscape wildlife plan' },
      { prefix: 'MPMRCL-BHO-MET', name: 'Bhopal-Indore Metro Rail Orange Line', agency: 'MPMRCL', ministry: 'MoHUA / MP PWD', sector: 'Urban Development', contractor: 'Dilip Buildcon Ltd.', blocker: 'Substation power interconnection' },
    ],
  },
  // 14. Maharashtra
  {
    state: 'Maharashtra',
    projects: [
      { prefix: 'NMIA-NAV-MUM', name: 'Navi Mumbai International Airport Runway & Terminal', agency: 'NMIAL / CIDCO', ministry: 'Ministry of Civil Aviation', sector: 'Urban Development', contractor: 'Tata Projects', blocker: 'Ulwe river diversion and hill cutting' },
      { prefix: 'MSRDC-SAM-MAH', name: 'Samruddhi Mahamarg Phase 3 (Igatpuri-Thane)', agency: 'MSRDC', ministry: 'MoRTH / Maharashtra PWD', sector: 'Highways', contractor: 'Afcons Infrastructure', blocker: 'Kasara Ghat twin tunnel viaduct finishing' },
      { prefix: 'NHAI-TAD-ROA', name: 'NH-353 Tadoba-Andhari Tiger Reserve Corridor 4-Laning', agency: 'NHAI', ministry: 'MoRTH', sector: 'Highways', contractor: 'L&T Construction', blocker: 'MoEFCC Stage-II Forest Diversion & Tree Felling Pass' },
    ],
  },
  // 15. Manipur
  {
    state: 'Manipur',
    projects: [
      { prefix: 'NFR-JIR-IMP', name: 'Jiribam-Imphal Broad Gauge Rail (Bridge 164)', agency: 'Northeast Frontier Railway', ministry: 'Ministry of Railways', sector: 'Railways', contractor: 'HCC - Vensar JV', blocker: 'Makru river gorge Pier-4 slipform stabilization' },
      { prefix: 'MORTH-IMP-RNG', name: 'Imphal Urban Ring Road Bypass Package', agency: 'NHIDCL', ministry: 'MoRTH', sector: 'Highways', contractor: 'BSCPL Infrastructure', blocker: 'Paddy land conversion administrative order' },
      { prefix: 'NHIDCL-LOK-TAK', name: 'NH-2 Loktak Lake Eco-Sensitive Buffer Expressway', agency: 'NHIDCL', ministry: 'MoRTH', sector: 'Highways', contractor: 'Patel Engineering', blocker: 'MoEFCC Forest Stage-II & Wetland Diversion clearance' },
    ],
  },
  // 16. Meghalaya
  {
    state: 'Meghalaya',
    projects: [
      { prefix: 'NHIDCL-SHL-DWK', name: 'Shillong-Dawki Highway (NH-40 JICA Corridor)', agency: 'NHIDCL', ministry: 'MoRTH', sector: 'Highways', contractor: 'SS Infrastructure', blocker: 'Community land ownership compensation settlement' },
      { prefix: 'NFR-BYR-SHL', name: 'Byrnihat-Shillong Strategic Rail Connectivity', agency: 'Northeast Frontier Railway', ministry: 'Ministry of Railways', sector: 'Railways', contractor: 'L&T Construction', blocker: 'Khasi Hills Autonomous District Council NOC' },
      { prefix: 'NHIDCL-KHA-FOR', name: 'NH-106 Khasi Hills Biosphere Reserve Forest Section', agency: 'NHIDCL', ministry: 'MoRTH', sector: 'Highways', contractor: 'SS Infrastructure', blocker: 'MoEFCC Forest Stage-II Compensatory Afforestation' },
    ],
  },
  // 17. Mizoram
  {
    state: 'Mizoram',
    projects: [
      { prefix: 'NFR-BAI-SAI', name: 'Bairabi-Sairang Rail Link (51 km to Aizawl)', agency: 'Northeast Frontier Railway', ministry: 'Ministry of Railways', sector: 'Railways', contractor: 'ABCIPL - Megha JV', blocker: 'Kurung river valley bridge approach rebuilding' },
      { prefix: 'NHIDCL-SEL-LNG', name: 'Seling-Lungsen Kaladan Multimodal Road Link', agency: 'NHIDCL', ministry: 'MoRTH', sector: 'Highways', contractor: 'Dharampal Satyapal Ltd.', blocker: 'Monsoon landslide debris clearing' },
      { prefix: 'NHIDCL-DAM-FOR', name: 'NH-306 Dampa Tiger Reserve Forest Diversion', agency: 'NHIDCL', ministry: 'MoRTH', sector: 'Highways', contractor: 'Dharampal Satyapal Ltd.', blocker: 'MoEFCC Stage-II Forest Diversion Sanction' },
    ],
  },
  // 18. Nagaland
  {
    state: 'Nagaland',
    projects: [
      { prefix: 'NFR-DMP-ZUB', name: 'Dimapur-Zubza Railway Project (Connecting Kohima)', agency: 'Northeast Frontier Railway', ministry: 'Ministry of Railways', sector: 'Railways', contractor: 'Patel Engineering', blocker: 'Pezhe river bridge piling rock strata delay' },
      { prefix: 'NHIDCL-KOH-MAO', name: 'Kohima-Mao 2-Lane with Paved Shoulder (NH-29)', agency: 'NHIDCL', ministry: 'MoRTH', sector: 'Highways', contractor: 'Fortune Group', blocker: 'Right of Way village council clearance' },
      { prefix: 'NHIDCL-INT-FOR', name: 'NH-29 Intanki National Park Forest Buffer 2-Laning', agency: 'NHIDCL', ministry: 'MoRTH', sector: 'Highways', contractor: 'Fortune Group', blocker: 'MoEFCC Forest Clearance & Tree Felling Pass' },
    ],
  },
  // 19. Odisha
  {
    state: 'Odisha',
    projects: [
      { prefix: 'IOCL-PAR-REF', name: 'Paradip Refinery PX-PTA Complex Expansion', agency: 'IOCL', ministry: 'Ministry of Petroleum', sector: 'Power', contractor: 'L&T Hydrocarbon', blocker: 'Ethylene glycol processing tower lift' },
      { prefix: 'ECOR-KHR-BLG', name: 'Khurda Road-Balangir New Railway Line (301 km)', agency: 'East Coast Railway', ministry: 'Ministry of Railways', sector: 'Railways', contractor: 'L&T Construction', blocker: 'Dasapalla forest elephant corridor pass' },
      { prefix: 'NHAI-SAM-CTC', name: 'Sambalpur-Cuttack 4-Laning (NH-55 Package)', agency: 'NHAI', ministry: 'MoRTH', sector: 'Highways', contractor: 'Gayatri Projects', blocker: 'Pallahara section sub-base rework' },
    ],
  },
  // 20. Punjab
  {
    state: 'Punjab',
    projects: [
      { prefix: 'DFCCIL-EDFC-SAH', name: 'Eastern DFC Sahnewal-Pilkhani Double Track', agency: 'DFCCIL', ministry: 'Ministry of Railways', sector: 'Railways', contractor: 'L&T Construction', blocker: 'Ludhiana outer flyover girders launching' },
      { prefix: 'NHAI-DLI-KAT', name: 'Delhi-Amritsar-Katra Expressway Punjab Section', agency: 'NHAI', ministry: 'MoRTH', sector: 'Highways', contractor: 'PNC Infratech', blocker: 'Farmers union arbitration award distribution' },
      { prefix: 'NHAI-SHV-FOR', name: 'NH-205 Shivalik Foothills Forest Corridor Expansion', agency: 'NHAI', ministry: 'MoRTH', sector: 'Highways', contractor: 'PNC Infratech', blocker: 'MoEFCC Stage-II Forest Land Diversion & Tree Felling' },
    ],
  },
  // 21. Rajasthan
  {
    state: 'Rajasthan',
    projects: [
      { prefix: 'HPCL-RAJ-REF', name: 'Rajasthan Refinery Project Pachpadra (HRRL)', agency: 'HPCL / HRRL', ministry: 'Ministry of Petroleum', sector: 'Power', contractor: 'L&T & Engineers India Ltd.', blocker: 'Desalination water intake pipeline testing' },
      { prefix: 'PGCIL-RAJ-SOL', name: 'Bhadla-Bikaner Ultra Mega Solar Power Grid', agency: 'POWERGRID', ministry: 'Ministry of Power', sector: 'Power', contractor: 'Kalpataru Power Transmission', blocker: 'Great Indian Bustard bird diverter installation' },
      { prefix: 'JJM-RAJ-DES', name: 'Jal Jeevan Mission Maru Desert Pipeline Network', agency: 'PHED Rajasthan', ministry: 'Ministry of Jal Shakti', sector: 'Water', contractor: 'NCC Limited', blocker: 'Barmer border zone security clearance' },
    ],
  },
  // 22. Sikkim
  {
    state: 'Sikkim',
    projects: [
      { prefix: 'IRCON-SEV-RNG', name: 'Sevoke-Rangpo Railway Tunnel Link (45 km)', agency: 'IRCON / NF Railway', ministry: 'Ministry of Railways', sector: 'Railways', contractor: 'IRCON International', blocker: 'Melli tunnel squeeze under Teesta river' },
      { prefix: 'NHPC-TEE-VI', name: 'Teesta-VI Hydroelectric Power Project (500 MW)', agency: 'NHPC', ministry: 'Ministry of Power', sector: 'Power', contractor: 'Jaiprakash Associates', blocker: 'Dam silt flushing tunnel rehabilitation' },
      { prefix: 'NHIDCL-KHN-BIO', name: 'NH-10 Khangchendzonga Biosphere Forest Diversion', agency: 'NHIDCL', ministry: 'MoRTH', sector: 'Highways', contractor: 'IRCON International', blocker: 'MoEFCC Stage-II Forest Diversion & Eco-Sensitive clearance' },
    ],
  },
  // 23. Tamil Nadu
  {
    state: 'Tamil Nadu',
    projects: [
      { prefix: 'NPCIL-KUD-NUC', name: 'Kudankulam Nuclear Power Plant Units 3-6', agency: 'NPCIL', ministry: 'Department of Atomic Energy', sector: 'Power', contractor: 'L&T Construction', blocker: 'Reactor containment dome stress testing' },
      { prefix: 'CMRL-PH2-COR', name: 'Chennai Metro Phase II (Madhavaram-SIPCOT Line 3)', agency: 'CMRL', ministry: 'MoHUA / Tamil Nadu', sector: 'Urban Development', contractor: 'Tata Projects', blocker: 'Adyar river underbed TBM drive' },
      { prefix: 'VOCPT-TUT-HAR', name: 'Tuticorin Port Outer Harbour Container Terminal', agency: 'V.O. Chidambaranar Port', ministry: 'Ministry of Ports', sector: 'Highways', contractor: 'Adani Ports', blocker: 'Breakwater arm dolos placement' },
      { prefix: 'NHAI-MUD-TIG', name: 'NH-181 Mudumalai Elephant Corridor Forest Highway', agency: 'NHAI', ministry: 'MoRTH', sector: 'Highways', contractor: 'KNR Constructions', blocker: 'MoEFCC Stage-II Forest Diversion & WII Eco-Ducts' },
    ],
  },
  // 24. Telangana
  {
    state: 'Telangana',
    projects: [
      { prefix: 'NTPC-SOLAR-RAM', name: 'Ramagundam Ultra Mega Floating Solar & Thermal', agency: 'NTPC', ministry: 'Ministry of Power', sector: 'Power', contractor: 'BHEL', blocker: 'Reservoir mooring cable anchor tensioning' },
      { prefix: 'HMRL-HYD-PH2', name: 'Hyderabad Metro Phase 2 Airport Express', agency: 'HMRL', ministry: 'MoHUA / Telangana', sector: 'Urban Development', contractor: 'L&T Construction', blocker: 'Gachibowli junction flyover pier alignment' },
      { prefix: 'NHAI-HYD-BLR', name: 'Hyderabad-Bengaluru Super Corridor Northern Link', agency: 'NHAI', ministry: 'MoRTH', sector: 'Highways', contractor: 'Megha Engineering (MEIL)', blocker: 'Section 3G compensation award reconciliation' },
      { prefix: 'NHAI-KAW-TIG', name: 'NH-363 Kawal Tiger Reserve Forest Section 4-Laning', agency: 'NHAI', ministry: 'MoRTH', sector: 'Highways', contractor: 'Megha Engineering (MEIL)', blocker: 'MoEFCC Stage-II Forest Diversion & CAMPA Handover' },
    ],
  },
  // 25. Tripura
  {
    state: 'Tripura',
    projects: [
      { prefix: 'IRCON-AGA-AKH', name: 'Agartala-Akhaura Indo-Bangla Railway Link', agency: 'IRCON / NF Railway', ministry: 'Ministry of Railways', sector: 'Railways', contractor: 'IRCON International', blocker: 'Integrated Check Post biometric security system' },
      { prefix: 'AAI-AGA-AIR', name: 'Maharaja Bir Bikram Airport International Cargo Hub', agency: 'AAI', ministry: 'Ministry of Civil Aviation', sector: 'Urban Development', contractor: 'NCC Limited', blocker: 'Customs air cargo scanner certification' },
      { prefix: 'NHIDCL-CLD-LEO', name: 'NH-8 Clouded Leopard National Park Forest Link', agency: 'NHIDCL', ministry: 'MoRTH', sector: 'Highways', contractor: 'NCC Limited', blocker: 'MoEFCC Stage-II Forest Diversion & Wildlife Corridor' },
    ],
  },
  // 26. Uttar Pradesh
  {
    state: 'Uttar Pradesh',
    projects: [
      { prefix: 'NHAI-GNG-EXP', name: 'Ganga Expressway Meerut to Prayagraj (594 km)', agency: 'UPEIDA', ministry: 'MoRTH State PWD', sector: 'Highways', contractor: 'Adani Road Transport & IRB', blocker: 'Ganga floodway bridge piling clearance' },
      { prefix: 'JWR-AIRPORT-P', name: 'Noida International Airport (Jewar Phase 1)', agency: 'YAPL / NIAL', ministry: 'Civil Aviation / UP Govt', sector: 'Urban Development', contractor: 'Tata Projects', blocker: 'DGCA final runway calibration flight signoff' },
      { prefix: 'NCRTC-DEL-MRT', name: 'Delhi-Meerut Regional Rapid Transit (RRTS)', agency: 'NCRTC', ministry: 'Ministry of Railways / MoHUA', sector: 'Railways', contractor: 'L&T Construction', blocker: 'Sarai Kale Khan multimodal interchange' },
      { prefix: 'UPMRC-AGR-PH', name: 'Agra Metro Rail Heritage Underground Section', agency: 'UPMRC', ministry: 'MoHUA / UP PWD', sector: 'Urban Development', contractor: 'Afcons Infrastructure', blocker: 'Archaeological Survey of India (ASI) vibration NOC' },
    ],
  },
  // 27. Uttarakhand
  {
    state: 'Uttarakhand',
    projects: [
      { prefix: 'MORTH-CHAR-DHAM', name: 'Char Dham All-Weather Highway (Silkyara-Barkot)', agency: 'NHIDCL / BRO', ministry: 'MoRTH', sector: 'Highways', contractor: 'Navayuga Engineering', blocker: 'Supreme Court HPC slope safety verification' },
      { prefix: 'RVNL-RISH-KAR', name: 'Rishikesh-Karnaprayag Rail Tunnel (125 km)', agency: 'RVNL', ministry: 'Ministry of Railways', sector: 'Railways', contractor: 'Megha Engineering (MEIL)', blocker: 'Tunnel-8 main shear fault rock support' },
      { prefix: 'THDC-TEH-PSP', name: 'Tehri Pumped Storage Hydro Plant (1,000 MW)', agency: 'THDCIL', ministry: 'Ministry of Power', sector: 'Power', contractor: 'HCC Limited', blocker: 'Underground powerhouse butterfly valve assembly' },
      { prefix: 'NHAI-RAJ-COR', name: 'NH-72 Rajaji-Corbett Tiger Corridor Express Highway', agency: 'NHAI', ministry: 'MoRTH', sector: 'Highways', contractor: 'Navayuga Engineering', blocker: 'MoEFCC Stage-II Forest Diversion & Tree Felling Sanction' },
    ],
  },
  // 28. West Bengal
  {
    state: 'West Bengal',
    projects: [
      { prefix: 'KMRC-KOL-MET', name: 'Kolkata Metro Green Line (Under-River Hooghly)', agency: 'KMRC', ministry: 'Ministry of Railways', sector: 'Urban Development', contractor: 'Afcons Infrastructure', blocker: 'Bowbazar subsidence structural remediation' },
      { prefix: 'DFCCIL-EDFC-DAN', name: 'Eastern DFC Sonnagar-Dankuni Section', agency: 'DFCCIL', ministry: 'Ministry of Railways', sector: 'Railways', contractor: 'L&T Construction', blocker: 'Land possession along Asansol railway coal belt' },
      { prefix: 'NHAI-VR-EXP', name: 'Varanasi-Kolkata Expressway Bengal Terminal Link', agency: 'NHAI', ministry: 'MoRTH', sector: 'Highways', contractor: 'Dilip Buildcon Ltd.', blocker: 'Wetland clearance at Uluberia interchange' },
    ],
  },
  // 29. Andaman & Nicobar (UT)
  {
    state: 'Andaman & Nicobar',
    projects: [
      { prefix: 'IPA-GAL-BAY', name: 'Great Nicobar International Transshipment Terminal', agency: 'IPA / Andaman Admin', ministry: 'Ministry of Ports', sector: 'Highways', contractor: 'L&T Construction', blocker: 'Shompen tribal reserve buffer demarcation' },
      { prefix: 'NHIDCL-AND-TRK', name: 'Andaman Trunk Road Middle Strait Bridge (NH-4)', agency: 'NHIDCL', ministry: 'MoRTH', sector: 'Highways', contractor: 'HCC Limited', blocker: 'Jarawa tribal reserve transit restriction' },
    ],
  },
  // 30. Chandigarh (UT)
  {
    state: 'Chandigarh',
    projects: [
      { prefix: 'MORTH-CHD-LOG', name: 'Chandigarh Integrated Multimodal Logistics Hub', agency: 'MoRTH / UT Admin', ministry: 'MoRTH', sector: 'Highways', contractor: 'PNC Infratech', blocker: 'Inter-state Punjab-Haryana municipal drainage tie-in' },
      { prefix: 'NHAI-SKH-FOR', name: 'Sukhna Wildlife Sanctuary Eco-Sensitive Highway Bypass', agency: 'MoRTH / UT Admin', ministry: 'MoRTH', sector: 'Highways', contractor: 'PNC Infratech', blocker: 'MoEFCC Stage-II Forest Diversion & NBWL Clearance' },
    ],
  },
  // 31. Dadra & Nagar Haveli (UT)
  {
    state: 'Dadra & Nagar Haveli',
    projects: [
      { prefix: 'PWD-DAM-CST', name: 'Daman Seafront Coastal Ring Corridor & Bridge', agency: 'UT PWD', ministry: 'MoRTH / MHA', sector: 'Highways', contractor: 'JMC Projects', blocker: 'CRZ clearance for tidal estuary spans' },
    ],
  },
  // 32. Delhi (NCT)
  {
    state: 'Delhi',
    projects: [
      { prefix: 'DMRC-PH4-DC', name: 'Delhi Metro Phase IV (Aerocity-Tughlakabad)', agency: 'DMRC', ministry: 'MoHUA / Delhi Govt', sector: 'Urban Development', contractor: 'L&T Construction', blocker: 'Ridge Management Board forest tree cutting nod' },
      { prefix: 'NHAI-UER-II', name: 'Urban Extension Road-II (UER-II Expressway)', agency: 'NHAI', ministry: 'MoRTH', sector: 'Highways', contractor: 'J. Kumar Infraprojects', blocker: 'Gas pipeline utility encumbrance at Mundka' },
    ],
  },
  // 33. Jammu & Kashmir (UT)
  {
    state: 'Jammu & Kashmir',
    projects: [
      { prefix: 'USBRL-KAT-REA', name: 'Udhampur-Srinagar-Baramulla Rail Link (Chenab Bridge)', agency: 'Northern Railway / KRCL', ministry: 'Ministry of Railways', sector: 'Railways', contractor: 'Afcons & Konkan Railway', blocker: 'Tunnel T-49 CRS speed sanction verification' },
      { prefix: 'NHIDCL-ZOJ-TUN', name: 'Zojila Pass Himalayan Tunnel (14.15 km Baltal)', agency: 'NHIDCL', ministry: 'MoRTH', sector: 'Highways', contractor: 'Megha Engineering (MEIL)', blocker: 'Sub-zero winter concrete heating batching' },
      { prefix: 'CVPPPL-PAKAL', name: 'Pakal Dul Hydroelectric Project (1,000 MW Chenab)', agency: 'CVPPPL', ministry: 'Ministry of Power', sector: 'Power', contractor: 'L&T & Jaiprakash Associates', blocker: 'Underground cavern shear zone convergence' },
      { prefix: 'NHIDCL-DAC-FOR', name: 'NH-1D Dachigam Forest Buffer Strategic Bypass', agency: 'NHIDCL', ministry: 'MoRTH', sector: 'Highways', contractor: 'Megha Engineering (MEIL)', blocker: 'MoEFCC Stage-II Forest Diversion Sanction' },
    ],
  },
  // 34. Ladakh (UT)
  {
    state: 'Ladakh',
    projects: [
      { prefix: 'NHIDCL-Z-MORH', name: 'Z-Morh All-Weather Tunnel (6.5 km Sonamarg-Ladakh)', agency: 'NHIDCL', ministry: 'MoRTH', sector: 'Highways', contractor: 'APCO Infratech', blocker: 'Avalanche protection gallery deflection testing' },
      { prefix: 'BRO-NIM-PAD', name: 'Nimoo-Padum-Darcha Strategic Defense Highway', agency: 'BRO', ministry: 'Ministry of Defence', sector: 'Highways', contractor: 'BRO Border Roads', blocker: 'Shinku La high-altitude pass bridge approaches' },
      { prefix: 'AAI-LEH-TRM', name: 'Leh Kushok Bakula Rimpochee Airport Terminal', agency: 'AAI', ministry: 'Ministry of Civil Aviation', sector: 'Urban Development', contractor: 'Shapoorji Pallonji', blocker: 'Low oxygen HVAC sub-zero commissioning' },
      { prefix: 'BRO-HEM-FOR', name: 'Hemis National Park Eco-Sensitive Strategic Highway', agency: 'BRO', ministry: 'Ministry of Defence', sector: 'Highways', contractor: 'BRO Border Roads', blocker: 'MoEFCC Wildlife & Forest Clearance in Hemis Buffer' },
    ],
  },
  // 35. Lakshadweep (UT)
  {
    state: 'Lakshadweep',
    projects: [
      { prefix: 'AAI-AGA-LAK', name: 'Agatti Island Airport Airstrip Extension into Sea', agency: 'AAI / UT Admin', ministry: 'Ministry of Civil Aviation', sector: 'Urban Development', contractor: 'L&T Construction', blocker: 'Coral reef protection environmental compliance' },
      { prefix: 'ALHW-MIN-PRT', name: 'Minicoy Island Deepwater Eco-Tourism Jetty', agency: 'ALHW', ministry: 'Ministry of Ports', sector: 'Highways', contractor: 'HCC Limited', blocker: 'Lagoon dredging sand disposal permit' },
    ],
  },
  // 36. Puducherry (UT)
  {
    state: 'Puducherry',
    projects: [
      { prefix: 'MoPS-PUD-PRT', name: 'Puducherry Port Coastal Cargo Berth Development', agency: 'Puducherry Port Dept', ministry: 'Ministry of Ports', sector: 'Highways', contractor: 'KNR Constructions', blocker: 'Coastal erosion groynes hydraulic study' },
      { prefix: 'SR-KAR-RAIL', name: 'Karaikal Port Railway Freight Link Doubling', agency: 'Southern Railway', ministry: 'Ministry of Railways', sector: 'Railways', contractor: 'L&T Construction', blocker: 'Salt pan land acquisition compensation' },
      { prefix: 'NHAI-OUS-FOR', name: 'Ousteri Wetland Bird Sanctuary Eco-Corridor Bypass', agency: 'NHAI', ministry: 'MoRTH', sector: 'Highways', contractor: 'KNR Constructions', blocker: 'MoEFCC Wetland & Forest Stage-II Clearance' },
    ],
  },
];

const CONTRACT_MODES = [
  'EPC HAM Mode',
  'EPC Pure Item Rate',
  'World Bank Loan',
  'TBCB Tariff',
  'SPV Multi-Tranche',
  'JICA ODA Loan',
  'Central CapEx',
  'State Grant + Central',
];

// Pseudorandom deterministic number generator with seed
function createSeededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Generate the complete 1,428 records deterministically guaranteeing representation across ALL 36 states and UTs
function generateAll1428Projects(): ProjectRow[] {
  const result: ProjectRow[] = [...SEED_PROJECTS];
  const rand = createSeededRandom(984210);

  const TARGET_COUNT = 1428;
  const REMAINING = TARGET_COUNT - SEED_PROJECTS.length; // 1421

  // First pass: Guarantee at least 15-40 projects for major states and 3-10 for smaller UTs/states
  let countPerSpec: number[] = STATE_CORRIDOR_SPECS.map((spec) => {
    // Higher weight for big states like UP, Maharashtra, Gujarat, TN, Karnataka, Rajasthan
    if (['Uttar Pradesh', 'Maharashtra', 'Gujarat', 'Tamil Nadu', 'Karnataka', 'Rajasthan', 'Madhya Pradesh', 'Bihar', 'West Bengal', 'Andhra Pradesh'].includes(spec.state)) {
      return 60;
    }
    if (['Assam', 'Odisha', 'Kerala', 'Telangana', 'Punjab', 'Haryana', 'Chhattisgarh', 'Jharkhand', 'Uttarakhand', 'Himachal Pradesh', 'Jammu & Kashmir'].includes(spec.state)) {
      return 42;
    }
    if (['Goa', 'Delhi', 'Arunachal Pradesh', 'Meghalaya', 'Manipur', 'Nagaland', 'Mizoram', 'Tripura', 'Sikkim', 'Ladakh'].includes(spec.state)) {
      return 22;
    }
    // UTs
    return 8;
  });

  // Normalize to exactly sum to REMAINING (1421)
  let currentSum = countPerSpec.reduce((a, b) => a + b, 0);
  while (currentSum !== REMAINING) {
    if (currentSum < REMAINING) {
      countPerSpec[Math.floor(rand() * 10)]++; // give to top states
      currentSum++;
    } else {
      const idx = Math.floor(rand() * 10);
      if (countPerSpec[idx] > 20) {
        countPerSpec[idx]--;
        currentSum--;
      }
    }
  }

  STATE_CORRIDOR_SPECS.forEach((spec, specIdx) => {
    const quota = countPerSpec[specIdx];
    for (let i = 0; i < quota; i++) {
      const projectArchetype = spec.projects[i % spec.projects.length];
      const packageNum = Math.floor(i / spec.projects.length) + 1;
      const subCode = String.fromCharCode(65 + (i % 8));
      const id = `${projectArchetype.prefix}-PKG-${packageNum < 10 ? '0' + packageNum : packageNum}${subCode}`;

      const outlayCr = Math.round((rand() * 4800 + 380) * 10) / 10;
      const plannedPct = Math.min(100, Math.round((rand() * 65 + 30) * 10) / 10);

      const roll = rand();
      let predictedDelayDays = 0;
      let riskSeverity: ProjectRow['riskSeverity'] = 'nominal';
      let progressDiff = 0;

      if (roll < 0.18) {
        // Critical
        predictedDelayDays = Math.round(rand() * 180 + 92);
        riskSeverity = 'critical';
        progressDiff = -Math.round((rand() * 19 + 11) * 10) / 10;
      } else if (roll < 0.48) {
        // Moderate
        predictedDelayDays = Math.round(rand() * 60 + 31);
        riskSeverity = 'moderate';
        progressDiff = -Math.round((rand() * 9 + 3) * 10) / 10;
      } else if (roll < 0.72) {
        // Low slip
        predictedDelayDays = Math.round(rand() * 25 + 5);
        riskSeverity = 'low';
        progressDiff = -Math.round((rand() * 4 + 1) * 10) / 10;
      } else {
        // Nominal
        predictedDelayDays = 0;
        riskSeverity = 'nominal';
        progressDiff = Math.round((rand() * 3.5) * 10) / 10;
      }

      const actualPct = Math.max(2, Math.min(100, Math.round((plannedPct + progressDiff) * 10) / 10));
      const confidencePct = Math.round(rand() * 16 + 82);

      let progressDiffLabel = 'On track';
      if (progressDiff < -12) {
        progressDiffLabel = `${progressDiff}% SEVERE LAG`;
      } else if (progressDiff < 0) {
        progressDiffLabel = `${progressDiff}% physical slip`;
      } else if (progressDiff > 0) {
        progressDiffLabel = `+${progressDiff}% ahead of DPR`;
      }

      let criticalBlocker = 'Statutory approvals progressing on critical schedule';
      if (predictedDelayDays > 0) {
        criticalBlocker = `${projectArchetype.blocker} (${spec.state} Div)`;
      }

      const startKm = Math.floor(rand() * 180);
      const endKm = startKm + Math.floor(rand() * 45 + 18);
      let chainage = `Ch. ${startKm}+000 to ${endKm}+500`;
      if (projectArchetype.sector === 'Urban Development') {
        chainage = `${(rand() * 22 + 10).toFixed(1)} km elevated corridor`;
      } else if (projectArchetype.sector === 'Power') {
        chainage = `${Math.floor(rand() * 600 + 150)} ckm line span`;
      } else if (projectArchetype.sector === 'Water') {
        chainage = `Zones ${Math.floor(rand() * 6 + 1)} & ${Math.floor(rand() * 6 + 7)} District Pipeline`;
      }

      const contractMode = CONTRACT_MODES[Math.floor(rand() * CONTRACT_MODES.length)];
      const fullName = `${projectArchetype.name} (Pkg ${packageNum}${subCode} - ${spec.state})`;

      result.push({
        id,
        name: fullName,
        agency: projectArchetype.agency,
        ministry: projectArchetype.ministry,
        state: spec.state,
        chainage,
        outlayCr,
        contractMode,
        actualPct,
        plannedPct,
        progressDiff,
        progressDiffLabel,
        predictedDelayDays,
        riskSeverity,
        confidencePct,
        criticalBlocker,
        contractor: projectArchetype.contractor,
        sector: projectArchetype.sector,
      });
    }
  });

  return result;
}

export const ALL_1428_PROJECTS: ProjectRow[] = generateAll1428Projects();
