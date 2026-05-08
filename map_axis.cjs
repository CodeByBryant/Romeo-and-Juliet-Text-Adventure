const fs = require('fs');

let story = fs.readFileSync('src/data/story.ts', 'utf8');

const mappings = {
  "star_crossed": { fate: -60, luck: -20 },
  "bitter_survival": { fate: 40, luck: -60 },
  "stars_defied": { fate: 80, luck: 80 },
  "princes_mercy": { fate: 50, luck: 20 },
  "blood_on_altar": { fate: -80, luck: -80 },
  "friars_folly": { fate: 10, luck: 50 },
  "romeos_sacrifice": { fate: 30, luck: -30 },
  "juliets_ruin": { fate: -30, luck: 40 },
  "endless_war": { fate: -90, luck: -10 },
  "faded_embers": { fate: 60, luck: -10 }
};

for (const [id, points] of Object.entries(mappings)) {
    const rx = new RegExp('id: "' + id + '" as any,[\\\\s\\\\S]*?axisPoint: \\{ fate: 0, luck: 0 \\}');
    story = story.replace(rx, (match) => {
        return match.replace("axisPoint: { fate: 0, luck: 0 }", "axisPoint: { fate: " + points.fate + ", luck: " + points.luck + " }");
    });
}

// Just match exact values instead of using regex if needed.
for (const [id, points] of Object.entries(mappings)) {
    let strMatch = `    id: "${id}" as any,
    title:`;
    let strIdx = story.indexOf(strMatch);
    if(strIdx !== -1) {
        let axisIdx = story.indexOf("axisPoint: { fate: 0, luck: 0 }", strIdx);
        if(axisIdx !== -1 && axisIdx < strIdx + 300) {
            story = story.substring(0, axisIdx) + `axisPoint: { fate: ${points.fate}, luck: ${points.luck} }` + story.substring(axisIdx + 31);
        }
    }
}

fs.writeFileSync('src/data/story.ts', story);
console.log("Mapped endings");
