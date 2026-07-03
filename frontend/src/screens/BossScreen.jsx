import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";
import { IMG, BOSS_DIALOGUE, SAMPLE_QUESTION, LEVELS } from "../data/game";
import { HUD } from "../components/HUD";
import { DialogueBox } from "../components/DialogueBox";
import { QuestionCard } from "../components/QuestionCard";
import { EmberParticles, CyanMist, LightShaft, MotionScreen } from "../components/Atmosphere";

// Segmented stone HP bar for boss
const BossHP = ({ segs = 10, filled = 7 }) => (
  <div className="stone-hp" data-testid="boss-hp-bar">
    {Array.from({ length: segs }).map((_, i) => (
      <div key={i} className={`stone-hp-seg ${i >= filled ? "stone-hp-seg-empty" : ""}`} />
    ))}
  </div>
);

export default function BossScreen() {
  const navigate = useNavigate();
  const { num } = useParams();
  const level = LEVELS[(parseInt(num) || 10) - 1] || LEVELS[9];

  const [dialogueIdx, setDialogueIdx] = useState(0);
  const [phase, setPhase] = useState("dialogue"); // dialogue | question | attacking | victory
  const [bossHp, setBossHp] = useState(10);
  const [playerHp, setPlayerHp] = useState(5);
  const [bossPose, setBossPose] = useState("idle");
  const [playerPose, setPlayerPose] = useState("idle");
  const [shakeKey, setShakeKey] = useState(0);

  const advanceDialogue = () => {
    if (dialogueIdx < BOSS_DIALOGUE.length - 1) {
      setDialogueIdx(dialogueIdx + 1);
    } else {
      setPhase("question");
    }
  };

  const handleAnswer = (ok) => {
    if (ok) {
      setPlayerPose("attack");
      setBossPose("hurt");
      const newHp = Math.max(0, bossHp - 2);
      setBossHp(newHp);
      setTimeout(() => {
        setPlayerPose("idle");
        setBossPose("idle");
        if (newHp <= 0) {
          setPhase("victory");
          setTimeout(() => navigate("/victory"), 1200);
        } else {
          setPhase("question");
        }
      }, 900);
    } else {
      setBossPose("attack");
      setPlayerPose("hurt");
      const newHp = Math.max(0, playerHp - 1);
      setPlayerHp(newHp);
      setShakeKey((k) => k + 1);
      setTimeout(() => {
        setPlayerPose("idle");
        setBossPose("idle");
        if (newHp <= 0) {
          navigate("/defeat");
        } else {
          setPhase("question");
        }
      }, 900);
    }
    setPhase("attacking");
  };

  const bossImg = bossPose === "attack" ? IMG.boss_attack : bossPose === "hurt" ? IMG.boss_hurt : IMG.boss_idle;
  const playerImg = playerPose === "attack" ? IMG.player_attack : playerPose === "hurt" ? IMG.player_hurt : IMG.player_idle;

  return (
    <MotionScreen>
      <motion.div
        key={shakeKey}
        animate={shakeKey > 0 ? { x: [-10, 10, -6, 6, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="absolute inset-0"
      >
        <img src={IMG.bg_boss_cavern} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-darkest/40 via-transparent to-stone-darkest/85" />
        <div className="absolute inset-0 noise pointer-events-none" />
        <LightShaft style={{ top: 20, left: "38%", width: 140, height: 500 }} opacity={0.28} />
        <CyanMist />
      </motion.div>

      {/* Top strip */}
      <div className="absolute top-0 left-0 right-0 z-30 p-3 space-y-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full carved-stone flex items-center justify-center"
            data-testid="btn-back-map"
          >
            <ArrowLeft className="w-5 h-5 text-cyan-mist" />
          </button>
          <div className="glass-panel-ember flex-1 px-3 py-1.5 flex items-center gap-2">
            <Shield className="w-4 h-4 text-ember-orange" />
            <span className="font-display text-sm font-bold tracking-widest text-bone">
              GUARDIAN {level.zoneIndex + 1}
            </span>
          </div>
        </div>

        {/* Boss HP */}
        <div className="glass-panel-ember p-2.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-ember-orange">
              STONE DEITY
            </span>
            <span className="font-mono text-xs text-bone">{bossHp * 10}/100</span>
          </div>
          <BossHP segs={10} filled={bossHp} />
        </div>

        <HUD hp={playerHp} xp={80} level={7} coins={128} />
      </div>

      {/* Arena — boss upper, player lower-left */}
      <div className="absolute inset-x-0 top-[220px] bottom-[240px] pointer-events-none z-20">
        {/* Boss */}
        <motion.div
          animate={{
            y: bossPose === "attack" ? -8 : bossPose === "hurt" ? 8 : [0, -4, 0],
            x: bossPose === "attack" ? -12 : 0,
          }}
          transition={
            bossPose === "idle"
              ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.5 }
          }
          className="absolute top-4 left-1/2 -translate-x-1/2 w-56 h-64"
          data-testid={`boss-pose-${bossPose}`}
        >
          <img
            src={bossImg}
            alt=""
            className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(255,107,53,0.35)]"
          />
        </motion.div>

        {/* Player */}
        <motion.div
          animate={{
            y: playerPose === "hurt" ? 6 : playerPose === "attack" ? -8 : [0, -3, 0],
            x: playerPose === "attack" ? 30 : 0,
          }}
          transition={
            playerPose === "idle"
              ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.5 }
          }
          className="absolute bottom-4 left-6 w-28 h-40"
          data-testid={`player-pose-${playerPose}`}
        >
          <img
            src={playerImg}
            alt=""
            className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)]"
          />
        </motion.div>
      </div>

      {/* Bottom stack: dialogue OR question */}
      <div className="absolute inset-x-0 bottom-0 z-40 p-3 pb-5">
        <AnimatePresence mode="wait">
          {phase === "dialogue" && (
            <motion.div
              key="dialogue"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
            >
              <DialogueBox
                entry={BOSS_DIALOGUE[dialogueIdx]}
                onAdvance={advanceDialogue}
                index={dialogueIdx}
                total={BOSS_DIALOGUE.length}
              />
            </motion.div>
          )}
          {(phase === "question" || phase === "attacking") && (
            <motion.div
              key="question"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
            >
              <QuestionCard
                question={SAMPLE_QUESTION}
                onAnswer={handleAnswer}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <EmberParticles count={18} />
    </MotionScreen>
  );
}
