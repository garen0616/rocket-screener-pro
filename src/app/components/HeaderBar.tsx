"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type HeaderBarProps = {
  onResult: (data: any) => void;
  onBusyChange?: (busy: boolean) => void;
};

export default function HeaderBar({ onResult, onBusyChange }: HeaderBarProps) {
  const [ticker, setTicker] = useState("");
  const [asOf, setAsOf] = useState(new Date().toISOString().slice(0, 10));
  const [question, setQuestion] = useState(
    "請依雙標準打分，輸出最近四季財報重點與對股價影響、綜合結論，以及倉位與執行建議。"
  );
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const ctrlRef = useRef<AbortController | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    onBusyChange?.(true);

    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker: ticker.trim().toUpperCase(),
          asOf,
          question
        }),
        signal: ctrl.signal
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Server error");
      onResult(json);
    } catch (error: any) {
      if (error?.name === "AbortError") {
        setErr("已取消分析");
      } else {
        setErr(error?.message ?? "Unknown error");
      }
    } finally {
      setLoading(false);
      onBusyChange?.(false);
      ctrlRef.current = null;
    }
  }

  const handleCancel = () => {
    ctrlRef.current?.abort();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="card glow grid md:grid-cols-5 gap-3 items-end"
    >
      <div className="md:col-span-2">
        <Label className="label">美股代號（Ticker）</Label>
        <Input
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="例如：NVDA / AMD / PLTR"
          required
        />
      </div>
      <div>
        <Label className="label">測試日期（回溯）</Label>
        <Input
          type="date"
          value={asOf}
          onChange={(e) => setAsOf(e.target.value)}
          required
        />
      </div>
      <div className="md:col-span-2">
        <Label className="label">附加問題（選填）</Label>
        <Textarea
          rows={1}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      <div className="md:col-span-5 flex items-center gap-3">
        <Button
          type="submit"
          variant="ghost"
          className="rounded-xl bg-cyan-500/90 px-6 py-2 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:bg-cyan-400/90 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "分析中…" : "開始打分"}
        </Button>
        {loading && (
          <Button
            type="button"
            variant="secondary"
            className="rounded-xl bg-white/10 border border-white/15"
            onClick={handleCancel}
          >
            取消
          </Button>
        )}
        {err && <div className="text-red-400 text-sm">錯誤：{err}</div>}
        <span className="text-white/60 text-xs">
          ＊回溯日期限制模型僅使用該日前資訊。
        </span>
      </div>
    </form>
  );
}
