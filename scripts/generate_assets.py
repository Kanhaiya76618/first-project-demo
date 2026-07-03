"""
Nano Banana image generation script for Dungeon of Recall UI Kit.
Generates all background, character, monster, boss, NPC, and prop art.
Saves PNGs to /app/frontend/public/generated/
"""
import asyncio
import os
import base64
import sys
from pathlib import Path
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv('/app/backend/.env')

API_KEY = os.getenv("EMERGENT_LLM_KEY")
OUT_DIR = Path("/app/frontend/public/generated")
OUT_DIR.mkdir(parents=True, exist_ok=True)

MODEL = "gemini-3.1-flash-image-preview"

STYLE_TAIL = (
    " Cinematic magical realism, 2D game art, chibi proportions with thick black outlines, "
    "painterly texture, deep mossy green and stone gray palette, cyan (#00E5FF) and ember-orange (#FF6B35) "
    "accent glows only, absolutely NO purple, NO navy dungeon look."
)

CHAR_TAIL = " transparent background, centered, sprite pose, full body visible."

ASSETS = [
    # BACKGROUNDS (scenes, not transparent)
    ("bg_world_map", "Vertically-tall cinematic background of ancient jungle ruins at night, a winding stone S-curve pathway climbing upwards through overgrown mossy temple ruins, glowing cyan bioluminescent flora, drifting cyan mist volumes, warm ember firepits along the path, volumetric moonlight shafts through vines, distant carved deity statues, painterly detailed 2D game art." + STYLE_TAIL),
    ("bg_level", "Wide horizontal cinematic background of a mossy jungle ruin clearing / playfield with broken temple pillars, glowing cyan bioluminescent plants along the edges, ember torches on stone braziers, ancient carved runes on the ground, thick jungle canopy above, painterly 2D game art." + STYLE_TAIL),
    ("bg_boss_cavern", "Wide cinematic underground cavern arena carved from ancient temple stone, a colossal carved deity face in the far wall with cracked mossy stone, ember-orange lava fissures across the floor, glowing cyan rune circles on the ground, high contrast volumetric lighting, painterly 2D game art." + STYLE_TAIL),
    ("bg_side_left", "Vertical parallax scenery slab of a colossal moss-covered carved jungle statue, cascading vines, glowing cyan bioluminescent flowers, dark stone details, painterly 2D game art." + STYLE_TAIL),
    ("bg_side_right", "Vertical parallax scenery slab of a luminescent cyan waterfall cascading over dark stone ruins into a misty abyss, glowing cyan bioluminescent plants clinging to wet stone, painterly 2D game art." + STYLE_TAIL),

    # PLAYER — red scarf explorer
    ("player_idle", "Chibi 2D game character sprite: a young explorer with a bright red scarf blowing gently, deep moss-green tunic, brown leather boots, a small glowing cyan magic lantern in hand, standing idle pose, thick black outlines, painterly texture." + STYLE_TAIL + CHAR_TAIL),
    ("player_attack", "Chibi 2D game character sprite: same red-scarf explorer in a mid-attack lunge pose, cyan lantern swinging forward emitting a bright cyan burst, red scarf whipping backwards, thick black outlines, painterly texture." + STYLE_TAIL + CHAR_TAIL),
    ("player_hurt", "Chibi 2D game character sprite: same red-scarf explorer in a hurt pose, hunched slightly, one arm shielding face, ember-orange sparks around, distressed expression, thick black outlines, painterly texture." + STYLE_TAIL + CHAR_TAIL),

    # BOSS — Stone Deity Guardian
    ("boss_idle", "Chibi 2D game boss sprite: giant Stone Deity Guardian, a hulking humanoid carved from mossy cracked ancient stone, glowing ember-orange eyes and chest core, massive shoulders, carved cyan rune tattoos, standing idle menacing pose, thick black outlines, painterly texture." + STYLE_TAIL + CHAR_TAIL),
    ("boss_attack", "Chibi 2D game boss sprite: the Stone Deity Guardian smashing down with both stone fists, ember cracks flaring bright orange across its body, cyan runes glowing, dramatic pose, thick black outlines, painterly texture." + STYLE_TAIL + CHAR_TAIL),
    ("boss_hurt", "Chibi 2D game boss sprite: the Stone Deity Guardian recoiling in pain, chunks of stone chipping off, ember-orange fissures widening, one knee down, thick black outlines, painterly texture." + STYLE_TAIL + CHAR_TAIL),

    # MONSTERS (3 types, each with idle + hit)
    ("monster1_idle", "Chibi 2D game monster sprite: a small hostile jungle goblin creature made of vines and mossy roots with glowing cyan eyes, tiny sharp teeth, hunched idle pose, thick black outlines, painterly texture." + STYLE_TAIL + CHAR_TAIL),
    ("monster1_hit", "Chibi 2D game monster sprite: the same vine-goblin creature recoiling, ember-orange spark burst around it, eyes squinting, thick black outlines, painterly texture." + STYLE_TAIL + CHAR_TAIL),
    ("monster2_idle", "Chibi 2D game monster sprite: a floating carved stone skull with glowing ember-orange eye sockets and cyan cracks, hovering with tiny wisps of cyan mist below, idle pose, thick black outlines, painterly texture." + STYLE_TAIL + CHAR_TAIL),
    ("monster2_hit", "Chibi 2D game monster sprite: same floating stone skull cracking apart with ember-orange fissures glowing, cyan mist puffing out, thick black outlines, painterly texture." + STYLE_TAIL + CHAR_TAIL),
    ("monster3_idle", "Chibi 2D game monster sprite: a giant beetle-like ruin bug with a mossy stone carapace, glowing cyan underbelly, two ember-orange antennae, idle pose, thick black outlines, painterly texture." + STYLE_TAIL + CHAR_TAIL),
    ("monster3_hit", "Chibi 2D game monster sprite: the same ruin beetle flipped on its back, legs kicking, ember sparks flying, thick black outlines, painterly texture." + STYLE_TAIL + CHAR_TAIL),

    # NPCs (2 NPCs, each idle A/B)
    ("npc1_a", "Chibi 2D game NPC sprite: an old jungle sage in a hooded moss-green robe, holding a carved wooden staff topped with a small cyan crystal, standing idle A pose looking left, thick black outlines, painterly texture." + STYLE_TAIL + CHAR_TAIL),
    ("npc1_b", "Chibi 2D game NPC sprite: the same jungle sage in idle B pose looking right, staff tilted slightly, thick black outlines, painterly texture." + STYLE_TAIL + CHAR_TAIL),
    ("npc2_a", "Chibi 2D game NPC sprite: a small merchant with a large backpack of glowing relics, a red-orange cloak, holding an ember lantern, idle A pose, thick black outlines, painterly texture." + STYLE_TAIL + CHAR_TAIL),
    ("npc2_b", "Chibi 2D game NPC sprite: same merchant in idle B pose, waving, lantern swinging, thick black outlines, painterly texture." + STYLE_TAIL + CHAR_TAIL),

    # PROPS
    ("prop_chest", "2D game prop sprite of an ancient carved stone treasure chest overflowing with glowing cyan crystals and ember-orange relic coins, thick black outlines, painterly texture." + STYLE_TAIL + CHAR_TAIL),
    ("prop_statue", "2D game prop sprite of a small carved jungle deity statue overgrown with vines, ember-orange rune eyes, thick black outlines, painterly texture." + STYLE_TAIL + CHAR_TAIL),
    ("prop_plant", "2D game prop sprite of a bioluminescent jungle plant with glowing cyan blossoms and delicate leaves, thick black outlines, painterly texture." + STYLE_TAIL + CHAR_TAIL),
]


