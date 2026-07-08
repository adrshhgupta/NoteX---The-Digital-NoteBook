import { AppTab, AuthorProfile } from '../types';
import { BookOpen, FileText, Archive, Settings, HelpCircle, LogOut, Plus } from 'lucide-react';
interface SidebarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  profile: AuthorProfile;
  onNewEntry: () => void;
  onLogout: () => void;
  onHelp: () => void;
}
export default function Sidebar({
  activeTab,
  onTabChange,
  profile,
  onNewEntry,
  onLogout,
  onHelp
}: SidebarProps) {
  const getTabStyle = (tab: AppTab) => {
    if (activeTab === tab) {
      return 'bg-black dark:bg-white text-white dark:text-black font-bold text-base';
    }
    return 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white transition-all duration-200 text-base font-medium';
  };
  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-black border-r border-neutral-200 dark:border-neutral-850 flex flex-col pt-8 p-4 z-40 hidden md:flex select-none transition-all duration-300">
      <div className="px-4 mb-10">
        <h2 className="font-sans text-2xl font-black text-black dark:text-white tracking-tight leading-none">Note X</h2>
        <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-neutral-450 dark:text-neutral-500 mt-2.5">
          Digital Notebook
        </p>
      </div>
      <div className="flex flex-col gap-1.5 flex-grow">
        <button
          onClick={() => onTabChange('library')}
          className={`flex items-center gap-3.5 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${getTabStyle('library')}`}
        >
          <BookOpen className="w-5 h-5 flex-shrink-0" />
          <span>Library</span>
        </button>
        <button
          onClick={() => onTabChange('drafts')}
          className={`flex items-center gap-3.5 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${getTabStyle('drafts')}`}
        >
          <FileText className="w-5 h-5 flex-shrink-0" />
          <span>Drafts</span>
        </button>
        <button
          onClick={() => onTabChange('archive')}
          className={`flex items-center gap-3.5 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${getTabStyle('archive')}`}
        >
          <Archive className="w-5 h-5 flex-shrink-0" />
          <span>Archive</span>
        </button>
        <button
          onClick={() => onTabChange('settings')}
          className={`flex items-center gap-3.5 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${getTabStyle('settings')}`}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span>Settings</span>
        </button>
        <div className="mt-6 px-1">
          <button
            onClick={onNewEntry}
            className="w-full bg-black dark:bg-white hover:bg-neutral-900 dark:hover:bg-neutral-100 text-white dark:text-black py-3.5 text-base font-bold tracking-wide rounded-xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer shadow-sm border border-neutral-300 dark:border-neutral-700"
          >
            <Plus className="w-5 h-5" />
            <span>New Entry</span>
          </button>
        </div>
      </div>
      <div className="mt-auto flex flex-col gap-1.5 border-t border-neutral-200 dark:border-neutral-850 pt-4">
        <button
          onClick={onHelp}
          className="flex items-center gap-3.5 px-4 py-3 text-base font-medium tracking-wide text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-xl cursor-pointer transition-all duration-200"
        >
          <HelpCircle className="w-5 h-5" />
          <span>Help</span>
        </button>
        <button
          onClick={onLogout}
          className="flex items-center gap-3.5 px-4 py-3 text-base font-medium tracking-wide text-neutral-500 dark:text-neutral-400 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl cursor-pointer transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
        <div className="flex items-center gap-3 px-2 pb-4 pt-3 mt-1">
          <button
            onClick={() => onTabChange('settings')}
            className="w-10 h-10 rounded-full border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-all duration-200 bg-white dark:bg-neutral-850 cursor-pointer group flex-shrink-0 overflow-hidden"
            title="Edit User Profile"
          >
            <img
              alt="Profile"
              className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-200"
              src={profile.avatarUrl}
            />
          </button>
          <div className="overflow-hidden">
            <h4 className="font-sans text-base font-bold text-neutral-800 dark:text-neutral-200 truncate leading-none">
              {profile.name}
            </h4>
            <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 truncate mt-1.5">
              {profile.email}
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}

