"use client";
import React from "react";

const labelMap: Record<string,string> = {
  current: "📍 今日價格",
  optimistic: "🚀 樂觀目標價（3M）",
  base: "⚖️ 合理目標價（3M）",
  pessimistic: "📉 悲觀價格（3M）",
  stoploss: "🛑 停損價"
};

const safe = (v:any) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
};

export default function TargetGrid({ targets }: { targets: any }) {
  if (!targets) return null;
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(targets).map(([k, v]: any) => {
        const px = safe(v?.price);
        return (
          <div key={k} className="card border border-white/10 bg-white/5">
            <h2 className="text-lg font-semibold mb-1">{labelMap[k] || k}</h2>
            <div className="text-3xl font-bold text-white mb-1">
              {px !== null ? `$${px.toFixed(2)}` : "—"}
            </div>
            <p className="text-sm text-white/70">{v?.rationale || "尚無模型給出資料"}</p>
          </div>
        );
      })}
    </div>
  );
}
