"use client";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
const safe = (v:any) => { const n=Number(v); return Number.isFinite(n)&&n>0?n:null; };
export default function ScoreRadar({ breakdown }: { breakdown: Record<string, number> }) {
  if (!breakdown) return null;
  const data = Object.entries(breakdown).map(([k,v])=>({metric:k, score:safe(v)})).filter(d=>d.score!==null);
  if (!data.length) return null;
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-2">📈 分數雷達圖</h2>
      <div className="h-72">
        <ResponsiveContainer>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" tick={{ fill: "#9fb3c8", fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 20]} tick={{ fill: "#9fb3c8" }} />
            <Tooltip />
            <Radar name="Score" dataKey="score" fill="#3aaef1" fillOpacity={0.35} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
