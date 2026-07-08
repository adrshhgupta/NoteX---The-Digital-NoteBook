import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { UserAccount } from '../types';
interface LoginFormProps {
  onLogin: (email: string) => void;
}
export default function LoginForm({ onLogin }: LoginFormProps) {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('notex_users_db');
    if (saved) {
      return JSON.parse(saved);
    }
    const defaultUsers: UserAccount[] = [{
      email: 'curator@notex.archive',
      passwordHash: 'midnight_session',
      name: 'Julian Thorne',
      bio: 'Curating moments of digital stillness through the art of long-form notation.',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmWWT5eA9rHNXZgidRNbtwsnMG8OIC40Pdcr-7eMi_uJbXGOEVNHYfns5pwI3CmcXesntuJF8P_rbm9QOIMvqG00rMIETz4J8wYfG6JxOmCwrh-BodrbHzkeGoJ1nqmkcatlpzL54hZF2ZP8YEaKaRtyHcyJIBkVq1s87cg48KWfMKd5UH874stCkiz7y00RIi7-TfaByuO1ADN7o7fIq3iTIVZf82H8-1OHcpGzNO8CwICYVhNo98Ypugcg1kXXl-t4H9eXyUWkM'
    }];
    localStorage.setItem('notex_users_db', JSON.stringify(defaultUsers));
    return defaultUsers;
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const normalizedEmail = email.toLowerCase().trim();
    if (mode === 'signin') {
      const matchedUser = users.find(u => u.email.toLowerCase() === normalizedEmail);
      if (!matchedUser) {
        setError('Email address not found. Please register first.');
        return;
      }
      if (matchedUser.passwordHash !== password) {
        setError('Invalid email or password. Please try again.');
        return;
      }
      onLogin(matchedUser.email);
    } else {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify.');
        return;
      }
      if (password.length < 4) {
        setError('Password must be at least 4 characters.');
        return;
      }
      const emailExists = users.some(u => u.email.toLowerCase() === normalizedEmail);
      if (emailExists) {
        setError('This email address is already registered.');
        return;
      }
      const newUser: UserAccount = {
        email: normalizedEmail,
        passwordHash: password,
        name: name.trim(),
        bio: "",
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'
      };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('notex_users_db', JSON.stringify(updatedUsers));
      localStorage.setItem(`notex_author_profile_${normalizedEmail}`, JSON.stringify({
        name: newUser.name,
        email: newUser.email,
        bio: newUser.bio,
        avatarUrl: newUser.avatarUrl
      }));
      onLogin(newUser.email);
    }
  };
  return (
    <div className="relative min-h-screen bg-[#ffffff] dark:bg-[#000000] text-black dark:text-neutral-100 flex flex-col items-center justify-center font-sans select-none overflow-hidden">
      <main className="w-full max-w-lg px-6 py-12 flex flex-col items-center justify-center z-10">
        <header className="text-center mb-10 animate-fade-in">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="font-sans text-5xl md:text-6xl font-black text-black dark:text-white mb-3 tracking-tight"
          >
            Note X
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-neutral-450 dark:text-neutral-500"
          >
            {mode === 'signin' ? 'Archival Sign In' : 'Archival Registration'}
          </motion.p>
        </header>
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-[420px] bg-white dark:bg-black rounded-3xl border border-neutral-250 dark:border-neutral-800 p-8 md:p-10 shadow-sm relative animate-fade-in"
        >
          <form className="space-y-5" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="relative group animate-fade-in">
                <label 
                  className="block font-sans text-xs font-bold text-neutral-455 dark:text-neutral-500 uppercase mb-2 tracking-widest" 
                  htmlFor="name"
                >
                  Full Name
                </label>
                <input 
                  className="w-full bg-white dark:bg-black border border-neutral-250 dark:border-neutral-800 py-3 px-4 rounded-xl font-sans text-base placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-black dark:focus:border-white focus:outline-none transition-all duration-200" 
                  id="name" 
                  name="name" 
                  placeholder="Alice Miller" 
                  required 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div className="relative group">
              <label 
                className="block font-sans text-xs font-bold text-neutral-455 dark:text-neutral-500 uppercase mb-2 tracking-widest" 
                htmlFor="email"
              >
                Email Address
              </label>
              <input 
                className="w-full bg-white dark:bg-black border border-neutral-250 dark:border-neutral-800 py-3 px-4 rounded-xl font-sans text-base placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-black dark:focus:border-white focus:outline-none transition-all duration-200" 
                id="email" 
                name="email" 
                placeholder="curator@notex.archive" 
                required 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative group">
              <label 
                className="block font-sans text-xs font-bold text-neutral-455 dark:text-neutral-500 uppercase mb-2 tracking-widest" 
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input 
                  className="w-full bg-white dark:bg-black border border-neutral-250 dark:border-neutral-800 py-3 px-4 pr-12 rounded-xl font-sans text-base placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-black dark:focus:border-white focus:outline-none transition-all duration-200" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  required 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            {mode === 'register' && (
              <div className="relative group animate-fade-in">
                <label 
                  className="block font-sans text-xs font-bold text-neutral-455 dark:text-neutral-500 uppercase mb-2 tracking-widest" 
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <input 
                  className="w-full bg-white dark:bg-black border border-neutral-250 dark:border-neutral-800 py-3 px-4 rounded-xl font-sans text-base placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-black dark:focus:border-white focus:outline-none transition-all duration-200" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  placeholder="••••••••" 
                  required 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
            {error && (
              <p className="text-red-500 text-xs tracking-wider uppercase font-semibold mt-2 animate-pulse">
                {error}
              </p>
            )}
            <div className="pt-4 space-y-4">
              <button 
                type="submit"
                className="w-full bg-black dark:bg-white hover:bg-neutral-900 dark:hover:bg-neutral-100 text-white dark:text-black py-4 font-sans text-base font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2.5 group cursor-pointer rounded-xl border border-neutral-300 dark:border-neutral-700 active:scale-[0.98] shadow-sm animate-fade-in"
              >
                <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <div className="flex flex-col items-center gap-3.5 justify-center font-sans text-sm uppercase tracking-widest font-bold">
                <a 
                  className="text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer hover:underline text-center"
                  onClick={() => {
                    setMode(mode === 'signin' ? 'register' : 'signin');
                    setError('');
                  }}
                >
                  {mode === 'signin' ? "Create a Personal Account" : "Already registered? Sign In"}
                </a>
                {mode === 'signin' && (
                  <a 
                    className="text-neutral-450 hover:text-neutral-800 dark:hover:text-neutral-200 hover:underline transition-all cursor-pointer font-bold"
                    onClick={() => {
                      setEmail('curator@notex.archive');
                      setPassword('midnight_session');
                      setError('');
                    }}
                  >
                    Fill Demo Credentials
                  </a>
                )}
              </div>
            </div>
          </form>
        </motion.section>
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-16 w-full max-w-2xl text-center"
        >
          <p className="font-serif italic text-neutral-500 dark:text-neutral-400 text-base leading-relaxed px-6">
            "The permanence of thought is captured not in the ink, but in the space between the words."
          </p>
        </motion.footer>
      </main>
    </div>
  );
}

