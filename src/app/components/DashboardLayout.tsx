"use client";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen text-white">
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div className="fixed inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-cyan-500/20 via-transparent to-transparent blur-3xl" />

      <header className="sticky top-0 z-30 backdrop-blur-lg border-b border-white/10 bg-slate-950/70">
        <div className="container flex flex-col gap-4 py-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Rocket Screener Pro
            </h1>
            <p className="text-sm text-white/70">
              AI 財經情報平台 · 智能目標價 · 實時風控指標
            </p>
          </div>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={cn("container grid grid-cols-1 lg:grid-cols-3 gap-6 py-8")}
      >
        {children}
      </motion.main>
      <Toaster />
    </div>
  );
}
