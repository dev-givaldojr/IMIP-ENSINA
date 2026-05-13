import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ArrowLeft, Edit3, HeartPulse, Sparkles, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const patient = useStore(state => state.patients.find(p => p.id === id));

  if (!patient) return <div className="p-8 text-center text-gray-500">Paciente não encontrado.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-hospital-blue font-bold transition-colors mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-hospital-blue to-hospital-green relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        </div>
        
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 mb-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-32 h-32 rounded-2xl bg-white p-2 shadow-lg border-4 border-white z-10"
            >
              <div className="w-full h-full bg-gray-100 rounded-xl overflow-hidden relative">
                <img src={patient.avatarUrl} alt={patient.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 right-0 bg-white p-1 rounded-tl-lg">
                  <div className="w-6 h-6 flex items-center justify-center text-lg">
                    {patient.emotion === 'happy' ? '😊' : patient.emotion === 'neutral' ? '😐' : patient.emotion === 'sad' ? '😔' : '😤'}
                  </div>
                </div>
              </div>
            </motion.div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-black text-hospital-dark">{patient.name}</h1>
              <p className="text-gray-500 font-bold">{patient.age} anos • Internação Pediátrica</p>
            </div>
            
            <div className="flex gap-3">
              <div className="bg-orange-50 border-2 border-orange-200 text-orange-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                <Flame className="w-5 h-5 fill-current" />
                {patient.streak} dias
              </div>
              <button 
                onClick={() => navigate(`/session/${patient.id}`)}
                className="bg-hospital-green hover:bg-green-600 text-white px-6 py-2 rounded-xl font-bold shadow-[0_4px_0_0_#4ca04c] active:shadow-none active:translate-y-1 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5 fill-current" />
                Iniciar Sessão
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-2 space-y-8">
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-black text-hospital-dark flex items-center gap-2">
                    Nível de Alfabetização
                  </h3>
                </div>
                <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-6">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-hospital-blue font-black text-2xl">Nível {patient.level}</p>
                      <p className="text-sm font-bold text-blue-600/70">Sílabas Complexas</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-hospital-dark">{patient.xp} XP total</p>
                    </div>
                  </div>
                  <div className="h-4 w-full bg-blue-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-hospital-blue rounded-full relative" 
                      style={{ width: `${(patient.xp % 500) / 5}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-center text-blue-600/70 mt-3 uppercase tracking-wider">
                    {500 - (patient.xp % 500)} XP para o próximo nível
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-black text-hospital-dark mb-4 flex items-center gap-2">
                  Interesses da Criança
                  <button className="text-gray-400 hover:text-hospital-blue"><Edit3 className="w-4 h-4" /></button>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {patient.interests.map(interest => (
                    <span key={interest} className="bg-gray-100 text-gray-600 border-2 border-gray-200 font-bold px-4 py-2 rounded-xl">
                      {interest}
                    </span>
                  ))}
                  <button className="border-2 border-dashed border-gray-300 text-gray-400 hover:text-hospital-blue hover:border-hospital-blue font-bold px-4 py-2 rounded-xl transition-colors">
                    + Adicionar
                  </button>
                </div>
              </section>
            </div>

            <div className="col-span-1">
              <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-6 h-full">
                <h3 className="text-lg font-black text-red-800 mb-4 flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-red-500" />
                  Dados Clínicos
                </h3>
                <div className="bg-white/60 p-4 rounded-xl border border-red-200">
                  <p className="text-sm text-red-900 font-medium leading-relaxed">
                    {patient.clinicalNotes}
                  </p>
                </div>
                <p className="text-xs text-red-400 font-bold mt-4 text-center">
                  ⚠️ Visível apenas para equipe autorizada
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
