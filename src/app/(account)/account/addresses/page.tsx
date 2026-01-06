"use client";

import { useState, useMemo } from "react";
import {
  MapPin,
  Plus,
  Home,
  Briefcase,
  MoreVertical,
  Check,
  X,
  Trash2,
  Phone,
  Star,
  Edit2,
} from "lucide-react";
import { Header } from "@/components/layout/Header";

// --- Types ---
type AddressType = "Home" | "Work" | "Other";

interface Address {
  id: string;
  name: string;
  phone: string;
  altPhone?: string;
  pincode: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  district: string;
  state: string;
  type: AddressType;
  isDefault: boolean;
}

// --- Data: States & Districts of India ---
// (Large static data kept outside component to avoid re-creation on render)
const indianStatesAndDistricts: Record<string, string[]> = {
  "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
  "Arunachal Pradesh": ["Tawang", "West Kameng", "East Kameng", "Papum Pare", "Kurung Kumey", "Kra Daadi", "Lower Subansiri", "Upper Subansiri", "West Siang", "East Siang", "Siang", "Upper Siang", "Lower Siang", "Lower Dibang Valley", "Dibang Valley", "Anjaw", "Lohit", "Namsai", "Changlang", "Tirap", "Longding"],
  "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"],
  "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
  "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"],
  "Goa": ["North Goa", "South Goa"],
  "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
  "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
  "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
  "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"],
  "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davangere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"],
  "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
  "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
  "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
  "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
  "Meghalaya": ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"],
  "Mizoram": ["Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Serchhip"],
  "Nagaland": ["Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"],
  "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"],
  "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar", "Sangrur", "Shahid Bhagat Singh Nagar", "Sri Muktsar Sahib", "Tarn Taran"],
  "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
  "Sikkim": ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
  "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
  "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal", "Nagarkurnool", "Nalgonda", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal (Rural)", "Warangal (Urban)", "Yadadri Bhuvanagiri"],
  "Tripura": ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
  "Uttar Pradesh": ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddh Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
  "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
  "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"],
  "Andaman and Nicobar Islands": ["Nicobar", "North and Middle Andaman", "South Andaman"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli", "Daman", "Diu"],
  "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
  "Jammu and Kashmir": ["Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"],
  "Ladakh": ["Kargil", "Leh"],
  "Lakshadweep": ["Lakshadweep"],
  "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"]
};

