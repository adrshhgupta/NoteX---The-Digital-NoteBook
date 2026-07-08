import React from 'react';
import { AuthorProfile, StationeryConfig, StationeryTypeface, StationeryPaperGrain } from '../types';
import { Globe, ShieldCheck, Check } from 'lucide-react';
import { motion } from 'motion/react';
interface SettingsViewProps {
  profile: AuthorProfile;
  onProfileChange: (newProfile: AuthorProfile) => void;
  config: StationeryConfig;
  onConfigChange: (newConfig: StationeryConfig) => void;
}
export default function SettingsView({
  profile,
  onProfileChange,
  config,
  onConfigChange
}: SettingsViewProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        onProfileChange({
          ...profile,
          avatarUrl: base64
        });
      }
    };
    reader.readAsDataURL(file);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onProfileChange({
      ...profile,
      [name]: value
    });
  };
  const typefaces: { id: StationeryTypeface; name: string; style: string }[] = [
    { id: 'Sans-Serif', name: 'Sans-Serif (Modern)', style: 'font-sans' },
    { id: 'Serif', name: 'Serif (Classic)', style: 'font-serif' },
    { id: 'Garamond', name: 'Garamond (Literary)', style: 'font-garamond' },
    { id: 'Editorial', name: 'Editorial (Italic)', style: 'font-serif italic' },
    { id: 'Monospace', name: 'Monospace (Clean)', style: 'font-mono' }
  ];
  const grains: { id: StationeryPaperGrain; name: string; bgClass: string }[] = [
    { id: 'linen', name: 'LINEN STOCK', bgClass: 'grain-linen' },
    { id: 'vellum', name: 'VELLUM', bgClass: 'grain-vellum' },
    { id: 'parchment', name: 'PARCHMENT', bgClass: 'grain-parchment' },
    { id: 'blueprint', name: 'BLUEPRINT', bgClass: 'grain-blueprint' },
    { id: 'manuscript', name: 'MANUSCRIPT', bgClass: 'grain-manuscript' },
    { id: 'obsidian', name: 'OBSIDIAN', bgClass: 'grain-obsidian' },
    { id: 'midnight', name: 'MIDNIGHT', bgClass: 'grain-midnight' }
  ];
  const getPreviewTypefaceClass = () => {
    if (config.typeface === 'Serif') return 'font-serif';
    if (config.typeface === 'Garamond') return 'font-garamond';
    if (config.typeface === 'Editorial') return 'font-serif italic';
    if (config.typeface === 'Monospace') return 'font-mono text-sm';
    return 'font-sans';
  };
  return (
    <div className="max-w-[1140px] mx-auto py-6 select-none font-sans text-black dark:text-white">
      <section className="mb-10 animate-fade-in">
        <h1 className="font-sans text-4xl md:text-5xl text-black dark:text-white font-black tracking-tight mb-3">
          Atelier Workspace
        </h1>
        <p className="font-sans text-base text-neutral-500 dark:text-neutral-450">
          Manage writer biography details, membership configurations, and digital typography defaults.
        </p>
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 animate-fade-in">
        <section className="lg:col-span-8 bg-white dark:bg-black rounded-3xl border border-neutral-250 dark:border-neutral-800 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div 
              onClick={handleAvatarClick}
              className="relative group w-32 h-32 rounded-2xl border border-neutral-250 dark:border-neutral-800 flex-shrink-0 overflow-hidden shadow-sm bg-neutral-50 cursor-pointer animate-fade-in"
              title="Click to change profile picture"
            >
              <img
                alt="Author Portrait"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                src={profile.avatarUrl}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl flex items-center justify-center">
                <span className="text-white text-xs font-bold uppercase tracking-widest bg-black/60 px-2.5 py-1 rounded-lg">Upload</span>
              </div>
              <div className="absolute right-2 bottom-2 bg-white dark:bg-black text-black dark:text-white p-1.5 rounded-lg shadow-sm group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors cursor-pointer border border-neutral-200 dark:border-neutral-800">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleAvatarChange} 
              className="hidden" 
            />
            <div className="flex-grow w-full space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">
                    Author Name
                  </label>
                  <input
                    className="w-full bg-white dark:bg-black border border-neutral-250 dark:border-neutral-800 px-4 py-2.5 text-lg font-bold focus:outline-none rounded-lg focus:border-black dark:focus:border-white transition-colors"
                    name="name"
                    type="text"
                    value={profile.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">
                    Email Address
                  </label>
                  <input
                    className="w-full bg-white dark:bg-black border border-neutral-250 dark:border-neutral-800 px-4 py-2.5 text-base font-mono focus:outline-none rounded-lg focus:border-black dark:focus:border-white transition-colors text-neutral-800 dark:text-neutral-200"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">
                  Profile Photo URL
                </label>
                <input
                  className="w-full bg-white dark:bg-black border border-neutral-250 dark:border-neutral-800 px-4 py-2 text-base focus:outline-none rounded-lg focus:border-black dark:focus:border-white transition-colors text-neutral-800 dark:text-neutral-200"
                  name="avatarUrl"
                  type="text"
                  placeholder="https://example.com/avatar.jpg"
                  value={profile.avatarUrl}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">
                  Professional Bio
                </label>
                <textarea
                  className="w-full bg-white dark:bg-black border border-neutral-250 dark:border-neutral-800 px-4 py-3 text-base focus:outline-none rounded-lg min-h-[70px] resize-none focus:border-black dark:focus:border-white transition-colors"
                  name="bio"
                  rows={2}
                  value={profile.bio}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="lg:col-span-4 bg-black dark:bg-black border border-neutral-800 text-white p-8 flex flex-col justify-between rounded-3xl relative order-first lg:order-last min-h-[240px] shadow-sm">
          <div>
            <div className="flex justify-between items-start mb-6">
              <p className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800">
                <ShieldCheck className="w-5 h-5 text-white" />
              </p>
              <span className="bg-neutral-900 text-xs px-3 py-1.5 uppercase tracking-widest font-bold text-neutral-250 rounded-full border border-neutral-800">
                Active
              </span>
            </div>
            <h3 className="font-sans text-2xl font-black text-white mb-2">
              Archival Pro
            </h3>
            <p className="font-sans text-sm text-neutral-400 leading-relaxed font-normal mb-8">
              Unlimited leather-bound journals and cloud ink synchronization.
            </p>
          </div>
          <button className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer border border-neutral-800">
            Manage Billing
          </button>
        </section>
      </div>
      <section className="bg-white dark:bg-black rounded-3xl border border-neutral-250 dark:border-neutral-800 shadow-sm p-6 md:p-8">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="p-2 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-250 dark:border-neutral-800">
            <Globe className="w-5 h-5 text-black dark:text-white" />
          </div>
          <h2 className="font-sans text-xl md:text-2xl font-black text-black dark:text-white">
            Stationery Customization
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-450 dark:text-neutral-500 mb-4">
              Primary Typeface
            </h4>
            <div className="flex flex-col gap-3">
              {typefaces.map(item => {
                const isSelected = config.typeface === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onConfigChange({ ...config, typeface: item.id })}
                    className={`w-full text-left p-4 rounded-xl cursor-pointer flex items-center justify-between transition-colors border ${
                      isSelected ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white font-bold' : 'bg-white dark:bg-black text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 border-neutral-250 dark:border-neutral-800'
                    }`}
                  >
                    <span className={`text-base font-bold ${item.style}`}>
                      {item.name}
                    </span>
                    <span className="flex-shrink-0">
                      {isSelected ? (
                        <Check className="w-5 h-5 text-white dark:text-black stroke-[2.5]" />
                      ) : (
                        <span className="w-4.5 h-4.5 border-2 border-neutral-300 dark:border-neutral-700 rounded-full block" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-450 dark:text-neutral-500 mb-4">
              Paper Grain
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {grains.map(grain => {
                const isSelected = config.paperGrain === grain.id;
                return (
                  <button
                    key={grain.id}
                    onClick={() => onConfigChange({ ...config, paperGrain: grain.id })}
                    className={`h-28 rounded-2xl relative flex flex-col justify-end p-2.5 cursor-pointer select-none group overflow-hidden border ${grain.bgClass} transition-all ${
                      isSelected ? 'border-black dark:border-white ring-2 ring-black dark:ring-white shadow-sm' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-black dark:bg-white text-white dark:text-black p-1 rounded-lg border border-neutral-350 dark:border-neutral-650 shadow-sm">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                    )}
                    <span className="text-xs font-bold py-1.5 px-2.5 uppercase leading-none tracking-tight rounded-lg inline-block text-left w-full truncate bg-white/95 dark:bg-black/95 text-black dark:text-white border border-neutral-250 dark:border-neutral-800">
                      {grain.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="md:col-span-4 flex flex-col justify-between">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-450 dark:text-neutral-500 mb-4">
              Aesthetic Rendering
            </h4>
            <div 
              className={`flex-grow border-2 border-dashed border-neutral-350 dark:border-neutral-750 rounded-2xl p-6 flex flex-col justify-center items-center min-h-[160px] relative ${
                config.paperGrain === 'linen' ? 'grain-linen text-black' : (
                  config.paperGrain === 'vellum' ? 'grain-vellum text-black' : (
                    config.paperGrain === 'parchment' ? 'grain-parchment text-black' : (
                      config.paperGrain === 'blueprint' ? 'grain-blueprint text-white' : (
                        config.paperGrain === 'manuscript' ? 'grain-manuscript text-black' : (
                          config.paperGrain === 'obsidian' ? 'grain-obsidian text-white' : 'grain-midnight text-white'
                        )
                      )
                    )
                  )
                )
              }`}
            >
              <div className="w-full max-w-[160px] space-y-3.5 mb-2 relative">
                <div className={`h-[1px] w-full ${(config.paperGrain === 'midnight' || config.paperGrain === 'blueprint' || config.paperGrain === 'obsidian') ? 'bg-white/10' : 'bg-black/10'}`}></div>
                <div className={`h-[1px] w-full ${(config.paperGrain === 'midnight' || config.paperGrain === 'blueprint' || config.paperGrain === 'obsidian') ? 'bg-white/10' : 'bg-black/10'}`}></div>
                <div className={`h-[1px] w-5/6 ${(config.paperGrain === 'midnight' || config.paperGrain === 'blueprint' || config.paperGrain === 'obsidian') ? 'bg-white/10' : 'bg-black/10'}`}></div>
              </div>
              <p className={`text-center font-bold tracking-tight text-lg mt-4 ${getPreviewTypefaceClass()}`}>
                Live Preview
              </p>
              <p className="text-xs font-mono tracking-widest uppercase opacity-50 mt-2">
                {config.typeface} • {config.paperGrain} stock
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

