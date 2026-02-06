import React from 'react';
import TaxDashboard from './components/TaxDashboard';
import { FileText } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">Agroterra Consulta de Impostos</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden sm:block">Powered by Google Gemini</span>
            <a 
              href="https://portalunico.siscomex.gov.br/classif/#/nomenclatura" 
              target="_blank" 
              rel="noreferrer"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Consulta Oficial
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <TaxDashboard />
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Agroterra Consultas. Ferramenta Feita por Matheus</p>
        </div>
      </footer>
    </div>
  );
};

export default App;