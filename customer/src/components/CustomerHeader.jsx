import React from "react";
import { useSocket } from "../context/SocketContext";
import { ExternalLink, Volume2, VolumeX } from "lucide-react";

export default function CustomerHeader({ isMuted, setIsMuted }) {
  const { isConnected } = useSocket();

  return (
    <header className="bg-white border-b-2 border-black sticky top-0 z-40 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand Header */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-full border-2 border-black bg-sky-200 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs">
            SB
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-extrabold text-slate-900 leading-none">
                Customer Storefront Board
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-950 rounded-full border-2 border-black">
                Live Display
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Live pickup status display board
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          
          {/* Link to Kitchen Portal */}
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-900 border-2 border-black text-xs font-extrabold shadow-xs transition-all"
          >
            <span>Kitchen Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-900" />
          </a>

          {/* Audio Chime Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? "Unmute READY Chime" : "Mute READY Chime"}
            className={`p-2 rounded-full border-2 border-black text-xs font-black transition-all shadow-xs ${
              isMuted
                ? "bg-white text-slate-400 hover:text-slate-900"
                : "bg-emerald-100 text-emerald-950"
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
          </button>

          {/* Connection Indicator */}
          <div
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-black border-2 border-black ${
              isConnected
                ? "bg-emerald-100 text-emerald-950"
                : "bg-rose-100 text-rose-950"
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full border border-black ${
                isConnected ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
              }`}
            ></span>
            <span>{isConnected ? "Connected" : "Offline"}</span>
          </div>

        </div>

      </div>
    </header>
  );
}
