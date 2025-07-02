"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Search, Phone, MapPin, CheckCircle, FileText as FileIcon, ClipboardList, Activity, CheckSquare, File, FileText as DocumentIcon, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { orderService } from '../api/orderService';
import { userService } from '../api/userService';
import { quoteService } from "@/api/quoteService";
import { calculateUploadedDocuments, REQUIRED_DOCUMENTS } from '../utils/documentUtils';
import OrderDetailPopup from './components/OrderDetailPopup';

export default function InterventionList() {
  const [search, setSearch] = useState("");
  const [activeLink, setActiveLink] = useState("intervention");
  const [showStats, setShowStats] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState([]);
  const [userData, setUserData] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const router = useRouter(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch user data
        const userResult = await userService.getCurrentUser();
        if (userResult.status === 'success') {
          setUserData(userResult.data);
          console.log('user : ',userResult.data.role);
          
        }

        // Fetch interventions
        const result = await orderService.getOrderByUserId(userResult.data.role, userResult.data.id);
        if (result.status === 'success') {
          
          setInterventions(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch interventions');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setInterventions([]);
      } finally {
        setLoading(false);
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

    fetchQuotes();
    fetchData();
  }, []);

 

  // Calculate statistics
  const stats = {
    enCours: interventions.filter(item => item.status === "En Cours").length,
    termine: interventions.filter(item => item.status === "Terminé").length,
    factures: quotes.filter(quote => quote.status === 'accepted').length,
    documents: userData ? `${calculateUploadedDocuments(userData.id)}/${REQUIRED_DOCUMENTS.length}` : '0/0'
  };

  const links = [
    { name: "Intervention", icon: CheckCircle, key: "intervention" },
    { name: "Facture", icon: FileIcon, key: "facture" },
    { name: "Mes documents", icon: ClipboardList, key: "documents" },
  ];
  
  const handleLinkClick = (link) => {
    setActiveLink(link.key);
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

  const formatDateTime = (date, time) => {
    const formattedDate = new Date(date).toLocaleDateString('fr-FR');
    const formattedTime = new Date(time).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return { date: formattedDate, time: formattedTime };
  };

  const handleOrderClick = (order) => {
    // Format the date and time for the popup
    const formattedDate = new Date(order.date_intervention).toLocaleDateString('fr-FR');
    const formattedTime = new Date(order.heure_intervention).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Prepare order details for the popup
    const orderDetails = {
      id: order.id,
      status: order.status,
      acceptance: order.prestataire?.acceptance || 'pending',
      date: formattedDate,
      time: formattedTime,
      zipcode: order.client.zip_code,
      description: order.description,
      userName: `${order.client.first_name} ${order.client.last_name}`,
      userRole: 'Client',
      profilePic: order.client.profile_pic_path,
      prestataire_id: order.prestataire_id,
      address: order.client.address,
      phone: order.client.phone_number
    };

    setSelectedOrder(orderDetails);
    setIsPopupOpen(true);
  };

  const handleOrderUpdate = (orderId, newStatus) => {
    setInterventions(prevInterventions =>
      prevInterventions.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F4F3] p-6 flex justify-center">
      <div className="w-full max-w-7xl bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-end mb-4 lg:hidden">
          <button
            onClick={() => setShowStats(!showStats)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            {showStats ? "Hide Statistics" : "Show Statistics"}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 pb-1 justify-items-center">
          {/* Statistics Section */}
          <div className={`flex flex-col items-center p-5 ${showStats ? "block" : "hidden"} lg:flex`}>
            <Activity className="w-6 h-6 text-blue-500 mb-1" />
            <p className="text-sm text-gray-500 font-bold text-center">Intervention en cours</p>
            <p className="text-lg font-semibold text-[#333]">{stats.enCours}</p>
          </div>
          <div className={`flex flex-col items-center p-5 ${showStats ? "block" : "hidden"} lg:flex`}>
            <CheckSquare className="w-6 h-6 text-blue-500 mb-1" />
            <p className="text-sm text-gray-500 font-bold text-center">Intervention terminée</p>
            <p className="text-lg font-semibold text-[#333]">{stats.termine}</p>
          </div>
          {/* Profile Section */}
          <div className="flex flex-col items-center mx-auto p-5 lg:p-0">
            <img
              src={userData?.profile_pic_path || "https://symbols.getvecta.com/stencil_34/21_female-factory-worker.7052c847e3.svg"}
              alt="Profile"
              className="w-20 h-20 rounded-full border-4 border-white shadow-md mx-auto"
            />
            <h2 className="text-xl font-semibold mt-2 text-[#333] text-center">
              {userData ? `${userData.first_name}` : 'Loading...'}
            </h2>
            <p className="text-gray-500 text-center">Prestataire</p>
          </div>
          {/* More Statistics Section */}
          <div className={`flex flex-col items-center p-5 ${showStats ? "block" : "hidden"} lg:flex`}>
            <File className="w-6 h-6 text-blue-500 mb-1" />
            <p className="text-sm text-gray-500 font-bold text-center">Facture</p>
            <p className="text-lg font-semibold text-[#333]">{stats.factures}</p>
          </div>
          <div className={`flex flex-col items-center p-5 ${showStats ? "block" : "hidden"} lg:flex`}>
            <DocumentIcon className="w-6 h-6 text-blue-500 mb-1" />
            <p className="text-sm text-gray-500 font-bold text-center">Mes documents</p>
            <p className="text-lg font-semibold text-[#333]">{stats.documents}</p>
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

        {/* Search and List Header */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
          <h3 className="text-lg font-semibold text-[#333] flex items-center mb-4 sm:mb-0">
            Liste des interventions
          </h3>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search Here"
              className="border rounded-lg py-2 pl-8 pr-4 w-full text-[#333] border-gray-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>
        
        {/* Interventions Table */}
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full bg-white text-black">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-left">Numero</th>
                <th className="px-4 py-2 border-b text-left">Problème</th>
                <th className="px-4 py-2 border-b text-left">Client</th>
                <th className="px-4 py-2 border-b text-center">Status</th>
                <th className="px-4 py-2 border-b text-center">Date</th>
                <th className="px-4 py-2 border-b text-center">Heure</th>
                <th className="px-4 py-2 border-b text-center min-w-[100px]">Prix</th>
                <th className="px-4 py-2 border-b text-center">Téléphone</th>
                <th className="px-4 py-2 border-b text-center">Adresse</th>
                <th className="px-4 py-2 border-b text-center">ZIP Code</th>
                <th className="px-4 py-2 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} className="px-4 py-2 border-b text-center">Loading...</td>
                </tr>
              ) : interventions.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-2 border-b text-center">
                    No interventions found. {/* Added message for empty state */}
                  </td>
                </tr>
              ) : (
                interventions.map((item, index) => {
                  const { date, time } = formatDateTime(item.date_intervention, item.heure_intervention);
                  return (
                    <tr key={item.id} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border-b text-left">{index + 1}</td>
                      <td className="px-4 py-2 border-b text-left">
                        <div className="text-gray-500">{item.description}</div>
                      </td>
                      <td className="px-4 py-2 border-b text-left">{`${item.client.first_name} ${item.client.last_name}`}</td>
                      <td className="px-4 py-2 border-b text-center">
                        <span className={`px-2 py-1 rounded-full font-bold text-gray-500 text-sm ${item.status === "Terminé" ? "bg-cyan-50" : "bg-amber-50"} whitespace-nowrap`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 border-b text-center">{date}</td>
                      <td className="px-4 py-2 border-b text-center">{time}</td>
                      <td className="px-4 py-2 border-b text-center text-sm min-w-[100px]">{item.price} €</td>
                      <td className="px-4 py-2 border-b text-center">{item.client.phone_number}</td>
                      <td className="px-4 py-2 border-b text-center">{item.client.address}</td>
                      <td className="px-4 py-2 border-b text-center">{item.client.zip_code}</td>
                      <td className="px-4 py-2 border-b text-center">
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() => handleOrderClick(item)}
                        >
                          <Eye className="w-5 h-5 inline-block" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Order Detail Popup */}
      {selectedOrder && (
        <OrderDetailPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          orderDetails={selectedOrder}
          onOrderUpdate={handleOrderUpdate}
        />
      )}
    </div>
  );
}