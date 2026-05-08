const fs = require('fs');
let story = fs.readFileSync('src/data/story.ts', 'utf8');

story = story.replace(/const IMPULSE_LABELS = \[[\s\S]*?\];\nconst RESTRAINT_LABELS = \[[\s\S]*?\];\nconst OMEN_LABELS = \[[\s\S]*?\];\n/, '');

story = story.replace(/Omit<SceneChoice, 'nextId' \| 'id' \| 'tone'>/g, "Partial<SceneChoice>");

story = story.replace("import {", "import { ChoiceTone,");

fs.writeFileSync('src/data/story.ts', story);
