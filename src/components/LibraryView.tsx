import { useState, useMemo } from 'react';
import { NoteItem, NoteType, AppTab } from '../types';
import { ExternalLink, Hash, ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { renderFormattedContent } from '../utils/formatter';
interface LibraryViewProps {
  currentTab: AppTab;
  notes: NoteItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectNote: (note: NoteItem) => void;
  onNewEntry: () => void;
}
export default function LibraryView({
  currentTab,
  notes,
  searchQuery,
  setSearchQuery,
  onSelectNote,
  onNewEntry
}: LibraryViewProps) {
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('All Time');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const allCategories = useMemo(() => {
    const cats = new Set(notes.map(n => n.category));
    return ['All', ...Array.from(cats)];
  }, [notes]);
  const tabFilteredNotes = useMemo(() => {
    return notes.filter(note => {
      if (currentTab === 'drafts') return note.type === 'Draft';
      if (currentTab === 'archive') return note.type === 'Archive';
      return true; // Library view displays everything
    });
  }, [notes, currentTab]);
  const filteredNotes = useMemo(() => {
    return tabFilteredNotes.filter(note => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = query === '' || 
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.category.toLowerCase().includes(query) ||
        note.tags.some(t => t.toLowerCase().includes(query));
      const matchesCategory = categoryFilter === 'All' || note.category === categoryFilter;
      let matchesDate = true;
      if (dateRangeFilter === 'Last 7 Days') {
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        matchesDate = note.lastEditedTimestamp >= sevenDaysAgo;
      } else if (dateRangeFilter === 'Last 30 Days') {
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        matchesDate = note.lastEditedTimestamp >= thirtyDaysAgo;
      }
      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [tabFilteredNotes, searchQuery, categoryFilter, dateRangeFilter]);
  const featuredNote = useMemo(() => {
    const manuscript = filteredNotes.find(n => n.type === 'Manuscript');
    if (manuscript) return manuscript;
    return filteredNotes[0] || null;
  }, [filteredNotes]);
  const listDetailsNotes = useMemo(() => {
    if (!featuredNote) return filteredNotes;
    return filteredNotes.filter(n => n.id !== featuredNote.id);
  }, [filteredNotes, featuredNote]);
  const quickTags = useMemo(() => {
    const tags = new Set<string>();
    notes.forEach(n => n.tags.forEach(t => tags.add(t)));
    return Array.from(tags).slice(0, 6);
  }, [notes]);
  const toggleTagSelection = (tag: string) => {
    if (searchQuery.toLowerCase() === tag.toLowerCase()) {
      setSearchQuery('');
    } else {
      setSearchQuery(tag);
    }
  };
  return (
    <div className="max-w-[1140px] mx-auto py-6 select-none">
      <section className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-250 dark:border-neutral-850 pb-8">
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-neutral-450 dark:text-neutral-550 mb-2.5">
              {currentTab === 'library' && 'Notebook Archive'}
              {currentTab === 'drafts' && 'Working Drafts'}
              {currentTab === 'archive' && 'Archived Records'}
            </p>
            <h1 className="font-sans text-4xl md:text-5xl font-black text-black dark:text-white tracking-tight leading-none animate-fade-in">
              {searchQuery ? `"${searchQuery}"` : (
                currentTab === 'library' ? 'The Library' : (
                  currentTab === 'drafts' ? 'Unfinished Intent' : 'Archived Repository'
                )
              )}
            </h1>
            <p className="font-sans text-base text-neutral-500 dark:text-neutral-450 mt-3.5 font-medium">
              {filteredNotes.length} matches found across your collections.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3.5 relative w-full md:w-auto">
            <div className="flex items-center bg-white dark:bg-black border border-neutral-250 dark:border-neutral-800 rounded-xl px-4 py-2.5 w-full md:w-64 focus-within:border-black dark:focus-within:border-white transition-all duration-200 shadow-sm text-black dark:text-white">
              <button 
                type="button"
                className="focus:outline-none mr-2.5 flex-shrink-0 cursor-pointer text-neutral-450 hover:text-black dark:hover:text-white"
                onClick={() => {
                  document.getElementById('library-search-input')?.focus();
                }}
                title="Focus Search"
              >
                <Search className="w-4.5 h-4.5 text-neutral-400 dark:text-neutral-500" />
              </button>
              <input
                id="library-search-input"
                className="bg-transparent border-none outline-none focus:outline-none text-sm font-sans w-full text-black dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                placeholder="Search notes, tags, category..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-sm text-neutral-450 hover:text-black dark:hover:text-white font-bold ml-1.5 flex-shrink-0"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="relative">
              <button 
                onClick={() => {
                  setShowDateDropdown(!showDateDropdown);
                  setShowCategoryDropdown(false);
                }}
                className="px-4 py-2.5 bg-white dark:bg-black border border-neutral-250 dark:border-neutral-800 rounded-xl font-sans text-sm font-semibold uppercase tracking-widest flex items-center gap-2 hover:border-black dark:hover:border-white transition-all duration-200 cursor-pointer shadow-sm text-neutral-800 dark:text-neutral-200"
              >
                <span>Date: {dateRangeFilter}</span> 
                <ChevronDown className="w-4 h-4 text-neutral-500" />
              </button>
              {showDateDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-black border border-neutral-250 dark:border-neutral-800 rounded-xl shadow-lg z-50 overflow-hidden">
                  {['All Time', 'Last 7 Days', 'Last 30 Days'].map(item => (
                    <button
                      key={item}
                      onClick={() => {
                        setDateRangeFilter(item);
                        setShowDateDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer text-neutral-700 dark:text-neutral-350 ${
                        dateRangeFilter === item ? 'bg-black dark:bg-white text-white dark:text-black font-bold' : ''
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button 
                onClick={() => {
                  setShowCategoryDropdown(!showCategoryDropdown);
                  setShowDateDropdown(false);
                }}
                className="px-4 py-2.5 bg-white dark:bg-black border border-neutral-250 dark:border-neutral-800 rounded-xl font-sans text-sm font-semibold uppercase tracking-widest flex items-center gap-2 hover:border-black dark:hover:border-white transition-all duration-200 cursor-pointer shadow-sm text-neutral-800 dark:text-neutral-200"
              >
                <span>Category: {categoryFilter}</span> 
                <ChevronDown className="w-4 h-4 text-neutral-500" />
              </button>
              {showCategoryDropdown && (
                <div className="absolute right-0 mt-2 min-w-48 bg-white dark:bg-black border border-neutral-250 dark:border-neutral-800 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                  {allCategories.map(item => (
                    <button
                      key={item}
                      onClick={() => {
                        setCategoryFilter(item);
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer text-neutral-700 dark:text-neutral-350 ${
                        categoryFilter === item ? 'bg-black dark:bg-white text-white dark:text-black font-bold' : ''
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {filteredNotes.length === 0 ? (
        <div className="bg-white dark:bg-black border border-neutral-250 dark:border-neutral-800 rounded-3xl p-12 text-center shadow-sm">
          <p className="font-serif italic text-xl text-neutral-400 dark:text-neutral-500">
            No entries found matching your inquiry.
          </p>
          <button
            onClick={onNewEntry}
            className="mt-6 px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-900 dark:hover:bg-neutral-100 transition-all duration-200 shadow-sm border border-neutral-300 dark:border-neutral-700"
          >
            Create New Entry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in">
          {featuredNote && (
            <motion.div 
              layoutId={`card-container-${featuredNote.id}`}
              className="md:col-span-8 group"
            >
              <article 
                onClick={() => onSelectNote(featuredNote)}
                className="bg-white dark:bg-black border border-neutral-250 dark:border-neutral-800 rounded-3xl p-8 h-full flex flex-col justify-between hover:border-black dark:hover:border-neutral-500 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-3.5 py-1.5 bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-sans text-xs font-bold uppercase tracking-widest rounded-lg border border-neutral-200 dark:border-neutral-800">
                      {featuredNote.type}
                    </span>
                    <span className="font-sans text-sm text-neutral-400 dark:text-neutral-500 font-medium">
                      Updated {featuredNote.updatedAt}
                    </span>
                  </div>
                  <h3 className="font-sans text-3xl md:text-4xl text-black dark:text-white font-bold group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-all duration-200 leading-snug">
                    {featuredNote.title}
                  </h3>
                  <p className="font-sans text-base text-neutral-600 dark:text-neutral-300 mt-5 line-clamp-4 leading-relaxed font-normal">
                    {renderFormattedContent(featuredNote.content)}
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-neutral-200 dark:border-neutral-850 flex items-center gap-2">
                  <span className="font-sans text-sm font-bold uppercase tracking-widest text-black dark:text-white group-hover:underline">
                    Read Full Entry
                  </span>
                  <span className="font-sans font-bold text-black dark:text-white text-base">
                    →
                  </span>
                </div>
              </article>
            </motion.div>
          )}
          <div className="md:col-span-4 space-y-8">
            <div className="rounded-2xl overflow-hidden h-64 border border-neutral-250 dark:border-neutral-800 shadow-sm">
              <img 
                alt="Brutalist spiral architecture" 
                className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0K9XEWRUPR3Z0jy_yzwrK3OqkgDpuvmSnTpNnc3xhZ88B3Vj2SoIKryvLASFrX604HUAhLetB7Clatics_2Lly8AXrF8InAnQIja7cMrD4K6qNI-OIKIXU8Cvyyg82Pd19bRoXJPnPCXgG-nO-Qm7Uw_LPy9-wOLtsyPG8le08XgSUCZ0-stztzPXqOxPiZeBfDquBDBCRDrn0cdwt6rQAJ35_WESNCKEvVR0ud6oF9TKaAe28a_-WCqK1vcdFAZryoHrhACtf8g"
              />
            </div>
            <div className="bg-white dark:bg-black border border-neutral-250 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-neutral-450 dark:text-neutral-500 mb-4">
                Quick Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {quickTags.map(tag => {
                  const isActive = searchQuery.toLowerCase() === tag.toLowerCase();
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTagSelection(tag)}
                      className={`px-3.5 py-1.5 rounded-full text-sm font-semibold tracking-wide cursor-pointer transition-all duration-200 ${
                        isActive 
                        ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm' 
                        : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800/80'
                      }`}
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          {listDetailsNotes.length > 0 && (
            <div className="md:col-span-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {listDetailsNotes.map((note) => (
                  <div 
                    key={note.id}
                    onClick={() => onSelectNote(note)}
                    className="bg-white dark:bg-black border border-neutral-250 dark:border-neutral-800 rounded-2xl p-6 md:p-8 hover:border-black dark:hover:border-neutral-500 cursor-pointer transition-all duration-200 group flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <span className="font-sans text-xs font-bold uppercase tracking-widest text-neutral-450 dark:text-neutral-550 block mb-2.5">
                        {note.type} • {note.category}
                      </span>
                      <h4 className="font-sans text-xl font-bold text-black dark:text-white group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors duration-200 mb-3.5 leading-snug">
                        {note.title}
                      </h4>
                      <p className="font-sans text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                        {renderFormattedContent(note.content)}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-850 flex justify-between items-center text-xs font-semibold">
                      <span className="font-sans italic text-neutral-450 dark:text-neutral-500">
                        Last edited {note.updatedAt}
                      </span>
                      <ExternalLink className="w-4 h-4 text-black dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="md:col-span-5">
            <div className="bg-black dark:bg-black rounded-3xl p-8 text-white h-full flex flex-col justify-between shadow-sm border border-neutral-800">
              <h2 className="font-serif text-xl md:text-2xl italic leading-relaxed text-neutral-200 mb-8 font-medium">
                "Search is not about finding; it is about recalling intent."
              </h2>
              <button 
                onClick={onNewEntry}
                className="self-start px-6 py-3.5 bg-neutral-900 dark:bg-neutral-900 hover:bg-white hover:text-black text-white text-sm font-bold uppercase tracking-widest rounded-xl border border-neutral-750 transition-all duration-200 cursor-pointer select-none"
              >
                Create New Entry
              </button>
            </div>
          </div>
          <div className="md:col-span-7">
            <div className="bg-white dark:bg-black border border-neutral-250 dark:border-neutral-800 rounded-3xl p-8 h-full shadow-sm">
              <div className="flex items-center gap-3.5 mb-6">
                <Hash className="w-5 h-5 text-black dark:text-white" />
                <span className="font-sans text-sm font-bold uppercase tracking-widest text-black dark:text-white">
                  Related Collections
                </span>
              </div>
              <ul className="space-y-1 font-sans text-base font-semibold">
                <li 
                  onClick={() => setSearchQuery('Theoretical')}
                  className="flex justify-between items-center py-2.5 px-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer group transition-all duration-150"
                >
                  <span className="text-neutral-700 dark:text-neutral-350 group-hover:text-black dark:group-hover:text-white transition-colors">Theoretical Frameworks</span>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800">32 notes</span>
                </li>
                <li 
                  onClick={() => setSearchQuery('Archive')}
                  className="flex justify-between items-center py-2.5 px-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer group transition-all duration-150"
                >
                  <span className="text-neutral-700 dark:text-neutral-350 group-hover:text-black dark:group-hover:text-white transition-colors">Digital Curation Series</span>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800">14 notes</span>
                </li>
                <li 
                  onClick={() => setSearchQuery('Space')}
                  className="flex justify-between items-center py-2.5 px-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer group transition-all duration-150"
                >
                  <span className="text-neutral-700 dark:text-neutral-350 group-hover:text-black dark:group-hover:text-white transition-colors">Personal Correspondence</span>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800">8 notes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

