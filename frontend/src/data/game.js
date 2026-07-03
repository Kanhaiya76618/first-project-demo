// Asset paths — all pre-generated PNGs in /public/generated/
const B = "/generated";

export const IMG = {
  bg_world_map: `${B}/bg_world_map.png`,
  bg_level: `${B}/bg_level.png`,
  bg_boss_cavern: `${B}/bg_boss_cavern.png`,
  bg_side_left: `${B}/bg_side_left.png`,
  bg_side_right: `${B}/bg_side_right.png`,

  player_idle: `${B}/player_idle.png`,
  player_attack: `${B}/player_attack.png`,
  player_hurt: `${B}/player_hurt.png`,

  boss_idle: `${B}/boss_idle.png`,
  boss_attack: `${B}/boss_attack.png`,
  boss_hurt: `${B}/boss_hurt.png`,

  monster1_idle: `${B}/monster1_idle.png`,
  monster1_hit: `${B}/monster1_hit.png`,
  monster2_idle: `${B}/monster2_idle.png`,
  monster2_hit: `${B}/monster2_hit.png`,
  monster3_idle: `${B}/monster3_idle.png`,
  monster3_hit: `${B}/monster3_hit.png`,

  npc1_a: `${B}/npc1_a.png`,
  npc1_b: `${B}/npc1_b.png`,
  npc2_a: `${B}/npc2_a.png`,
  npc2_b: `${B}/npc2_b.png`,

  prop_chest: `${B}/prop_chest.png`,
  prop_statue: `${B}/prop_statue.png`,
  prop_plant: `${B}/prop_plant.png`,
};

// 5 themed zones, 10 levels each = 50 total, boss every 10
export const ZONES = [
  { id: 1, name: "Verdant Threshold", color: "#3F5A42", accent: "#00E5FF" },
  { id: 2, name: "Whispering Vines",  color: "#2F4A34", accent: "#00E5FF" },
  { id: 3, name: "Sunken Cloister",   color: "#2A3F3D", accent: "#FF6B35" },
  { id: 4, name: "Ember Chasm",       color: "#3F2E22", accent: "#FF6B35" },
  { id: 5, name: "Deity's Vault",     color: "#382918", accent: "#FF6B35" },
];

// Generate 50 nodes with S-curve horizontal offsets
export const LEVELS = Array.from({ length: 50 }, (_, i) => {
  const num = i + 1;
  const zoneIndex = Math.floor(i / 10);
  const zone = ZONES[zoneIndex];
  const isBoss = num % 10 === 0;

  // status distribution: first 6 completed, 7 current, rest unlocked/locked
  let status = "locked";
  if (num < 7) status = "completed";
  else if (num === 7) status = "current";
  else if (num < 12) status = "unlocked";

  // S-curve: sinusoidal horizontal offset within column (0..1)
  const t = i;
  const xPct = 50 + Math.sin(t * 0.55) * 32; // 18% .. 82%

  return {
    num,
    zone,
    zoneIndex,
    isBoss,
    status,
    xPct,
    // detailed nodes: first 15 have unique previews
    detailed: num <= 15,
    title: isBoss ? `Guardian ${zoneIndex + 1}` : `Trial ${num}`,
    preview: isBoss
      ? "A colossal stone guardian stirs. Answer wisely or be forgotten."
      : "Whispers in the moss — a monster guards fragments of memory.",
  };
});

export const SAMPLE_QUESTION = {
  prompt: "Which relic seals the Guardian's slumber?",
  options: [
    { key: "A", text: "The Verdant Sigil" },
    { key: "B", text: "The Ember Tear" },
    { key: "C", text: "The Bone Chime" },
    { key: "D", text: "The Cyan Rune" },
  ],
  correct: "B",
};

export const BOSS_DIALOGUE = [
  { speaker: "boss", name: "Stone Deity", text: "You dare disturb the deep silence, small flame?" },
  { speaker: "player", name: "You", text: "I came for what your ruins remember." },
  { speaker: "boss", name: "Stone Deity", text: "Then prove your memory. Answer, or become dust." },
];
