"use client";
import React, { useState } from "react";
import DashboardLayout from "./components/DashboardLayout";
import HeaderBar from "./components/HeaderBar";
import KpiCard from "./components/KpiCard";
import EarningsCard from "./components/EarningsCard";
import { MarkdownCard } from "./components/MarkdownCard";
import ProcessingIndicator from "./components/ProcessingIndicator";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const json = data?.result_json;
  const md = data?.report_md as string;

  const [busy, setBusy] = useState(false);

  return (
    <DashboardLayout>
      <div className="lg:col-span-3 space-y-4">
        <HeaderBar onResult={setData} onBusyChange={setBusy} />
        <ProcessingIndicator active={busy} />
      </div>

      <div className="space-y-4">
        <KpiCard
          title="總分"
          value={Number(json?.scores?.total) || 0}
          note={
            json
              ? `${String(json?.cap_class || "").toUpperCase()} / as of ${
                  json?.as_of
                }`
              : "等待分析"
          }
        />
        <KpiCard
          title="今日價格"
          value={Number(json?.targets?.current?.price) || 0}
          accent="violet"
        />
        <KpiCard
          title="購買建議"
          displayValue={false}
          accent="emerald"
          note={
            json
              ? `進場帶：${json?.positioning?.entry_band ?? "待模型填寫"}\n加碼條件：${
                  json?.positioning?.add_condition ?? "逢關鍵事件/量縮回測"
                }\n減碼條件：${
                  json?.positioning?.trim_condition ?? "突破目標價或跌破風控位"
                }`
              : "等待分析"
          }
        />
      </div>


      <div className="space-y-4">
        {md && <MarkdownCard title="🧠 模型報告" md={md} />}
        <EarningsCard items={json?.earnings} summaryMd={json?.earnings_md} />
      </div>
    </DashboardLayout>
  );
}
