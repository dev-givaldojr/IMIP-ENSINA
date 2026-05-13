import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import type { Patient } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Play, TrendingUp, Users, Calendar, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { patients, teacherName, fetchPatients } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const EmotionIcon = ({ emotion }: { emotion: Patient['emotion'] }) => {
    const map = {
      happy: { emoji: '😊', color: 'bg-green-100 text-green-700' },
      neutral: { emoji: '😐', color: 'bg-yellow-100 text-yellow-700' },
      sad: { emoji: '😔', color: 'bg-blue-100 text-blue-700' },
      angry: { emoji: '😤', color: 'bg-red-100 text-red-700' },
    };
    const mapped = map[emotion];
    return (
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${mapped.color}`} title={emotion}>
        {mapped.emoji}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-hospital-dark">Olá, {teacherName}! 👋</h2>
          <p className="text-gray-500 font-semibold mt-1">Aqui está o resumo dos seus pacientes hoje.</p>
        </div>
        <button className="bg-hospital-blue hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-[0_4px_0_0_#387bc4] active:shadow-none active:translate-y-1 transition-all flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Planejar Nova Sessão
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-hospital-blue">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Pacientes Ativos</p>
            <p className="text-3xl font-black text-hospital-dark">{patients.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-hospital-green">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Sessões Realizadas</p>
            <p className="text-3xl font-black text-hospital-dark">12 <span className="text-sm text-green-500 font-bold ml-2">↑ 3 esta semana</span></p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center text-hospital-yellow">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Nível Médio</p>
            <p className="text-3xl font-black text-hospital-dark">Lvl 2.3</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-hospital-dark">Meus Pacientes</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={patient.id} 
              className="group bg-white rounded-2xl border-2 border-gray-100 hover:border-hospital-blue/30 transition-all shadow-sm hover:shadow-md overflow-hidden flex flex-col"
            >
              <div className="p-6 flex-1 cursor-pointer" onClick={() => navigate(`/patient/${patient.id}`)}>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 border-4 border-white shadow-sm overflow-hidden relative">
                    <img src={patient.avatarUrl} alt={patient.name} className="w-full h-full object-cover" />
                  </div>
                  <EmotionIcon emotion={patient.emotion} />
                </div>
                <h4 className="text-xl font-black text-hospital-dark mb-1">{patient.name}</h4>
                <p className="text-sm font-semibold text-gray-500 mb-4">{patient.age} anos • Nível {patient.level}</p>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-500">Progresso</span>
                    <span className="text-hospital-blue">{patient.xp % 500} / 500 XP</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-hospital-blue rounded-full transition-all duration-1000" 
                      style={{ width: `${(patient.xp % 500) / 5}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <button 
                  onClick={() => navigate(`/session/${patient.id}`)}
                  className="w-full bg-white hover:bg-hospital-green hover:text-white hover:border-hospital-green text-hospital-green border-2 border-hospital-green font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_4px_0_0_#4ca04c] group-hover:-translate-y-1"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Iniciar Sessão
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
