"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CountUp from "react-countup";

type KpiCardProps = {
  title: string;
  value?: number | null;
  suffix?: string;
  note?: string;
  accent?: "cyan" | "emerald" | "red" | "violet";
  displayValue?: boolean;
};

export default function KpiCard({
  title,
  value,
  suffix,
  note,
  accent = "cyan",
  displayValue = true
}: KpiCardProps) {
  const color = accent === "emerald" ? "text-emerald-400" : accent === "red" ? "text-red-400" : accent === "violet" ? "text-violet-400" : "text-cyan-400";
  const v = typeof value === "number" ? value : 0;
  return (
    <Card className="bg-white/5 border border-white/10 shadow-xl hover:shadow-cyan-500/10 transition-all">
      <CardHeader><CardTitle className="text-white/80">{title}</CardTitle></CardHeader>
      <CardContent>
        {displayValue && (
          <div className={`text-4xl font-bold ${color}`}>
            <CountUp end={v} duration={1.2} decimals={2} />
            {suffix && <span className="text-2xl text-white/60 ml-1">{suffix}</span>}
          </div>
        )}
        {note && (
          <div className="text-sm text-white/60 mt-2 whitespace-pre-line">
            {note}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
