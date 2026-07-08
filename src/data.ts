import { NoteItem, AuthorProfile, StationeryConfig } from './types';
export const INITIAL_AUTHOR_PROFILE: AuthorProfile = {
  name: 'Julian Thorne',
  email: 'julian@midnight.ate',
  bio: 'Curating moments of digital stillness through the art of long-form notation.',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmWWT5eA9rHNXZgidRNbtwsnMG8OIC40Pdcr-7eMi_uJbXGOEVNHYfns5pwI3CmcXesntuJF8P_rbm9QOIMvqG00rMIETz4J8wYfG6JxOmCwrh-BodrbHzkeGoJ1nqmkcatlpzL54hZF2ZP8YEaKaRtyHcyJIBkVq1s87cg48KWfMKd5UH874stCkiz7y00RIi7-TfaByuO1ADN7o7fIq3iTIVZf82H8-1OHcpGzNO8CwICYVhNo98Ypugcg1kXXl-t4H9eXyUWkM'
};
export const DEFAULT_STATIONERY_CONFIG: StationeryConfig = {
  typeface: 'Sans-Serif',
  paperGrain: 'linen'
};
export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Defining the Modernist Aesthetic: An Archive of Intent',
    type: 'Manuscript',
    category: 'Theoretical',
    content: 'This collection explores the intersection of brutalist architecture and digital interfaces. The core thesis revolves around the removal of non-essential elements to reveal the structural truth of the medium. We strip the padding, eliminate the shadows, and let the hairline borders define the visual vocabulary of our spatial thought.',
    updatedAt: 'Oct 12, 2023',
    lastEditedTimestamp: Date.now() - 30 * 24 * 60 * 60 * 1000,
    tags: ['Modernism', 'Architecture', 'Brutalism', 'Archive']
  },
  {
    id: 'note-2',
    title: 'Morning Observations on Form',
    type: 'Draft',
    category: 'Journaling',
    content: 'Structure is the skeleton of thought. Without the frame, the ink has no purpose. As I sit at the work desk, the sharp angles of the stationery remind me that digital tools should not mimic paper\'s softness, but inherit its rigid boundaries. A clean grid, a monochrome page, and a pure play of black and off-white shapes is enough to carry the weight of human curation.',
    updatedAt: '2 days ago',
    lastEditedTimestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    tags: ['Form', 'Journaling', 'Midnight']
  },
  {
    id: 'note-3',
    title: 'Bibliographic Reference: Bauhaus Roots',
    type: 'Archive',
    category: 'Research',
    content: 'Compiled list of essential reading for the 2024 editorial cycle on minimalism:\n\n1. "The Minimalist Mind" - G. Thorne\n2. "Less and More: The Design Ethos of Dieter Rams" - K. Klemp\n3. "Brutalist Space, Digital Interface" - S. Kobayashi\n\nThese references form the baseline of the current Note X aesthetic.',
    updatedAt: '1 week ago',
    lastEditedTimestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
    tags: ['Research', 'Bauhaus', 'Minimalism', 'Archive']
  },
  {
    id: 'note-4',
    title: 'Atelier Spatial Layouts',
    type: 'Draft',
    category: 'Curation',
    content: 'Planning the furniture configuration of the new Midnight Atelier office. High-contrast surfaces, metal shelving, and a singular spotlight directed at the main reading lectern. Distraction-free zones are not a luxury, but a required piece of physical infrastructure for deep intellectual thought.',
    updatedAt: '3 weeks ago',
    lastEditedTimestamp: Date.now() - 21 * 24 * 60 * 60 * 1000,
    tags: ['Atelier', 'Space', 'Interior']
  },
  {
    id: 'note-5',
    title: 'The Ink of Midnight',
    type: 'Manuscript',
    category: 'Theory',
    content: 'Why does Node X default to high-contrast monochrome? Because color is a sensory distraction when capturing abstract principles. Deep ink blue and obsidian black are colors of precision, whereas paper is the canvas that receives them without adding unnecessary commentary.',
    updatedAt: 'Oct 1, 2023',
    lastEditedTimestamp: Date.now() - 41 * 24 * 60 * 60 * 1000,
    tags: ['Theory', 'Aesthetic']
  },
  {
    id: 'note-6',
    title: 'Digital Stationery Philosophy',
    type: 'Archive',
    category: 'Curation',
    content: 'Reflections on Note X v4. Writing on screens should feel deliberate. Haptic key feedback, monospace fonts, and a canvas that doesn\'t scroll indefinitely like social feeds, but acts as a series of finite broadsheet columns. Let the layout command attention.',
    updatedAt: '2 months ago',
    lastEditedTimestamp: Date.now() - 60 * 24 * 60 * 60 * 1000,
    tags: ['Philosophy', 'Stationery']
  }
];

