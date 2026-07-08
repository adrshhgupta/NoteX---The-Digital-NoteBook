import { useState, useEffect } from 'react';
import { 
  AppTab, 
  NoteItem, 
  AuthorProfile, 
  StationeryConfig,
  NoteType
} from './types';
import { 
  INITIAL_AUTHOR_PROFILE, 
  DEFAULT_STATIONERY_CONFIG, 
  INITIAL_NOTES 
} from './data';
import LoginForm from './components/LoginForm';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LibraryView from './components/LibraryView';
import SettingsView from './components/SettingsView';
import NoteModal from './components/NoteModal';
import { AnimatePresence, motion } from 'motion/react';
function DashboardWrapper({ 
  loggedInEmail, 
  onLogout 
}: { 
  loggedInEmail: string; 
  onLogout: () => void; 
}) {
  const [activeTab, setActiveTab] = useState<AppTab>('library');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('notex_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'light';
  });
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('notex_theme', theme);
  }, [theme]);
  const handleToggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const saved = localStorage.getItem(`notex_notes_archive_${loggedInEmail}`);
    if (saved) return JSON.parse(saved);
    if (loggedInEmail === 'curator@notex.archive') {
      return INITIAL_NOTES;
    }
    const defaultNotes: NoteItem[] = [
      {
        id: `welcome-${Date.now()}`,
        title: `Welcome to your personal Note X workspace!`,
        type: 'Manuscript',
        category: 'Overview',
        content: `Hello! This is your own private writing sanctuary. Every word you compile here is stored exclusively in your personal account space and isolated from anyone else.<br /><br />Feel free to adjust typography presets in the Settings tab, write drafts, or export your collections to PDF.`,
        updatedAt: 'Just Now',
        lastEditedTimestamp: Date.now(),
        tags: ['Personal', 'Welcome']
      }
    ];
    localStorage.setItem(`notex_notes_archive_${loggedInEmail}`, JSON.stringify(defaultNotes));
    return defaultNotes;
  });
  const [profile, setProfile] = useState<AuthorProfile>(() => {
    const saved = localStorage.getItem(`notex_author_profile_${loggedInEmail}`);
    if (saved) return JSON.parse(saved);
    if (loggedInEmail === 'curator@notex.archive') {
      return INITIAL_AUTHOR_PROFILE;
    }
    const defaultProfile: AuthorProfile = {
      name: loggedInEmail.split('@')[0].toUpperCase(),
      email: loggedInEmail,
      bio: '',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'
    };
    localStorage.setItem(`notex_author_profile_${loggedInEmail}`, JSON.stringify(defaultProfile));
    return defaultProfile;
  });
  const [stationeryConfig, setStationeryConfig] = useState<StationeryConfig>(() => {
    const saved = localStorage.getItem(`notex_stationery_config_${loggedInEmail}`);
    return saved ? JSON.parse(saved) : DEFAULT_STATIONERY_CONFIG;
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState<boolean>(false);
  useEffect(() => {
    localStorage.setItem(`notex_notes_archive_${loggedInEmail}`, JSON.stringify(notes));
  }, [notes, loggedInEmail]);
  useEffect(() => {
    localStorage.setItem(`notex_author_profile_${loggedInEmail}`, JSON.stringify(profile));
  }, [profile, loggedInEmail]);
  useEffect(() => {
    localStorage.setItem(`notex_stationery_config_${loggedInEmail}`, JSON.stringify(stationeryConfig));
  }, [stationeryConfig, loggedInEmail]);
  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };
  const handleSelectNote = (note: NoteItem) => {
    setSelectedNote(note);
    setIsNoteModalOpen(true);
  };
  const handleCreateNewNote = () => {
    setSelectedNote(null);
    setIsNoteModalOpen(true);
  };
  const handleSaveNote = (savedNote: NoteItem) => {
    setNotes(prev => {
      const exists = prev.some(n => n.id === savedNote.id);
      if (exists) {
        return prev.map(n => n.id === savedNote.id ? savedNote : n);
      } else {
        return [savedNote, ...prev];
      }
    });
    setIsNoteModalOpen(false);
    setSelectedNote(null);
  };
  const handleAutoSaveNote = (savedNote: NoteItem) => {
    setNotes(prev => {
      const exists = prev.some(n => n.id === savedNote.id);
      if (exists) {
        return prev.map(n => n.id === savedNote.id ? savedNote : n);
      } else {
        return [savedNote, ...prev];
      }
    });
    if (!selectedNote) {
      setSelectedNote(savedNote);
    }
  };
  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    setIsNoteModalOpen(false);
    setSelectedNote(null);
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case 'library':
      case 'drafts':
      case 'archive':
        return (
          <LibraryView
            currentTab={activeTab}
            notes={notes}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectNote={handleSelectNote}
            onNewEntry={handleCreateNewNote}
          />
        );
      case 'settings':
        return (
          <SettingsView
            config={stationeryConfig}
            onConfigChange={setStationeryConfig}
            profile={profile}
            onProfileChange={setProfile}
          />
        );
      default:
        return null;
    }
  };
  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };
  const handleTabChange = (tab: AppTab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };
  const getSystemFontClass = () => {
    if (stationeryConfig.typeface === 'Serif') return 'font-serif';
    if (stationeryConfig.typeface === 'Garamond') return 'font-garamond';
    if (stationeryConfig.typeface === 'Editorial') return 'font-serif italic';
    if (stationeryConfig.typeface === 'Monospace') return 'font-mono text-sm';
    return 'font-sans';
  };
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} antialiased overflow-x-hidden selection:bg-neutral-200 dark:selection:bg-neutral-800 relative transition-all duration-300 ${getSystemFontClass()}`}>
      <Header
        activeTab={activeTab}
        profile={profile}
        isSidebarOpen={isSidebarOpen}
        isSyncing={isSyncing}
        onSearchChange={setSearchQuery}
        onSync={handleSync}
        onTabChange={handleTabChange}
        onToggleSidebar={handleToggleSidebar}
        searchQuery={searchQuery}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        profile={profile}
        onHelp={() => alert('Note X is a personal writing sanctuary. All notes are saved to your browser cache under your secure registration key.')}
        onLogout={onLogout}
        onNewEntry={handleCreateNewNote}
      />
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={handleToggleSidebar}
              className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-black z-40 border-r border-neutral-200 dark:border-neutral-800 flex flex-col p-4 md:hidden"
            >
              <Sidebar
                activeTab={activeTab}
                onTabChange={handleTabChange}
                profile={profile}
                onHelp={() => alert('Welcome to Note X!')}
                onLogout={onLogout}
                onNewEntry={handleCreateNewNote}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <main className="md:ml-64 pt-24 px-6 md:px-16 min-h-screen relative z-10 transition-all duration-300">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="pb-24"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
        <footer className="max-w-[1140px] mx-auto pb-10 border-t border-neutral-200 dark:border-neutral-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-neutral-450 dark:text-neutral-550 text-xs gap-4">
          <div className="flex items-center gap-2">
            <span className="font-sans font-black text-black dark:text-white">Note X</span>
            <span>v4.2.0-stable</span>
          </div>
          <div className="flex gap-6 uppercase tracking-wider font-bold">
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy Archive</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms of Service</a>
          </div>
        </footer>
      </main>
      <AnimatePresence>
        {isNoteModalOpen && (
          <NoteModal
            isOpen={isNoteModalOpen}
            note={selectedNote}
            onClose={() => setIsNoteModalOpen(false)}
            onDelete={handleDeleteNote}
            onSave={handleSaveNote}
            onAutoSave={handleAutoSaveNote}
            stationeryConfig={stationeryConfig}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
export default function App() {
  const [loggedInEmail, setLoggedInEmail] = useState<string>(() => {
    return localStorage.getItem('notex_active_user_email') || '';
  });
  const handleLogin = (email: string) => {
    localStorage.setItem('notex_active_user_email', email);
    setLoggedInEmail(email);
  };
  const handleLogout = () => {
    localStorage.removeItem('notex_active_user_email');
    setLoggedInEmail('');
  };
  if (!loggedInEmail) {
    return <LoginForm onLogin={handleLogin} />;
  }
  return (
    <DashboardWrapper 
      key={loggedInEmail}
      loggedInEmail={loggedInEmail}
      onLogout={handleLogout}
    />
  );
}

