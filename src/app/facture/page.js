"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Search, Download } from "lucide-react";
import { userService } from '@/api/userService';
import DocUploadCard from '../components/DocUploadCard';
import { quoteService } from '@/api/quoteService';
import Header from '../components/Header';

const REQUIRED_DOCUMENTS = [
  "Piece d'identite",
  "Assurance",
  "Kibis ou registre de commerce",
  "URSSAF",
  "Rib",
  "Diplome et certification"
];

export default function Facture() {
  const [search, setSearch] = useState("");
  const [activeLink, setActiveLink] = useState("facture");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [uploadedDocsCount, setUploadedDocsCount] = useState(0);
  const [quotes, setQuotes] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [stats, setStats] = useState({
    totalInvoices: 0,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Fetch user data and stats in parallel
        const [{ data: user, status }, { stats: userStats }] = await Promise.all([
          userService.getCurrentUser(),
          userService.getUserStats()
        ]);

        if (status === 'success' && user) {
          setUserData(user);
          setStats(userStats);

    
          // Calculate uploaded documents count
          const uploadedCount = REQUIRED_DOCUMENTS.reduce((count, docTitle) => {
            const storageKey = `${user.id}-${docTitle}`;
            return localStorage.getItem(storageKey) ? count + 1 : count;
          }, 0);
          
          setUploadedDocsCount(uploadedCount);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchData = async () => {
      try {
        const allQuotes = await quoteService.getQuotes();
        const acceptedQuotes = allQuotes.filter(quote => quote.status === 'accepted');
        setQuotes(acceptedQuotes);
        
        // Update totalInvoices directly
        setStats({
          totalInvoices: acceptedQuotes.length
        });
      } catch (error) {
        console.error('Error fetching quotes:', error);
        setError('Failed to fetch quotes');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    fetchUserData();
  }, []);



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredQuotes = quotes.filter(quote => 
    quote.client.first_name.toLowerCase().includes(search.toLowerCase()) ||
    quote.client.last_name.toLowerCase().includes(search.toLowerCase()) ||
    quote.service_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F4F3] p-6 flex justify-center">
      <div className="w-full max-w-7xl bg-white p-6 rounded-xl shadow-md">
        <Header 
          stats={stats}
          loading={loading}
          userData={userData}
          uploadedDocsCount={uploadedDocsCount}
          activeLink="facture"
        />

        {/* Search and List Header */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
          <h3 className="text-lg font-semibold text-[#333] flex items-center mb-4 sm:mb-0">
            Liste des factures
          </h3>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Rechercher..."
              className="border rounded-lg py-2 pl-8 pr-4 w-full text-[#333] border-gray-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>
        
        {/* Quotes Table */}
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full bg-white text-black">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-left">Date</th>
                <th className="px-4 py-2 border-b text-left">Client</th>
                <th className="px-4 py-2 border-b text-left">Service</th>
                <th className="px-4 py-2 border-b text-center">Produits</th>
                <th className="px-4 py-2 border-b text-center">Total HT</th>
                <th className="px-4 py-2 border-b text-center">TVA</th>
                <th className="px-4 py-2 border-b text-center">Total TTC</th>
                <th className="px-4 py-2 border-b text-center">Paiement</th>
                <th className="px-4 py-2 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                    Chargement...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                    Aucune facture trouvée
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border-b text-left">
                      {formatDate(quote.created_at)}
                    </td>
                    <td className="px-4 py-2 border-b text-left">
                      <div className="font-medium">{quote.client.first_name} {quote.client.last_name}</div>
                      <div className="text-sm text-gray-500">{quote.client.email}</div>
                    </td>
                    <td className="px-4 py-2 border-b text-left">
                      <div>{quote.service_name}</div>
                      <div className="text-sm text-gray-500">{quote.service_price}</div>
                    </td>
                    <td className="px-4 py-2 border-b text-center">
                      <div className="text-sm">
                        {quote.products.map(p => p.name).join(', ')}
                      </div>
                      <div className="text-sm text-gray-500">{quote.products_total}</div>
                    </td>
                    <td className="px-4 py-2 border-b text-center">{quote.subtotal}</td>
                    <td className="px-4 py-2 border-b text-center">
                      {quote.tva_amount} ({quote.tva_percentage}%)
                    </td>
                    <td className="px-4 py-2 border-b text-center font-medium">{quote.total}</td>
                    <td className="px-4 py-2 border-b text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        quote.payment_status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {quote.payment_status === 'paid' ? 'Payé' : 'Non payé'}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b text-center">
                      <button
                        onClick={() => {
                          // Ensure we're passing a string ID
                          const quoteId = String(quote.id);
                          console.log('Opening invoice for quote:', quoteId);
                          window.open(`/invoice/${quoteId}`, '_blank');
                        }}
                        className="text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        <span>Télécharger</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}