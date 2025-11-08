"use client";
import { motion } from "framer-motion";

export default function ProcessingIndicator({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="processing-indicator">
      <div className="processing-indicator__orb">
        <motion.span
          className="processing-indicator__ring"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        />
        <span className="processing-indicator__dot" />
      </div>
      <div>
        <p className="processing-indicator__title">分析進行中…</p>
        <p className="processing-indicator__desc">需要 1–2 分鐘，執行中請稍候</p>
      </div>
    </div>
  );
}
