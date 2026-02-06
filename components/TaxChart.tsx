import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TaxRates } from '../types';

interface TaxChartProps {
  taxes: TaxRates;
}

const COLORS = ['#0ea5e9', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'];

const TaxChart: React.FC<TaxChartProps> = ({ taxes }) => {
  const data = [
    { name: 'II (Importação)', value: taxes.ii },
    { name: 'IPI', value: taxes.ipi },
    { name: 'PIS', value: taxes.pis },
    { name: 'COFINS', value: taxes.cofins },
    { name: 'ICMS (Est.)', value: taxes.icms },
  ].filter(item => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50 rounded-lg border border-dashed border-slate-300">
        <p className="text-slate-400">Sem impostos incidentes para exibir.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-80 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Composição da Carga Tributária</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value}%`, 'Alíquota']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaxChart;