import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ListChecks, ArrowRight, ShieldCheck, UserCheck, Building2, Globe, Zap, Sparkles } from 'lucide-react';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* VIBRANT BACKGROUND ACCENTS */}
            <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden -z-10">
                <div className="absolute top-[-100px] left-[10%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] animate-glow"></div>
                <div className="absolute top-[100px] right-[10%] w-[400px] h-[400px] bg-pink-600/20 rounded-full blur-[100px] animate-glow" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* HERO SECTION */}
            <section className="relative pt-[var(--nav-height)] min-h-[90vh] flex items-center">
                <div className="container-custom grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-left z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
                            <Sparkles size={14} className="text-amber-400" />
                            <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Next-Gen Governance</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
                            Civic Infra <br />
                            <span className="text-gradient">Reimagined.</span>
                        </h1>

                        <p className="text-lg text-slate-400 mb-10 max-w-xl leading-relaxed">
                            A decentralized, high-integrity platform for modern cities.
                            Report issues, track resolution, and reshape your community.
                        </p>

                        <div className="flex flex-wrap items-center gap-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="btn-vibrant text-base px-8 py-4 shadow-lg shadow-indigo-500/25"
                            >
                                Launch Portal <ArrowRight size={20} />
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="btn-glass text-base px-8 py-4"
                            >
                                <UserCheck size={20} /> Member Access
                            </button>
                        </div>
                    </div>

                    {/* VIBRANT HERO GRAPHIC */}
                    <div className="relative hidden lg:block animate-float">
                        <div className="glass-card p-8 relative z-10 bg-gradient-to-br from-white/10 to-transparent">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">System Status</div>
                                        <div className="text-xs text-emerald-400 font-mono">● OPERATIONAL</div>
                                    </div>
                                </div>
                                <div className="px-3 py-1 rounded-lg bg-white/5 text-xs text-white/60">Live Feed</div>
                            </div>

                            <div className="space-y-4">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-black/20 border border-white/5">
                                        <div className={`w-2 h-12 rounded-full ${i === 0 ? 'bg-pink-500' : i === 1 ? 'bg-indigo-500' : 'bg-cyan-500'}`}></div>
                                        <div className="flex-1">
                                            <div className="h-2 w-24 bg-white/20 rounded mb-2"></div>
                                            <div className="h-1.5 w-16 bg-white/10 rounded"></div>
                                        </div>
                                        <div className="text-xs text-white/40">0{i + 1}m ago</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Decorative blobs behind card */}
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500 rounded-full blur-[40px] opacity-40"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500 rounded-full blur-[50px] opacity-40"></div>
                    </div>
                </div>
            </section>

            {/* FEATURES GRID */}
            <section className="py-24 relative">
                <div className="container-custom md:px-12">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Core <span className="text-gradient-ocean">Capabilities</span></h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Equipped with advanced tools for real-time monitoring and resolution.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: <Zap size={24} />, title: "Instant Dispatch", desc: "Automated routing to field units.", color: "text-amber-400" },
                            { icon: <Globe size={24} />, title: "Global Access", desc: "Connect from any device, anywhere.", color: "text-cyan-400" },
                            { icon: <ShieldCheck size={24} />, title: "Secure Data", desc: "End-to-end encrypted reporting.", color: "text-emerald-400" },
                            { icon: <ListChecks size={24} />, title: "Live Tracking", desc: "Real-time ticket status updates.", color: "text-pink-400" },
                            { icon: <MapPin size={24} />, title: "Geo-Tagging", desc: "Precise location pinning.", color: "text-indigo-400" },
                            { icon: <Building2 size={24} />, title: "City Insights", desc: "Data-driven urban planning.", color: "text-violet-400" }
                        ].map((item, idx) => (
                            <div key={idx} className="glass-card p-8 hover:bg-white/5 transition-colors group">
                                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${item.color} mb-6 group-hover:scale-110 transition-transform`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
