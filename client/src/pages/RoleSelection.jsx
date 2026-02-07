import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, HardHat, ArrowRight, Sparkles } from 'lucide-react';

export default function RoleSelection() {
    const navigate = useNavigate();

    const roles = [
        {
            id: 'citizen',
            title: 'Citizen Portal',
            description: 'Report infrastructure issues and track real-time resolution progress.',
            icon: <User size={32} />,
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10 border-indigo-500/20',
            route: '/login/citizen',
            gradient: 'from-indigo-600 to-violet-600'
        },
        {
            id: 'worker',
            title: 'Field Ops',
            description: 'Access assigned dispatch units and update protocol status.',
            icon: <HardHat size={32} />,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10 border-emerald-500/20',
            route: '/login/worker',
            gradient: 'from-emerald-600 to-teal-600'
        },
        {
            id: 'admin',
            title: 'Command Center',
            description: 'Oversee city-wide analytics, governance, and unit management.',
            icon: <ShieldCheck size={32} />,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10 border-purple-500/20',
            route: '/login/admin',
            gradient: 'from-purple-600 to-fuchsia-600'
        }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* VIBRANT BACKGROUND ELEMENTS */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-[#050b14]">
                <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-glow"></div>
                <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[100px] animate-glow" style={{ animationDelay: '3s' }}></div>
            </div>

            <div className="max-w-6xl w-full relative z-10">
                <div className="text-center mb-16 animate-float">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                        <Sparkles size={14} className="text-amber-400" />
                        <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Secure Access Gateway</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                        Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Protocol</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Choose your authorized entry point to the governance network.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                    {roles.map((role, idx) => (
                        <button
                            key={role.id}
                            onClick={() => navigate(role.route)}
                            className="group glass-card text-left p-8 h-full flex flex-col items-start relative overflow-hidden"
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            {/* Hover Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                            <div className={`w-16 h-16 ${role.bg} rounded-2xl flex items-center justify-center mb-6 border transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 relative z-10`}>
                                <div className={role.color}>
                                    {role.icon}
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold mb-3 text-white relative z-10">
                                {role.title}
                            </h3>

                            <p className="text-slate-400 leading-relaxed mb-8 flex-grow text-sm relative z-10">
                                {role.description}
                            </p>

                            <div className={`flex items-center gap-2 ${role.color} font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all relative z-10`}>
                                <span>Initialize</span>
                                <ArrowRight size={16} />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
