import { Router } from 'express';
const router = Router();

// GET /api/v1/districts/summary?state=Maharashtra
router.get('/summary', (req, res) => {
  // Return district-level aggregated delay stats
  // For now, return mock district data based on state
  const state = (req.query.state as string) || 'Maharashtra';
  // Generate 5-8 district summaries with avg delay, project count, risk level
  const districts = generateDistrictSummary(state);
  res.json({ state, districts });
});

function generateDistrictSummary(state: string) {
  // Deterministic mock district data based on state name hash
  const DISTRICTS: Record<string, string[]> = {
        'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Kadapa', 'Rajahmundry'],
        'Arunachal Pradesh': ['Tawang', 'Itanagar', 'Ziro', 'Pasighat', 'Bomdila'],
        'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tezpur'],
        'Bihar': ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Purnia', 'Darbhanga', 'Begusarai'],
        'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Raigarh', 'Rajnandgaon'],
        'Goa': ['North Goa', 'South Goa', 'Panaji', 'Margao'],
        'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Junagadh'],
        'Haryana': ['Faridabad', 'Gurugram', 'Panipat', 'Ambala', 'Rohtak', 'Hisar', 'Karnal'],
        'Himachal Pradesh': ['Shimla', 'Mandi', 'Dharamshala', 'Solan', 'Kullu'],
        'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh', 'Deoghar'],
        'Karnataka': ['Bengaluru Urban', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi', 'Kalaburagi', 'Ballari'],
        'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kannur', 'Kollam'],
        'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Rewa'],
        'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Amravati'],
        'Manipur': ['Imphal', 'Churachandpur', 'Thoubal', 'Bishnupur'],
        'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongpoh'],
        'Mizoram': ['Aizawl', 'Lunglei', 'Champhai', 'Kolasib'],
        'Nagaland': ['Dimapur', 'Kohima', 'Mokokchung', 'Tuensang'],
        'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur', 'Sambalpur', 'Puri', 'Balasore'],
        'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Pathankot'],
        'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar'],
        'Sikkim': ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan'],
        'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Vellore', 'Erode'],
        'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Ramagundam', 'Mahbubnagar'],
        'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailashahar'],
        'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Prayagraj', 'Bareilly', 'Aligarh'],
        'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur'],
        'West Bengal': ['Kolkata', 'Howrah', 'Asansol', 'Siliguri', 'Durgapur', 'Bardhaman', 'Malda', 'Kharagpur'],
        'Andaman & Nicobar': ['Port Blair', 'Nicobar', 'North & Middle Andaman'],
        'Chandigarh': ['Chandigarh'],
        'Dadra & Nagar Haveli': ['Silvassa', 'Daman', 'Diu'],
        'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Central Delhi'],
        'Jammu & Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Kathua', 'Udhampur'],
        'Ladakh': ['Leh', 'Kargil'],
        'Lakshadweep': ['Kavaratti', 'Agatti', 'Minicoy'],
        'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam']
  };
  const stateDistricts = DISTRICTS[state] || ['District 1', 'District 2', 'District 3', 'District 4', 'District 5'];
  const hash = state.split('').reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
  return stateDistricts.map((name, i) => ({
    district: name,
    projectCount: 3 + (Math.abs(hash + i * 7) % 15),
    avgDelayDays: 20 + (Math.abs(hash + i * 13) % 200),
    riskLevel: (Math.abs(hash + i * 11) % 3 === 0) ? 'critical' : (Math.abs(hash + i * 11) % 3 === 1) ? 'high' : 'moderate',
    landAcqPendingPct: +(0.1 + (Math.abs(hash + i * 17) % 70) / 100).toFixed(2),
    rfctlarrAvgStage: 1 + (Math.abs(hash + i * 5) % 5),
  }));
}

export default router;
