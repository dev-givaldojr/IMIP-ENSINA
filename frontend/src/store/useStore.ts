import { create } from 'zustand';

export interface Patient {
  id: string;
  name: string;
  age: number;
  level: number; // 1 to 5
  xp: number;
  streak: number;
  interests: string[];
  emotion: 'happy' | 'neutral' | 'sad' | 'angry';
  clinicalNotes: string; // LGPD sensitive
  avatarUrl?: string;
}

interface StoreState {
  isAuthenticated: boolean;
  token: string | null;
  teacherName: string;
  patients: Patient[];
  activePatient: Patient | null;
  login: (token: string, user: any) => void;
  logout: () => void;
  fetchPatients: () => Promise<void>;
  setActivePatient: (id: string) => void;
  updatePatientEmotion: (id: string, emotion: Patient['emotion']) => void;
  addXp: (amount: number) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  isAuthenticated: false,
  token: null,
  teacherName: '',
  patients: [],
  activePatient: null,
  
  login: (token, user) => set({ isAuthenticated: true, token, teacherName: user.name }),
  logout: () => set({ isAuthenticated: false, token: null, activePatient: null, patients: [] }),
  
  fetchPatients: async () => {
    const { token } = get();
    if (!token) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080'}/api/patients`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        set({ patients: data });
      }
    } catch (e) {
      console.error('Failed to fetch patients', e);
    }
  },

  setActivePatient: (id) => set((state) => ({ 
    activePatient: state.patients.find(p => p.id === id) || null 
  })),
  
  updatePatientEmotion: (id, emotion) => set((state) => ({
    patients: state.patients.map(p => p.id === id ? { ...p, emotion } : p),
    activePatient: state.activePatient?.id === id ? { ...state.activePatient, emotion } : state.activePatient
  })),
  
  addXp: async (amount) => {
    const state = get();
    if (!state.activePatient || !state.token) return;
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080'}/api/gamification/xp`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${state.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patientId: state.activePatient.id,
          xpEarned: amount
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        
        // data contains: newTotalXp, newLevel, newStreak
        const updatedPatient = {
          ...state.activePatient,
          xp: data.newTotalXp,
          level: data.newLevel,
          streak: data.newStreak
        };
        
        set({
          activePatient: updatedPatient,
          patients: state.patients.map(p => p.id === updatedPatient.id ? updatedPatient : p)
        });
      }
    } catch (e) {
      console.error('Failed to update XP', e);
    }
  }
}));
