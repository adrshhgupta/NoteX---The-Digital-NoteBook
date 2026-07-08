import { Search, RotateCw, User, Menu, X, Bell, Sun, Moon } from 'lucide-react';
import { AppTab, AuthorProfile } from '../types';
interface HeaderProps {
  activeTab: AppTab;
  profile: AuthorProfile;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTabChange: (tab: AppTab) => void;
  onSync: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isSyncing: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}
export default function Header({
  activeTab,
  profile,
  searchQuery,
  onSearchChange,
  onTabChange,
  onSync,
  isSidebarOpen,
  onToggleSidebar,
  isSyncing,
  theme,
  onToggleTheme
}: HeaderProps) {
  const isSettings = activeTab === 'settings';
  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 z-30 bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-850 flex justify-between items-center px-5 md:px-8 h-16 select-none transition-all duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 focus:outline-none cursor-pointer flex items-center justify-center transition-all duration-200"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <span 
          onClick={() => onTabChange(isSettings ? 'settings' : 'library')}
          className="font-sans text-xl md:text-2xl font-black text-black dark:text-white cursor-pointer tracking-tight leading-none hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors duration-200 select-none"
        >
          {isSettings ? 'Settings' : (activeTab === 'library' ? 'Library' : activeTab === 'drafts' ? 'Drafts' : activeTab === 'archive' ? 'Archive' : 'Note X')}
        </span>
        <div className="hidden md:flex items-center bg-white dark:bg-black border border-neutral-250 dark:border-neutral-800 rounded-xl px-4 py-2 ml-6 w-72 lg:w-[320px] focus-within:border-black dark:focus-within:border-white transition-all duration-200">
          <button 
            type="button"
            className="focus:outline-none mr-2.5 flex-shrink-0 cursor-pointer text-neutral-450 dark:text-neutral-500 hover:text-black dark:hover:text-white"
            onClick={() => {
              document.getElementById('header-search-input')?.focus();
            }}
            title="Focus Search"
          >
            <Search className="w-4.5 h-4.5" />
          </button>
          <input
            id="header-search-input"
            className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 text-base text-black dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 font-sans w-full p-0 m-0 leading-normal"
            placeholder={isSettings ? 'Search preferences...' : 'Search archives...'}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          className="text-neutral-655 dark:text-neutral-400 hover:text-black dark:hover:text-white p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer focus:outline-none transition-all duration-200"
          title={theme === 'dark' ? 'Activate Light Theme' : 'Activate Dark Theme'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        {isSettings ? (
          <>
            <button 
              className="relative text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer focus:outline-none transition-all duration-200"
              title="Notifications"
              onClick={() => alert('Atelier Notification System is online. No new alerts.')}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-black dark:bg-white border border-white dark:border-black rounded-full block" />
            </button>
            <button
              onClick={() => onTabChange('settings')}
              className="w-9 h-9 rounded-full border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-all duration-250 bg-white dark:bg-neutral-850 flex-shrink-0 cursor-pointer overflow-hidden flex items-center justify-center"
              title="Atelier Profile"
            >
              <img
                alt=" Julian Thorne Portrait"
                className="w-full h-full object-cover rounded-full hover:scale-105 transition-transform duration-200"
                src={profile.avatarUrl}
              />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onSync}
              className="relative text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer select-none focus:outline-none active:scale-95 transition-all duration-200"
              title="Reload & Index Notes"
            >
              <RotateCw className={`w-5 h-5 ${isSyncing ? 'animate-spin text-black dark:text-white' : 'transition-transform duration-200'}`} />
            </button>
            <button
              onClick={() => onTabChange('settings')}
              className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer select-none focus:outline-none active:scale-95 transition-all duration-200"
              title="Atelier Settings Workspace"
            >
              <User className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </header>
  );
}

