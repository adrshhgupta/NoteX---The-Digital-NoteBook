import React, { useState, useEffect, useRef } from 'react';
import { NoteItem, NoteType, StationeryConfig } from '../types';
import { 
  X, Save, Trash2, Hash, Bold, Italic, Underline, Upload, FileDown, Type, Search,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Undo2, Redo2, Highlighter,
  Strikethrough, List, ListOrdered, Eraser, Palette, Check, Hourglass, Play, Pause
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
interface NoteModalProps {
  note: NoteItem | null; // Null means creating a new note
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: NoteItem) => void;
  onAutoSave: (note: NoteItem) => void;
  onDelete?: (id: string) => void;
  stationeryConfig: StationeryConfig;
}
export default function NoteModal({
  note,
  isOpen,
  onClose,
  onSave,
  onAutoSave,
  onDelete,
  stationeryConfig
}: NoteModalProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<NoteType>('Draft');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [noteId, setNoteId] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  const [isAutoSaving, setIsAutoSaving] = useState<boolean>(false);
  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write');
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [zenDuration, setZenDuration] = useState<number>(25); // minutes
  const [zenTimeRemaining, setZenTimeRemaining] = useState<number>(0); // seconds
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [showZenDurationDropdown, setShowZenDurationDropdown] = useState<boolean>(false);
  useEffect(() => {
    let intervalId: any = null;
    if (isZenMode && isTimerRunning && zenTimeRemaining > 0) {
      intervalId = setInterval(() => {
        setZenTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            alert("Zen Hourglass Focus: Your session has completed successfully!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isZenMode, isTimerRunning, zenTimeRemaining]);
  const formatZenTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const handleStartZen = (minutes: number) => {
    setZenDuration(minutes);
    setZenTimeRemaining(minutes * 60);
    setIsZenMode(true);
    setIsTimerRunning(true);
    setShowZenDurationDropdown(false);
  };
  const handleToggleTimer = () => {
    setIsTimerRunning(prev => !prev);
  };
  const handleExitZen = () => {
    setIsZenMode(false);
    setIsTimerRunning(false);
  };
  const [docSearchQuery, setDocSearchQuery] = useState<string>('');
  const [replaceQuery, setReplaceQuery] = useState<string>('');
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);
  const [isBoldActive, setIsBoldActive] = useState<boolean>(false);
  const [isItalicActive, setIsItalicActive] = useState<boolean>(false);
  const [isUnderlineActive, setIsUnderlineActive] = useState<boolean>(false);
  const [isStrikeActive, setIsStrikeActive] = useState<boolean>(false);
  const [isOLActive, setIsOLActive] = useState<boolean>(false);
  const [isULActive, setIsULActive] = useState<boolean>(false);
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState<boolean>(false);
  const [showFontFamilyDropdown, setShowFontFamilyDropdown] = useState<boolean>(false);
  const [showHighlightDropdown, setShowHighlightDropdown] = useState<boolean>(false);
  const [showTextColorDropdown, setShowTextColorDropdown] = useState<boolean>(false);
  const [editorFontSize, setEditorFontSize] = useState<string>('16px');
  const [editorFontFamily, setEditorFontFamily] = useState<string>('');
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };
  const checkSelectionStyles = () => {
    setIsBoldActive(document.queryCommandState('bold'));
    setIsItalicActive(document.queryCommandState('italic'));
    setIsUnderlineActive(document.queryCommandState('underline'));
    setIsStrikeActive(document.queryCommandState('strikeThrough'));
    setIsOLActive(document.queryCommandState('insertOrderedList'));
    setIsULActive(document.queryCommandState('insertUnorderedList'));
  };
  const handleFormat = (style: 'bold' | 'italic' | 'underline' | 'strikeThrough' | 'insertOrderedList' | 'insertUnorderedList' | 'removeFormat') => {
    if (editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(style, false);
    handleInput();
    checkSelectionStyles();
  };
  const handleAlign = (alignment: 'justifyLeft' | 'justifyCenter' | 'justifyRight' | 'justifyFull') => {
    if (editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(alignment, false);
    handleInput();
  };
  const handleUndo = () => {
    if (editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand('undo', false);
    handleInput();
  };
  const handleRedo = () => {
    if (editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand('redo', false);
    handleInput();
  };
  const setCursorInElement = (el: HTMLElement) => {
    const range = document.createRange();
    const sel = window.getSelection();
    if (sel) {
      range.setStart(el.firstChild || el, el.firstChild ? el.firstChild.textContent?.length || 0 : 0);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };
  const handleFontSizeChange = (size: string) => {
    setEditorFontSize(size);
    if (editorRef.current) {
      editorRef.current.style.fontSize = size;
      const spans = editorRef.current.getElementsByTagName('span');
      for (let i = 0; i < spans.length; i++) {
        spans[i].style.fontSize = '';
      }
    }
    handleInput();
    setShowFontSizeDropdown(false);
  };
  const handleFontFamilyChange = (font: string) => {
    setEditorFontFamily(font);
    if (editorRef.current) {
      if (font === 'Editorial') {
        editorRef.current.style.fontFamily = 'Georgia, serif';
        editorRef.current.style.fontStyle = 'italic';
      } else {
        editorRef.current.style.fontFamily = font;
        editorRef.current.style.fontStyle = 'normal';
      }
      const spans = editorRef.current.getElementsByTagName('span');
      for (let i = 0; i < spans.length; i++) {
        spans[i].style.fontFamily = '';
        spans[i].style.fontStyle = '';
      }
    }
    handleInput();
    setShowFontFamilyDropdown(false);
  };
  const handleTextColorChange = (color: string) => {
    if (editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand('foreColor', false, color);
    handleInput();
    setShowTextColorDropdown(false);
  };
  const handleHighlight = (color: string) => {
    if (editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand('hiliteColor', false, color);
    handleInput();
    setShowHighlightDropdown(false);
  };
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
    handleInput();
  };
  const handleSearchNext = () => {
    if (!docSearchQuery.trim()) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    const found = window.find(docSearchQuery, false, false, true, false, true, false);
    if (!found) {
      alert(`No more matches found for "${docSearchQuery}"`);
    }
  };
  const handleSearchPrev = () => {
    if (!docSearchQuery.trim()) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    const found = window.find(docSearchQuery, false, true, true, false, true, false);
    if (!found) {
      alert(`No matches found for "${docSearchQuery}"`);
    }
  };
  const handleReplace = () => {
    if (!docSearchQuery.trim()) return;
    const selection = window.getSelection();
    if (selection && selection.toString().toLowerCase() === docSearchQuery.toLowerCase()) {
      document.execCommand('insertText', false, replaceQuery);
      handleInput();
    }
    handleSearchNext();
  };
  const handleReplaceAll = () => {
    if (!docSearchQuery.trim()) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
    let count = 0;
    let found = window.find(docSearchQuery, false, false, true, false, true, false);
    while (found && count < 100) {
      document.execCommand('insertText', false, replaceQuery);
      handleInput();
      count++;
      found = window.find(docSearchQuery, false, false, true, false, true, false);
    }
    if (count > 0) {
      alert(`Replaced ${count} occurrences of "${docSearchQuery}"`);
    } else {
      alert(`No occurrences of "${docSearchQuery}" found to replace`);
    }
  };
  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;
      const editor = editorRef.current;
      if (!editor) {
        setContent(prev => prev + '\n' + text);
        return;
      }
      editor.focus();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const formattedTxt = text.replace(/\n/g, '<br />');
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = formattedTxt;
        const fragment = document.createDocumentFragment();
        let child = tempDiv.firstChild;
        while (child) {
          fragment.appendChild(child.cloneNode(true));
          child = child.nextSibling;
        }
        range.insertNode(fragment);
      } else {
        editor.innerHTML += '<br />' + text.replace(/\n/g, '<br />');
      }
      handleInput();
    };
    reader.readAsText(file);
    e.target.value = '';
  };
  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return alert('Please allow popups to export PDF.');
    const activeFont = stationeryConfig.typeface === 'Serif' 
      ? "Georgia, serif" 
      : stationeryConfig.typeface === 'Monospace'
      ? "Courier New, monospace"
      : "system-ui, -apple-system, sans-serif";
    printWindow.document.write(`
      <html>
        <head>
          <title>${title || 'Note X Notebook'}</title>
          <style>
            body {
              font-family: ${activeFont};
              padding: 40px;
              color: #000000;
              background-color: #ffffff;
              line-height: 1.6;
            }
            .header-bar {
              border-bottom: 2px solid #000000;
              padding-bottom: 12px;
              margin-bottom: 24px;
            }
            .header-title {
              font-size: 28px;
              font-weight: 900;
              color: #000000;
              margin: 0 0 6px 0;
            }
            .header-meta {
              font-family: system-ui, sans-serif;
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #666666;
            }
            .content-area {
              font-size: 15px;
              color: #000000;
            }
            @media print {
              body { padding: 0; background: white; }
            }
          </style>
        </head>
        <body>
          <div class="header-bar">
            <h1 class="header-title">${title || 'Untitled Archive'}</h1>
            <div class="header-meta">Category: ${category || 'General'} | Collection: ${type}</div>
          </div>
          <div class="content-area">${content}</div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };
  const getRenderedPreview = () => {
    if (!content.trim()) {
      return <span className="italic opacity-30">No conceptual elements to render yet. Select Write Content to draft.</span>;
    }
    let html = content;
    if (docSearchQuery.trim()) {
      const escapedQuery = docSearchQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`(${escapedQuery})(?![^<>]*>)`, 'gi');
      html = html.replace(regex, '<mark class="bg-neutral-200 text-black dark:bg-neutral-800 dark:text-white font-semibold px-0.5 rounded shadow-sm">$1</mark>');
    }
    return (
      <span 
        className="inline-block w-full"
        dangerouslySetInnerHTML={{ __html: html }} 
      />
    );
  };
  useEffect(() => {
    if (isOpen) {
      if (!isInitialized) {
        setIsInitialized(true);
        if (note) {
          setTitle(note.title);
          setType(note.type);
          setCategory(note.category);
          setContent(note.content);
          setTagInput(note.tags.join(', '));
          setNoteId(note.id);
          setLastSavedTime('');
        } else {
          setTitle('');
          setType('Draft');
          setCategory('Journaling');
          setContent('');
          setTagInput('Midnight, New');
          setNoteId(`note-${Date.now()}`);
          setLastSavedTime('');
        }
        const inheritedFont = stationeryConfig.typeface === 'Serif' ? 'Georgia, serif'
          : stationeryConfig.typeface === 'Garamond' ? '"EB Garamond", Georgia, serif'
          : stationeryConfig.typeface === 'Editorial' ? 'Georgia, serif'
          : stationeryConfig.typeface === 'Monospace' ? '"Roboto Mono", monospace'
          : 'system-ui, -apple-system, sans-serif';
        const isItalic = stationeryConfig.typeface === 'Editorial';
        setEditorFontSize('18px');
        setEditorFontFamily(inheritedFont);
        if (editorRef.current) {
          editorRef.current.style.fontSize = '18px';
          editorRef.current.style.fontFamily = inheritedFont;
          editorRef.current.style.fontStyle = isItalic ? 'italic' : 'normal';
        }
      }
    } else {
      setIsInitialized(false);
    }
  }, [note, isOpen, isInitialized]);
  useEffect(() => {
    if (isOpen && isInitialized && editorRef.current) {
      editorRef.current.innerHTML = content;
      editorRef.current.style.fontSize = editorFontSize;
      editorRef.current.style.fontFamily = editorFontFamily;
    }
  }, [isOpen, isInitialized, noteId]);
  const latestDraftRef = useRef({ title, type, category, content, tagInput, noteId });
  useEffect(() => {
    latestDraftRef.current = { title, type, category, content, tagInput, noteId };
  }, [title, type, category, content, tagInput, noteId]);
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      const { title: curTitle, type: curType, category: curCategory, content: curContent, tagInput: curTag, noteId: curId } = latestDraftRef.current;
      if (!curTitle.trim() && !curContent.trim()) return;
      setIsAutoSaving(true);
      const parsedTags = curTag
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);
      const savedNote: NoteItem = {
        id: curId,
        title: curTitle.trim() || 'Untitled Diary Entry',
        type: curType,
        category: curCategory.trim() || 'General',
        content: curContent,
        updatedAt: 'Auto-saved',
        lastEditedTimestamp: Date.now(),
        tags: parsedTags
      };
      onAutoSave(savedNote);
      setTimeout(() => {
        setIsAutoSaving(false);
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSavedTime(timeStr);
      }, 700);
    }, 30000);
    return () => clearInterval(interval);
  }, [isOpen, onAutoSave]);
  if (!isOpen) return null;
  const isDarkPaper = stationeryConfig.paperGrain === 'midnight' || stationeryConfig.paperGrain === 'blueprint' || stationeryConfig.paperGrain === 'obsidian';
  const textColorClass = isDarkPaper ? 'text-white' : 'text-neutral-900';
  const labelColorClass = isDarkPaper ? 'text-neutral-400' : 'text-neutral-500';
  const borderColorClass = isDarkPaper ? 'border-neutral-800' : 'border-neutral-200';
  const inputBgClass = isDarkPaper ? 'bg-neutral-950/40' : 'bg-white/60';
  const borderLightClass = isDarkPaper ? 'border-neutral-800/40' : 'border-neutral-200/40';
  const borderVeryLightClass = isDarkPaper ? 'border-neutral-800/20' : 'border-neutral-200/20';
  const activeStyleClass = isDarkPaper
    ? 'bg-white text-black border-white font-bold'
    : 'bg-black text-white border-black font-bold';
  const searchInputBgClass = isDarkPaper ? 'bg-neutral-900' : 'bg-white';
  const searchPanelBgClass = isDarkPaper ? 'bg-neutral-950/60' : 'bg-neutral-100';
  const getPaperClass = () => {
    if (stationeryConfig.paperGrain === 'linen') return 'grain-linen text-[#000000]';
    if (stationeryConfig.paperGrain === 'vellum') return 'grain-vellum text-[#000000]';
    if (stationeryConfig.paperGrain === 'parchment') return 'grain-parchment text-[#000000]';
    if (stationeryConfig.paperGrain === 'blueprint') return 'grain-blueprint text-[#ffffff]';
    if (stationeryConfig.paperGrain === 'manuscript') return 'grain-manuscript text-[#000000]';
    if (stationeryConfig.paperGrain === 'obsidian') return 'grain-obsidian text-[#ffffff]';
    return 'grain-midnight text-[#ffffff]';
  };
  const getEditorFontClass = () => {
    if (stationeryConfig.typeface === 'Serif') return 'font-serif';
    if (stationeryConfig.typeface === 'Garamond') return 'font-garamond text-base';
    if (stationeryConfig.typeface === 'Editorial') return 'font-serif italic';
    if (stationeryConfig.typeface === 'Monospace') return 'font-mono text-sm leading-relaxed';
    return 'font-sans';
  };
  const handleSave = () => {
    if (!title.trim()) return alert('Please input an entry title first.');
    const parsedTags = tagInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    const savedNote: NoteItem = {
      id: noteId,
      title: title.trim(),
      type,
      category: category.trim() || 'General',
      content,
      updatedAt: 'Just Now',
      lastEditedTimestamp: Date.now(),
      tags: parsedTags
    };
    onSave(savedNote);
  };
  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '40px'];
  const highlightColors = [
    { name: 'Yellow', value: '#fef08a' },
    { name: 'Green', value: '#bbf7d0' },
    { name: 'Cyan', value: '#a5f3fc' },
    { name: 'Clear', value: 'transparent' }
  ];
  const getWordCount = () => {
    const cleanText = content.replace(/<[^>]*>/g, ' ');
    const words = cleanText.trim().split(/\s+/).filter(w => w.length > 0);
    return words.length;
  };
  const getCharCount = () => {
    const cleanText = content.replace(/<[^>]*>/g, '');
    return cleanText.length;
  };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <input 
        type="file" 
        accept=".txt,.md" 
        ref={fileInputRef} 
        onChange={handleDocUpload} 
        className="hidden" 
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="w-full max-w-[840px] bg-white dark:bg-black border border-neutral-250 dark:border-neutral-800 shadow-xl flex flex-col relative h-[90vh] max-h-[850px] overflow-hidden"
      >
        {!isZenMode && (
          <div className="bg-white dark:bg-black border-b border-neutral-250 dark:border-neutral-850 p-4 flex gap-4 md:items-center justify-between flex-shrink-0 z-20 text-neutral-800 dark:text-neutral-200 rounded-t-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-sans text-base font-black tracking-tight block text-black dark:text-white">
                Note X Editor
              </span>
              <div className="flex bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-lg overflow-hidden text-[10px] font-bold uppercase leading-none p-0.5 gap-0.5 shadow-sm">
                {(['Draft', 'Manuscript', 'Archive'] as NoteType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`px-3 py-2 cursor-pointer transition-all rounded-md ${
                      type === t ? 'bg-black text-white dark:bg-white dark:text-black font-bold' : 'bg-transparent text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isAutoSaving && (
                <span className="text-[10px] sm:text-xs font-bold text-neutral-500 animate-pulse">
                  Auto-saving...
                </span>
              )}
              {!isAutoSaving && lastSavedTime && (
                <span className="text-[10px] sm:text-xs font-medium text-neutral-400 dark:text-neutral-550">
                  Saved {lastSavedTime}
                </span>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 dark:text-neutral-550 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-850 cursor-pointer flex items-center justify-center transition-colors"
                title="Close Page"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        <div className={`flex-grow p-6 md:p-8 overflow-y-auto space-y-6 custom-scrollbar-thin ${getPaperClass()}`}>
          {isZenMode && (
            <div className={`flex items-center justify-between pb-4 border-b ${borderLightClass} mb-4 select-none animate-fade-in ${textColorClass}`}>
              <div className="flex items-center gap-3">
                <Hourglass className={`w-5 h-5 text-amber-600 dark:text-amber-400 ${isTimerRunning ? 'animate-pulse' : ''}`} />
                <span className="text-xl font-mono font-bold tracking-widest">{formatZenTime(zenTimeRemaining)}</span>
                <button
                  type="button"
                  onClick={handleToggleTimer}
                  className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center border border-transparent"
                  title={isTimerRunning ? "Pause Focus Session" : "Resume Focus Session"}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-450 dark:text-neutral-500 animate-pulse">Zen Focus Session</span>
                <button
                  type="button"
                  onClick={handleExitZen}
                  className="px-3.5 py-1.5 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 border border-neutral-300 dark:border-neutral-700 text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Exit Zen
                </button>
              </div>
            </div>
          )}
          {!isZenMode && (
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b ${borderLightClass}`}>
              <div className="space-y-1.5">
                <label className={`text-xs font-bold uppercase tracking-widest block ${labelColorClass}`}>
                  Entry Title
                </label>
                <input
                  className={`w-full ${inputBgClass} border ${borderColorClass} focus:border-black dark:focus:border-white py-2 px-3 text-lg font-bold focus:outline-none rounded-lg transition-colors ${textColorClass}`}
                  placeholder="The Archival Thesis..."
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className={`text-xs font-bold uppercase tracking-widest block ${labelColorClass}`}>
                  Collection Category
                </label>
                <input
                  className={`w-full ${inputBgClass} border ${borderColorClass} focus:border-black dark:focus:border-white py-2 px-3 text-base focus:outline-none rounded-lg transition-colors ${textColorClass}`}
                  placeholder="Theoretical Curation..."
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
            </div>
          )}
          {!isZenMode && (
            <div className={`flex gap-2.5 items-center text-sm pb-4 border-b ${borderVeryLightClass} ${textColorClass}`}>
              <Hash className="w-4 h-4 opacity-60" />
              <input
                className={`bg-transparent border-none focus:outline-none text-sm font-sans tracking-wide w-full ${textColorClass}`}
                placeholder="separate, tags, with, commas..."
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />
            </div>
          )}
          <div className="flex-grow flex flex-col pt-2 min-h-[300px]">
            {!isZenMode && (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-current/10 mb-4 select-none flex-wrap gap-3">
                <div className={`flex items-center gap-1 relative flex-wrap ${textColorClass}`}>
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={editorMode !== 'write'}
                  className={`p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-all cursor-pointer flex items-center justify-center ${editorMode !== 'write' ? 'opacity-20 cursor-not-allowed' : ''}`}
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={editorMode !== 'write'}
                  className={`p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-all cursor-pointer flex items-center justify-center ${editorMode !== 'write' ? 'opacity-20 cursor-not-allowed' : ''}`}
                  title="Redo (Ctrl+Y)"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
                <div className="h-4 w-[1px] bg-current/15 mx-1" />
                <button
                  type="button"
                  onClick={() => handleFormat('bold')}
                  disabled={editorMode !== 'write'}
                  className={`p-1.5 rounded-lg hover:bg-neutral-200 transition-all cursor-pointer flex items-center justify-center border ${
                    isBoldActive 
                    ? activeStyleClass 
                    : 'bg-transparent text-current border-transparent'
                  } ${editorMode !== 'write' ? 'opacity-20 cursor-not-allowed' : ''}`}
                  title="Apply Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat('italic')}
                  disabled={editorMode !== 'write'}
                  className={`p-1.5 rounded-lg hover:bg-neutral-200 transition-all cursor-pointer flex items-center justify-center border ${
                    isItalicActive 
                    ? activeStyleClass 
                    : 'bg-transparent text-current border-transparent'
                  } ${editorMode !== 'write' ? 'opacity-20 cursor-not-allowed' : ''}`}
                  title="Apply Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat('underline')}
                  disabled={editorMode !== 'write'}
                  className={`p-1.5 rounded-lg hover:bg-neutral-200 transition-all cursor-pointer flex items-center justify-center border ${
                    isUnderlineActive 
                    ? activeStyleClass 
                    : 'bg-transparent text-current border-transparent'
                  } ${editorMode !== 'write' ? 'opacity-20 cursor-not-allowed' : ''}`}
                  title="Apply Underline"
                >
                  <Underline className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat('strikeThrough')}
                  disabled={editorMode !== 'write'}
                  className={`p-1.5 rounded-lg hover:bg-neutral-200 transition-all cursor-pointer flex items-center justify-center border ${
                    isStrikeActive 
                    ? activeStyleClass 
                    : 'bg-transparent text-current border-transparent'
                  } ${editorMode !== 'write' ? 'opacity-20 cursor-not-allowed' : ''}`}
                  title="Strikethrough"
                >
                  <Strikethrough className="w-4 h-4" />
                </button>
                <div className="h-4 w-[1px] bg-current/15 mx-1" />
                <button
                  type="button"
                  onClick={() => handleFormat('insertUnorderedList')}
                  disabled={editorMode !== 'write'}
                  className={`p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-all cursor-pointer flex items-center justify-center border ${
                    isULActive 
                    ? activeStyleClass 
                    : 'bg-transparent text-current border-transparent'
                  } ${editorMode !== 'write' ? 'opacity-20 cursor-not-allowed' : ''}`}
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat('insertOrderedList')}
                  disabled={editorMode !== 'write'}
                  className={`p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-all cursor-pointer flex items-center justify-center border ${
                    isOLActive 
                    ? activeStyleClass 
                    : 'bg-transparent text-current border-transparent'
                  } ${editorMode !== 'write' ? 'opacity-20 cursor-not-allowed' : ''}`}
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat('removeFormat')}
                  disabled={editorMode !== 'write'}
                  className={`p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-all cursor-pointer flex items-center justify-center ${editorMode !== 'write' ? 'opacity-20 cursor-not-allowed' : ''}`}
                  title="Clear All Formatting"
                >
                  <Eraser className="w-4 h-4" />
                </button>
                <div className="h-4 w-[1px] bg-current/15 mx-1" />
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      if (editorMode === 'write') setShowTextColorDropdown(!showTextColorDropdown);
                    }}
                    disabled={editorMode !== 'write'}
                    className={`p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1 bg-transparent text-current ${editorMode !== 'write' ? 'opacity-20 cursor-not-allowed' : ''}`}
                    title="Text Color"
                  >
                    <Palette className="w-4 h-4" />
                    <span className="text-[10px] font-bold">Color</span>
                  </button>
                  {showTextColorDropdown && (
                    <div className="absolute left-0 mt-2 w-32 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg z-35 overflow-hidden">
                      {[
                        { name: 'Black', value: '#000000' },
                        { name: 'Dark Gray', value: '#4b5563' },
                        { name: 'Red', value: '#dc2626' },
                        { name: 'Blue', value: '#2563eb' },
                        { name: 'Green', value: '#16a34a' }
                      ].map(color => (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => handleTextColorChange(color.value)}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-sans cursor-pointer transition-colors flex items-center gap-2"
                        >
                          <span 
                            className="w-3.5 h-3.5 rounded border border-neutral-300" 
                            style={{ backgroundColor: color.value }} 
                          />
                          <span>{color.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      if (editorMode === 'write') setShowHighlightDropdown(!showHighlightDropdown);
                    }}
                    disabled={editorMode !== 'write'}
                    className={`p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1 bg-transparent text-current ${editorMode !== 'write' ? 'opacity-20 cursor-not-allowed' : ''}`}
                    title="Text Highlight Color"
                  >
                    <Highlighter className="w-4 h-4" />
                    <span className="text-[10px] font-bold">Highlight</span>
                  </button>
                  {showHighlightDropdown && (
                    <div className="absolute left-0 mt-2 w-32 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg z-35 overflow-hidden">
                      {highlightColors.map(color => (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => handleHighlight(color.value)}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-sans cursor-pointer transition-colors flex items-center gap-2"
                        >
                          <span 
                            className="w-3.5 h-3.5 rounded border border-neutral-300" 
                            style={{ backgroundColor: color.value === 'transparent' ? 'white' : color.value }} 
                          />
                          <span>{color.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      if (editorMode === 'write') setShowFontFamilyDropdown(!showFontFamilyDropdown);
                    }}
                    disabled={editorMode !== 'write'}
                    className={`p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1 bg-transparent text-current ${editorMode !== 'write' ? 'opacity-20 cursor-not-allowed' : ''}`}
                    title="Change font family"
                  >
                    <Type className="w-4 h-4" />
                    <span className="text-[10px] font-bold">Font</span>
                  </button>
                  {showFontFamilyDropdown && (
                    <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-black border border-neutral-250 dark:border-neutral-800 rounded-xl shadow-lg z-35 max-h-60 overflow-y-auto">
                      {[
                        { name: 'Sans-Serif (Modern)', value: 'system-ui, -apple-system, sans-serif' },
                        { name: 'Serif (Classic)', value: 'Georgia, serif' },
                        { name: 'Garamond (Literary)', value: '"EB Garamond", Georgia, serif' },
                        { name: 'Editorial (Italic)', value: 'Editorial' },
                        { name: 'Monospace (Clean)', value: '"Roboto Mono", Courier New, monospace' }
                      ].map(font => (
                        <button
                          key={font.name}
                          type="button"
                          onClick={() => handleFontFamilyChange(font.value)}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-sans cursor-pointer transition-colors"
                          style={{ fontFamily: font.value === 'Editorial' ? 'Georgia, serif' : font.value, fontStyle: font.value === 'Editorial' ? 'italic' : 'normal' }}
                        >
                          {font.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      if (editorMode === 'write') setShowFontSizeDropdown(!showFontSizeDropdown);
                    }}
                    disabled={editorMode !== 'write'}
                    className={`p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1 bg-transparent text-current ${editorMode !== 'write' ? 'opacity-20 cursor-not-allowed' : ''}`}
                    title="Change text size"
                  >
                    <span className={`text-sm font-bold leading-none px-2 py-1 rounded border ${isDarkPaper ? 'bg-neutral-800 text-neutral-200 border-neutral-700' : 'bg-neutral-200 text-neutral-850 border-neutral-300'}`}>{editorFontSize}</span>
                  </button>
                  {showFontSizeDropdown && (
                    <div className="absolute left-0 mt-2 w-32 bg-white dark:bg-black border border-neutral-250 dark:border-neutral-800 rounded-xl shadow-lg z-35 max-h-60 overflow-y-auto">
                      {fontSizes.map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleFontSizeChange(size)}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-sans cursor-pointer transition-colors"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="h-4 w-[1px] bg-current/15 mx-1" />
                <button
                  type="button"
                  onClick={() => handleAlign('justifyLeft')}
                  disabled={editorMode !== 'write'}
                  className={`p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-all cursor-pointer flex items-center justify-center ${editorMode !== 'write' ? 'opacity-20 cursor-not-allowed' : ''}`}
                  title="Align Left"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleAlign('justifyCenter')}
                  disabled={editorMode !== 'write'}
                  className={`p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-all cursor-pointer flex items-center justify-center ${editorMode !== 'write' ? 'opacity-20 cursor-not-allowed' : ''}`}
                  title="Align Center"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleAlign('justifyRight')}
                  disabled={editorMode !== 'write'}
                  className={`p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-all cursor-pointer flex items-center justify-center ${editorMode !== 'write' ? 'opacity-20 cursor-not-allowed' : ''}`}
                  title="Align Right"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleAlign('justifyFull')}
                  disabled={editorMode !== 'write'}
                  className={`p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-all cursor-pointer flex items-center justify-center ${editorMode !== 'write' ? 'opacity-20 cursor-not-allowed' : ''}`}
                  title="Justify"
                >
                  <AlignJustify className="w-4 h-4" />
                </button>
                <div className="h-4 w-[1px] bg-current/15 mx-1" />
                <button
                  type="button"
                  onClick={() => {
                    if (editorMode === 'write') fileInputRef.current?.click();
                  }}
                  disabled={editorMode !== 'write'}
                  className={`p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1 bg-transparent text-current ${editorMode !== 'write' ? 'opacity-20 cursor-not-allowed' : ''}`}
                  title="Import document (.txt, .md)"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Import</span>
                </button>
                <div className="h-4 w-[1px] bg-current/15 mx-1" />
                <button
                  type="button"
                  onClick={() => setShowSearchInput(!showSearchInput)}
                  className={`p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1 border ${
                    showSearchInput 
                    ? activeStyleClass 
                    : 'bg-transparent text-current border-transparent'
                  }`}
                  title="Search & Replace words inside document"
                >
                  <Search className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Search</span>
                </button>
                <div className="h-4 w-[1px] bg-current/15 mx-1" />
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowZenDurationDropdown(!showZenDurationDropdown)}
                    className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1 border border-transparent"
                    title="Start distraction-free Zen Hourglass focus session"
                  >
                    <Hourglass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-[10px] font-bold">Zen Focus</span>
                  </button>
                  {showZenDurationDropdown && (
                    <div className="absolute left-0 mt-2 w-40 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg z-35 overflow-hidden">
                      <div className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-neutral-450 dark:text-neutral-500 border-b border-neutral-100 dark:border-neutral-800/80">Choose Duration</div>
                      {[5, 10, 15, 25, 50].map(mins => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => handleStartZen(mins)}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-sans cursor-pointer transition-colors"
                        >
                          {mins} Minutes
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className={`flex ${isDarkPaper ? 'bg-neutral-950/60 border-neutral-800' : 'bg-neutral-200/80 border-neutral-300'} border rounded-lg text-[10px] font-semibold uppercase leading-none p-0.5 gap-0.5 shadow-sm`}>
                <button
                  type="button"
                  onClick={() => setEditorMode('write')}
                  className={`px-3 py-1.5 cursor-pointer transition-all rounded-md ${
                    editorMode === 'write' 
                    ? activeStyleClass 
                    : 'bg-transparent text-neutral-500 hover:text-neutral-850 dark:text-neutral-400 dark:hover:text-neutral-200'
                  }`}
                >
                  Write Content
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('preview')}
                  className={`px-3 py-1.5 cursor-pointer transition-all rounded-md ${
                    editorMode === 'preview' 
                    ? activeStyleClass 
                    : 'bg-transparent text-neutral-500 hover:text-neutral-850 dark:text-neutral-400 dark:hover:text-neutral-200'
                  }`}
                >
                  Preview Markup
                </button>
              </div>
            </div>
            <AnimatePresence>
              {showSearchInput && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mb-4 overflow-hidden"
                >
                  <div className={`flex flex-col gap-2.5 ${searchPanelBgClass} border ${borderColorClass} rounded-2xl p-4 shadow-sm ${textColorClass}`}>
                    <div className="flex flex-col sm:flex-row gap-3 items-center w-full">
                      <div className={`flex ${searchInputBgClass} border ${borderColorClass} rounded-xl px-3 py-1.5 items-center gap-2 w-full sm:w-1/2`}>
                        <Search className="w-4 h-4 text-neutral-400" />
                        <input
                          className={`bg-transparent border-none outline-none focus:outline-none text-xs font-sans w-full ${textColorClass}`}
                          placeholder="Find word in document..."
                          type="text"
                          value={docSearchQuery}
                          onChange={(e) => setDocSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSearchNext();
                            }
                          }}
                        />
                      </div>
                      <div className={`flex ${searchInputBgClass} border ${borderColorClass} rounded-xl px-3 py-1.5 items-center gap-2 w-full sm:w-1/2`}>
                        <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <input
                          className={`bg-transparent border-none outline-none focus:outline-none text-xs font-sans w-full ${textColorClass}`}
                          placeholder="Replace with..."
                          type="text"
                          value={replaceQuery}
                          onChange={(e) => setReplaceQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleReplace();
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-800/80">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSearchPrev}
                          className="px-3 py-1.5 text-xs bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-black dark:text-white rounded-lg font-bold cursor-pointer transition-colors"
                        >
                          Find Prev
                        </button>
                        <button
                          type="button"
                          onClick={handleSearchNext}
                          className="px-3 py-1.5 text-xs bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-900 dark:hover:bg-neutral-100 rounded-lg font-bold cursor-pointer transition-colors"
                        >
                          Find Next
                        </button>
                        <div className="h-5 w-[1px] bg-neutral-300 dark:bg-neutral-700 mx-1" />
                        <button
                          type="button"
                          onClick={handleReplace}
                          className="px-3 py-1.5 text-xs bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-black dark:text-white rounded-lg font-bold cursor-pointer transition-colors"
                        >
                          Replace
                        </button>
                        <button
                          type="button"
                          onClick={handleReplaceAll}
                          className="px-3 py-1.5 text-xs bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-900 dark:hover:bg-neutral-100 rounded-lg font-bold cursor-pointer transition-colors"
                        >
                          Replace All
                        </button>
                      </div>
                      {docSearchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setDocSearchQuery('');
                            setReplaceQuery('');
                          }}
                          className="text-xs text-neutral-500 hover:text-black dark:hover:text-white font-bold cursor-pointer"
                        >
                          Clear Fields
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
              </>
            )}
            <div className="flex-grow flex flex-col pt-1 min-h-[350px]">
              {editorMode === 'write' ? (
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={handleInput}
                  onKeyUp={checkSelectionStyles}
                  onMouseUp={checkSelectionStyles}
                  onFocus={checkSelectionStyles}
                  onPaste={handlePaste}
                  className={`w-full flex-grow bg-transparent border-none focus:outline-none text-base leading-relaxed resize-none h-full placeholder:opacity-30 min-h-[350px] focus:ring-0 select-text overflow-y-auto whitespace-pre-wrap ${getEditorFontClass()} ${textColorClass}`}
                  style={{ minHeight: '350px', fontSize: editorFontSize, fontFamily: editorFontFamily }}
                  data-placeholder="Transcribe intellectual concepts here..."
                />
              ) : (
                <div className={`w-full flex-grow text-base leading-relaxed min-h-[350px] ${getEditorFontClass()} select-text overflow-y-auto whitespace-pre-wrap ${textColorClass}`}>
                  {getRenderedPreview()}
                </div>
              )}
            </div>
          </div>
        </div>
        {!isZenMode && (
          <div className="bg-neutral-50 dark:bg-neutral-955 border-t border-neutral-200 dark:border-neutral-805 p-4 flex flex-col md:flex-row md:items-center justify-between flex-shrink-0 text-neutral-800 dark:text-neutral-200 rounded-b-3xl gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              <span>Words: {getWordCount()}</span>
              <span className="w-1.5 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
              <span>Characters: {getCharCount()}</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-between w-full md:w-auto">
              <div className="flex gap-2">
                {note && onDelete && (
                  <button
                    onClick={() => {
                      if (confirm('Are you absolutely sure you want to delete this archive?')) {
                        onDelete(note.id);
                      }
                    }}
                    className="px-4 py-2 text-red-655 hover:bg-red-50 dark:hover:bg-red-955/20 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors rounded-xl"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                )}
                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors rounded-xl border border-neutral-200 dark:border-neutral-800"
                  title="Print document and export as PDF"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Export PDF</span>
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-sans text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors rounded-xl text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-900 dark:hover:bg-neutral-100 border border-neutral-300 dark:border-neutral-700 font-sans text-xs font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-all rounded-xl shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

