# NoteX — The Digital Notebook

**NoteX** is a modern personal notebook application built with React, TypeScript, and Vite. It provides an elegant, distraction-free writing workspace with local note storage, themed stationery, searchable archives, and a responsive interface.

## Features

- Library, Drafts, and Archive views
- Rich note creation and editing experience
- Search across titles, categories, and tags
- Theme toggle with light and dark modes
- Local browser persistence per user
- Custom stationery and profile settings
- Responsive layout for desktop and mobile

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS (via @tailwindcss/vite)
- lucide-react icons
- motion/react animations

## Getting Started

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open the app at `http://localhost:3000`.

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Vercel Deployment

This project is configured for Vercel deployment. The production build output is generated into the `dist` folder.

### Deploy with Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

If you prefer the Vercel dashboard:

1. Log in to Vercel at https://vercel.com
2. Import the repository: `https://github.com/adrshhgupta/NoteX---The-Digital-NoteBook`
3. Set the framework preset to `Vite` if prompted
4. Use `npm run build` as the build command
5. Use `dist` as the output directory

## Project Structure

- `src/` — application source files
- `src/components/` — UI components
- `src/data.ts` — initial note and profile data
- `src/types.ts` — TypeScript interfaces and types
- `package.json` — scripts and dependencies
- `vite.config.ts` — Vite configuration

## Notes

This app stores notes locally in the browser using `localStorage`. Each user session is isolated by email, and changes persist across reloads.

## Repository

https://github.com/adrshhgupta/NoteX---The-Digital-NoteBook
