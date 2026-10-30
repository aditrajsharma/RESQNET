"use client";

import React, { useEffect, useState } from "react";
import {
  ShieldAlert,
  Activity,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Server,
  Layers,
  MapPin,
  Users,
  FileCheck2,
  Database,
  Radio,
} from "lucide-react";

interface HealthData {
  status: string;
  service: string;
}

export default function HomePage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<string>("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const checkBackendHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/health`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: HealthData = await response.json();
      setHealth(data);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to connect to backend";
      setError(message);
      setHealth(null);
      setLastChecked(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Top Situational Awareness Bar */}
      <header className="border-b border-[#E2E8F0] bg-[#FFFFFF] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-[#2563EB] flex items-center justify-center text-white">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm tracking-wide text-[#0F172A]">
                RESQNET
              </span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                PHASE 1 FOUNDATION
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              Multi-Agent Disaster Response and Coordination System
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-xs text-[#64748B]">
          <div className="flex items-center space-x-1.5">
            <Radio className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Sector: Yamuna-Delhi Basin</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
            <span>Operator: HQ-DELTA-1</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Project Welcome Card */}
        <section className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg p-6 space-y-4">
          <div className="max-w-3xl space-y-2">
            <h1 className="text-xl font-semibold text-[#0F172A]">
              Emergency Operations Command Centre
            </h1>
            <p className="text-sm text-[#475569] leading-relaxed">
              RESQNET coordinates autonomous AI agents and human incident commanders to triage distress reports, evaluate flood hazards, formulate optimal rescue team deployment plans, and issue bilingual community advisories.
            </p>
          </div>

          <div className="pt-2 border-t border-[#F1F5F9] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="flex items-center space-x-2 text-[#475569]">
              <Layers className="w-4 h-4 text-[#2563EB]" />
              <span>Two Cooperating Agents (Triage + Coord)</span>
            </div>
            <div className="flex items-center space-x-2 text-[#475569]">
              <FileCheck2 className="w-4 h-4 text-[#16A34A]" />
              <span>7-Point Human Dispatch Verification</span>
            </div>
            <div className="flex items-center space-x-2 text-[#475569]">
              <Database className="w-4 h-4 text-[#D97706]" />
              <span>Append-Only Audit Trail</span>
            </div>
          </div>
        </section>

        {/* Backend Connectivity Status Panel */}
        <section className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <div className="flex items-center space-x-2">
              <Server className="w-4 h-4 text-[#0F172A]" />
              <h2 className="text-sm font-semibold text-[#0F172A]">
                Backend Health & Connectivity
              </h2>
            </div>
            <button
              onClick={checkBackendHealth}
              disabled={loading}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-[#64748B] ${loading ? "animate-spin" : ""}`}
              />
              <span>Check Endpoint</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Status Card */}
            <div className="p-3.5 rounded border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
              <span className="text-[11px] font-medium text-[#64748B]">
                Connection Status
              </span>
              <div className="flex items-center space-x-2 pt-0.5">
                {loading ? (
                  <span className="text-xs text-[#64748B] font-medium flex items-center space-x-1.5">
                    <Activity className="w-3.5 h-3.5 animate-pulse text-[#2563EB]" />
                    <span>Pinging {apiUrl}...</span>
                  </span>
                ) : health?.status === "ok" ? (
                  <span className="text-xs text-[#16A34A] font-semibold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>Online & Verified (HTTP 200)</span>
                  </span>
                ) : (
                  <span className="text-xs text-[#DC2626] font-semibold flex items-center space-x-1.5">
                    <XCircle className="w-4 h-4 text-[#DC2626]" />
                    <span>Connection Offline</span>
                  </span>
                )}
              </div>
            </div>

            {/* Service Identifier */}
            <div className="p-3.5 rounded border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
              <span className="text-[11px] font-medium text-[#64748B]">
                Service Identifier
              </span>
              <p className="text-xs font-mono font-medium text-[#0F172A] pt-0.5">
                {health?.service || (error ? "unreachable" : "checking...")}
              </p>
            </div>

            {/* Target Endpoint & Timestamp */}
            <div className="p-3.5 rounded border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
              <span className="text-[11px] font-medium text-[#64748B]">
                Target Endpoint / Timestamp
              </span>
              <p className="text-xs text-[#0F172A] font-mono pt-0.5 truncate">
                {apiUrl}/health {lastChecked ? `(${lastChecked})` : ""}
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#991B1B]">
              <span className="font-semibold">Error connecting to API:</span>{" "}
              {error}. Ensure the FastAPI server is running on port 8000.
            </div>
          )}
        </section>

        {/* Navigation & System Modules Overview (Phase 1 Placeholder) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#0F172A]">
              Command Modules (Implementation Roadmap)
            </h2>
            <span className="text-xs text-[#64748B]">
              Phases 2–10 Progression
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0F172A]">
                  1. Incident Triage
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#64748B]">
                  Phase 3
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                SOS intake, victim estimation, and AI severity categorization.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0F172A]">
                  2. Response Coordination
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#64748B]">
                  Phase 4
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Team proximity matching and tactical rescue recommendations.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0F172A]">
                  3. Dispatch Approvals
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#64748B]">
                  Phase 6
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                7-point pre-flight checklist authorization gate.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0F172A]">
                  4. Disaster Simulation
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#64748B]">
                  Phase 9
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Automated flash flood scenario playback and dynamic rerouting.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-[#FFFFFF] py-3 px-6 text-center text-xs text-[#64748B]">
        RESQNET Emergency Operations Command Platform — Solo Developer Hackathon Architecture
      </footer>
    </div>
  );
}
