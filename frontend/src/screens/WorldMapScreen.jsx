import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LEVELS, ZONES, IMG } from "../data/game";
import { ECHOES_JOURNAL } from "../data/memory";
import { LevelNode, ZoneBanner } from "../components/LevelNode";
import { EmberParticles, CyanMist, LightShaft, MotionScreen } from "../components/Atmosphere";
import { HUD } from "../components/HUD";
import { EchoesJournal, EchoesTrigger } from "../components/EchoesJournal";
import { Settings, MapPin } from "lucide-react";

// The vertically scrolling S-curve world map
export default function WorldMapScreen({ onOpenSettings }) {
  const navigate = useNavigate();
  const [echoesOpen, setEchoesOpen] = useState(false);

  // Node vertical spacing (px) — total scroll length
  const rowH = 108;

  // group nodes per zone with a banner slot
  const rows = useMemo(() => {
    // total height accounting for a banner between each 10-block zone
    return LEVELS.map((lvl, i) => ({ lvl, yPx: 60 + i * rowH + Math.floor(i / 10) * 90 }));
  }, []);

  // helper: scatter NPCs at fixed positions
  const npcs = [
    { img: IMG.npc1_a, alt: IMG.npc1_b, x: 12, y: 340, id: "sage" },
    { img: IMG.npc2_a, alt: IMG.npc2_b, x: 78, y: 900, id: "merchant" },
    { img: IMG.npc1_b, alt: IMG.npc1_a, x: 8, y: 1900, id: "sage2" },
    { img: IMG.npc2_b, alt: IMG.npc2_a, x: 76, y: 3100, id: "merchant2" },
  ];

  const totalH = rows[rows.length - 1].yPx + 200;

  const handleNodeClick = (lvl) => {
    if (lvl.isBoss) navigate(`/boss/${lvl.num}`);
    else navigate(`/level/${lvl.num}`);
  };

  return (
    <MotionScreen>
      {/* Fixed backdrop background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={IMG.bg_world_map}
          alt=""
          className="absolute top-0 left-0 w-full h-full object-cover object-top"
          style={{ minHeight: totalH }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-moss-darkest/60 via-transparent to-moss-darkest/70" />
        <div className="absolute inset-0 noise pointer-events-none" />
        <CyanMist />
      </div>

      {/* Top HUD (sticky) */}
      <div className="absolute top-0 left-0 right-0 z-40 p-3 space-y-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-full carved-stone flex items-center justify-center"
            data-testid="btn-open-settings"
          >
            <Settings className="w-5 h-5 text-cyan-mist" />
          </button>
          <div className="glass-panel flex-1 px-3 py-1.5 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-mist" />
            <span className="font-display text-sm font-bold tracking-widest text-bone">
              DUNGEON OF RECALL
            </span>
          </div>
          <EchoesTrigger onClick={() => setEchoesOpen(true)} />
        </div>
        <HUD hp={4} xp={64} level={7} coins={128} />
      </div>

      {/* Scrolling map body */}
      <div
        className="relative w-full overflow-y-auto overflow-x-hidden pt-[130px] pb-16"
        style={{ height: "100%" }}
        data-testid="worldmap-scroll"
      >
        <div className="relative w-full" style={{ height: totalH }}>
          {/* S-curve stone path SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            viewBox={`0 0 100 ${totalH}`}
          >
            <defs>
              <linearGradient id="pathGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#3F5A42" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#382918" stopOpacity="0.9" />
              </linearGradient>
              <filter id="pathBlur"><feGaussianBlur stdDeviation="0.3" /></filter>
            </defs>
            {rows.slice(0, -1).map(({ lvl, yPx }, i) => {
              const next = rows[i + 1];
              return (
                <line
                  key={i}
                  x1={lvl.xPct}
                  y1={yPx}
                  x2={next.lvl.xPct}
                  y2={next.yPx}
                  stroke="url(#pathGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="1 2"
                  filter="url(#pathBlur)"
                />
              );
            })}
          </svg>

          {/* Zone banners at boundaries */}
          {ZONES.map((z, i) => {
            // first level of the zone
            const first = rows[i * 10];
            const y = first ? first.yPx - 60 : 0;
            return (
              <div
                key={z.id}
                className="absolute left-0 right-0"
                style={{ top: y }}
              >
                <ZoneBanner zone={z} index={i} />
              </div>
            );
          })}

          {/* NPC scatter */}
          {npcs.map((npc, i) => (
            <div
              key={npc.id + i}
              className="absolute w-16 h-16 pointer-events-none"
              style={{ top: npc.y, left: `${npc.x}%` }}
              data-testid={`npc-${npc.id}`}
            >
              <motion.img
                src={npc.img}
                alt=""
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 3, repeat: Infinity, times: [0, 0.5, 1] }}
                className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_6px_12px_rgba(0,0,0,0.7)] animate-idle-bob"
              />
              <motion.img
                src={npc.alt}
                alt=""
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, times: [0, 0.5, 1] }}
                className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_6px_12px_rgba(0,0,0,0.7)]"
              />
            </div>
          ))}

          {/* Bioluminescent plant props scatter */}
          {[
            { x: 6, y: 220 }, { x: 84, y: 640 }, { x: 10, y: 1100 },
            { x: 82, y: 1500 }, { x: 6, y: 2200 }, { x: 84, y: 2700 },
          ].map((p, i) => (
            <img
              key={i}
              src={IMG.prop_plant}
              alt=""
              className="absolute w-14 h-14 object-contain animate-sway opacity-90"
              style={{ top: p.y, left: `${p.x}%`, filter: "drop-shadow(0 0 12px rgba(0,229,255,0.35))" }}
            />
          ))}

          {/* Level nodes */}
          {rows.map(({ lvl, yPx }) => (
            <div
              key={lvl.num}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ top: yPx, left: `${lvl.xPct}%` }}
            >
              <LevelNode level={lvl} onClick={handleNodeClick} />
              {/* mini caption below current level */}
              {lvl.status === "current" && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap">
                  <div className="glass-panel-ember px-2 py-1">
                    <span className="font-heading text-[10px] font-bold text-ember-orange tracking-widest">
                      YOU ARE HERE
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <EmberParticles count={10} />

      {/* ECHOES journal overlay */}
      <EchoesJournal
        open={echoesOpen}
        onClose={() => setEchoesOpen(false)}
        data={ECHOES_JOURNAL}
      />
    </MotionScreen>
  );
}
