import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { FileText, Sparkles, Send, BrainCircuit, CheckCircle } from 'lucide-react';

export default function TrailGenerator() {
  const patients = useStore(state => state.patients);
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState('');
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrail, setGeneratedTrail] = useState<any>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !topic) return;
    
    setIsGenerating(true);
    // Simular a geração de IA via mock
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedTrail({
        title: `Aventura Especial: ${topic}`,
        lessons: [
          { title: "Descobrindo Palavras", type: "Leitura" },
          { title: "Qual é a Letra?", type: "Mini-game" },
          { title: "Escrevendo com a IA", type: "Escrita" }
        ]
      });
    }, 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-hospital-dark">Gerador de Trilhas com IA</h2>
            <p className="text-gray-500 font-semibold">Crie lições personalizadas usando IA Generativa</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Selecione o Paciente</label>
              <select 
                required
                value={selectedPatient}
                onChange={e => setSelectedPatient(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-hospital-blue outline-none font-medium text-gray-700"
              >
                <option value="">Escolha...</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name} (Lvl {p.level})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tema de Interesse</label>
              <input 
                type="text" 
                required
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Ex: Viagem espacial com dinossauros"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-hospital-blue outline-none font-medium text-gray-700"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isGenerating}
            className="w-full bg-hospital-blue hover:bg-blue-600 text-white font-bold text-lg py-4 rounded-xl shadow-[0_4px_0_0_#387bc4] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 animate-pulse" /> Gerando Narrativa com IA...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-5 h-5" /> Gerar Trilha Pedagógica
              </span>
            )}
          </button>
        </form>

        {generatedTrail && (
          <div className="mt-8 pt-8 border-t border-gray-100 animate-fade-in">
            <h3 className="text-xl font-bold text-green-600 flex items-center gap-2 mb-4">
              <CheckCircle className="w-6 h-6" /> Trilha Gerada com Sucesso!
            </h3>
            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
              <h4 className="text-lg font-black text-hospital-dark mb-4">{generatedTrail.title}</h4>
              <ul className="space-y-3">
                {generatedTrail.lessons.map((lesson: any, index: number) => (
                  <li key={index} className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                    <span className="bg-hospital-yellow text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">
                      {index + 1}
                    </span>
                    <span className="font-bold text-gray-700">{lesson.title}</span>
                    <span className="ml-auto text-xs font-bold text-gray-400 uppercase bg-gray-100 px-2 py-1 rounded">
                      {lesson.type}
                    </span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 flex gap-3">
                <button className="flex-1 bg-white border-2 border-gray-200 hover:border-hospital-blue text-gray-700 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5" /> Exportar PDF
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="flex-1 bg-hospital-green text-white font-bold py-3 rounded-xl shadow-[0_4px_0_0_#4ca04c] hover:bg-green-600 transition-colors"
                >
                  Salvar e Voltar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
