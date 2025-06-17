export default function InvoicePage() {
  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-[297mm] p-10">
      <div className="w-full max-w-[210mm] bg-white shadow-md rounded-lg border border-gray-300 p-5 min-h-[297mm] flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-5">
            <img
              src="https://service-pro-admin-master.vercel.app/assets/logo-vertigo.b6dd3a74.svg"
              alt="ServicePro Logo"
              className="h-16"
            />
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-800">Facture INV-00002</h2>
              <p className="text-gray-600">créé le : 12/14/2024 à Paris</p>
            </div>
          </div>

          <div className="flex justify-between mb-5">
            <div className="w-1/2 pr-2">
              <h3 className="font-bold text-gray-800">Client Nom</h3>
              <p className="text-gray-600">10 rue de la fontaine St germain, Soisy-sous-Montmorency</p>
              <p className="text-gray-600">Zipcode Client</p>
              <p className="text-gray-600">+Telephone Client</p>
            </div>

            <div className="w-1/2 pl-2">
              <h3 className="font-bold text-gray-800">Description de l'intervention</h3>
              <p className="text-gray-600">Devis accepté changement de serrure "Selon ordre de services"</p>
              <p className="text-gray-600">Devis numéro 67437</p>
              <p className="text-gray-600">Date: 07/04/2023</p>
              <p className="text-gray-600">Heure: 10:39</p>
              <p className="text-gray-600">Montant H.T vente: 838.73 € HT</p>
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
              <tr>
                <td className="border border-gray-300 p-2 text-gray-600">Montant total</td>
                <td className="border border-gray-300 p-2 text-gray-600">2000.00</td>
                <td className="border border-gray-300 p-2 text-gray-600">0.00</td>
                <td className="border border-gray-300 p-2 text-gray-600">2000.00</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-gray-600">Frais de fournisseur</td>
                <td className="border border-gray-300 p-2 text-gray-600">1500.00</td>
                <td className="border border-gray-300 p-2 text-gray-600">0.00</td>
                <td className="border border-gray-300 p-2 text-gray-600">1500.00</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-gray-600">Bénéfice</td>
                <td className="border border-gray-300 p-2 text-gray-600">500.00</td>
                <td className="border border-gray-300 p-2 text-gray-600">0.00</td>
                <td className="border border-gray-300 p-2 text-gray-600">500.00</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-gray-600">Commission</td>
                <td className="border border-gray-300 p-2 text-gray-600">200.00</td>
                <td className="border border-gray-300 p-2 text-gray-600">0.00</td>
                <td className="border border-gray-300 p-2 text-gray-600">200.00</td>
              </tr>
            </tbody>
          </table>

          <div className="w-1/2 ml-auto">
            <table className="w-full border-collapse bg-gray-100 mb-5">
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 text-gray-800 font-bold">Bénéfice</td>
                  <td className="border border-gray-300 p-2 text-gray-800">6000.00 €</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-gray-800 font-bold">Commission</td>
                  <td className="border border-gray-300 p-2 text-gray-800">20%</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-gray-800 font-bold">Prix total</td>
                  <td className="border border-gray-300 p-2 text-gray-800">2000 €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <footer className="text-xs text-gray-600 mt-5 p-5 bg-gray-100 rounded-lg">
          Société FRANCE CONTRE COURANT - SAS au capital de 220.000 € - siège social 12, bis chemin de Conflans 95220 HERBLAY SUR SEINE - Siren 913728598 - RCS PONTOISE - Numéro de TVA INTRACOMMUNAUTAIRE FR47913728598 - Assurance AXA France Cenac ASSOCIES - 96, avenue de Paris 94300 VINCENNES - contrat Numéro 0000216826621904
        </footer>
      </div>
    </div>
  );
}