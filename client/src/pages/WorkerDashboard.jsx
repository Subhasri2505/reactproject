import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, MapPin, Clock, Activity, ShieldCheck, ArrowUpRight, Zap } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function WorkerDashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;

            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/issues`);
            // Filter for tasks assigned to this worker and not resolved
            const myTasks = res.data.filter(i =>
                i.assignedTo === user?.email &&
                i.status !== 'Resolved'
            );
            setTasks(myTasks);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const updateStatus = async (id, newStatus) => {
        const confirmMsg = newStatus === 'Resolved' ? 'Mark this issue as Resolved?' : `Set status to ${newStatus}?`;
        if (!window.confirm(confirmMsg)) return;
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/api/issues/${id}/status`, { status: newStatus });
            fetchTasks(); // Refresh
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex bg-[#050b14] min-h-screen relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/10 blur-[120px] rounded-full -z-10 animate-glow"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[120px] rounded-full -z-10 animate-glow" style={{ animationDelay: '2s' }}></div>

            <Sidebar role="worker" />

            <div className="flex-1 p-8 md:p-12 overflow-y-auto relative z-10 w-full">
                <div className="max-w-7xl mx-auto space-y-12 animate-fade-in">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20 flex items-center gap-2">
                                    <Activity size={12} className="animate-pulse" />
                                    Operational Status: Active
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Field <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Operations</span></h1>
                            <p className="text-slate-400 font-bold mt-4 uppercase tracking-widest text-[11px]">Assigned Mission Logs & Service Requests</p>
                        </div>
                        <div className="glass-card px-8 py-5 flex items-center gap-6 border-emerald-500/20">
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Queue Status</p>
                                <p className="text-2xl font-bold text-white">{tasks.length} Requests</p>
                            </div>
                            <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                                <Zap size={24} />
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="glass-card h-80 animate-pulse bg-white/5 border-white/5"></div>
                            ))}
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="glass-card text-center py-32 border-white/5 max-w-2xl mx-auto">
                            <div className="bg-emerald-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                                <CheckCircle size={48} className="text-emerald-400" />
                            </div>
                            <h2 className="text-4xl font-bold text-white mb-4">Clean Matrix</h2>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs max-w-xs mx-auto">All assigned civic protocols have been executed successfully.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {tasks.map((task, idx) => (
                                <div key={task._id} className="group glass-card border-white/5 hover:border-emerald-500/30 transition-all duration-500 hover:scale-[1.02] flex flex-col relative overflow-hidden" style={{ animationDelay: `${idx * 150}ms` }}>

                                    {/* Task Status Indicator */}
                                    <div className="absolute top-6 right-6 z-20">
                                        <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-slate-300 text-[9px] font-bold rounded-full uppercase tracking-widest border border-white/10">{task.type}</span>
                                    </div>

                                    {/* Task Image */}
                                    <div className="relative h-56 shrink-0 overflow-hidden bg-slate-900">
                                        {task.imageUrl ? (
                                            <img src={`${import.meta.env.VITE_API_URL}${task.imageUrl}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" alt="Issue" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-700 bg-white/5">
                                                <MapPin size={48} className="opacity-20 translate-y-2" />
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0f172a] to-transparent"></div>
                                    </div>

                                    <div className="p-8 flex-1 flex flex-col">
                                        <div className="mb-6 flex-1">
                                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <Clock size={12} />
                                                Logged {new Date(task.createdAt).toLocaleDateString()}
                                            </p>
                                            <h3 className="text-xl font-bold text-white tracking-tight mb-4 group-hover:text-emerald-400 transition-colors uppercase">{task.title}</h3>
                                            <p className="text-slate-400 font-medium text-xs leading-relaxed line-clamp-3">{task.description}</p>
                                        </div>

                                        <div className="pt-6 border-t border-white/10 space-y-6">
                                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={14} className="text-emerald-500" />
                                                    <span>Coordinate locked</span>
                                                </div>
                                                <span className="text-slate-400 font-mono">{task.location.lat.toFixed(3)}, {task.location.lng.toFixed(3)}</span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                {task.status === 'Reported' || task.status === 'Verified' ? (
                                                    <button
                                                        onClick={() => updateStatus(task._id, 'In Progress')}
                                                        className="flex items-center justify-center gap-2 py-3 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-lg active:scale-95"
                                                    >
                                                        <Activity size={14} /> Start Mission
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center justify-center py-3 bg-emerald-500/10 rounded-xl text-[10px] font-bold text-emerald-400 uppercase tracking-widest border border-emerald-500/20">
                                                        Active Log
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() => updateStatus(task._id, 'Resolved')}
                                                    className="flex items-center justify-center gap-2 py-3 bg-emerald-600 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg active:scale-95 shadow-emerald-500/20"
                                                >
                                                    <ShieldCheck size={14} /> Resolve
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
