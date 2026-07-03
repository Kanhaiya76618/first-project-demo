# Dungeon of Recall — 2D Fantasy Adventure Quiz UI Kit

## Problem Statement (verbatim)
A complete, production-ready UI kit for an ancient jungle-ruins quiz adventure game, delivered as a mobile-first (390x844) responsive web experience with a desktop variant (1440x900). Focus: pixel-perfect cinematic screens, reusable glassmorphism components, and export-ready character/monster sprite sheets.

## User Choices (locked in ask_human)
- **Art sourcing**: MIX — Nano Banana for backgrounds, boss, player, NPCs, monsters. Pure CSS/SVG for ALL UI (nodes, buttons, cards, dialogue, HUD).
- **Nodes**: 15 fully detailed nodes + repeating pattern for remaining 35 (reusable component, all 50 generated from data).
- **Desktop 1440x900**: vertical scroll with side scenery panels (statues left, waterfall right).
- **Interactivity**: FULL prototype flow with Framer Motion (map → level → question → correct/wrong → boss → victory/defeat).
- **API keys**: Emergent Universal LLM Key for Nano Banana.

## Architecture
- **Frontend**: React 19 + TypeScript-optional + Tailwind CSS 3 + Framer Motion 11 + Shadcn UI + Lucide icons + react-router 7.
- **Backend**: FastAPI + MongoDB (unmodified — this UI kit has no backend business logic; static data only).
- **Art pipeline**: `/app/scripts/generate_assets.py` uses `emergentintegrations` with Gemini `gemini-3.1-flash-image-preview`. All PNGs saved to `/app/frontend/public/generated/`. `/app/scripts/strip_bg.py` post-processes near-uniform matte backgrounds using PIL flood-fill to produce transparent alpha.
- **Typography**: Cinzel Decorative (display), Cinzel (headings), Lora (body), JetBrains Mono (data). Google Fonts CDN.
- **Palette (locked)**: moss (#131A14–#3F5A42), stone (#141614–#8A928A), earth (#382918–#6B5138), cyan-mist #00E5FF, ember-orange #FF6B35, ember-gold #F5B942, bone #E8EDE6. NO purple, NO navy.

## Screens Implemented (v1 — 2026-02-03)
1. **World Map** `/` — vertically scrolling S-curve with 50 nodes, 5 themed zone banners, boss hex nodes every 10 levels, parallax jungle-ruins bg, NPC scatter with idle A/B blend, bioluminescent plant props, HUD strip, settings modal trigger.
2. **Small Level** `/level/:num` — jungle playfield bg, 1–3 tappable monsters, sliding glassmorphism question card with vine timer, correct/wrong states with +XP / -HP toasts, defeat overlay when hp=0.
3. **Boss Level** `/boss/:num` — cavern arena, Stone Deity Guardian with 3 poses (idle/attack/hurt), player with 3 poses, RPG dialogue box with typewriter, segmented 10-block stone HP bar, transitions dialogue → question → attack → victory.
4. **Component Library** `/library` — Typography, palette swatches, ember/cyan/disabled buttons, all 5 node variants, HUD widgets, zone banners, panel recipes (cyan glass, ember glass, carved stone, cyan glow), motion demos.
5. **Sprite Sheet** `/spritesheet` — 5 grouped rows (Player x3, Boss x3, Monsters x6, NPCs x4, Props x3) on checker mattes with mono labels + engine-handoff note + download link.
6. **Victory** `/victory` — cyan radial burst, 3-star rating with staggered spring, floating relic chest, XP/relic rewards, ember+cyan CTAs.
7. **Defeat** `/defeat` — grayscale mist swallow, "THE RUINS REMEMBER…", retry CTA.

## Reusable Components
- `LevelNode` — 5 variants (locked, unlocked, completed, current, boss-hex).
- `ZoneBanner` — carved-stone plaque with zone tint.
- `QuestionCard` — vine timer, monster peek, A/B/C/D options, correct/wrong feedback.
- `DialogueBox` — typewriter, speaker tab (boss ember / player cyan), next indicator.
- `HeartsHUD`, `XPBar`, `CoinCounter`, `StarRating`, `HUD`.
- `EmberParticles`, `CyanMist`, `LightShaft`, `RuneDivider`, `CornerRune`, `MotionScreen`.
- `SettingsModal` (shadcn Dialog + Slider + Switch).
- `SideScenery` (left/right desktop parallax slabs with animated cyan motes).
- `DesktopNav` (5-tab carved-stone nav bar).

## Assets Generated (24 PNGs)
Backgrounds (5): bg_world_map, bg_level, bg_boss_cavern, bg_side_left, bg_side_right.
Player (3): idle, attack, hurt. Boss (3): idle, attack, hurt.
Monsters (6): vine-goblin/stone-skull/ruin-beetle × idle+hit.
NPCs (4): sage_a/b, merchant_a/b. Props (3): chest, statue, plant.

## Testing (2026-02-03)
- Testing subagent iteration 1: **100% (44/44)** functional pass. All prototype flows, click navigations, state transitions, node variants verified. Only minor a11y warning (DialogDescription missing) — patched.

## Backlog (P1/P2)
- P1: Additional zones 4-5 could get unique background art (currently reuse bg_world_map).
- P1: Real question bank + backend Mongo persistence of progress (currently client-only).
- P2: Sound design (SFX + BGM) — sliders exist in Settings.
- P2: Full alpha-clean sprites via a dedicated background-remover model.
- P2: Reduced-motion detection to disable ember drift + cyan mist for accessibility.
- P2: PNG-export tool that stitches all sprites into one atlas.png.
