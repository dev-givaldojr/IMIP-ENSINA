import { BarChart3, Download, ShieldCheck } from 'lucide-react';

export default function Reports() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-hospital-dark">Relatórios de Alfabetização</h2>
          <p className="text-gray-500 font-semibold">Visualização dos KPIs de progresso mensal</p>
        </div>
        <button className="bg-white border-2 border-gray-200 hover:border-hospital-blue text-hospital-dark font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2">
          <Download className="w-5 h-5 text-hospital-blue" />
          Exportar Dados (LGPD)
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
        <ShieldCheck className="w-6 h-6 text-blue-600 flex-shrink-0" />
        <p className="text-sm font-medium text-blue-900">
          <strong>Aviso LGPD:</strong> Todos os relatórios exportados nesta seção são automaticamente anonimizados. 
          Nomes, registros hospitalares e prontuários são removidos antes do download para garantir a privacidade dos pacientes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-hospital-green" />
            Evolução de XP (Mensal)
          </h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[40, 55, 30, 80, 65, 90].map((h, i) => (
              <div key={i} className="w-full flex flex-col items-center gap-2">
                <div className="w-full bg-green-100 rounded-t-lg relative group">
                  <div 
                    className="absolute bottom-0 w-full bg-hospital-green rounded-t-lg transition-all"
                    style={{ height: `${h}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-gray-400">Mês {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-hospital-yellow" />
            Nível de Engajamento
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-bold text-gray-600 mb-1">
                <span>Leitura Interativa</span>
                <span>85%</span>
              </div>
              <div className="h-3 w-full bg-gray-100 rounded-full"><div className="h-full bg-hospital-blue rounded-full w-[85%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-gray-600 mb-1">
                <span>Mini-games de Sílabas</span>
                <span>92%</span>
              </div>
              <div className="h-3 w-full bg-gray-100 rounded-full"><div className="h-full bg-hospital-yellow rounded-full w-[92%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-gray-600 mb-1">
                <span>Atividades de Escrita</span>
                <span>64%</span>
              </div>
              <div className="h-3 w-full bg-gray-100 rounded-full"><div className="h-full bg-hospital-green rounded-full w-[64%]"></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
