# Verona: Fate and Fortune

Interactive Romeo and Juliet text adventure for a creative class project.

The game now plays like an old-school terminal story: dark blue screen, numbered commands, Enter-to-choose interaction, and a typewriter-style text feed.

## Project Snapshot

- 25 scene nodes across Acts I-V
- 50 choices woven through the story
- 4 endings (A-D) driven by fate and luck
- Shakespeare quote + citation shown in every scene
- Built with React, TypeScript, SCSS, and Vite

## Tech Stack

- React 19
- TypeScript 6
- Vite 8
- SCSS (sass)
- ESLint

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Scripts

```bash
npm run dev             # start local dev server
npm run lint            # lint TS/TSX files
npm run validate:story  # graph + route + ending validation
npm run build           # production build
npm run check           # lint + validation + build
```

## Architecture

- `src/data/story.ts`
  - Story graph source of truth
  - Quote/citation data
  - Ending definitions and fate/luck ranges
- `src/hooks/useStoryEngine.ts`
  - Runtime game state
  - Choice execution, luck rolls, inventory updates
  - Ending resolution
- `src/lib/engine.ts`
  - Luck evaluator, stat clamping, ending resolver
- `scripts/validate-story.ts`
  - Structural checks (unique IDs, reachable graph, valid edges)
  - Monte Carlo sampling of ending distribution

## Luck + Fate Model

- Fate mostly reflects your decisions.
- Luck is rolled each turn (1-10), adjusted by choice bias.
- Critical luck can nudge fate at key moments.
- Final ending is resolved by both coordinates:
  - X-axis: Fate score
  - Y-axis: Luck score

## Suggested Screenshot Set (for submission)

1. Scene node data in `src/data/story.ts`
2. Engine logic in `src/hooks/useStoryEngine.ts`
3. Running game UI with choices visible
4. Ending graph component with current player point
5. Final ending screen (one tragic + one high outcome)
6. Validation output from `npm run validate:story`

## Deploy (Vercel)

1. Push this repository to GitHub.
2. Import the repo into Vercel.
3. Use default Vite settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy.

## Notes

- Text is original project writing, with public-domain Shakespeare quotes from Romeo and Juliet.
- The node architecture is modular, so adding more scenes is data-driven and does not require engine rewrites.
