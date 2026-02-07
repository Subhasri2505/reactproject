import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { RefreshCw, LayoutDashboard, ShieldCheck, Sparkles, TrendingUp, CheckCircle, Clock, AlertTriangle, Trash2 } from 'lucide-react';
import { io } from 'socket.io-client';

import Sidebar from '../components/Sidebar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [heatmapData, setHeatmapData] = useState([]);
    const [issues, setIssues] = useState([]);
    const [workers, setWorkers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, heatmapRes, issuesRes, workersRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/api/analytics/stats`),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/analytics/heatmap`),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/issues`),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/auth/workers`)
                ]);
                setStats(statsRes.data);
                setHeatmapData(heatmapRes.data);
                setIssues(issuesRes.data);
                setWorkers(workersRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();

        // Socket.io Real-time Updates
        const socket = io(`${import.meta.env.VITE_API_URL}`);

        socket.on('issueUpdated', (updatedIssue) => {
            setIssues(prev => prev.map(issue => issue._id === updatedIssue._id ? updatedIssue : issue));
            // Optional: Re-fetch stats if needed, or update stats locally (more complex)
        });

        socket.on('newIssue', (newIssue) => {
            setIssues(prev => [newIssue, ...prev]);
        });

        socket.on('issueDeleted', (deletedId) => {
            setIssues(prev => prev.filter(issue => issue._id !== deletedId));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleAssign = async (id, workerEmail) => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/api/issues/${id}/assign`, { assignedTo: workerEmail });
            setIssues(issues.map(i => i._id === id ? { ...i, assignedTo: workerEmail } : i));
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/api/issues/${id}/status`, { status: newStatus });
            // Refresh local state
            setIssues(issues.map(i => i._id === id ? { ...i, status: newStatus } : i));
        } catch (err) {
            console.error(err);
        }
    };

    const handleIssueDelete = async (id) => {
        if (!window.confirm('IRREVERSIBLE ACTION: Purge this record from the matrix?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/issues/${id}`);
            setIssues(issues.filter(i => i._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (!stats) return (
        <div className="flex bg-[#050b14] min-h-screen items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-indigo-600/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-indigo-400 font-bold animate-pulse">Initializing Command Center...</p>
            </div>
        </div>
    );

    const chartData = {
        labels: stats.byType.map(d => d._id),
        datasets: [{
            label: 'Issues by Type',
            data: stats.byType.map(d => d.count),
            backgroundColor: [
                'rgba(99, 102, 241, 0.6)',
                'rgba(139, 92, 246, 0.6)',
                'rgba(236, 72, 153, 0.6)',
                'rgba(6, 182, 212, 0.6)',
                'rgba(249, 115, 22, 0.6)',
                'rgba(16, 185, 129, 0.6)'
            ],
            borderRadius: 8,
            borderWidth: 0,
        }]
    };

    const statusData = {
        labels: stats.byStatus.map(d => d._id),
        datasets: [{
            data: stats.byStatus.map(d => d.count),
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#6366f1'],
            borderWidth: 0,
            hoverOffset: 10
        }]
    };

    return (
        <div className="flex bg-[#050b14] min-h-screen relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full -z-10 animate-glow"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full -z-10 animate-glow" style={{ animationDelay: '2s' }}></div>

            <Sidebar role="admin" />

            <div className="flex-1 p-8 md:p-12 overflow-y-auto relative z-10 w-full">
                <div className="max-w-7xl mx-auto space-y-12 animate-fade-in">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20">System Live</span>
                                <Sparkles size={14} className="text-amber-400 animate-pulse" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Admin <span className="text-gradient">Dashboard</span></h1>
                        </div>
                        <div className="flex gap-4">
                            <button className="btn-glass px-6 py-3 text-sm flex items-center gap-3">
                                <RefreshCw size={16} />
                                <span>Sync Stats</span>
                            </button>
                            <button className="btn-vibrant px-8 py-3 text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                                <TrendingUp size={16} />
                                <span>Export Report</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "Total Reports", value: stats.total, icon: <LayoutDashboard />, color: "text-indigo-400", sub: "+12.5% this month" },
                            { label: "Resolved", value: stats.resolved, icon: <CheckCircle />, color: "text-emerald-400", sub: `${Math.round((stats.resolved / stats.total) * 100)}% efficiency` },
                            { label: "Pending", value: stats.pending, icon: <Clock />, color: "text-amber-400", sub: "Priority triage required" },
                            { label: "Critical", value: issues.filter(i => i.priority === 'High').length, icon: <AlertTriangle />, color: "text-rose-400", sub: "Immediate action" }
                        ].map((stat, idx) => (
                            <div key={idx} className="glass-card p-8 group hover:bg-white/5 transition-colors">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${stat.color} group-hover:scale-110 transition-transform`}>
                                        {React.cloneElement(stat.icon, { size: 24 })}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</span>
                                </div>
                                <h2 className="text-4xl font-bold text-white mb-2">{stat.value}</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="glass-card p-8 md:p-10">
                            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-4">
                                <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                                Registry Distribution
                            </h3>
                            <div className="h-72">
                                <Bar data={chartData} options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { weight: 'bold' } } },
                                        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
                                    }
                                }} />
                            </div>
                        </div>
                        <div className="glass-card p-8 md:p-10">
                            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-4">
                                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                Resolution Status
                            </h3>
                            <div className="h-72 flex justify-center">
                                <Doughnut data={statusData} options={{
                                    cutout: '75%',
                                    plugins: {
                                        legend: { position: 'bottom', labels: { color: '#94a3b8', font: { weight: 'bold' }, padding: 20 } }
                                    }
                                }} />
                            </div>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="glass-card overflow-hidden">
                        <div className="p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                            <div>
                                <h3 className="text-2xl font-bold text-white tracking-tight">Recent Incidents</h3>
                                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">Real-time Activity Log</p>
                            </div>
                            <div className="relative w-full md:w-96">
                                <input
                                    type="text"
                                    placeholder="Search registry ID or type..."
                                    className="input-field rounded-full px-6"
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto p-4 md:p-8">
                            <table className="w-full text-left border-separate border-spacing-y-4">
                                <thead>
                                    <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                        <th className="pb-4 px-6">Incident Path</th>
                                        <th className="pb-4 px-6">Classification</th>
                                        <th className="pb-4 px-6">Assigned Agent</th>
                                        <th className="pb-4 px-6">Priority</th>
                                        <th className="pb-4 px-6">Status Portal</th>
                                        <th className="pb-4 px-6 text-right">Matrix Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {issues.map(issue => (
                                        <tr key={issue._id} className="group hover:bg-white/5 transition-all duration-300">
                                            <td className="py-6 px-6 bg-white/5 border-y border-l border-white/10 first:rounded-l-2xl">
                                                <div className="font-bold text-white text-base">{issue.title}</div>
                                                <div className="text-[10px] text-slate-500 font-bold tracking-widest mt-1">#ID_{issue._id.slice(-6).toUpperCase()}</div>
                                            </td>
                                            <td className="py-6 px-6 bg-white/5 border-y border-white/10">
                                                <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-indigo-300 uppercase tracking-widest">{issue.type}</span>
                                            </td>
                                            <td className="py-6 px-6 bg-white/5 border-y border-white/10">
                                                <select
                                                    className="bg-[#0f172a] border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-bold text-slate-300 outline-none focus:border-indigo-500 w-32"
                                                    value={issue.assignedTo || ''}
                                                    onChange={(e) => handleAssign(issue._id, e.target.value)}
                                                >
                                                    <option value="">-- Unassigned --</option>
                                                    {workers.map(w => (
                                                        <option key={w._id} value={w.email}>{w.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="py-6 px-6 bg-white/5 border-y border-white/10 font-bold text-center">
                                                <span className={`px-4 py-1 rounded-full ${issue.priority === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'} uppercase tracking-widest text-[10px] font-bold`}>
                                                    {issue.priority}
                                                </span>
                                            </td>
                                            <td className="py-6 px-6 bg-white/5 border-y border-white/10">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full animate-pulse ${issue.status === 'Resolved' ? 'bg-emerald-400' :
                                                        issue.status === 'In Progress' ? 'bg-amber-400' : 'bg-indigo-400'
                                                        }`}></div>
                                                    <span className="text-xs font-bold text-white uppercase tracking-widest">{issue.status}</span>
                                                </div>
                                            </td>
                                            <td className="py-6 px-6 bg-white/5 border-y border-r border-white/10 last:rounded-r-2xl text-right">
                                                <div className="flex items-center justify-end gap-4">
                                                    <select
                                                        className="bg-[#0f172a] border border-white/10 rounded-xl px-4 py-2 text-[10px] font-bold uppercase text-indigo-400 outline-none focus:border-indigo-500 transition-all cursor-pointer"
                                                        value={issue.status}
                                                        onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                                                    >
                                                        <option value="Reported">Reported</option>
                                                        <option value="Verified">Verified</option>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Resolved">Resolved</option>
                                                    </select>
                                                    <button
                                                        onClick={() => handleIssueDelete(issue._id)}
                                                        className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                                                        title="Purge Record"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
