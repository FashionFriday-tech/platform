"use client";

import { useState } from "react";
import {
  Shield,
  FileText,
  RefreshCcw,
  Truck,
  XCircle,
  HelpCircle,
  Mail,
  Info,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/layout/Header";

// --- Types ---
type SectionId = 
  | "privacy" 
  | "terms" 
  | "returns" 
  | "shipping" 
  | "cancellation" 
  | "faq" 
  | "contact" 
  | "about";

interface SectionItem {
  id: SectionId;
  label: string;
  icon: React.ReactNode;
  description: string;
}

// --- Navigation Data ---
const sections: SectionItem[] = [
  { id: "about", label: "About Us", icon: <Info size={18} />, description: "Our story and mission" },
  { id: "contact", label: "Contact Us", icon: <Mail size={18} />, description: "Get in touch with support" },
  { id: "faq", label: "FAQ", icon: <HelpCircle size={18} />, description: "Frequently asked questions" },
  { id: "returns", label: "Return & Refund", icon: <RefreshCcw size={18} />, description: "Policies on returns" },
  { id: "shipping", label: "Shipping Policy", icon: <Truck size={18} />, description: "Delivery timelines" },
  { id: "cancellation", label: "Cancellation", icon: <XCircle size={18} />, description: "Order cancellations" },
  { id: "privacy", label: "Privacy Policy", icon: <Shield size={18} />, description: "How we manage data" },
  { id: "terms", label: "Terms & Conditions", icon: <FileText size={18} />, description: "Usage agreements" },
];

export default function HelpCenterPage() {
  const [activeTab, setActiveTab] = useState<SectionId>("about");

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-20 pb-24 md:pt-28">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* --- SIDEBAR NAVIGATION --- */}
          <aside className="lg:col-span-3 lg:col-start-1">
            <div className="lg:sticky lg:top-28">
              <h1 className="text-2xl font-bold mb-6 hidden lg:block">Help Center</h1>
              
              {/* Desktop Nav: Vertical List */}
              <nav className="hidden lg:flex flex-col gap-1">
                {sections.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`group flex items-center justify-between w-full p-4 rounded-2xl text-left transition-all duration-300 border
                    ${activeTab === item.id 
                      ? "bg-black text-white border-black shadow-lg" 
                      : "bg-white text-zinc-500 border-transparent hover:bg-white hover:border-zinc-200 hover:text-black"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1 rounded-md ${activeTab === item.id ? "text-white" : "text-zinc-400 group-hover:text-black"}`}>
                         {item.icon}
                      </div>
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>
                    {activeTab === item.id && <ChevronRight size={16} />}
                  </button>
                ))}
              </nav>

              {/* Mobile Nav: Horizontal Scroll */}
              <div className="lg:hidden mb-6 -mx-4 px-4 overflow-x-auto no-scrollbar flex gap-3 pb-2">
                 {sections.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold border transition-all whitespace-nowrap
                      ${activeTab === item.id 
                        ? "bg-black text-white border-black" 
                        : "bg-white text-zinc-600 border-zinc-200"}`}
                    >
                       {item.icon}
                       {item.label}
                    </button>
                 ))}
              </div>
            </div>
          </aside>

          {/* --- MAIN CONTENT AREA --- */}
          <div className="lg:col-span-8 lg:col-start-5 min-h-[600px]">
            {/* Dynamic Content Rendering */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               {activeTab === "about" && <AboutContent />}
               {activeTab === "contact" && <ContactContent />}
               {activeTab === "faq" && <FAQContent />}
               {activeTab === "returns" && <ReturnsContent />}
               {activeTab === "shipping" && <ShippingContent />}
               {activeTab === "cancellation" && <CancellationContent />}
               {activeTab === "privacy" && <PrivacyContent />}
               {activeTab === "terms" && <TermsContent />}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// ==========================================
// CONTENT COMPONENTS
// ==========================================

const AboutContent = () => (
  <article className="space-y-8">
    <div className="relative h-64 w-full rounded-3xl overflow-hidden mb-8 group">
       <img 
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop" 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        alt="About Us"
       />
       <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <h2 className="text-4xl font-bold text-white tracking-tight">Our Story</h2>
       </div>
    </div>
    
    <div className="prose prose-zinc max-w-none">
      <h3 className="text-2xl font-bold text-black mb-4">Fashion Friday: Redefining Streetwear</h3>
      <p className="text-zinc-600 leading-relaxed mb-6">
        Founded in 2024, Fashion Friday began with a simple idea: luxury shouldn't be loud. 
        We believe in the power of monochrome minimalism. Our pieces are designed for those 
        who speak through their style without saying a word.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
         <div className="p-6 bg-white border border-zinc-100 rounded-3xl shadow-sm">
            <h4 className="font-bold text-lg mb-2">Our Mission</h4>
            <p className="text-sm text-zinc-500">To provide high-quality, sustainable fashion that stands the test of time, both in durability and style.</p>
         </div>
         <div className="p-6 bg-white border border-zinc-100 rounded-3xl shadow-sm">
            <h4 className="font-bold text-lg mb-2">Our Vision</h4>
            <p className="text-sm text-zinc-500">To become the global destination for minimalist enthusiasts who value craftsmanship over logos.</p>
         </div>
      </div>
    </div>
  </article>
);

const ContactContent = () => (
  <div className="max-w-2xl">
     <h2 className="text-3xl font-bold mb-2">Get in Touch</h2>
     <p className="text-zinc-500 mb-8">We'd love to hear from you. Send us a message and we'll respond within 24 hours.</p>
     
     <form className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
           <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">First Name</label>
              <input type="text" className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-black transition-all" placeholder="Jane" />
           </div>
           <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Last Name</label>
              <input type="text" className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-black transition-all" placeholder="Doe" />
           </div>
        </div>

        <div className="space-y-2">
           <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Email Address</label>
           <input type="email" className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-black transition-all" placeholder="jane@example.com" />
        </div>

        <div className="space-y-2">
           <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Message</label>
           <textarea rows={5} className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-black transition-all resize-none" placeholder="How can we help you today?"></textarea>
        </div>

        <button className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
           Send Message <ArrowRight size={18} />
        </button>
     </form>

     <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 bg-white rounded-2xl border border-zinc-100 flex items-center gap-4">
           <div className="p-3 bg-zinc-50 rounded-full"><Mail size={20}/></div>
           <div>
              <p className="text-xs text-zinc-400 font-bold uppercase">Email Support</p>
              <p className="font-medium">support@fashionfriday.com</p>
           </div>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-zinc-100 flex items-center gap-4">
           <div className="p-3 bg-zinc-50 rounded-full"><HelpCircle size={20}/></div>
           <div>
              <p className="text-xs text-zinc-400 font-bold uppercase">Live Chat</p>
              <p className="font-medium">Mon-Fri, 9am - 6pm</p>
           </div>
        </div>
     </div>
  </div>
);

const FAQContent = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const faqs = [
     { q: "How do I track my order?", a: "Once your order ships, you will receive an email with a tracking number and link. You can also track it in your profile." },
     { q: "What is your return policy?", a: "We accept returns within 14 days of delivery. Items must be unworn with tags attached. Refunds are processed to the original payment method." },
     { q: "Do you ship internationally?", a: "Yes, we ship to over 50 countries worldwide. Shipping costs are calculated at checkout." },
     { q: "Can I cancel my order?", a: "You can cancel your order within 2 hours of placing it. After that, it is processed by our warehouse and cannot be changed." },
     { q: "How do I use my gift card?", a: "Enter your unique gift card code at the checkout page in the 'Discount Code' box." },
  ];

  return (
     <div className="max-w-3xl">
        <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
           {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden transition-all duration-300">
                 <button 
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left"
                 >
                    <span className="font-bold text-lg">{faq.q}</span>
                    <span className={`p-2 rounded-full transition-colors ${openIndex === idx ? "bg-black text-white" : "bg-zinc-100 text-black"}`}>
                       {openIndex === idx ? <Minus size={16}/> : <Plus size={16}/>}
                    </span>
                 </button>
                 <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${openIndex === idx ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                       <p className="px-6 pb-6 text-zinc-500 leading-relaxed">{faq.a}</p>
                    </div>
                 </div>
              </div>
           ))}
        </div>
     </div>
  )
};

const ReturnsContent = () => (
   <div className="space-y-6 max-w-3xl text-zinc-600">
      <h2 className="text-3xl font-bold text-black mb-4">Return & Refund Policy</h2>
      <p className="font-medium text-black">Last updated: December 2024</p>
      
      <div className="bg-white p-6 rounded-3xl border border-zinc-100 space-y-4">
         <h3 className="text-xl font-bold text-black">1. Return Window</h3>
         <p>You have 14 days from the date of delivery to request a return. Requests made after this period will not be accepted.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-zinc-100 space-y-4">
         <h3 className="text-xl font-bold text-black">2. Conditions for Return</h3>
         <ul className="list-disc pl-5 space-y-2">
            <li>Items must be unused, unwashed, and in original condition.</li>
            <li>All original tags and packaging must be intact.</li>
            <li>Footwear must be returned in the original shoe box.</li>
         </ul>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-zinc-100 space-y-4">
         <h3 className="text-xl font-bold text-black">3. Refund Process</h3>
         <p>Once we receive your return, we will inspect the item. If approved, a refund will be initiated to your original payment method within 5-7 business days.</p>
      </div>
   </div>
);

const ShippingContent = () => (
   <div className="space-y-6 max-w-3xl text-zinc-600">
      <h2 className="text-3xl font-bold text-black mb-6">Shipping Policy</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
         <div className="p-6 bg-zinc-900 text-white rounded-3xl">
            <h4 className="font-bold text-lg mb-1">Standard Shipping</h4>
            <p className="text-zinc-400 text-sm">5-7 Business Days</p>
            <p className="mt-4 font-mono text-xl">Free</p>
         </div>
         <div className="p-6 bg-white border border-zinc-200 rounded-3xl">
            <h4 className="font-bold text-lg mb-1">Express Shipping</h4>
            <p className="text-zinc-500 text-sm">1-2 Business Days</p>
            <p className="mt-4 font-mono text-xl text-black">₹250</p>
         </div>
      </div>
      <p>
         We ship to all states across India. Orders are processed within 24 hours of payment confirmation. 
         Please note that delivery times may vary during public holidays and sale periods.
      </p>
   </div>
);

const CancellationContent = () => (
   <div className="space-y-6 max-w-3xl text-zinc-600">
      <h2 className="text-3xl font-bold text-black mb-6">Cancellation Policy</h2>
      <p>
         We understand that plans change. Here is how we handle order cancellations:
      </p>
      <div className="space-y-4">
         <div className="flex gap-4">
            <div className="min-w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">1</div>
            <div>
               <h4 className="font-bold text-black">Before Shipping</h4>
               <p className="text-sm mt-1">You can cancel your order directly from your "My Orders" page if the status is "Processing". A full refund will be issued instantly.</p>
            </div>
         </div>
         <div className="flex gap-4">
            <div className="min-w-8 h-8 rounded-full bg-zinc-200 text-zinc-500 flex items-center justify-center font-bold">2</div>
            <div>
               <h4 className="font-bold text-black">After Shipping</h4>
               <p className="text-sm mt-1">If the order has already been dispatched, we cannot cancel it. You will need to receive the package and initiate a return request.</p>
            </div>
         </div>
      </div>
   </div>
);

const PrivacyContent = () => (
   <div className="space-y-6 max-w-3xl text-zinc-600">
      <h2 className="text-3xl font-bold text-black mb-6">Privacy Policy</h2>
      <p className="text-sm bg-yellow-50 text-yellow-800 p-4 rounded-xl border border-yellow-100">
         We value your privacy and are committed to protecting your personal data.
      </p>
      <div className="space-y-4">
         <h3 className="text-lg font-bold text-black">Information We Collect</h3>
         <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or sign up for our newsletter. This includes name, email, shipping address, and payment information.</p>
         
         <h3 className="text-lg font-bold text-black mt-6">How We Use Your Data</h3>
         <p>We use your data to process transactions, improve our website, and communicate with you about your orders and promotions.</p>
      </div>
   </div>
);

const TermsContent = () => (
   <div className="space-y-6 max-w-3xl text-zinc-600">
      <h2 className="text-3xl font-bold text-black mb-6">Terms & Conditions</h2>
      <p>Welcome to Fashion Friday. By accessing or using our website, you agree to be bound by these terms.</p>
      
      <div className="space-y-4 mt-6">
         <h3 className="text-lg font-bold text-black">1. Intellectual Property</h3>
         <p>All content on this site, including text, graphics, logos, and images, is the property of Fashion Friday and protected by copyright laws.</p>
         
         <h3 className="text-lg font-bold text-black">2. User Accounts</h3>
         <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>

         <h3 className="text-lg font-bold text-black">3. Limitation of Liability</h3>
         <p>Fashion Friday shall not be liable for any indirect, incidental, or consequential damages arising out of the use of our service.</p>
      </div>
   </div>
);