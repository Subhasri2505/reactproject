import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, AlertCircle, CheckCircle, Settings, Home, ShieldCheck, Sparkles, LogOut } from 'lucide-react';

export default function Sidebar({ role }) {
    const location = useLocation();

    const links = role === 'admin' ? [
        { name: 'Overview', path: '/admin', icon: LayoutDashboard },
        { name: 'All Issues', path: '/admin/issues', icon: AlertCircle },
        { name: 'Analytics', path: '/admin/analytics', icon: Home },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ] : [
        { name: 'My Tasks', path: '/worker', icon: CheckCircle },
        { name: 'Map View', path: '/worker/map', icon: Home },
    ];

    return (
        <aside className="sidebar-vibrant">
            <div className="mb-12 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 border border-white/10 shadow-2xl relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <ShieldCheck size={28} className="relative z-10" />
                </div>
                <div>
                    <h2 className="text-white font-black tracking-tight leading-none text-xl">
                        CityFix<span className="text-indigo-400">360</span>
                    </h2>
                    <div className="flex items-center gap-1 mt-1">
                        <Sparkles size={10} className="text-amber-400" />
                        <span className="text-white/30 text-[9px] uppercase font-black tracking-[0.2em]">{role} portal</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 space-y-3">
                {links.map((link) => {
                    const Icon = link.icon;
                    const active = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`nav-item ${active ? 'active' : ''} group`}
                        >
                            <div className={`p-2 rounded-lg transition-all ${active ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-white/5 group-hover:bg-white/10'}`}>
                                <Icon size={18} />
                            </div>
                            <span className="tracking-wide">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-8 border-t border-white/5">
                <Link to="/" className="nav-item group opacity-60 hover:opacity-100 transition-opacity">
                    <div className="p-2 rounded-lg bg-white/5 group-hover:bg-red-500/20 group-hover:text-red-400 transition-all">
                        <LogOut size={18} />
                    </div>
                    <span className="font-bold">Logout</span>
                </Link>
            </div>
        </aside>
    );
}

