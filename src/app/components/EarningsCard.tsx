"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Earn = {
  date?: string; quarter?: string;
  eps_actual?: any; eps_consensus?: any; eps_surprise_pct?: any;
  revenue_actual?: any; revenue_consensus?: any; revenue_surprise_pct?: any;
  guidance?: string; highlights?: string[];
  price_reaction?: { day1_pct?: any; week1_pct?: any; rationale?: string };
};

const num = (v:any) => { if(v===null||v===undefined) return null; const n = typeof v==="string"?Number(v.replace(/[,%$]/g,"")):Number(v); return Number.isFinite(n)?n:null; };
const pct = (v:any) => { const n=num(v); return n===null?"—":`${n.toFixed(2)}%`; };
const money = (v:any) => { const n=num(v); return n===null?"—":`$${n.toLocaleString(undefined,{maximumFractionDigits:2})}`; };

export default function EarningsCard({ items, summaryMd }: { items?: Earn[]; summaryMd?: string }) {
  const rows = Array.isArray(items) ? items.slice(0,4) : [];

  return (
    <>
      <Card className="bg-black/30 border-white/10">
        <CardHeader><CardTitle>🧾 財報分析（最近四季）</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/70">
                  <th className="text-left py-2">日期</th>
                  <th className="text-left">季度</th>
                  <th className="text-left">EPS（實/預）/驚喜</th>
                  <th className="text-left">營收（實/預）/驚喜</th>
                  <th className="text-left">指引</th>
                  <th className="text-left">1D / 1W</th>
                  <th className="text-left">重點</th>
                </tr>
              </thead>
              <tbody>
                {rows.length ? rows.map((e,i)=>(
                  <tr key={i} className="border-t border-white/10 align-top">
                    <td className="py-2">{e.date||"—"}</td>
                    <td>{e.quarter||"—"}</td>
                    <td>{(num(e.eps_actual)?.toFixed(2) ?? "—")} / {(num(e.eps_consensus)?.toFixed(2) ?? "—")} · {pct(e.eps_surprise_pct)}</td>
                    <td>{money(e.revenue_actual)} / {money(e.revenue_consensus)} · {pct(e.revenue_surprise_pct)}</td>
                    <td>{e.guidance || "—"}</td>
                    <td>{pct(e.price_reaction?.day1_pct)} / {pct(e.price_reaction?.week1_pct)}<div className="text-white/50 text-xs">{e.price_reaction?.rationale||""}</div></td>
                    <td><ul className="list-disc pl-5 space-y-1">{(e.highlights||[]).map((h,idx)=><li key={idx}>{h}</li>)}</ul></td>
                  </tr>
                )) : <tr><td className="py-4 text-white/60" colSpan={7}>尚無資料</td></tr>}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {summaryMd && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-2">🧠 ChatGPT 財報綜合分析</h2>
          <article className="prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{summaryMd}</ReactMarkdown>
          </article>
        </div>
      )}
    </>
  );
}
