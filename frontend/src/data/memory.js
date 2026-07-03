// Mock Cognee memory data — single source of truth for all memory-system UI.
// Real game will populate this shape from the Cognee API response.

export const MEMORY_SHARD_TYPES = {
  weakness: {
    label: "Weakness",
    accent: "#FF6B35",
    ring: "rgba(255,107,53,0.55)",
    glow: "rgba(255,107,53,0.35)",
    icon: "target",
  },
  behavior: {
    label: "Behavior",
    accent: "#00E5FF",
    ring: "rgba(0,229,255,0.55)",
    glow: "rgba(0,229,255,0.35)",
    icon: "activity",
  },
  strength: {
    label: "Strength",
    accent: "#7CE38B",
    ring: "rgba(124,227,139,0.55)",
    glow: "rgba(124,227,139,0.35)",
    icon: "shield",
  },
  event: {
    label: "Event",
    accent: "#F5B942",
    ring: "rgba(245,185,66,0.55)",
    glow: "rgba(245,185,66,0.3)",
    icon: "history",
  },
};

// Boss identity — later populated by Cognee agent config
export const BOSS_IDENTITY = {
  name: "VASHKAR",
  title: "Stone Deity",
  memory_source: "cognee.memory.v1",
};

// The four example shards required by the spec (data-driven, extensible)
export const MEMORY_SHARDS = [
  {
    id: "shd-01",
    type: "weakness",
    title: "Weak topic: Arrays",
    detail: "3 past failures",
    source: "Zone 2, Level 14",
    weight: 0.82,
  },
  {
    id: "shd-02",
    type: "behavior",
    title: "Hesitates on timed questions",
    detail: "avg 9.2s per answer",
    source: "Zone 3, Level 22",
    weight: 0.71,
  },
  {
    id: "shd-03",
    type: "event",
    title: "Last encounter: fled at 20 HP",
    detail: "abandoned trial mid-fight",
    source: "Zone 4, Level 30",
    weight: 0.66,
  },
  {
    id: "shd-04",
    type: "strength",
    title: "Strong topic: Recursion",
    detail: "90% accuracy",
    source: "Zone 3, Level 27",
    weight: 0.93,
  },
];

// Recalled-dialogue lines the boss can speak using memory
export const RECALLED_DIALOGUE = [
  {
    id: "rd-01",
    speaker: "boss",
    name: "Vashkar",
    text: "Arrays again, little flame? I remember every time they burned you.",
    memory_ref: "shd-01",
  },
  {
    id: "rd-02",
    speaker: "boss",
    name: "Vashkar",
    text: "You hesitate. Nine seconds, ten... the ruins have counted them all.",
    memory_ref: "shd-02",
  },
];

// The ECHOES journal — mastered + haunting topics + per-zone accuracy
export const ECHOES_JOURNAL = {
  mastered: [
    { topic: "Recursion", accuracy: 0.90 },
    { topic: "Loops",     accuracy: 0.85 },
    { topic: "Strings",   accuracy: 0.78 },
    { topic: "Hashmaps",  accuracy: 0.74 },
  ],
  haunting: [
    { topic: "Arrays",   accuracy: 0.40 },
    { topic: "Pointers", accuracy: 0.52 },
    { topic: "Trees",    accuracy: 0.55 },
    { topic: "Graphs",   accuracy: 0.58 },
  ],
  zones: [
    { id: 1, name: "Verdant Threshold", accuracy: 0.88 },
    { id: 2, name: "Whispering Vines",  accuracy: 0.72 },
    { id: 3, name: "Sunken Cloister",   accuracy: 0.61 },
    { id: 4, name: "Ember Chasm",       accuracy: 0.44 },
    { id: 5, name: "Deity's Vault",     accuracy: 0.00 },
  ],
};

// Memory gauge config — each answered question fills one segment
export const MEMORY_GAUGE = {
  segments: 5,
  filled: 2, // default starting state for the prototype
};

// Empty-state placeholder for a fresh player
export const EMPTY_MEMORY_MESSAGE = "The Guardian knows nothing of you... yet.";
