import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { CornerRune } from "./Atmosphere";

// RPG dialogue box with typewriter reveal
export const DialogueBox = ({ entry, onAdvance, index = 0, total = 1 }) => {
  const { speaker, name, text } = entry;
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setShown("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, 22);
    return () => clearInterval(id);
  }, [text]);

  const handleClick = () => {
    if (!done) {
      setShown(text);
      setDone(true);
    } else {
      onAdvance && onAdvance();
    }
  };

  const isBoss = speaker === "boss";

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`carved-stone relative p-4 pt-5 w-full cursor-pointer select-none`}
      onClick={handleClick}
      data-testid="dialogue-box"
    >
      <CornerRune className="absolute -top-2.5 -left-2.5 w-6 h-6" />
      <CornerRune className="absolute -top-2.5 -right-2.5 w-6 h-6" flip />

      {/* speaker tab */}
      <div
        className={`absolute -top-3 left-4 px-3 py-0.5 rounded-md border-2 border-stone-darkest ${
          isBoss ? "bg-ember-deep" : "bg-cyan-deep"
        }`}
        data-testid="dialogue-speaker"
      >
        <span className="font-heading text-[11px] font-bold tracking-[0.2em] uppercase text-bone">
          {name}
        </span>
      </div>

      <p className="font-body text-[15px] leading-relaxed text-bone min-h-[60px]">
        {shown}
        {!done && <span className="inline-block w-2 h-4 bg-cyan-mist ml-0.5 animate-pulse" />}
      </p>

      <div className="flex items-center justify-between mt-2">
        <span className="font-mono text-[10px] tracking-widest text-stone-pale">
          {index + 1} / {total}
        </span>
        {done && (
          <motion.div
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            data-testid="dialogue-next-button"
          >
            <ChevronDown className="w-5 h-5 text-cyan-mist" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
