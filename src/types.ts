export type AppTab = 'signin' | 'library' | 'drafts' | 'archive' | 'settings';
export interface AuthorProfile {
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
}
export type StationeryTypeface = 'Sans-Serif' | 'Serif' | 'Monospace' | 'Garamond' | 'Editorial';
export type StationeryPaperGrain = 'linen' | 'vellum' | 'parchment' | 'midnight' | 'blueprint' | 'manuscript' | 'obsidian';
export interface StationeryConfig {
  typeface: StationeryTypeface;
  paperGrain: StationeryPaperGrain;
}
export type NoteType = 'Manuscript' | 'Draft' | 'Archive';
export interface NoteItem {
  id: string;
  title: string;
  type: NoteType;
  category: string;
  content: string;
  updatedAt: string;
  lastEditedTimestamp: number; // millisecond timestamp for sorting
  tags: string[];
}
export interface UserAccount {
  email: string;
  passwordHash: string;
  name: string;
  bio: string;
  avatarUrl: string;
}

