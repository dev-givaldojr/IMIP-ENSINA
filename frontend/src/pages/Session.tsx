import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Heart, X, Star, Volume2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Session() {
  const { id } = useParams();
  const navigate = useNavigate();
  const patient = useStore(state => state.patients.find(p => p.id === id));
  const addXp = useStore(state => state.addXp);
  const setActivePatient = useStore(state => state.setActivePatient);

  const [step, setStep] = useState(0);
  const [lives, setLives] = useState(3);
  const [progress, setProgress] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (id) setActivePatient(id);
  }, [id, setActivePatient]);

  if (!patient) return null;

  // Mocked AI Content
  const storyModules: any[] = [
    {
      type: 'reading',
      content: `O grande dinossauro azul voava pelo céu com ${patient.name}.`,
      image: '/dino_voador.png'
    },
    {
      type: 'writing',
      question: 'Complete a palavra: DI - NO - SAU - ___',
      options: ['RA', 'RO', 'RE'],
      answer: 'RO'
    },
    {
      type: 'minigame',
      letters: ['C', 'É', 'U'],
      targetWord: 'CÉU'
    }
  ];

  const handleOptionClick = (option: string) => {
    if (option === storyModules[1].answer) {
      setIsCorrect(true);
      setTimeout(() => {
        setIsCorrect(null);
        setProgress(66);
        setStep(2);
        addXp(10);
      }, 1500);
    } else {
      setIsCorrect(false);
      setLives(prev => Math.max(0, prev - 1));
      setTimeout(() => setIsCorrect(null), 1000);
    }
  };

  const finishSession = () => {
    setProgress(100);
    addXp(50);
    setTimeout(() => {
      navigate(`/patient/${patient.id}`);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Session Header */}
      <header className="p-4 flex items-center justify-between max-w-4xl mx-auto w-full">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 transition-colors p-2">
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex-1 mx-6 relative">
          <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-hospital-green rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-red-500 font-black text-xl">
          <Heart className="w-6 h-6 fill-current animate-pulse" />
          {lives}
        </div>
      </header>

      {/* Session Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-3xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div 
              key="reading"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full text-center space-y-8"
            >
              <h2 className="text-3xl font-black text-hospital-dark">Vamos ler a história!</h2>
              
              <div className="bg-gray-50 rounded-3xl p-4 border-2 border-gray-200 shadow-sm">
                <div className="aspect-video w-full rounded-2xl overflow-hidden mb-6 relative group cursor-pointer">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                  <img src={storyModules[0].image} alt="Ilustração gerada por IA" className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-500 flex items-center gap-1 z-20">
                    <Sparkles className="w-3 h-3 text-hospital-yellow" />
                    Gerado por IA
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-4">
                  <button className="w-12 h-12 bg-hospital-blue rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors shadow-md">
                    <Volume2 className="w-6 h-6" />
                  </button>
                  <p className="text-2xl font-bold text-gray-800 leading-relaxed text-left flex-1">
                    {storyModules[0].content}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => { setStep(1); setProgress(33); addXp(10); }}
                className="w-full max-w-sm mx-auto bg-hospital-green hover:bg-green-600 text-white font-bold text-xl py-4 rounded-2xl shadow-[0_4px_0_0_#4ca04c] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                Continuar
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div 
              key="writing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full text-center space-y-8"
            >
              <h2 className="text-3xl font-black text-hospital-dark">Como termina a palavra?</h2>
              
              <div className="text-4xl font-black text-hospital-blue bg-blue-50 py-12 rounded-3xl border-2 border-blue-100">
                {storyModules[1].question}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {storyModules[1].options.map((opt: string) => (
                  <button 
                    key={opt}
                    onClick={() => handleOptionClick(opt)}
                    className={`
                      py-6 rounded-2xl font-black text-2xl border-2 transition-all shadow-[0_4px_0_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-1
                      ${isCorrect === true && opt === storyModules[1].answer ? 'bg-green-100 border-green-500 text-green-700' : ''}
                      ${isCorrect === false && opt !== storyModules[1].answer ? 'bg-red-100 border-red-500 text-red-700' : ''}
                      ${isCorrect === null ? 'bg-white border-gray-200 text-gray-700 hover:border-hospital-blue hover:text-hospital-blue' : ''}
                    `}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="finish"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full text-center space-y-8 flex flex-col items-center justify-center h-full"
            >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-100/50 via-white to-white"
              />
              <div className="relative z-10 w-48 h-48 bg-hospital-yellow rounded-full flex items-center justify-center text-white mb-8 mx-auto shadow-[0_0_60px_-15px_#F5A623]">
                <Star className="w-24 h-24 fill-white" />
              </div>
              <h2 className="relative z-10 text-4xl font-black text-hospital-dark">Lição Concluída!</h2>
              <p className="relative z-10 text-xl font-bold text-hospital-green">+ 50 XP ganhos</p>
              
              <button 
                onClick={finishSession}
                className="relative z-10 w-full max-w-sm mx-auto bg-hospital-blue hover:bg-blue-600 text-white font-bold text-xl py-4 rounded-2xl shadow-[0_4px_0_0_#387bc4] active:shadow-none active:translate-y-1 transition-all"
              >
                Voltar ao Perfil
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mascot / Helper Overlay */}
      {step < 2 && (
        <div className="fixed bottom-6 left-6 flex items-end gap-4 z-40 pointer-events-none">
          <div className="w-24 h-24 relative pointer-events-auto cursor-pointer animate-bounce">
            <div className="absolute inset-0 bg-hospital-yellow rounded-full shadow-lg"></div>
            <div className="absolute inset-0 flex items-center justify-center text-3xl">⭐</div>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-none shadow-lg border border-gray-100 font-bold text-gray-600 pointer-events-auto">
            {step === 0 ? 'Leia com atenção!' : 'Você consegue!'}
          </div>
        </div>
      )}
    </div>
  );
}
