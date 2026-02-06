import React, { useState } from 'react';
import { fetchTaxInfoByNcm } from '../services/geminiService';
import { NcmResponse } from '../types';
import InputForm from './InputForm';
import { AlertCircle, Calculator, Info, CheckCircle2, ArrowDownCircle, ArrowUpCircle, Copy, Database } from 'lucide-react';

const TaxDashboard: React.FC = () => {
  const [data, setData] = useState<NcmResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (ncm: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await fetchTaxInfoByNcm(ncm);
      setData(result);
    } catch (err) {
      setError("Ocorreu um erro ao consultar os dados tributários. Verifique o NCM e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
          <Calculator className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          Agroterra Consulta de Impostos
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Identifique os CSTs de PIS e COFINS (Entrada e Saída) através do NCM utilizando inteligência fiscal.
        </p>
      </div>

      <InputForm onSearch={handleSearch} isLoading={loading} />

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-medium">Erro na consulta</h3>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {data && (
        <div className="animate-fade-in-up">
          {/* Header Result Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-slate-800 text-white px-3 py-1 rounded-md text-sm font-mono font-bold">
                        NCM: {data.ncmCode}
                    </span>
                    <span className="text-emerald-600 flex items-center text-sm font-medium bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Validado
                    </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{data.productName}</h2>
                <p className="text-slate-600 mt-2 leading-relaxed">{data.description}</p>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
             Enquadramento PIS e COFINS
          </h3>

          {/* CST Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* ENTRADA Column */}
            <div className="space-y-4">
               <div className="flex items-center gap-2 mb-2 text-indigo-700 font-semibold border-b border-indigo-100 pb-2">
                  <ArrowDownCircle className="w-5 h-5" />
                  ENTRADA (Compra/Crédito)
               </div>
               
               <CstCard 
                 label="CST PIS Entrada" 
                 code={data.taxes.cstPisEntrada.code} 
                 description={data.taxes.cstPisEntrada.description}
                 colorClass="bg-blue-50 border-blue-200 text-blue-900"
                 badgeClass="bg-blue-600 text-white"
               />
               
               <CstCard 
                 label="CST COFINS Entrada" 
                 code={data.taxes.cstCofinsEntrada.code} 
                 description={data.taxes.cstCofinsEntrada.description}
                 colorClass="bg-indigo-50 border-indigo-200 text-indigo-900"
                 badgeClass="bg-indigo-600 text-white"
               />
            </div>

            {/* SAÍDA Column */}
            <div className="space-y-4">
               <div className="flex items-center gap-2 mb-2 text-emerald-700 font-semibold border-b border-emerald-100 pb-2">
                  <ArrowUpCircle className="w-5 h-5" />
                  SAÍDA (Venda/Débito)
               </div>

               <CstCard 
                 label="CST PIS Saída" 
                 code={data.taxes.cstPisSaida.code} 
                 description={data.taxes.cstPisSaida.description}
                 colorClass="bg-emerald-50 border-emerald-200 text-emerald-900"
                 badgeClass="bg-emerald-600 text-white"
               />

               <CstCard 
                 label="CST COFINS Saída" 
                 code={data.taxes.cstCofinsSaida.code} 
                 description={data.taxes.cstCofinsSaida.description}
                 colorClass="bg-teal-50 border-teal-200 text-teal-900"
                 badgeClass="bg-teal-600 text-white"
               />
            </div>
          </div>

          {/* SIMILAR PRODUCTS SECTION */}
          {data.similarProducts && data.similarProducts.length > 0 && (
            <div className="mb-8">
               <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <Database className="w-5 h-5 text-indigo-600" />
                 Comparativo Tributário (Simulação ERP)
              </h3>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 font-bold text-slate-700 w-32">NCM Similar</th>
                        <th className="px-6 py-3 font-bold text-slate-700">Descrição do Produto</th>
                        <th className="px-6 py-3 font-bold text-slate-700">Perfil (ERP)</th>
                        <th className="px-6 py-3 font-bold text-slate-700 text-center w-24">CST Ent.</th>
                        <th className="px-6 py-3 font-bold text-slate-700 text-center w-24">CST Saída</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.similarProducts.map((sim, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-4 font-mono font-bold text-indigo-600 bg-slate-50 group-hover:bg-indigo-50 transition-colors">
                            {sim.ncm}
                          </td>
                          <td className="px-6 py-4 text-slate-800 font-medium">
                            {sim.name}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200 font-mono">
                              {sim.erpProfile}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center font-mono text-slate-600">
                             {sim.cstEntry}
                          </td>
                          <td className="px-6 py-4 text-center font-mono text-slate-600">
                             {sim.cstOutput}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-xs text-slate-500">
                   * Dados simulados baseados em configurações comuns de ERP para fins de comparação.
                </div>
              </div>
            </div>
          )}

          {/* Legal Note */}
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 flex items-start gap-4">
            <Info className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-amber-900 text-base mb-2 uppercase tracking-wide">Fundamentação Legal & Observações</h4>
              <p className="text-amber-800 text-sm leading-relaxed text-justify">
                {data.legalNote}
              </p>
            </div>
          </div>

          <div className="mt-8 text-center border-t border-slate-200 pt-6">
            <p className="text-xs text-slate-400 max-w-3xl mx-auto">
              <strong>Atenção:</strong> Os CSTs sugeridos consideram o Regime Não-Cumulativo (Lucro Real) como padrão. 
              Para empresas do Simples Nacional ou Lucro Presumido, as regras podem variar. 
              Sempre valide a tributação com seu contador antes de emitir notas fiscais.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const CstCard: React.FC<{ 
  label: string; 
  code: string; 
  description: string; 
  colorClass: string;
  badgeClass: string;
}> = ({ label, code, description, colorClass, badgeClass }) => (
  <div className={`p-5 rounded-lg border shadow-sm ${colorClass} transition-all hover:shadow-md`}>
    <div className="flex justify-between items-start mb-2">
      <span className="text-xs font-bold uppercase tracking-wider opacity-70">{label}</span>
    </div>
    <div className="flex items-center gap-3">
      <span className={`text-3xl font-black ${badgeClass} px-3 py-1 rounded-md min-w-[3.5rem] text-center shadow-sm`}>
        {code}
      </span>
      <span className="text-sm font-medium leading-tight">
        {description}
      </span>
    </div>
  </div>
);

export default TaxDashboard;