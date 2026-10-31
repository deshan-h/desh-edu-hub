import AtmosphericBackground from "@/components/cyber-tech/AtmosphericBackground";
import CyberNavbar from "@/components/cyber-tech/CyberNavbar";
import CyberHero from "@/components/cyber-tech/CyberHero";
import CyberServices from "@/components/cyber-tech/CyberServices";
import CyberAbout from "@/components/cyber-tech/CyberAbout";
import CyberFooter from "@/components/cyber-tech/CyberFooter";

export const metadata = {
  title: "DESH Digital Hub // Cyber Tech Dark Glassmorphism",
  description:
    "Next-generation distributed infrastructure tailored for high-scale computing, autonomous intelligence, and edge-native zero-trust security.",
};

export default function DeshDigitalHubPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-600 selection:text-white font-sans relative overflow-x-hidden">
      {/* Ambient Glowing Orbs & Tech Grid Overlay */}
      <AtmosphericBackground />

      {/* Sticky Floating Cyber Navbar */}
      <CyberNavbar />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* 1. Hero Section with Signature Gradients, CTA Hierarchy & News Glass Card */}
        <CyberHero />

        {/* 2. Services Grid with 3D Glowing Glass Surfaces & Nested Telemetry Items */}
        <CyberServices />

        {/* 3. Architecture & About Section with Interactive Control Shell */}
        <CyberAbout />
      </main>

      {/* Ultra-Modern Cyber Glassmorphic Footer */}
      <CyberFooter />
    </div>
  );
}

