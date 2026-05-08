const fs = require('fs');

let story = fs.readFileSync('src/data/story.ts', 'utf8');

// We want to remove makeDefaultChoices and patchSceneChoices, and instead provide unique choices in the nodes themselves.
// We can define a hardcoded array of unique choices for each of the 25 nodes, or modify the AST.
// To keep it simple, let's write a JS script that injects custom choices directly into the `generateStoryNodes` function based on sceneId.

const replacement = `
function getCustomChoices(sceneId: SceneId, act: ActNumber, beatIndex: number): SceneChoice[] {
  const choicesMap: Record<string, Omit<SceneChoice, 'nextId' | 'id' | 'tone'>[]> = {
    // Act 1
    "a1_00": [
      { label: "Draw your sword and join the fray.", note: "Blood calls to blood.", fateShift: 2, luckBias: -2 },
      { label: "Turn away and seek quiet streets.", note: "Avoid the conflict for now.", fateShift: -1, luckBias: 1 },
      { label: "Stand and watch the chaotic dance.", note: "Observe the hatred.", fateShift: 0, luckBias: 0 }
    ],
    "a1_01": [
      { label: "Take the guest list and read it.", note: "Curiosity is a dangerous thing.", fateShift: 2, luckBias: -1 },
      { label: "Refuse the servant and walk away.", note: "Stay out of Capulet affairs.", fateShift: -1, luckBias: 1 },
      { label: "Ask Benvolio what he thinks.", note: "Lean on your cousin's advice.", fateShift: 0, luckBias: 0 }
    ],
    "a1_02": [
      { label: "Strut into the hall with false bravado.", note: "Confidence masks your name.", fateShift: 1, luckBias: -1 },
      { label: "Keep to the shadows of the pillars.", note: "Observe without being seen.", fateShift: -1, luckBias: 2, addItems: ["capulet-mask"] },
      { label: "Seek out the wine and mingle.", note: "Blend in with the crowd.", fateShift: 0, luckBias: 0 }
    ],
    "a1_03": [
      { label: "Approach her without hesitation.", note: "The magnetic pull is too strong.", fateShift: 2, luckBias: -2 },
      { label: "Wait for her to notice you.", note: "Patience might reward you.", fateShift: 0, luckBias: 1 },
      { label: "Ask a servant who she is first.", note: "Information is protective.", fateShift: -1, luckBias: 0 }
    ],
    "a1_04": [
      { label: "Flee into the night immediately.", note: "Escape before Tybalt finds you.", fateShift: -1, luckBias: 1 },
      { label: "Linger to catch one last glance.", note: "Dangerous obsession begins.", fateShift: 2, luckBias: -1 },
      { label: "Drop your mask by her feet.", note: "Leave a trace of yourself.", fateShift: 1, luckBias: 0 }
    ],
    // Act 2
    "a2_00": [
      { label: "Call up to her boldly.", note: "Let your voice break the silence.", fateShift: 2, luckBias: -2 },
      { label: "Listen to her private thoughts.", note: "Eavesdrop on her soul.", fateShift: -1, luckBias: 1 },
      { label: "Climb the lattice towards the balcony.", note: "Physical risk for proximity.", fateShift: 1, luckBias: -1 }
    ],
    "a2_01": [
      { label: "Pledge yourself to her totally.", note: "Vows bind you.", fateShift: 2, luckBias: -1 },
      { label: "Offer a cautious promise.", note: "Hold a piece of yourself back.", fateShift: -1, luckBias: 1 },
      { label: "Let her lead the declarations.", note: "Follow her heart's pace.", fateShift: 0, luckBias: 0 }
    ],
    "a2_02": [
      { label: "Agree to her sudden plan.", note: "Commitment at breakneck speed.", fateShift: 2, luckBias: 0 },
      { label: "Ask if she is truly certain.", note: "Test the swiftness of love.", fateShift: -1, luckBias: 1 },
      { label: "Promise to send word by nine.", note: "Set the logistics in motion.", fateShift: 1, luckBias: -1 }
    ],
    "a2_03": [
      { label: "Beg the Friar to act today.", note: "Urgency drives you.", fateShift: 2, luckBias: -2 },
      { label: "Ask for his measured guidance.", note: "Seek wisdom.", fateShift: -1, luckBias: 1 },
      { label: "Argue that this will end the feud.", note: "Appeal to his politics.", fateShift: 0, luckBias: 0 }
    ],
    "a2_04": [
      { label: "Speak the vows loud and clear.", note: "No hesitation at the altar.", fateShift: 2, luckBias: 0, addItems: ["silver-ring"] },
      { label: "Whisper them in quiet reverence.", note: "A secret held tight.", fateShift: -1, luckBias: 1, addItems: ["silver-ring"] },
      { label: "Look only at her, ignoring the Friar.", note: "Lost in the moment.", fateShift: 1, luckBias: -1, addItems: ["silver-ring"] }
    ],
    // Act 3
    "a3_00": [
      { label: "Stand between Tybalt and Mercutio.", note: "Try to enforce peace.", fateShift: 1, luckBias: 1 },
      { label: "Plead with Tybalt to walk away.", note: "Beg your new cousin.", fateShift: -1, luckBias: 0 },
      { label: "Draw your weapon defensively.", note: "Prepare for the worst.", fateShift: 2, luckBias: -2 }
    ],
    "a3_01": [
      { label: "Hold the dying Mercutio.", note: "Witness his final curse.", fateShift: 1, luckBias: -1 },
      { label: "Turn your face to the heavens.", note: "Scream at the injustice.", fateShift: 0, luckBias: 0 },
      { label: "Grab your sword from the dirt.", note: "Let rage take the wheel.", fateShift: 2, luckBias: -2 }
    ],
    "a3_02": [
      { label: "Strike Tybalt with lethal intent.", note: "Vengeance is absolute.", fateShift: 2, luckBias: -2, addItems: ["duel-scar"] },
      { label: "Fight recklessly, blindingly.", note: "Chaos guides your blade.", fateShift: 1, luckBias: -1, addItems: ["duel-scar"] },
      { label: "Disarm him, but the strike goes too deep.", note: "An accidental tragedy.", fateShift: 0, luckBias: 0, addItems: ["duel-scar"] }
    ],
    "a3_03": [
      { label: "Collapse to the floor in tears.", note: "Give in to the despair.", fateShift: 0, luckBias: -1 },
      { label: "Threaten to use your dagger on yourself.", note: "Desperation turns inward.", fateShift: 2, luckBias: -2 },
      { label: "Listen to the Friar's harsh lecture.", note: "Seek a shred of hope.", fateShift: -1, luckBias: 1 }
    ],
    "a3_04": [
      { label: "Ride hard for Mantua without looking back.", note: "Flee the city gates.", fateShift: -1, luckBias: 0 },
      { label: "Pause at the border to curse Verona.", note: "Leave your hatred behind.", fateShift: 1, luckBias: -1 },
      { label: "Slip away in total silence.", note: "A ghost entering exile.", fateShift: 0, luckBias: 1 }
    ],
    // Act 4
    "a4_00": [
      { label: "Pace the floor endlessly.", note: "Anxiety eats at you.", fateShift: 1, luckBias: -1 },
      { label: "Try to sleep and find her in dreams.", note: "Seek solace in the unreal.", fateShift: 0, luckBias: 0 },
      { label: "Write a letter you cannot send.", note: "Pour your heart onto parchment.", fateShift: -1, luckBias: 1 }
    ],
    "a4_01": [
      { label: "Demand Balthasar tell you more.", note: "Refuse the simple truth.", fateShift: -1, luckBias: 0 },
      { label: "Fall silent, stunned beyond words.", note: "The shock paralyzes you.", fateShift: 0, luckBias: -1 },
      { label: "Curse the stars and roar.", note: "Your rage returns.", fateShift: 2, luckBias: -2 }
    ],
    "a4_02": [
      { label: "Saddle the fastest horse.", note: "Speed is your only friend.", fateShift: 2, luckBias: -1 },
      { label: "Pack lightly, ignoring Balthasar's pleas.", note: "Leave reason behind.", fateShift: 1, luckBias: -2 },
      { label: "Stare blankly at the wall before moving.", note: "A moment of terrifying clarity.", fateShift: 0, luckBias: 0 }
    ],
    "a4_03": [
      { label: "Offer the starving man twice his asking price.", note: "Buy death swiftly.", fateShift: 2, luckBias: -2, addItems: ["sleeping-vial"] },
      { label: "Demand the strongest draft he has.", note: "Ensure no waking.", fateShift: 1, luckBias: -1, addItems: ["sleeping-vial"] },
      { label: "Take the vial with a grim nod.", note: "The transaction is complete.", fateShift: -1, luckBias: 0, addItems: ["sleeping-vial"] }
    ],
    "a4_04": [
      { label: "Whip the horse faster.", note: "Push to the breaking point.", fateShift: 2, luckBias: -1 },
      { label: "Ride in cold, dead silence.", note: "A specter on the road.", fateShift: 0, luckBias: 0 },
      { label: "Keep your hand wrapped around the poison.", note: "Hold your only comfort.", fateShift: -1, luckBias: 1 }
    ],
    // Act 5
    "a5_00": [
      { label: "Ignite your torch and march into the graveyard.", note: "Announce your presence.", fateShift: 2, luckBias: -2 },
      { label: "Creep to the iron gates in darkness.", note: "Avoid the watch.", fateShift: -1, luckBias: 1 },
      { label: "Prepare the crowbar and ignore Paris.", note: "Focus entirely on the stone.", fateShift: 1, luckBias: -1 }
    ],
    "a5_01": [
      { label: "Lash out at Paris wildly.", note: "Clear the obstacle.", fateShift: 2, luckBias: -2, addItems: ["duel-scar"] },
      { label: "Warn him to flee for his life.", note: "Offer one chance at mercy.", fateShift: -1, luckBias: 1 },
      { label: "Engage him in a brief, grim duel.", note: "A necessary evil.", fateShift: 1, luckBias: -1 }
    ],
    "a5_02": [
      { label: "Fall to your knees beside her bier.", note: "The weight breaks you.", fateShift: 0, luckBias: 0 },
      { label: "Kiss her cold cheek tenderly.", note: "A final embrace.", fateShift: 1, luckBias: -1 },
      { label: "Whisper your apologies to her unhearing ears.", note: "Confess your failure.", fateShift: -1, luckBias: 1 }
    ],
    "a5_03": [
      { label: "Uncork the vial with trembling fingers.", note: "Prepare to drink.", fateShift: 2, luckBias: -2 },
      { label: "Stare at the poison, lost in thought.", note: "A final hesitation.", fateShift: -1, luckBias: 1 },
      { label: "Listen to the sounds of the tomb one last time.", note: "A moment of truth.", fateShift: 4, luckBias: 3, nextId: "a5_04" }
    ],
    "a5_04": [
      { label: "Drink the poison and end it.", note: "The tragedy is sealed.", fateShift: -5, luckBias: 0, nextId: "ENDING_GATE" },
      { label: "Delay your hand as her chest rises.", note: "A miracle in the dark.", fateShift: 5, luckBias: 5, nextId: "ENDING_GATE" },
      { label: "Wait for the Friar to burst through the doors.", note: "The truth is revealed.", fateShift: 3, luckBias: 2, nextId: "ENDING_GATE" }
    ]
  };

  const choiceData = choicesMap[sceneId] || [
    { label: "Proceed forward blindly.", note: "Moving ahead.", fateShift: 1, luckBias: 0 },
    { label: "Step carefully.", note: "With caution.", fateShift: -1, luckBias: 1 },
    { label: "Trust to fortune.", note: "Let fate decide.", fateShift: 0, luckBias: 2 }
  ];

  const tones: ChoiceTone[] = ["impulse", "restraint", "omen"];
  return choiceData.map((choice, i) => {
    let nextId = resolveNextId(act, beatIndex, 1);
    if ((choice as any).nextId) {
      nextId = (choice as any).nextId;
    }
    return {
      id: tones[i],
      tone: tones[i],
      label: choice.label,
      note: choice.note,
      fateShift: choice.fateShift,
      luckBias: choice.luckBias,
      addItems: (choice as any).addItems,
      requireItems: (choice as any).requireItems,
      nextId
    };
  });
}
`;

story = story.replace(/function makeDefaultChoices[\s\S]*?function patchSceneChoices[\s\S]*?return patched;\n}\n/m, replacement);

story = story.replace(/const defaultChoices = makeDefaultChoices\(blueprint\.act, index\);\n\s*const finalChoices = patchSceneChoices\(sceneId, defaultChoices\);/, `const finalChoices = getCustomChoices(sceneId, blueprint.act, index);`);

fs.writeFileSync('src/data/story.ts', story);