// Mock Initial Data
const initialAddresses: Address[] = [
  {
    id: "1",
    name: "Ajmal",
    phone: "7558969093",
    pincode: "676552",
    addressLine1: "Flat 4B, Skyline Apartments",
    addressLine2: "Puthanathani Road",
    city: "Puthanathani",
    district: "Malappuram",
    state: "Kerala",
    type: "Home",
    isDefault: true,
  },
  {
    id: "2",
    name: "Ajmal Office",
    phone: "9876543210",
    altPhone: "0483292929",
    pincode: "560001",
    addressLine1: "Tech Park, Sector 4",
    addressLine2: "MG Road",
    city: "Indiranagar",
    district: "Bengaluru Urban",
    state: "Karnataka",
    type: "Work",
    isDefault: false,
  },
];

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // --- Actions ---

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      setAddresses(addresses.filter((addr) => addr.id !== id));
    }
  };

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleSaveAddress = (addressData: Address) => {
    let updatedAddresses = [...addresses];

    if (addressData.isDefault) {
      updatedAddresses = updatedAddresses.map((addr) => ({
        ...addr,
        isDefault: false,
      }));
    } else if (updatedAddresses.length === 0) {
      addressData.isDefault = true;
    }

    const existingIndex = updatedAddresses.findIndex((a) => a.id === addressData.id);

    if (existingIndex >= 0) {
      updatedAddresses[existingIndex] = addressData;
    } else {
      updatedAddresses.push(addressData);
    }

    setAddresses(updatedAddresses);
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-20 md:pb-20 sm:pt-24">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Addresses</h1>
            <p className="text-zinc-500 mt-2">
              Manage your saved addresses for fast and easy checkout.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex sm:hidden items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-zinc-800 transition-all active:scale-95"
          >
            <Plus size={20} /> Add New Address
          </button>
        </div>

        {/* Address Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <button
            onClick={openAddModal}
            // Optimization: Fixed Tailwind min-h class for standard spacing
            className="hidden min-h-72 sm:flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 rounded-3xl text-zinc-400 hover:border-black hover:text-black hover:bg-white transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus size={32} />
            </div>
            <span className="font-semibold">Add New Address</span>
          </button>

          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
              onEdit={openEditModal}
            />
          ))}
        </div>
      </main>

      {isModalOpen && (
        <AddressFormModal
          initialData={editingAddress}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveAddress}
        />
      )}
    </div>
  );
}

// --- Sub-Component: Address Card ---

const AddressCard = ({
  address,
  onDelete,
  onSetDefault,
  onEdit,
}: {
  address: Address;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  onEdit: (addr: Address) => void;
}) => {
  return (
    // Optimization: min-h-72 (standard)
    <div className={`relative p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between min-h-72 bg-white
      ${address.isDefault ? "border-black ring-1 ring-black shadow-lg" : "border-zinc-200 hover:border-zinc-400 shadow-sm"}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-600 uppercase tracking-wide">
            {address.type === "Home" ? <Home size={12} /> : address.type === "Work" ? <Briefcase size={12} /> : <MapPin size={12} />}
            {address.type}
          </span>
          {address.isDefault && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-black text-white uppercase tracking-wide">
              <Star size={10} fill="white" /> Default
            </span>
          )}
        </div>
        
        <div className="flex gap-1">
          <button 
            onClick={() => onEdit(address)}
            className="p-2 hover:bg-zinc-100 rounded-full text-zinc-500 hover:text-black transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => onDelete(address.id)}
            className="p-2 hover:bg-red-50 rounded-full text-zinc-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Optimization: flex-grow -> grow */}
      <div className="space-y-1 grow">
        <h3 className="font-bold text-lg text-zinc-900">{address.name}</h3>
        <p className="text-zinc-500 text-sm line-clamp-1">{address.addressLine1}</p>
        <p className="text-zinc-500 text-sm line-clamp-1">{address.addressLine2}</p>
        <p className="text-zinc-900 font-medium text-sm mt-1">
          {address.city}, {address.district}
        </p>
        <p className="text-zinc-500 text-sm">
           {address.state} - <span className="text-zinc-900 font-medium">{address.pincode}</span>
        </p>
        
        <div className="flex flex-col gap-1 mt-3">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 bg-zinc-50 w-fit px-3 py-1.5 rounded-lg">
            <Phone size={14} />
            <span>+91 {address.phone}</span>
          </div>
          {address.altPhone && (
             <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 px-3">
               <span className="text-zinc-400">Alt:</span> +91 {address.altPhone}
             </div>
          )}
        </div>
      </div>

      {!address.isDefault && (
        <div className="pt-6 mt-4 border-t border-zinc-100">
          <button
            onClick={() => onSetDefault(address.id)}
            className="text-sm font-semibold text-zinc-500 hover:text-black transition-colors flex items-center gap-2"
          >
            Set as Default Address
          </button>
        </div>
      )}
    </div>
  );
};

// --- Sub-Component: Address Form Modal ---

