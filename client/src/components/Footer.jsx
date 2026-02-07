import React from 'react';
import { Heart, Github, Twitter, Linkedin, LayoutDashboard, GraduationCap, MapPin, Phone, Info, Globe, Activity, Zap } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative bg-slate-950 text-white pt-32 pb-16 overflow-hidden border-t border-white/5">
            {/* Background Glow */}
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-20">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg">
                                <Globe className="text-white" size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white tracking-tighter leading-none italic uppercase">
                                    City<span className="text-vibrant-gradient">Fix</span>
                                </h3>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2 opacity-70">Official Governance System</p>
                            </div>
                        </div>
                        <p className="text-slate-400 mb-10 max-w-sm leading-relaxed text-sm font-bold uppercase tracking-wider opacity-60">
                            Reimagining civic infrastructure through high-integrity data protocols and community-driven resolution cycles.
                        </p>
                        <div className="flex gap-4">
                            {[Linkedin, Twitter, Github].map((Icon, i) => (
                                <a key={i} href="#" className="h-12 w-12 flex items-center justify-center bg-white/5 border border-white/5 rounded-2xl hover:bg-white hover:text-slate-900 transition-all text-slate-400 group">
                                    <Icon size={20} className="group-hover:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white text-[10px] font-black uppercase tracking-[0.3em] mb-10">Interface Nodes</h4>
                        <ul className="space-y-5 text-[11px] font-black uppercase tracking-widest text-slate-500">
                            <li><a href="/" className="hover:text-indigo-400 transition-colors">Global Matrix</a></li>
                            <li><a href="/report" className="hover:text-indigo-400 transition-colors text-indigo-400">Dispatch Report</a></li>
                            <li><a href="/admin/dashboard" className="hover:text-indigo-400 transition-colors">Admin Console</a></li>
                            <li><a href="/worker" className="hover:text-indigo-400 transition-colors">Worker Terminal</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white text-[10px] font-black uppercase tracking-[0.3em] mb-10">Support Uplink</h4>
                        <ul className="space-y-6 text-[11px] font-black uppercase tracking-widest text-slate-500">
                            <li className="flex items-start gap-4">
                                <MapPin size={18} className="text-indigo-500 shrink-0" />
                                <span className="leading-relaxed">Sector 7 Central Hub<br />Digital District Node 01</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <Phone size={18} className="text-indigo-500" />
                                <span>+1 (800) MATRIX-FIX</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <Activity size={18} className="text-indigo-500" />
                                <span>SYSTEM_READY: 99.9%</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
                        © 2026 CITYFIX PROTOCOL. ALL RIGHTS RESERVED. SECURE_OS_ENCRYPTED.
                    </p>
                    <div className="flex gap-10 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Security</a>
                        <a href="#" className="hover:text-white transition-colors">Access</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
