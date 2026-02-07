import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, ArrowRight, HardHat, AlertCircle } from 'lucide-react';

export default function WorkerLogin() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, formData);

            if (response.data.role !== 'worker') {
                setError('Access denied. Field Ops privileges required.');
                setLoading(false);
                return;
            }

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify({
                name: response.data.name,
                email: response.data.email,
                role: response.data.role
            }));

            navigate('/worker');
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative bg-[#050b14]">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/20 blur-[120px] rounded-full -z-10 animate-glow"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="glass-card p-10 shadow-2xl animate-float border-t border-emerald-500/30">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 mb-4 border border-emerald-500/30">
                            <HardHat size={24} />
                        </div>
                        <h2 className="text-3xl font-bold mb-2 text-white">Field Operations</h2>
                        <p className="text-slate-400 text-sm">
                            Authorized Personnel Only
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold flex items-center gap-3">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Unit Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="unit@cityfix.gov"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Access Code</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full btn-vibrant mt-4 py-3 justify-center before:hidden hover:shadow-emerald-500/20 ${loading ? 'opacity-80 cursor-wait' : ''}`}
                            style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Start Shift</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <Link to="/login" className="text-xs font-bold text-slate-500 hover:text-white transition-colors">
                            ← Return to Main Portal
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