const AddressFormModal = ({
  initialData,
  onClose,
  onSave,
}: {
  initialData: Address | null;
  onClose: () => void;
  onSave: (addr: Address) => void;
}) => {
  const [formData, setFormData] = useState<Partial<Address>>(
    initialData || {
      name: "",
      phone: "",
      altPhone: "",
      pincode: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      district: "",
      state: "",
      type: "Home",
      isDefault: false,
    }
  );

  const availableDistricts = useMemo(() => {
     if (formData.state && indianStatesAndDistricts[formData.state]) {
        return indianStatesAndDistricts[formData.state];
     }
     return [];
  }, [formData.state]);

  // Fix: Correctly handling type safety for state updates
  const handleChange = (field: keyof Address, value: string | boolean | undefined) => {
    setFormData((prev) => {
        // Create base update object
        const updates: Partial<Address> = { [field]: value };
        
        // If state changes, explicitly reset district
        if (field === 'state') {
            updates.district = "";
        }
        
        return { ...prev, ...updates };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.pincode || !formData.addressLine1 || !formData.state || !formData.district) {
      alert("Please fill in all required fields");
      return;
    }

    onSave({
      id: initialData?.id || Date.now().toString(), 
      ...formData,
    } as Address);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Optimization: rounded-4xl */}
      <div className="relative bg-white w-full max-w-2xl rounded-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="px-8 py-6 border-b border-zinc-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold">{initialData ? "Edit Address" : "Add New Address"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar">
          <form id="address-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Full Name" placeholder="e.g. Ajmal" value={formData.name || ""} onChange={(v: string) => handleChange("name", v)} />
              <InputGroup label="Phone Number" placeholder="10-digit mobile number" type="tel" prefix="+91" value={formData.phone || ""} onChange={(v: string) => handleChange("phone", v)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <InputGroup label="Alt Phone (Optional)" placeholder="Alternate number" type="tel" prefix="+91" value={formData.altPhone || ""} onChange={(v: string) => handleChange("altPhone", v)} />
               <InputGroup label="Pincode" placeholder="e.g. 676552" type="number" value={formData.pincode || ""} onChange={(v: string) => handleChange("pincode", v)} />
            </div>

            <div className="space-y-6">
              <InputGroup 
                label="Flat, House no., Building, Company" 
                placeholder="e.g. Flat 4B, Skyline Apartments" 
                value={formData.addressLine1 || ""} 
                onChange={(v: string) => handleChange("addressLine1", v)} 
              />
              <InputGroup 
                label="Area, Street, Sector, Village" 
                placeholder="e.g. Puthanathani Road" 
                value={formData.addressLine2 || ""} 
                onChange={(v: string) => handleChange("addressLine2", v)} 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* State Dropdown */}
               <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">State</label>
                <div className="relative">
                    <select 
                        className="w-full bg-zinc-50 border-0 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-black appearance-none cursor-pointer font-medium"
                        value={formData.state || ""}
                        onChange={(e) => handleChange("state", e.target.value)}
                    >
                        <option value="" disabled>Select State</option>
                        {Object.keys(indianStatesAndDistricts).map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <MoreVertical size={16} className="rotate-90 text-zinc-400"/>
                    </div>
                </div>
              </div>

               {/* District Dropdown (Dynamic) */}
               <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">District</label>
                <div className="relative">
                    <select 
                        className="w-full bg-zinc-50 border-0 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-black appearance-none cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        value={formData.district || ""}
                        onChange={(e) => handleChange("district", e.target.value)}
                        disabled={!formData.state}
                    >
                        <option value="" disabled>Select District</option>
                        {availableDistricts.map(dist => (
                            <option key={dist} value={dist}>{dist}</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <MoreVertical size={16} className="rotate-90 text-zinc-400"/>
                    </div>
                </div>
              </div>

              <div className="md:col-span-2">
                 <InputGroup label="Locality / Town / City" placeholder="e.g. Puthanathani" value={formData.city || ""} onChange={(v: string) => handleChange("city", v)} />
              </div>
            </div>

            <hr className="border-dashed border-zinc-200 my-2" />

            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3 block">Type of address</label>
                    <div className="flex gap-3">
                        {(["Home", "Work", "Other"] as const).map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => handleChange("type", type)}
                                className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all
                                ${formData.type === type 
                                    ? "bg-black text-white border-black" 
                                    : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400"}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-xl cursor-pointer" onClick={() => handleChange("isDefault", !formData.isDefault)}>
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${formData.isDefault ? "bg-black border-black" : "border-zinc-300 bg-white"}`}>
                        {formData.isDefault && <Check size={14} className="text-white" />}
                    </div>
                    <span className="text-sm font-medium text-zinc-900 select-none">Make this my default address</span>
                </div>
            </div>

          </form>
        </div>

        <div className="px-8 py-5 border-t border-zinc-100 bg-white flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-3.5 rounded-full border border-zinc-200 font-bold text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="address-form"
            className="flex-1 px-6 py-3.5 rounded-full bg-black text-white font-bold hover:bg-zinc-800 transition-colors shadow-lg active:scale-[0.98]"
          >
            {initialData ? "Update Address" : "Save Address"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Reusable Input Component ---

interface InputGroupProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  prefix?: string;
}

const InputGroup = ({ label, placeholder, value, onChange, type = "text", prefix }: InputGroupProps) => (
  <div className="space-y-2">
    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">{label}</label>
    <div className="relative group focus-within:ring-2 ring-black/10 rounded-xl transition-all">
      {prefix && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-medium select-none z-10">
          {prefix}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-zinc-50 border-0 rounded-xl py-3.5 outline-none font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-black transition-all
        ${prefix ? "pl-12 pr-4" : "px-4"}`}
      />
    </div>
  </div>
);