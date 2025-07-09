"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Search, Eye } from "lucide-react";
import DocUploadCard from '../components/DocUploadCard';
import Header from '../components/Header';
import { userService } from '@/api/userService';
const REQUIRED_DOCUMENTS = {
  identity_card: "Piece d'identite",
  insurance: "Assurance",
  business_registration: "Kibis ou registre de commerce", 
  social_security: "URSSAF",
  bank_details: "Rib",
  diplomas: "Diplome et certification"
};

export default function DocumentsList() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [uploadedDocsCount, setUploadedDocsCount] = useState(0);
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

    fetchUserData();
  }, []);

  // Function to update document count when a new document is uploaded
  const handleDocumentUpload = (details, docTitle) => {
    console.log(`${docTitle} uploaded:`, details);
    setUploadedDocsCount(prev => Math.min(prev + 1, 6));
  };

  return (
    <div className="min-h-screen bg-[#F8F4F3] p-6 flex justify-center">
      <div className="w-full max-w-7xl bg-white p-6 rounded-xl shadow-md">
        <Header 
          stats={stats}
          loading={loading}
          userData={userData}
          uploadedDocsCount={uploadedDocsCount}
          activeLink="documents"
        />

        {/* Search and List Header */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
          <h3 className="text-lg font-semibold text-[#333] flex items-center mb-4 sm:mb-0">
            Liste des documents
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

        {/* Document Upload Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(REQUIRED_DOCUMENTS)
            .filter(([key, value]) => 
              value.toLowerCase().includes(search.toLowerCase())
            )
            .map(([key, value]) => (
              <DocUploadCard
                key={key}
                type={key}
                title={value}
                agentId={userData?.id}
                onUpload={(details) => handleDocumentUpload(details, key)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}