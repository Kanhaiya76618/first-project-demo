import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Timer } from "lucide-react";
import { CornerRune } from "./Atmosphere";

// Glassmorphism question card with vine timer bar
export const QuestionCard = ({
  question,
  monsterImg,
  onAnswer,
  onClose,
  testid = "question-card",
}) => {
  const [selected, setSelected] = useState(null);
  const [state, setState] = useState("asking"); // asking | correct | wrong
  const [timeLeft, setTimeLeft] = useState(100);

  useEffect(() => {
    if (state !== "asking") return;
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1.2)), 100);
    return () => clearInterval(id);
  }, [state]);

  const handlePick = (opt) => {
    if (state !== "asking") return;
    setSelected(opt.key);
    const ok = opt.key === question.correct;
    setState(ok ? "correct" : "wrong");
    setTimeout(() => onAnswer && onAnswer(ok), 900);
  };

  return (
    <motion.div
      initial={{ y: 40, opacity: 0, scale: 0.95 }}
      animate={
        state === "wrong"
          ? { y: 0, opacity: 1, scale: 1, x: [-10, 10, -8, 8, 0] }
          : { y: 0, opacity: 1, scale: 1 }
      }
      exit={{ y: 40, opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel relative p-4 w-full"
      data-testid={testid}
    >
      {/* corner runes */}
      <CornerRune className="absolute -top-2 -left-2 w-6 h-6" />
      <CornerRune className="absolute -top-2 -right-2 w-6 h-6" flip />

      {/* close */}
      {onClose && (
        <button
          onClick={onClose}
          data-testid="question-close"
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-stone-dark/70 border border-cyan-mist/30 flex items-center justify-center hover:border-cyan-mist"
        >
          <X className="w-4 h-4 text-bone" />
        </button>
      )}

      {/* Monster peek */}
      {monsterImg && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-24 h-24 pointer-events-none">
          <img
            src={monsterImg}
            alt=""
            className="w-full h-full object-contain animate-idle-bob drop-shadow-[0_8px_20px_rgba(0,229,255,0.35)]"
          />
        </div>
      )}

      {/* Vine timer */}
      <div className="flex items-center gap-2 mb-3 mt-2">
        <Timer className="w-3.5 h-3.5 text-cyan-mist" />
        <div className="vine-bar flex-1 h-2">
          <div
            className="vine-bar-fill transition-[width] duration-100"
            style={{
              width: `${timeLeft}%`,
              background:
                timeLeft < 30
                  ? "linear-gradient(90deg, #FF6B35, #B44420)"
                  : "linear-gradient(90deg, #3F5A42, #00E5FF)",
            }}
          />
        </div>
        <span className="font-mono text-[10px] text-cyan-mist tabular-nums w-6 text-right">
          {Math.ceil(timeLeft / 10)}
        </span>
      </div>

      {/* Prompt */}
      <p className="font-display text-sm md:text-base font-bold text-bone text-shadow-stone leading-tight mb-3">
        {question.prompt}
      </p>

      {/* Options */}
      <div className="grid grid-cols-1 gap-2" data-testid="question-options">
        {question.options.map((opt) => {
          const isCorrect = state !== "asking" && opt.key === question.correct;
          const isPicked = selected === opt.key;
          const wrongPick = state === "wrong" && isPicked;

          let cls =
            "border-cyan-mist/25 bg-moss-dark/60 hover:border-cyan-mist hover:bg-moss-mid/70";
          if (isCorrect) cls = "border-cyan-mist bg-cyan-mist/25 shadow-cyan-glow";
          if (wrongPick) cls = "border-ember-orange bg-ember-orange/25 shadow-ember-glow";

          return (
            <button
              key={opt.key}
              onClick={() => handlePick(opt)}
              disabled={state !== "asking"}
              data-testid={`question-option-${opt.key}`}
              className={`text-left px-3 py-2.5 rounded-lg border-2 transition-all flex items-center gap-3 ${cls}`}
            >
              <span
                className="w-7 h-7 rounded-md carved-stone flex items-center justify-center font-heading font-bold text-cyan-mist text-sm shrink-0"
                style={isCorrect ? { color: "#0B120C", background: "#00E5FF" } : {}}
              >
                {opt.key}
              </span>
              <span className="font-body text-sm text-bone">{opt.text}</span>
            </button>
          );
        })}
      </div>

      {/* Result banner */}
      <AnimatePresence>
        {state === "correct" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 py-2 px-3 rounded-lg bg-cyan-mist/15 border border-cyan-mist flex items-center justify-between"
            data-testid="answer-correct"
          >
            <span className="font-heading text-xs font-bold tracking-widest text-cyan-mist">
              MEMORY RECALLED
            </span>
            <span className="font-mono text-xs text-cyan-mist">+ 12 XP</span>
          </motion.div>
        )}
        {state === "wrong" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 py-2 px-3 rounded-lg bg-ember-orange/15 border border-ember-orange flex items-center justify-between"
            data-testid="answer-wrong"
          >
            <span className="font-heading text-xs font-bold tracking-widest text-ember-orange">
              THE RUINS FORGET YOU
            </span>
            <span className="font-mono text-xs text-ember-orange">– 1 HP</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
