"use client";

import { UserProfile, useClerk, useUser } from "@clerk/nextjs";
import {
  User,
  Zap,
  LogOut,
  Shield,
  LayoutDashboard,
  ArrowLeft,
  CreditCard,
  Download,
  HardDrive,
  Clock,
  History,
  Activity,
  X,
} from "lucide-react";
import { CyberLoader } from "./../../components/shared/CyberLoader";
import { useCarbon } from "../../context/CarbonContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TelegramConnect } from "@/app/components/dashboard/TelegramConnect";

interface BillingRecord {
  date: string;
  amount: number;
  status: string;
  invoiceId: string;
  plan: string;
}

interface UserData {
  plan: "free" | "pro";
  credits: number;
  trialStatus: "available" | "active" | "expired";
  trialEndsAt?: string;
  billingHistory: BillingRecord[];
  isLoading: boolean;
  isTelegramConnected: boolean;
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"app" | "clerk">("app");
  const { isCarbonMode, toggleCarbonMode } = useCarbon();
  const [dbUser, setDbUser] = useState<UserData>({
    plan: "free",
    credits: 0,
    trialStatus: "available",
    billingHistory: [],
    isLoading: true,
    isTelegramConnected: false,
  });

  const [showUsageModal, setShowUsageModal] = useState(false);
  const [usageLogs, setUsageLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    if (user) {
      fetch("/api/user/profile")
        .then((res) => res.json())
        .then((data) => {
          setDbUser({
            plan: data.plan,
            credits: data.credits,
            trialStatus: data.trialStatus, // This needs to be 'available' for the banner to show
            trialEndsAt: data.trialEndsAt,
            billingHistory: data.billingHistory,
            isTelegramConnected: data.isTelegramConnected, // <--- Map from API
            isLoading: false,
            // isLoading: false
          });
        })
        .catch((err) => {
          console.error("Failed to load profile:", err);
          setDbUser((prev) => ({ ...prev, isLoading: false }));
        });
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const handleSubscription = () => {
    alert("Redirecting to Stripe Payment Gateway...");
  };

  const fetchUsageLogs = async () => {
    setLoadingLogs(true);
    setShowUsageModal(true);
    try {
      const res = await fetch("/api/user/usage");
      const data = await res.json();
      setUsageLogs(data.logs || []);
    } catch (e) {
      console.error("Failed to fetch logs");
    } finally {
      setLoadingLogs(false);
    }
  };

  if (!isLoaded || dbUser.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1120]">
        <CyberLoader text="SYNCING PROFILE..." />
      </div>
    );
  }

