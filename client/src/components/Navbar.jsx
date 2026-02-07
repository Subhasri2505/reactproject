import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Globe, ShieldCheck, LogOut, User } from 'lucide-react';

export default function Navbar() {
    const location = useLocation();

    // User Session Management
    const userString = localStorage.getItem('user');
    let user = null;
    try {
        user = userString ? JSON.parse(userString) : null;
    } catch (e) {
        console.error("Error parsing user data:", e);
        localStorage.removeItem('user');
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-[#050b14]/80 backdrop-blur-xl transition-all duration-300">
            <nav className="container-custom h-[var(--nav-height)] flex items-center justify-between">
                {/* Brand Identity */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                        <Globe size={20} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-tight text-white leading-none">
                            City<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Fix</span>
                        </span>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mt-1">
                            Governance Platform
                        </span>
                    </div>
                </Link>

                {/* Navigation & Actions */}
                <div className="flex items-center gap-6">
                    {user ? (
                        <div className="flex items-center gap-6">
                            {/* Dashboard Link based on Role */}
                            {user.role === 'admin' ? (
                                <Link to="/admin/dashboard" className="btn-glass text-xs uppercase tracking-wider py-2 px-4 h-auto border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
                                    <LayoutDashboard size={14} /> Admin Node
                                </Link>
                            ) : user.role === 'worker' ? (
                                <Link to="/worker" className="btn-glass text-xs uppercase tracking-wider py-2 px-4 h-auto border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10">
                                    <LayoutDashboard size={14} /> Field Ops
                                </Link>
                            ) : (
                                <Link to="/report" className="btn-vibrant text-xs uppercase tracking-wider py-2 px-4 shadow-none">
                                    Report Issue
                                </Link>
                            )}

                            <div className="h-8 w-px bg-white/10 mx-2"></div>

                            {/* User Profile */}
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-bold text-white leading-none mb-1">{user.name}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{user.role}</p>
                                </div>
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center text-indigo-300">
                                    <User size={16} />
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="btn-vibrant text-xs font-bold uppercase tracking-wider py-2.5 px-5">
                                Sign In
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}
