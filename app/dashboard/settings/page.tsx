"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

const datacenterRegions = [
  { id: "us-east", name: "US-East (N. Virginia)", ping: "4ms", status: "Optimal" },
  { id: "us-west", name: "US-West (Oregon)", ping: "16ms", status: "Optimal" },
  { id: "eu-central", name: "EU-Central (Frankfurt)", ping: "12ms", status: "Optimal" },
  { id: "ap-east", name: "AP-East (Tokyo)", ping: "18ms", status: "Good" },
  { id: "sa-east", name: "SA-East (São Paulo)", ping: "32ms", status: "Good" },
];

const avatarsList = [
  "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
];

export default function SettingsPage() {
  const { user, isLoaded } = useUser();

  const [activeTab, setActiveTab] = useState<"profile" | "stream" | "accounts" | "security" | "notifications">("profile");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile Form State
  const [gamerTag, setGamerTag] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("us-east");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Stream Settings State
  const [resolution, setResolution] = useState("4K (2160p)");
  const [targetFps, setTargetFps] = useState("120 FPS");
  const [bitrate, setBitrate] = useState("75 Mbps");
  const [rayTracing, setRayTracing] = useState(true);
  const [hdr, setHdr] = useState(true);
  const [audioProfile, setAudioProfile] = useState("7.1 Spatial Surround");

  // Linked Accounts State
  const [linkedAccounts, setLinkedAccounts] = useState({
    steam: { connected: true, username: "CyberGamerX_Steam" },
    epic: { connected: true, username: "NimbusGamer_Epic" },
    xbox: { connected: false, username: "" },
    gog: { connected: true, username: "GamerPro_GOG" },
    twitch: { connected: false, username: "" },
    discord: { connected: true, username: "Gamer#1337" },
  });

  // Security State
  const [twoFactor, setTwoFactor] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Notifications State
  const [notifs, setNotifs] = useState({
    storeSales: true,
    maintenanceAlerts: true,
    friendRequests: true,
    gameUpdates: false,
    emailNewsletter: true,
  });

  useEffect(() => {
    if (isLoaded && user) {
      setGamerTag(user.username || user.firstName || "CloudGamer99");
      setFullName(`${user.firstName || ""} ${user.lastName || ""}`.trim() || "Pro Gamer");
      setEmail(user.primaryEmailAddress?.emailAddress || "gamer@nimbus.cloud");
      setAvatarUrl(user.imageUrl || avatarsList[0]);
      setBio("Hardcore cloud gamer conquering 4K ray-traced realms without local GPU bottlenecks.");
    }
  }, [isLoaded, user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Profile settings saved successfully!");
  };

  const toggleAccount = (key: keyof typeof linkedAccounts) => {
    setLinkedAccounts((prev) => {
      const isConn = prev[key].connected;
      const updated = {
        ...prev[key],
        connected: !isConn,
        username: !isConn ? `${gamerTag}_${key.toUpperCase()}` : "",
      };
      showToast(`${key.toUpperCase()} account ${!isConn ? "connected" : "disconnected"}.`);
      return { ...prev, [key]: updated };
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-dash-ink text-white font-mono text-xs font-bold px-5 py-3 rounded-xl shadow-sm flex items-center gap-2 animate-bounce">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/10 pb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-dash-ink">
            Account & Rig Settings
          </h1>
          <p className="text-dash-muted text-sm font-mono mt-1">
            Customize your gamer profile, WebRTC streaming quality, linked stores, and cloud hardware preferences.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-dash-muted bg-white p-2 rounded-xl border border-black/10">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Profile Status: <strong className="text-dash-ink">Synced & Verified</strong></span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-black/10 pb-3">
        {[
          { id: "profile", label: "🎮 Profile & Identity", badge: null },
          { id: "stream", label: "⚡ Streaming & Performance", badge: "4K 120FPS" },
          { id: "accounts", label: "🔗 Linked Stores", badge: "3 Active" },
          { id: "security", label: "🔒 Security & 2FA", badge: null },
          { id: "notifications", label: "🔔 Notifications", badge: null },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === tab.id
                ? "bg-dash-ink text-white font-bold shadow-sm"
                : "bg-dash-subtle text-dash-muted hover:text-dash-ink hover:bg-dash-subtle border border-black/10"
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-dash-subtle text-dash-ink"}`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 1: PROFILE & IDENTITY */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="space-y-8">
          {/* Avatar Section */}
          <div className="rounded-2xl bg-white border border-black/10 p-6 space-y-6">
            <h2 className="text-lg font-display font-bold text-dash-ink flex items-center gap-2">
              <span>Avatar & Gamer Avatar</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt="User Avatar"
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-dash-ink/30 shadow-sm"
                />
                <span className="absolute -bottom-1 -right-1 bg-dash-ink text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                  PRO
                </span>
              </div>
              <div className="space-y-3 text-center sm:text-left flex-1">
                <span className="text-xs font-mono text-dash-muted block">
                  Select a pre-made gaming avatar or enter a custom image URL below:
                </span>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                  {avatarsList.map((img, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setAvatarUrl(img)}
                      className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        avatarUrl === img ? "border-dash-ink scale-110 shadow-sm" : "border-black/10 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`Avatar option ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Custom image URL (https://...)"
                  className="w-full bg-dash-subtle border border-black/10 rounded-lg px-3 py-2 text-xs font-mono text-dash-ink placeholder:text-dash-muted focus:border-dash-ink focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* User Info Fields */}
          <div className="rounded-2xl bg-white border border-black/10 p-6 space-y-6">
            <h2 className="text-lg font-display font-bold text-dash-ink">Personal Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-dash-muted uppercase">GamerTag / Username</label>
                <input
                  type="text"
                  value={gamerTag}
                  onChange={(e) => setGamerTag(e.target.value)}
                  className="w-full bg-dash-subtle border border-black/10 rounded-lg px-4 py-2.5 text-xs font-mono text-dash-ink focus:border-dash-ink focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-dash-muted uppercase">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-dash-subtle border border-black/10 rounded-lg px-4 py-2.5 text-xs font-mono text-dash-ink focus:border-dash-ink focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-dash-muted uppercase">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dash-subtle border border-black/10 rounded-lg px-4 py-2.5 text-xs font-mono text-dash-ink focus:border-dash-ink focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-dash-muted uppercase">Primary Datacenter Region</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full bg-dash-subtle border border-black/10 rounded-lg px-4 py-2.5 text-xs font-mono text-dash-ink focus:border-dash-ink focus:outline-none cursor-pointer"
                >
                  {datacenterRegions.map((region) => (
                    <option key={region.id} value={region.id} className="bg-white text-dash-ink">
                      {region.name} ({region.ping}) - {region.status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-dash-muted uppercase">Gamer Bio / Quote</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-dash-subtle border border-black/10 rounded-lg p-4 text-xs font-mono text-dash-ink focus:border-dash-ink focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-dash-ink text-white font-mono font-bold text-xs shadow-sm hover:opacity-90 transition-all cursor-pointer"
            >
              SAVE PROFILE CHANGES
            </button>
          </div>
        </form>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: STREAMING & PERFORMANCE */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "stream" && (
        <div className="space-y-8">
          <div className="rounded-2xl bg-white border border-black/10 p-6 space-y-6">
            <div>
              <h2 className="text-lg font-display font-bold text-dash-ink">
                WebRTC Stream Quality & GPU Hardware
              </h2>
              <p className="text-xs font-mono text-dash-muted mt-1">
                Configure your cloud rig rendering targets and streaming protocol parameters.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Resolution */}
              <div className="p-4 rounded-xl bg-dash-subtle border border-black/10 space-y-3">
                <label className="text-xs font-mono text-dash-muted uppercase block">Target Resolution</label>
                {["4K (2160p)", "1440p Quad HD", "1080p Full HD"].map((res) => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => {
                      setResolution(res);
                      showToast(`Target resolution set to ${res}`);
                    }}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-mono text-left transition-all cursor-pointer ${
                      resolution === res
                        ? "bg-dash-ink border border-dash-ink text-white font-bold"
                        : "bg-dash-subtle border border-black/10 text-dash-muted hover:text-dash-ink"
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>

              {/* Target FPS */}
              <div className="p-4 rounded-xl bg-dash-subtle border border-black/10 space-y-3">
                <label className="text-xs font-mono text-dash-muted uppercase block">Target Frame Rate</label>
                {["240 FPS (Esports)", "120 FPS (Ultra)", "60 FPS (Balanced)"].map((fps) => (
                  <button
                    key={fps}
                    type="button"
                    onClick={() => {
                      setTargetFps(fps);
                      showToast(`Frame rate target set to ${fps}`);
                    }}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-mono text-left transition-all cursor-pointer ${
                      targetFps === fps
                        ? "bg-dash-ink border border-dash-ink text-white font-bold"
                        : "bg-dash-subtle border border-black/10 text-dash-muted hover:text-dash-ink"
                    }`}
                  >
                    {fps}
                  </button>
                ))}
              </div>

              {/* Bitrate */}
              <div className="p-4 rounded-xl bg-dash-subtle border border-black/10 space-y-3">
                <label className="text-xs font-mono text-dash-muted uppercase block">Max Stream Bitrate</label>
                {["100 Mbps (Ludicrous)", "75 Mbps (High)", "50 Mbps (Standard)"].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      setBitrate(b);
                      showToast(`Bitrate set to ${b}`);
                    }}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-mono text-left transition-all cursor-pointer ${
                      bitrate === b
                        ? "bg-dash-ink border border-dash-ink text-white font-bold"
                        : "bg-dash-subtle border border-black/10 text-dash-muted hover:text-dash-ink"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Hardware Toggles */}
            <div className="space-y-4 pt-4 border-t border-black/10">
              <div className="flex items-center justify-between p-4 rounded-xl bg-dash-subtle border border-black/10">
                <div>
                  <h3 className="font-display font-semibold text-dash-ink text-sm">
                    Ray Tracing Hardware Acceleration
                  </h3>
                  <p className="text-xs font-mono text-dash-muted">
                    Enable RTX Path Tracing and DLSS 3.5 Frame Generation on RTX 4090 Cloud Nodes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setRayTracing(!rayTracing);
                    showToast(`Ray Tracing ${!rayTracing ? "enabled" : "disabled"}`);
                  }}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    rayTracing ? "bg-dash-ink" : "bg-black/15"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${rayTracing ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-dash-subtle border border-black/10">
                <div>
                  <h3 className="font-display font-semibold text-dash-ink text-sm">
                    HDR 10-Bit Color Depth
                  </h3>
                  <p className="text-xs font-mono text-dash-muted">
                    Stream High Dynamic Range video color directly to compatible displays.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setHdr(!hdr);
                    showToast(`HDR 10-Bit ${!hdr ? "enabled" : "disabled"}`);
                  }}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    hdr ? "bg-dash-ink" : "bg-black/15"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${hdr ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 3: LINKED STORES */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "accounts" && (
        <div className="rounded-2xl bg-white border border-black/10 p-6 space-y-6">
          <div>
            <h2 className="text-lg font-display font-bold text-dash-ink">
              Linked Gaming Accounts & Libraries
            </h2>
            <p className="text-xs font-mono text-dash-muted mt-1">
              Connect your external digital store accounts to auto-sync games to your Nimbus Cloud PC.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(linkedAccounts).map(([key, data]) => {
              const platformName = key.toUpperCase();
              return (
                <div key={key} className="p-4 rounded-xl bg-dash-subtle border border-black/10 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-dash-ink text-sm">{platformName}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${data.connected ? "bg-emerald-400/20 text-emerald-600 border border-emerald-400/40" : "bg-white text-dash-muted"}`}>
                        {data.connected ? "CONNECTED" : "NOT LINKED"}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-dash-muted">
                      {data.connected ? `Linked as: ${data.username}` : "Sync cloud games & saves"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleAccount(key as any)}
                    className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                      data.connected
                        ? "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-dash-ink"
                        : "bg-dash-ink/5 text-dash-ink border border-dash-ink/25 hover:bg-dash-ink hover:text-white"
                    }`}
                  >
                    {data.connected ? "Disconnect" : "Connect"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 4: SECURITY & PRIVACY */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white border border-black/10 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-display font-bold text-dash-ink">Two-Factor Authentication (2FA)</h2>
                <p className="text-xs font-mono text-dash-muted mt-1">
                  Protect your cloud rig and purchases with authenticator apps.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTwoFactor(!twoFactor);
                  showToast(`2FA Security ${!twoFactor ? "Enabled" : "Disabled"}`);
                }}
                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  twoFactor ? "bg-dash-ink" : "bg-black/15"
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${twoFactor ? "translate-x-6" : "translate-x-0"}`} />
              </button>
            </div>

            <div className="pt-6 border-t border-black/10 space-y-4">
              <h3 className="font-display font-semibold text-dash-ink text-sm">Active Cloud Sessions</h3>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-dash-subtle border border-black/10 flex justify-between items-center text-xs font-mono">
                  <div>
                    <span className="text-dash-ink font-bold block">Windows 11 Cloud PC - RTX 4090 Rig</span>
                    <span className="text-dash-muted">US-East Node • Active Stream</span>
                  </div>
                  <span className="text-emerald-600 font-bold">CURRENT SESSION</span>
                </div>
                <div className="p-3.5 rounded-xl bg-dash-subtle border border-black/10 flex justify-between items-center text-xs font-mono">
                  <div>
                    <span className="text-dash-ink font-bold block">Chrome Browser - Dashboard</span>
                    <span className="text-dash-muted">IP 192.168.1.100 • 5 mins ago</span>
                  </div>
                  <button
                    onClick={() => showToast("Session revoked.")}
                    className="text-red-400 hover:underline cursor-pointer"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 5: NOTIFICATIONS */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "notifications" && (
        <div className="rounded-2xl bg-white border border-black/10 p-6 space-y-6">
          <div>
            <h2 className="text-lg font-display font-bold text-dash-ink">Gamer Notification Preferences</h2>
            <p className="text-xs font-mono text-dash-muted mt-1">
              Choose which game events and system alerts trigger notifications.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { id: "storeSales", title: "Game Store Discounts & Flash Sales", desc: "Get notified when items on your Wishlist go on sale." },
              { id: "maintenanceAlerts", title: "Cloud Node Maintenance Alerts", desc: "Receive advance notice when your datacenter region undergoes scheduled maintenance." },
              { id: "friendRequests", title: "Friend Requests & Multiplayer Invites", desc: "Notifications for coop invites and friend activity." },
              { id: "gameUpdates", title: "Cloud PC Game Pre-Load Updates", desc: "Alerts when game updates finish downloading on your virtual PC." },
            ].map((item) => {
              const enabled = (notifs as any)[item.id];
              return (
                <div key={item.id} className="p-4 rounded-xl bg-dash-subtle border border-black/10 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-semibold text-dash-ink text-sm">{item.title}</h3>
                    <p className="text-xs font-mono text-dash-muted">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNotifs((prev) => ({ ...prev, [item.id]: !enabled }));
                      showToast(`Preference updated.`);
                    }}
                    className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                      enabled ? "bg-dash-ink" : "bg-black/15"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${enabled ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
