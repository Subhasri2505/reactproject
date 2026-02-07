import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Camera, MapPin, Upload, AlertTriangle, Sparkles, Send, Download, CheckCircle, FileText } from 'lucide-react';
import L from 'leaflet';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Fix for invisible leaflet markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }) {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    )
}

export default function ReportIssue() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'Pothole',
        reportedBy: 'Citizen'
    });
    const [position, setPosition] = useState(null); // { lat, lng }
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [alert, setAlert] = useState(null); // { type: 'error'|'success', message: '' }
    const [submittedReport, setSubmittedReport] = useState(null); // Stores success data
    const receiptRef = useRef(null);
    const navigate = useNavigate();

    // Protect Route: Redirect if not logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const downloadPDF = async () => {
        if (!receiptRef.current) return;

        try {
            const canvas = await html2canvas(receiptRef.current, {
                scale: 2,
                backgroundColor: '#050b14', // Match theme
                useCORS: true
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`CityFix_Report_${submittedReport._id}.pdf`);
        } catch (err) {
            console.error("PDF Fail", err);
            setAlert({ type: 'error', message: `PDF Error: ${err.message || 'Unknown error'}` });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!position || !image) {
            setAlert({ type: 'error', message: 'Please select a location and upload an image.' });
            return;
        }

        setSubmitting(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('type', formData.type);
        data.append('reportedBy', formData.reportedBy);
        data.append('lat', position.lat);
        data.append('lng', position.lng);
        data.append('address', 'Selected Location');
        data.append('image', image);

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/issues`, data);

            if (res.data.isDuplicate) {
                if (res.data.duplicateType === 'image') {
                    setAlert({ type: 'warning', message: 'Alert: This image has already been sent to the admin!' });
                } else {
                    setAlert({ type: 'warning', message: 'Similar issue already reported nearby!' });
                }
            } else {
                // SUCCESS: Switch to Receipt View
                setSubmittedReport(res.data);
                setAlert({ type: 'success', message: 'Issue reported successfully!' });

                // Reset form state in background
                setFormData({ title: '', description: '', type: 'Pothole', reportedBy: 'Citizen' });
                // Note: We keep 'preview' and 'image' momentarily so the Receipt View can use the local blob 
                // to generate the PDF without CORS issues.
                setPosition(null);
            }
        } catch (err) {
            console.error(err);
            setAlert({ type: 'error', message: err.response?.data?.error || 'Failed to submit report.' });
        } finally {
            setSubmitting(false);
        }
    };

    // --- RECEIPT VIEW ---
    if (submittedReport) {
        return (
            <div className="min-h-screen py-20 px-6 relative overflow-hidden bg-[#050b14] flex items-center justify-center">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/10 blur-[120px] rounded-full -z-10 animate-glow"></div>

                <div className="max-w-2xl w-full relative z-10 animate-scale-in">
                    <div className="glass-card p-0 overflow-hidden shadow-2xl shadow-emerald-500/10">
                        {/* Printable Area */}
                        <div ref={receiptRef} className="p-10 bg-[#0f172a] text-white">
                            <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-10 w-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                                            <CheckCircle size={24} />
                                        </div>
                                        <h2 className="text-2xl font-bold tracking-tight">Report Logged</h2>
                                    </div>
                                    <p className="text-slate-400 text-sm font-mono uppercase tracking-widest pl-1">ID: #{submittedReport._id.slice(-8).toUpperCase()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Date</p>
                                    <p className="text-sm font-bold text-white">{new Date().toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Classification</p>
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-indigo-300 uppercase">{submittedReport.type}</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Location Matrix</p>
                                    <p className="text-sm font-mono text-emerald-400">{submittedReport.location.lat.toFixed(5)}° N, {submittedReport.location.lng.toFixed(5)}° E</p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Visual Evidence</p>
                                <div className="h-64 rounded-2xl overflow-hidden border border-white/10 relative">
                                    <img
                                        src={preview || `${import.meta.env.VITE_API_URL}${submittedReport.imageUrl}`}
                                        alt="Evidence"
                                        className="w-full h-full object-cover"
                                        crossOrigin="anonymous"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4">
                                        <p className="text-white font-bold text-lg">{submittedReport.title}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Description Protocol</p>
                                <p className="text-sm text-slate-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
                                    {submittedReport.description}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">CityFix Governance Platform</span>
                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                    <CheckCircle size={12} /> Verification Pending
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-[#050b14] p-6 flex items-center justify-between border-t border-white/10">
                            <button
                                onClick={() => {
                                    setSubmittedReport(null);
                                    setImage(null);
                                    setPreview(null);
                                }}
                                className="text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
                            >
                                ← File New Report
                            </button>
                            <button
                                onClick={downloadPDF}
                                className="btn-vibrant px-6 py-3 text-sm shadow-xl shadow-emerald-500/10 flex items-center gap-2"
                            >
                                <Download size={16} />
                                <span>Download PDF</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // --- FORM VIEW ---
    return (
        <div className="min-h-screen py-20 px-6 relative overflow-hidden bg-[#050b14]">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full -z-10 animate-glow"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/10 blur-[120px] rounded-full -z-10 animate-glow" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-20 animate-slide-up">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 border border-white/10 text-indigo-400 rounded-2xl mb-8 shadow-2xl backdrop-blur-xl group hover:scale-110 transition-transform">
                        <AlertTriangle size={32} className="group-hover:rotate-12 transition-transform" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">Report an <span className="text-gradient">Incident</span></h1>
                    <p className="text-slate-400 font-medium max-w-2xl mx-auto flex items-center justify-center gap-2">
                        <Sparkles size={16} className="text-amber-400" />
                        Empower your community through direct action
                    </p>
                </div>

                {alert && (
                    <div className={`p-6 mb-12 rounded-2xl flex items-center gap-4 border animate-scale-in backdrop-blur-xl ${alert.type === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        alert.type === 'warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                        <div className={`h-3 w-3 rounded-full animate-pulse ${alert.type === 'error' ? 'bg-red-500' : alert.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                        <span className="font-bold text-sm tracking-wide">{alert.message}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="glass-card p-8 md:p-12 space-y-12">
                        {/* Visual Evidence Area */}
                        <div>
                            <label className="flex items-center gap-3 text-sm font-bold text-white mb-6 uppercase tracking-wider">
                                <Camera size={18} className="text-indigo-400" /> Visual Evidence
                            </label>
                            <div className="relative group h-80 flex items-center justify-center overflow-hidden bg-black/20 rounded-3xl border-2 border-dashed border-white/10 hover:border-indigo-500/50 transition-all cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                />
                                {preview ? (
                                    <div className="relative w-full h-full">
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm">
                                            <Upload size={48} className="text-white mb-4" />
                                            <span className="text-white font-bold text-sm uppercase tracking-widest">Change Evidence</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                                        <div className="h-20 w-20 bg-white/5 rounded-2xl shadow-xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all">
                                            <Upload size={32} />
                                        </div>
                                        <p className="font-bold text-sm">Click to Upload Photo</p>
                                        <p className="text-xs mt-2 text-slate-600">Supports JPG, PNG (Max 5MB)</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Incident Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">Incident Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Brief identifier..."
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">Classification</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    className="input-field cursor-pointer appearance-none"
                                >
                                    <option className="bg-[#0f172a]">Pothole</option>
                                    <option className="bg-[#0f172a]">Garbage</option>
                                    <option className="bg-[#0f172a]">Water Leakage</option>
                                    <option className="bg-[#0f172a]">Streetlight</option>
                                    <option className="bg-[#0f172a]">Road Damage</option>
                                    <option className="bg-[#0f172a]">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">Description</label>
                            <textarea
                                placeholder="Describe the severity and impact..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="input-field h-40 resize-none"
                            ></textarea>
                        </div>

                        {/* Geolocation */}
                        <div className="space-y-6">
                            <label className="flex items-center gap-3 text-sm font-bold text-white uppercase tracking-wider">
                                <MapPin size={18} className="text-indigo-400" /> Precise Location
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-1 space-y-4">
                                    {position ? (
                                        <div className="p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl animate-fade-in">
                                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping"></div>
                                                GPS Locked
                                            </p>
                                            <div className="font-mono text-white text-lg font-bold">
                                                {position.lat.toFixed(4)}° N <br />
                                                {position.lng.toFixed(4)}° E
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-6 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center text-center h-full">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-relaxed">
                                                Select location <br /> on the map
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="md:col-span-2 h-64 rounded-2xl overflow-hidden border border-white/10 shadow-lg relative z-0">
                                    <MapContainer
                                        center={[12.9716, 77.5946]}
                                        zoom={13}
                                        style={{ height: '100%', width: '100%', filter: 'invert(1) hue-rotate(180deg) contrast(0.8)' }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; OpenStreetMap contributors'
                                        />
                                        <LocationMarker position={position} setPosition={setPosition} />
                                    </MapContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center pb-8">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`btn-vibrant px-12 py-4 text-base rounded-xl shadow-lg shadow-indigo-500/20 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {submitting ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Syncing...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Send size={20} />
                                    <span>Submit Report</span>
                                </div>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
