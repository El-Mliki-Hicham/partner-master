"use client";
import { useState } from 'react';
import { orderService } from '@/api/orderService';
import { X, Download } from 'lucide-react';
import DocumentUpload from './DocumentUpload';

export default function OrderDetailPopup({ isOpen, onClose, orderDetails, onOrderUpdate }) {
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDocumentUpload = (uploadDetails) => {
    console.log('Document uploaded:', uploadDetails);
    // Here you could update the UI or state to show the uploaded document
  };

  const handleDownloadFacture = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Redirect to the facture page with the order ID
      window.open(`/facture?orderId=${orderDetails.id}`, '_blank');
      
    } catch (err) {
      setError('Failed to download facture');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      setLoading(true);
      setError(null);
      await orderService.acceptOrder({
        id: orderDetails.id,
        prestataire_id: orderDetails.prestataire_id
      });
      onOrderUpdate(orderDetails.id, 'accepted');
      onClose();
      // Refresh the page
      window.location.reload();
    } catch (err) {
      setError('Failed to accept order');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefuse = async () => {
    try {
      setLoading(true);
      setError(null);
      await orderService.refuseOrder({
        id: orderDetails.id,
        prestataire_id: orderDetails.prestataire_id
      });
      onOrderUpdate(orderDetails.id, 'refused');
      onClose();
      // Refresh the page
      window.location.reload();
    } catch (err) {
      setError('Failed to refuse order');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !orderDetails) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header with profile */}
        <div className="flex flex-col items-center pt-8 pb-6 px-6 border-b border-gray-200 bg-gray-50">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
            <img
              src={orderDetails.profilePic || "https://symbols.getvecta.com/stencil_34/21_female-factory-worker.7052c847e3.svg"}
              alt={orderDetails.userName}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{orderDetails.userName}</h2>
          <p className="text-lg font-medium text-gray-700">{orderDetails.userRole}</p>
        </div>

        {/* Order details */}
        <div className="px-6 py-4">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Détails de l'intervention
          </h3>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Status Section */}
            <div className="flex items-center justify-between mb-6">
              {/* Order Status */}
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    orderDetails.status === "En Cours" ? "bg-yellow-100 text-yellow-800" : 
                    orderDetails.status === "Terminé" ? "bg-green-100 text-green-800" : 
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {orderDetails.status}
                  </span>
                </div>
              </div>

            
            </div>

            {/* Description */}
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 mb-1">Description</p>
                <p className="text-base text-gray-900">{orderDetails.description}</p>
              </div>
            </div>

            {/* Date and Time */}
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 mb-1">Date et Heure</p>
                <p className="text-base text-gray-900">{orderDetails.date} à {orderDetails.time}</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 mb-1">Adresse</p>
                <p className="text-base text-gray-900">{orderDetails.address}</p>
                <p className="text-sm text-gray-500">Code postal: {orderDetails.zipcode}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 mb-1">Téléphone</p>
                <p className="text-base text-gray-900">{orderDetails.phone}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            
              <button
                onClick={() => {
                  window.open(`/invoice/${orderDetails.id}`, '_blank');
                }}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger</span>
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}
