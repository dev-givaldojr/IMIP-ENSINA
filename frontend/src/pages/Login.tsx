import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Heart, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useStore(state => state.login);
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (res.ok && data.token) {
        login(data.token, data.user);
        navigate('/');
      } else {
        setError(data.error || 'Credenciais inválidas. Tente novamente.');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-hospital-blue/10 to-hospital-green/10 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorações de fundo */}
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-20 text-hospital-yellow opacity-50"
      >
        <Star size={48} className="fill-current" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 right-20 text-hospital-blue opacity-30"
      >
        <Heart size={64} className="fill-current" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-white/50 backdrop-blur-sm"
      >
        <div className="bg-hospital-blue p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-inner flex items-center justify-center mb-4 transform rotate-3">
              <Sparkles className="w-8 h-8 text-hospital-yellow" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">IMIP Aprende</h1>
            <p className="text-blue-100 font-medium mt-2">Plataforma de Alfabetização</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">E-mail Institucional</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-hospital-blue focus:ring-4 focus:ring-hospital-blue/20 outline-none transition-all font-medium text-gray-700"
                placeholder="professor@imip.org.br"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Senha</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-hospital-blue focus:ring-4 focus:ring-hospital-blue/20 outline-none transition-all font-medium text-gray-700"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-hospital-green hover:bg-green-600 text-white font-bold text-lg py-4 rounded-xl shadow-[0_4px_0_0_#4ca04c] active:shadow-[0_0px_0_0_#4ca04c] active:translate-y-1 transition-all flex items-center justify-center"
          >
            {isLoading ? (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full"
              />
            ) : (
              "Entrar na Plataforma"
            )}
          </button>
          
          {error && (
            <p className="text-red-500 font-bold text-center mt-2 animate-fade-in">
              {error}
            </p>
          )}

          <p className="text-center text-sm font-semibold text-gray-500 mt-4">
            Acesso restrito a extensionistas e equipe IMIP
          </p>
        </form>
      </motion.div>
    </div>
  );
}
