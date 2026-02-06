import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface InputFormProps {
  onSearch: (ncm: string) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSearch, isLoading }) => {
  const [ncm, setNcm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ncm.trim().length >= 4) {
      onSearch(ncm);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and dots
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setNcm(value);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
      <label htmlFor="ncm-input" className="block text-sm font-medium text-slate-700 mb-2">
        Digite o código NCM do produto
      </label>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <input
            id="ncm-input"
            type="text"
            className="block w-full pl-10 pr-4 py-4 text-lg border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-900 placeholder-slate-400"
            placeholder="Ex: 8471.30.12"
            value={ncm}
            onChange={handleChange}
            maxLength={10}
            autoComplete="off"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || ncm.length < 4}
          className="absolute right-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Consultando Base...</span>
            </>
          ) : (
            <span>Consultar Tributação</span>
          )}
        </button>
      </form>
      <p className="mt-2 text-xs text-slate-500">
        Informe o NCM para buscar as alíquotas na Tabela TIPI e TEC.
      </p>
    </div>
  );
};

export default InputForm;