"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { quoteService } from "@/api/quoteService";
import { Activity, CheckSquare, File, FileText as DocumentIcon, CheckCircle, FileText as FileIcon, ClipboardList, ChevronDown, ChevronUp } from "lucide-react";
import { orderService } from "@/api/orderService";
import { calculateUploadedDocuments, REQUIRED_DOCUMENTS } from '@/utils/documentUtils';

export default function Header({loading, userData, uploadedDocsCount, activeLink }) {
  const [showStats, setShowStats] = useState(false);
  const [interventions, setInterventions] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [showLinks, setShowLinks] = useState(false);
  const router = useRouter();

  const links = [
    { name: "Intervention", icon: CheckCircle, key: "intervention" },
    { name: "Facture", icon: FileIcon, key: "facture" },
    { name: "Mes documents", icon: ClipboardList, key: "documents" },
  ];

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
       
        // Fetch interventions
        const result = await orderService.getOrders();
        if (result.status === 'success') {
          setInterventions(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch interventions');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setInterventions([]);
      }
    };

    const fetchQuotes = async () => {
      try {
        const allQuotes = await quoteService.getQuotes();
        setQuotes(allQuotes);
      } catch (error) {
        console.error('Error fetching quotes:', error);
      }
    };


    fetchInterventions();
    fetchQuotes();
  }, []);

  const stats2 = {
    enCours: interventions.filter(item => item.status === "En Cours").length,
    termine: interventions.filter(item => item.status === "Terminé").length,
    factures: quotes.filter(quote => quote.status === "accepted").length,
    documents: userData ? `${calculateUploadedDocuments(userData.id)}/${REQUIRED_DOCUMENTS.length}` : '0/0'
  };

  const handleLinkClick = (link) => {
    setShowLinks(false);
    if (link.key === "facture") {
      router.push("/facture");
    }
    if (link.key === "documents") {
      router.push("/docs");
    }
    if (link.key === "intervention") {
      router.push("/");
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4 lg:hidden">
        <button
          onClick={() => setShowStats(!showStats)}
          className="bg-sky-700 text-white px-4 py-2 rounded-lg"
        >
          {showStats ? "Hide Statistics" : "Show Statistics"}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 pb-1 justify-items-center">
        {/* Statistics Section */}
        <div className={`flex flex-col items-center p-5 ${showStats ? "block" : "hidden"} lg:flex`}>
          <Activity className="w-6 h-6 text-sky-700 mb-1" />
          <p className="text-sm text-gray-500 font-bold text-center">Intervention en cours</p>
          <p className="text-lg font-semibold text-[#333]">{stats2.enCours}</p>
        </div>
        <div className={`flex flex-col items-center p-5 ${showStats ? "block" : "hidden"} lg:flex`}>
          <CheckSquare className="w-6 h-6 text-sky-700 mb-1" />
          <p className="text-sm text-gray-500 font-bold text-center">Intervention terminée</p>
          <p className="text-lg font-semibold text-[#333]">{stats2.termine}</p>
        </div>
        {/* Profile Section */}
        <div className="flex flex-col items-center mx-auto p-5 lg:p-0">
          {loading ? (
            <div className="animate-pulse">
              <div className="w-20 h-20 rounded-full bg-gray-200 mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
            </div>
          ) : (
            <>
              <img
                src={userData?.avatar || "https://symbols.getvecta.com/stencil_34/21_female-factory-worker.7052c847e3.svg"}
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-white shadow-md mx-auto"
              />
              <h2 className="text-xl font-semibold mt-2 text-[#333] text-center">{userData?.first_name  || 'Loading...'}</h2>
              <p className="text-gray-500 text-center">{userData?.role || 'Loading...'}</p>
            </>
          )}
        </div>
        {/* More Statistics Section */}
        <div className={`flex flex-col items-center p-5 ${showStats ? "block" : "hidden"} lg:flex`}>
          <File className="w-6 h-6 text-sky-700 mb-1" />
          <p className="text-sm text-gray-500 font-bold text-center">Facture</p>
          <p className="text-lg font-semibold text-[#333]">{stats2.factures}</p>
        </div>
        <div className={`flex flex-col items-center p-5 ${showStats ? "block" : "hidden"} lg:flex`}>
          <DocumentIcon className="w-6 h-6 text-sky-700 mb-1" />
          <p className="text-sm text-gray-500 font-bold text-center">Mes documents</p>
          <p className="text-lg font-semibold text-[#333]">{stats2.documents}</p> 
        </div>
      </div>

      {/* Links Section */}
      <div className="lg:hidden flex justify-center items-center mt-4">
        <button
          onClick={() => setShowLinks(!showLinks)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-lg"
        >
          <span className="font-bold text-gray-700">{links.find(link => link.key === activeLink).name}</span>
          {showLinks ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>
      <div className={`lg:flex flex-wrap justify-center items-center gap-6 mt-4 border-b bg-[#F2F6FA] ${showLinks ? "block" : "hidden"} lg:block`}>
        {links.map((link) => (
          <button
            key={link.key}
            className={`flex items-center space-x-2 px-4 py-2 transition-colors duration-200 ${activeLink === link.key ? "text-red-600 font-bold border-b-2 border-red-600" : "text-gray-500 font-bold border-b-2 border-[#F2F6FA]"} hover:text-red-600`}
            onClick={() => handleLinkClick(link)}
          >
            <link.icon className="w-5 h-5" />
            <span>{link.name}</span>
          </button>
        ))}
      </div>
    </>
  );
}