async def generate(name: str, prompt: str):
    out_path = OUT_DIR / f"{name}.png"
    if out_path.exists():
        print(f"[SKIP] {name} already exists")
        return True
    try:
        chat = LlmChat(
            api_key=API_KEY,
            session_id=f"dor-{name}",
            system_message="You are an expert 2D game concept artist."
        )
        chat.with_model("gemini", MODEL).with_params(modalities=["image", "text"])
        msg = UserMessage(text=prompt)
        text, images = await chat.send_message_multimodal_response(msg)
        if not images:
            print(f"[FAIL] {name}: no image returned. text={text[:100]}")
            return False
        img = images[0]
        image_bytes = base64.b64decode(img['data'])
        with open(out_path, "wb") as f:
            f.write(image_bytes)
        print(f"[OK]   {name} ({len(image_bytes)//1024}KB)")
        return True
    except Exception as e:
        print(f"[ERR]  {name}: {type(e).__name__}: {str(e)[:200]}")
        return False


async def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    tasks = ASSETS if not only else [(n, p) for n, p in ASSETS if only in n]
    print(f"Generating {len(tasks)} assets...")
    # Do sequentially to avoid rate limits but log each
    ok = 0
    for name, prompt in tasks:
        r = await generate(name, prompt)
        if r:
            ok += 1
    print(f"\nDone. {ok}/{len(tasks)} succeeded.")


if __name__ == "__main__":
    asyncio.run(main())
