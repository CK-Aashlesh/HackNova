"use client";

import React, { useState, useEffect } from 'react';
import { Shield, Key, Download, Trash2, RefreshCw, BarChart3, Users, Settings, Edit2, X, Save } from 'lucide-react';
import { motion } from 'motion/react';



export default function Admin() {
    const [key, setKey] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState('');

    const [stats, setStats] = useState({ teams: 0, visitors: 0 });
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [editingRegistration, setEditingRegistration] = useState<any | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const [regRes, statsRes] = await Promise.all([
                fetch('/api/admin/registrations', { headers: { 'x-admin-key': key } }),
                fetch('/api/admin/stats', { headers: { 'x-admin-key': key } })
            ]);

            if (regRes.status === 401 || statsRes.status === 401) {
                setIsAuthenticated(false);
                setError('Session expired or invalid key');
                return;
            }

            const regData = await regRes.json();
            const statsData = await statsRes.json();

            setRegistrations(regData);
            setStats(statsData);
            setIsAuthenticated(true);
            setError('');
        } catch (err) {
            console.error(err);
            setError('Failed to fetch data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!key) return;
        fetchDashboardData();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this registration?')) return;
        try {
            await fetch(`/api/admin/registrations/${id}`, {
                method: 'DELETE',
                headers: { 'x-admin-key': key }
            });
            fetchDashboardData();
        } catch (err) {
            alert('Delete failed');
        }
    };

    const parseMembers = (membersData: any) => {
        if (typeof membersData === 'string') {
            try {
                return JSON.parse(membersData);
            } catch (e) {
                return [];
            }
        }
        return membersData || [];
    };

    const handleEditClick = (reg: any) => {
        const parsedMembers = parseMembers(reg.members_data);
        setEditingRegistration({
            ...reg,
            membersList: parsedMembers.length > 0 ? parsedMembers : [{ name: '', email: '', phone: '', role: '', college: '', gender: '', year: '', course: '' }]
        });
    };

    const handleEditChange = (field: string, value: any) => {
        setEditingRegistration((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleEditMemberChange = (idx: number, field: string, value: string) => {
        setEditingRegistration((prev: any) => {
            const newMembers = [...prev.membersList];
            newMembers[idx] = { ...newMembers[idx], [field]: value };
            return { ...prev, membersList: newMembers };
        });
    };

    const submitEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await fetch(`/api/admin/registrations/${editingRegistration.id}`, {
                method: 'PUT',
                headers: {
                    'x-admin-key': key,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    teamName: editingRegistration.team_name,
                    memberCount: editingRegistration.member_count,
                    members: editingRegistration.membersList
                })
            });
            setEditingRegistration(null);
            fetchDashboardData();
        } catch (err) {
            alert('Failed to update registration');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDownloadCSV = () => {
        let csv = 'ID,Team Name,Member Count,Registration Date\n';
        registrations.forEach(r => {
            csv += `${r.id},"${r.team_name}",${r.member_count},"${new Date(r.registration_date).toLocaleString()}"\n`;
        });

        csv += '\n\nFull Members List\nTeam Name,Member Name,Email,Phone,Role,College,Gender,Year,Course\n';
        registrations.forEach(r => {
            const members = parseMembers(r.members_data);
            members.forEach((m: any) => {
                csv += `"${r.team_name}","${m.name}","${m.email}","${m.phone}","${m.role}","${m.college || ''}","${m.gender || ''}","${m.year || ''}","${m.course || ''}"\n`;
            });
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hacknova_registrations_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-space-violet/40 relative z-10"
                >
                    <div className="flex justify-center mb-6">
                        <Shield className="w-16 h-16 text-[#D4AF37]" />
                    </div>
                    <h1 className="text-3xl font-orbitron text-center mb-8 tracking-wider">COMMAND CENTER</h1>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="text-sm font-rajdhani text-gray-400 uppercase tracking-wider block mb-2">Access Key</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="password"
                                    value={key}
                                    onChange={(e) => setKey(e.target.value)}
                                    className="w-full bg-white/5 border border-space-violet/40 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors tracking-widest font-mono"
                                    placeholder="Enter Key"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm font-rajdhani text-center">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-[#D4AF37] hover:bg-[#B8972E] text-black font-bold font-orbitron py-3 rounded-lg transition-colors tracking-wider"
                        >
                            AUTHENTICATE
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-orbitron text-white mb-2">MISSION CONTROL</h1>
                    <p className="text-gray-400 font-rajdhani">Manage hackathon data and website traffic.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchDashboardData}
                        title="Refresh Data"
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-space-violet/40 transition-colors"
                    >
                        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin text-[#D4AF37]' : 'text-gray-300'}`} />
                    </button>
                    <button
                        onClick={handleDownloadCSV}
                        className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg border border-space-violet/40 transition-colors font-rajdhani hover:text-[#D4AF37]"
                    >
                        <Download className="w-5 h-5" />
                        <span>EXPORT CSV</span>
                    </button>
                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="px-6 py-3 bg-[#D4AF37]/10 hover:bg-[#D4AF37] hover:text-white text-[#D4AF37] rounded-lg border border-[#D4AF37]/30 transition-colors font-rajdhani font-bold"
                    >
                        LOGOUT
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-black/40 border border-space-violet/40 rounded-xl p-6 flex flex-col items-center justify-center text-center group hover:border-[#D4AF37]/30 transition-colors">
                    <Users className="w-8 h-8 text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-gray-400 font-rajdhani text-sm uppercase tracking-widest mb-1">Total Teams</h3>
                    <p className="text-4xl font-orbitron text-white">{stats.teams}</p>
                </div>
                <div className="bg-black/40 border border-space-violet/40 rounded-xl p-6 flex flex-col items-center justify-center text-center group hover:border-[#D4AF37]/30 transition-colors">
                    <BarChart3 className="w-8 h-8 text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-gray-400 font-rajdhani text-sm uppercase tracking-widest mb-1">Total Web Views</h3>
                    <p className="text-4xl font-orbitron text-white">{stats.visitors}</p>
                </div>
                <div className="bg-black/40 border border-space-violet/40 rounded-xl p-6 flex flex-col items-center justify-center text-center group hover:border-[#D4AF37]/30 transition-colors">
                    <Settings className="w-8 h-8 text-space-nebula mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-gray-400 font-rajdhani text-sm uppercase tracking-widest mb-1">System Status</h3>
                    <p className="text-xl mt-2 font-orbitron text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">ONLINE</p>
                </div>
            </div>

            <div className="bg-black/40 border border-space-violet/40 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-space-violet/40 bg-white/5">
                    <h2 className="text-2xl font-orbitron">REGISTERED CREWS</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left font-rajdhani whitespace-nowrap">
                        <thead className="bg-black/50 text-gray-400 text-sm uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Team Name</th>
                                <th className="px-6 py-4">Size</th>
                                <th className="px-6 py-4">Registered On</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {registrations.map(reg => (
                                <tr key={reg.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 text-gray-400">#{reg.id}</td>
                                    <td className="px-6 py-4 font-bold text-lg">{reg.team_name}</td>
                                    <td className="px-6 py-4">{reg.member_count} crew members</td>
                                    <td className="px-6 py-4 text-gray-400">
                                        {new Date(reg.registration_date).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleEditClick(reg)}
                                            className="p-2 text-gray-500 hover:text-blue-500 bg-black hover:bg-blue-500/10 rounded border border-transparent hover:border-blue-500/30 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(reg.id)}
                                            className="p-2 text-gray-500 hover:text-red-500 bg-black hover:bg-red-500/10 rounded border border-transparent hover:border-red-500/30 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {registrations.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-lg">
                                        No crews have registered yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingRegistration && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-[#080808] border border-white/20 rounded-2xl w-full max-w-4xl my-8 relative shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-space-violet/40">
                            <h2 className="text-2xl font-orbitron font-bold">EDIT CREW DATA</h2>
                            <button onClick={() => setEditingRegistration(null)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={submitEdit} className="p-6 space-y-8 h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-rajdhani text-gray-400 uppercase tracking-wider block mb-2">Team Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={editingRegistration.team_name}
                                        onChange={(e) => handleEditChange('team_name', e.target.value)}
                                        className="w-full bg-white/5 border border-space-violet/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] font-rajdhani"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-rajdhani text-gray-400 uppercase tracking-wider block mb-2">Party Size</label>
                                    <select
                                        required
                                        value={editingRegistration.member_count}
                                        onChange={(e) => handleEditChange('member_count', parseInt(e.target.value))}
                                        className="w-full bg-white/5 border border-space-violet/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] font-rajdhani appearance-none"
                                    >
                                        <option value={2}>2 Members</option>
                                        <option value={3}>3 Members</option>
                                        <option value={4}>4 Members</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xl font-orbitron text-gray-300 border-b border-space-violet/40 pb-2">CREW MEMBERS</h3>
                                {editingRegistration.membersList.slice(0, editingRegistration.member_count).map((member: any, idx: number) => (
                                    <div key={idx} className="bg-white/5 border border-space-violet/40 p-5 rounded-xl space-y-4">
                                        <h4 className="font-orbitron text-sm text-[#D4AF37]">CREW MEMBER {idx + 1}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <input required type="text" value={member.name} onChange={(e) => handleEditMemberChange(idx, 'name', e.target.value)} placeholder="Name" className="w-full bg-black border border-space-violet/40 rounded-lg px-4 py-2 text-white" />
                                            <input required type="email" value={member.email} onChange={(e) => handleEditMemberChange(idx, 'email', e.target.value)} placeholder="Email" className="w-full bg-black border border-space-violet/40 rounded-lg px-4 py-2 text-white" />
                                            <input required type="text" value={member.phone} onChange={(e) => handleEditMemberChange(idx, 'phone', e.target.value)} placeholder="Phone" className="w-full bg-black border border-space-violet/40 rounded-lg px-4 py-2 text-white" />

                                            <select required value={member.role || ""} onChange={(e) => handleEditMemberChange(idx, 'role', e.target.value)} className="w-full bg-black border border-space-violet/40 rounded-lg px-4 py-2 text-white appearance-none">
                                                <option value="" disabled>Select Role</option>
                                                <option value="frontend">Frontend</option><option value="backend">Backend</option><option value="fullstack">Fullstack</option><option value="ai">AI</option><option value="design">Design</option>
                                            </select>

                                            <input required type="text" value={member.college || ""} onChange={(e) => handleEditMemberChange(idx, 'college', e.target.value)} placeholder="College" className="w-full bg-black border border-space-violet/40 rounded-lg px-4 py-2 text-white" />

                                            <select required value={member.gender || ""} onChange={(e) => handleEditMemberChange(idx, 'gender', e.target.value)} className="w-full bg-black border border-space-violet/40 rounded-lg px-4 py-2 text-white appearance-none">
                                                <option value="" disabled>Gender</option>
                                                <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                                            </select>

                                            <select required value={member.year || ""} onChange={(e) => handleEditMemberChange(idx, 'year', e.target.value)} className="w-full bg-black border border-space-violet/40 rounded-lg px-4 py-2 text-white appearance-none">
                                                <option value="" disabled>Year</option>
                                                <option value="1st Year">1st Year</option><option value="2nd Year">2nd Year</option><option value="3rd Year">3rd Year</option><option value="4th Year">4th Year</option><option value="Other">Other</option>
                                            </select>

                                            <input required type="text" value={member.course || ""} onChange={(e) => handleEditMemberChange(idx, 'course', e.target.value)} placeholder="Course & Branch" className="w-full bg-black border border-space-violet/40 rounded-lg px-4 py-2 text-white lg:col-span-2" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-space-violet/40 flex justify-end gap-4">
                                <button type="button" onClick={() => setEditingRegistration(null)} className="px-6 py-3 font-rajdhani border border-white/20 rounded-lg hover:bg-white/5 transition-colors">
                                    CANCEL
                                </button>
                                <button type="submit" disabled={isSaving} className="px-6 py-3 font-rajdhani bg-[#D4AF37] hover:bg-[#B8972E] text-white font-bold rounded-lg transition-colors flex items-center gap-2">
                                    <Save className="w-4 h-4" />
                                    {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
