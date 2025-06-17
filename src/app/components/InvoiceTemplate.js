"use client";
import { useEffect, useCallback } from 'react';

export default function InvoiceTemplate({ quote, onLoad }) {
  const handlePrint = useCallback(() => {
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  useEffect(() => {
    if (quote) {
      handlePrint();
    }
  }, [quote, handlePrint]);

  if (!quote) return null;

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const formatTime = (dateString) => {
    try {
      return new Date(dateString).toLocaleTimeString('fr-FR');
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-[297mm] p-10 print:p-0">
      <div className="w-full max-w-[210mm] bg-white shadow-md rounded-lg border border-gray-300 p-5 min-h-[297mm] flex flex-col justify-between print:shadow-none print:border-none">
        <div>
          <div className="flex justify-between items-center mb-5">
            <img
              src="https://service-pro-admin-master.vercel.app/assets/logo-vertigo.b6dd3a74.svg"
              alt="ServicePro Logo"
              className="h-16"
            />
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-800">Facture {quote.id}</h2>
              <p className="text-gray-600">créé le : {formatDate(quote.created_at)} à Paris</p>
            </div>
          </div>

          <div className="flex justify-between mb-5">
            <div className="w-1/2 pr-2">
              <h3 className="font-bold text-gray-800">{quote.client.first_name} {quote.client.last_name}</h3>
              <p className="text-gray-600">{quote.client.address || 'Adresse non spécifiée'}</p>
              <p className="text-gray-600">{quote.client.zip_code || ''}</p>
              <p className="text-gray-600">{quote.client.phone || ''}</p>
            </div>

            <div className="w-1/2 pl-2">
              <h3 className="font-bold text-gray-800">Description de l'intervention</h3>
              <p className="text-gray-600">{quote.service_name}</p>
              <p className="text-gray-600">Devis numéro {quote.id}</p>
              <p className="text-gray-600">Date: {formatDate(quote.created_at)}</p>
              <p className="text-gray-600">Heure: {formatTime(quote.created_at)}</p>
              <p className="text-gray-600">Montant H.T: {quote.subtotal || 0} €</p>
            </div>
          </div>

          <table className="w-full border-collapse border border-gray-300 mb-5">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-gray-800">Description</th>
                <th className="border border-gray-300 p-2 text-gray-800">P.U.</th>
                <th className="border border-gray-300 p-2 text-gray-800">TVA</th>
                <th className="border border-gray-300 p-2 text-gray-800">Montant</th>
              </tr>
            </thead>
            <tbody>
              {(quote.products || []).map((product, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2 text-gray-600">{product.name}</td>
                  <td className="border border-gray-300 p-2 text-gray-600">{product.price || 0} €</td>
                  <td className="border border-gray-300 p-2 text-gray-600">{quote.tva_percentage || 0}%</td>
                  <td className="border border-gray-300 p-2 text-gray-600">
                    {((product.price || 0) * (1 + (quote.tva_percentage || 0) / 100)).toFixed(2)} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="w-1/2 ml-auto">
            <table className="w-full border-collapse bg-gray-100 mb-5">
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 text-gray-800 font-bold">Total HT</td>
                  <td className="border border-gray-300 p-2 text-gray-800">{quote.subtotal || 0} €</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-gray-800 font-bold">TVA ({quote.tva_percentage || 0}%)</td>
                  <td className="border border-gray-300 p-2 text-gray-800">{quote.tva_amount || 0} €</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-gray-800 font-bold">Total TTC</td>
                  <td className="border border-gray-300 p-2 text-gray-800">{quote.total || 0} €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <footer className="text-xs text-gray-600 mt-5 p-5 bg-gray-100 rounded-lg print:bg-white">
          Société FRANCE CONTRE COURANT - SAS au capital de 220.000 € - siège social 12, bis chemin de Conflans 95220 HERBLAY SUR SEINE - Siren 913728598 - RCS PONTOISE - Numéro de TVA INTRACOMMUNAUTAIRE FR47913728598 - Assurance AXA France Cenac ASSOCIES - 96, avenue de Paris 94300 VINCENNES - contrat Numéro 0000216826621904
        </footer>
      </div>
    </div>
  );
}