  const isPro = dbUser.plan === "pro";
  const isTrial = dbUser.trialStatus === "active";
  const hasAccess = isPro || isTrial;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 min-h-screen pb-24 font-sans">
      {/* HEADER AREA */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-2">
        <div className="flex items-center gap-4 self-start md:self-auto">
          <Link
            href="/dashboard"
            className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors border border-slate-700"
          >
            <ArrowLeft size={20} className="text-slate-300" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">My Profile</h1>
            <p className="text-slate-400">
              Manage your NetPulse account and settings.
            </p>
          </div>
        </div>

        {/* TOGGLE SWITCH */}
        <div className="bg-[#0f1623] p-1 rounded-lg border border-slate-800 flex shadow-lg">
          <button
            onClick={() => setActiveTab("app")}
            className={`flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-md text-sm font-bold transition-all ${
              activeTab === "app"
                ? "bg-slate-800 text-cyan-400 shadow-md border border-slate-700"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <LayoutDashboard size={16} />{" "}
            <span className="hidden md:inline">NetPulse Profile</span>
          </button>
          <button
            onClick={() => setActiveTab("clerk")}
            className={`flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-md text-sm font-bold transition-all ${
              activeTab === "clerk"
                ? "bg-slate-800 text-cyan-400 shadow-md border border-slate-700"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Shield size={16} />{" "}
            <span className="hidden md:inline">Security & Account</span>
          </button>
        </div>
      </div>

      {/* --- TAB 1: NETPULSE APP PROFILE --- */}
      {activeTab === "app" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          {/* Identity Card */}
          <div className="bg-[#151e32] p-6 md:p-8 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-xl">
            <div
              className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none ${
                isPro ? "bg-amber-500/10" : "bg-cyan-500/5"
              }`}
            ></div>

            <div
              className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-4 p-1 shrink-0 ${
                isPro
                  ? "border-amber-500/50 bg-amber-500/10"
                  : "border-slate-800 bg-gradient-to-br from-cyan-500 to-blue-600"
              }`}
            >
              <img
                src={user?.imageUrl}
                alt="Profile"
                className="w-full h-full rounded-full object-cover bg-slate-900"
              />
            </div>

            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 flex items-center justify-center md:justify-start gap-2">
                {user?.fullName}
              </h2>
              <p className="text-slate-400 font-mono text-sm mb-4">
                {user?.primaryEmailAddress?.emailAddress}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span
                  className={`px-3 py-1 border rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                    isPro
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                >
                  {isPro ? (
                    <Zap size={12} fill="currentColor" />
                  ) : (
                    <User size={12} />
                  )}
                  {isPro
                    ? isTrial
                      ? "Pro Trial Active"
                      : "Pro Plan Active"
                    : "Free Tier"}
                </span>

                {isTrial && dbUser.trialEndsAt && (
                  <span className="px-3 py-1 border border-amber-500/20 bg-amber-900/20 text-amber-400 rounded-full text-xs font-bold flex items-center gap-2">
                    <Clock size={12} />
                    Exp: {new Date(dbUser.trialEndsAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-bold transition-all shrink-0"
            >
              <LogOut size={18} /> Log Out
            </button>
          </div>

          {/* --- INSERTED TRIAL CTA BANNER HERE --- */}
          {(!dbUser.trialStatus || dbUser.trialStatus === "available") &&
            !isPro && (
              <div className="bg-gradient-to-r from-indigo-900 to-slate-900 border border-indigo-500/30 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between shadow-lg animate-in fade-in slide-in-from-bottom-4 gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Zap
                      size={20}
                      className="text-indigo-400"
                      fill="currentColor"
                    />{" "}
                    Unlock Pro Power for 24 Hours
                  </h3>
                  <p className="text-indigo-200 text-sm max-w-lg">
                    Experience unlimited history, AI threat detection, and
                    Carbon Mode completely free. No credit card required.
                  </p>
                </div>

                <button
                  onClick={async () => {
                    const res = await fetch("/api/user/trial", {
                      method: "POST",
                    });
                    if (res.ok) window.location.reload();
                  }}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-indigo-500/50 flex items-center gap-2 shrink-0"
                >
                  Start Free Trial
                </button>
              </div>
            )}

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {/* LEFT COLUMN: Stats & Billing */}
            <div className="space-y-6">
              {/* Credits Card with History Button */}
              <div className="bg-[#151e32] p-6 rounded-xl border border-slate-800 shadow-lg relative group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-slate-400 text-xs font-bold uppercase flex items-center gap-2">
                    <Zap size={14} className="text-amber-400" /> Remaining
                    Credits
                  </h3>
                  <button
                    onClick={fetchUsageLogs}
                    className="text-xs text-cyan-400 hover:text-white flex items-center gap-1 transition-colors bg-slate-800 px-2 py-1 rounded"
                  >
                    <History size={12} /> History
                  </button>
                </div>

                <div className="text-3xl font-bold text-white mb-3">
                  {dbUser.credits}
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full ${
                      dbUser.credits < 20
                        ? "bg-red-500"
                        : "bg-gradient-to-r from-amber-400 to-orange-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        (dbUser.credits / (isPro ? 5000 : 100)) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-500">
                  {isPro ? "Monthly reset cycle" : "Daily reset cycle (24h)"}
                </p>
              </div>

              {/* Carbon Mode Toggle */}
              <div
                className={`flex items-center justify-between p-4 gap-4 rounded-lg border transition-all duration-500 ${
                  isCarbonMode
                    ? "bg-green-900/20 border-green-500/50"
                    : "bg-slate-900/50 border-slate-800"
                }`}
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-2 flex-wrap">
                    Carbon Mode
                    {isCarbonMode && (
                      <span className="text-[10px] bg-green-500 text-black px-2 py-0.5 rounded font-bold animate-pulse">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {isCarbonMode
                      ? "System optimized. Energy saving active."
                      : "Reduce animation & CPU usage."}
                  </div>
                </div>

                <button
                  onClick={toggleCarbonMode}
                  className={`w-12 h-6 rounded-full p-1 shrink-0 transition-all duration-300 ${
                    isCarbonMode ? "bg-green-500" : "bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${
                      isCarbonMode ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </div>

              {/* BILLING SECTION */}
              <div className="bg-[#151e32] rounded-xl border border-slate-800 overflow-hidden shadow-lg">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="text-slate-200 font-bold flex items-center gap-2">
                    <CreditCard size={18} className="text-cyan-400" /> Billing
                  </h3>
                  {!isPro && (
                    <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">
                      Free Plan
                    </span>
                  )}
                </div>

                {/* Upgrade CTA */}
                {!isPro && (
                  <div className="p-6 bg-cyan-900/10 border-b border-slate-800">
                    <p className="text-sm text-slate-300 mb-4">
                      Upgrade to Pro for unlimited history and AI features.
                    </p>
                    <button
                      onClick={handleSubscription}
                      className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition-colors shadow-lg shadow-cyan-500/20"
                    >
                      Upgrade to Pro - $19/mo
                    </button>
                  </div>
                )}

                {/* Billing History Table */}
                <div className="p-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">
                    Recent Invoices
                  </h4>
                  <div className="space-y-3">
                    {dbUser.billingHistory.length > 0 ? (
                      dbUser.billingHistory.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-sm p-2 hover:bg-slate-900/50 rounded transition-colors cursor-pointer"
                        >
                          <div>
                            <div className="text-slate-200 font-medium">
                              {new Date(item.date).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-slate-500">
                              {item.invoiceId}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-bold">
                              ${item.amount}
                            </div>
                            <div className="text-xs text-green-400 uppercase">
                              {item.status}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-slate-600 text-xs py-2 italic">
                        No invoices found.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Actions & Timeline */}
            <div className="md:col-span-2 space-y-6">
              {/* NEW: TELEGRAM WIDGET */}
              <TelegramConnect
                isPro={hasAccess}
                isConnected={dbUser.isTelegramConnected} // <--- Pass it down
              />

              {/* DATA MANAGEMENT ACTIONS */}
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-[#151e32] border border-slate-800 rounded-xl flex flex-col items-center gap-3 hover:border-cyan-500/50 hover:bg-slate-900/50 transition-all group shadow-lg">
                  <div className="p-3 bg-slate-800 rounded-full text-cyan-400 group-hover:scale-110 transition-transform">
                    <Download size={20} />
                  </div>
                  <span className="text-sm font-bold text-slate-300">
                    Download Data Report
                  </span>
                </button>

                <button className="p-4 bg-[#151e32] border border-slate-800 rounded-xl flex flex-col items-center gap-3 hover:border-cyan-500/50 hover:bg-slate-900/50 transition-all group shadow-lg">
                  <div className="p-3 bg-slate-800 rounded-full text-purple-400 group-hover:scale-110 transition-transform">
                    <HardDrive size={20} />
                  </div>
                  <span className="text-sm font-bold text-slate-300">
                    Manage Log Storage
                  </span>
                </button>
              </div>

              {/* Timeline (Placeholder style) */}
              <div className="bg-[#151e32] rounded-xl border border-slate-800 p-6 shadow-xl h-[300px] flex flex-col justify-center items-center text-center">
                <h3 className="text-lg font-bold text-white mb-2">
                  Recent Activity
                </h3>
                <p className="text-slate-500 text-sm max-w-sm">
                  Activity timeline will appear here once your agents start
                  reporting metrics. Connect an agent to see data.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: CLERK SECURITY SETTINGS --- */}
      {activeTab === "clerk" && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex justify-center">
          <div className="w-full max-w-[800px] rounded-2xl shadow-2xl border border-slate-800 overflow-hidden overflow-x-auto bg-[#151e32]">
            <div className="min-w-[350px]">
              <UserProfile
                routing="hash"
                appearance={{
                  variables: {
                    colorPrimary: "#06b6d4",
                    colorBackground: "#151e32",
                    colorText: "white",
                    colorTextSecondary: "#94a3b8",
                    colorInputBackground: "#0f172a",
                    colorInputText: "white",
                    borderRadius: "0.75rem",
                  },
                  elements: {
                    card: "shadow-none border-0",
                    navbar: "hidden md:flex",
                    headerTitle: "text-white",
                    headerSubtitle: "text-slate-500",
                    main: "gap-4",
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* --- HISTORY MODAL --- */}
      {showUsageModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#151e32] w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Activity size={18} className="text-cyan-400" /> Credit Usage
                History
              </h3>
              <button
                onClick={() => setShowUsageModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-4 space-y-2">
              {loadingLogs ? (
                <div className="text-center py-8 text-slate-500">
                  Loading records...
                </div>
              ) : usageLogs.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No usage recorded yet.
                </div>
              ) : (
                usageLogs.map((log: any) => (
                  <div
                    key={log._id}
                    className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg border border-slate-800/50 hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <div className="text-sm text-white font-medium flex items-center gap-2">
                        {log.feature === "AI_RESPONSE"
                          ? "🤖 NetBot AI Chat"
                          : log.feature}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-red-400 font-mono text-xs font-bold bg-red-900/20 px-2 py-1 rounded">
                      -{log.cost} Credit
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
