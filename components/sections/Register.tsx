"use client";

import React, { useState } from 'react';
import { Shield, Users, Mail, Phone, Code, Terminal, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Member {
    name: string;
    email: string;
    phone: string;
    role: string;
    college: string;
    gender: string;
    year: string;
    course: string;
}

export default function Register() {
    const router = useRouter();
    const [teamName, setTeamName] = useState('');
    const [memberCount, setMemberCount] = useState<number>(2);
    const [members, setMembers] = useState<Member[]>([
        { name: '', email: '', phone: '', role: '', college: '', gender: '', year: '', course: '' },
        { name: '', email: '', phone: '', role: '', college: '', gender: '', year: '', course: '' },
    ]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleMemberCountChange = (count: number) => {
        if (count < 2 || count > 4) return;
        setMemberCount(count);

        setMembers(prev => {
            const newMembers = [...prev];
            if (count > prev.length) {
                for (let i = prev.length; i < count; i++) {
                    newMembers.push({ name: '', email: '', phone: '', role: '', college: '', gender: '', year: '', course: '' });
                }
            } else if (count < prev.length) {
                newMembers.splice(count);
            }
            return newMembers;
        });
    };

    const handleMemberChange = (index: number, field: keyof Member, value: string) => {
        setMembers(prev => {
            const newMembers = [...prev];
            newMembers[index] = { ...newMembers[index], [field]: value };
            return newMembers;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamName, memberCount, members }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            setStatus('success');
            // Notify The Curator mascot to celebrate
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('curator-event', {
                    detail: { action: 'celebrate', message: "You're all set! Welcome aboard, crew! 🚀" }
                }));
            }
            setTimeout(() => {
                router.push('/');
            }, 3000);
        } catch (err: any) {
            setStatus('error');
            setErrorMessage(err.message || 'Network error occurred');
            // Notify The Curator mascot about the error
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('curator-event', {
                    detail: { action: 'sad', message: "Oops... let's try again." }
                }));
            }
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="w-24 h-24 text-[#D4AF37] mb-8 animate-pulse" />
                <h1 className="text-4xl md:text-5xl font-bold mb-4 font-orbitron heading-glow">MISSION LAUNCHED</h1>
                <p className="text-gray-400 text-lg md:text-xl font-rajdhani">
                    Your journey as the {teamName} crew begins now. Await your launch instructions.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 font-orbitron heading-glow tracking-tighter">
                        REGISTER FOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F1D08A]">HackNova</span>
                    </h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto font-rajdhani">
                        Chart your coordinates. Only the most skilled pioneers will emerge victorious in the ultimate cosmic mission.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12 backdrop-blur-md bg-black/40 p-8 md:p-12 rounded-2xl border border-space-violet/25 shadow-2xl relative">
                    <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

                    {/* Team Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-8">
                            <Shield className="w-8 h-8 text-[#D4AF37]" />
                            <h2 className="text-3xl font-orbitron">CREW IDENTIFICATION</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-rajdhani text-gray-400 uppercase tracking-wider block">Team Name</label>
                                <input
                                    required
                                    type="text"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    className="w-full bg-white/5 border border-space-violet/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors font-rajdhani text-lg"
                                    placeholder="e.g. Star Voyagers"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-rajdhani text-gray-400 uppercase tracking-wider block">Party Size</label>
                                <div className="flex bg-white/5 border border-space-violet/40 rounded-lg p-1">
                                    {[2, 3, 4].map(size => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => handleMemberCountChange(size)}
                                            className={`flex-1 py-2 text-lg font-rajdhani rounded-md transition-all ${memberCount === size ? 'bg-[#D4AF37] text-white font-bold shadow-[0_0_15px_rgba(212,175,55,0.5)]' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    {/* Members Info */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 mb-4">
                            <Users className="w-8 h-8 text-[#D4AF37]" />
                            <h2 className="text-3xl font-orbitron">MISSION CREW ({members.length})</h2>
                        </div>

                        {members.map((member, idx) => (
                            <div key={idx} className="relative bg-white/[0.02] border border-space-violet/25 p-6 rounded-xl group hover:border-[#D4AF37]/30 transition-colors">
                                <div className="absolute -left-3 -top-3 w-8 h-8 bg-black border border-[#D4AF37]/50 rounded-full flex items-center justify-center font-orbitron text-[#D4AF37] font-bold text-sm">
                                    {idx + 1}
                                </div>

                                <h3 className="text-xl font-orbitron mb-6 text-gray-300">
                                    {idx === 0 ? 'COMMANDER (Leader)' : `CREW MEMBER ${idx}`}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            required
                                            type="text"
                                            value={member.name}
                                            onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                                            placeholder="Member Name"
                                            className="w-full bg-black/50 border border-space-violet/40 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        />
                                    </div>

                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            required
                                            type="email"
                                            value={member.email}
                                            onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                                            placeholder="Comm Link (Email)"
                                            className="w-full bg-black/50 border border-space-violet/40 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        />
                                    </div>

                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            required
                                            type="tel"
                                            value={member.phone}
                                            onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                                            placeholder="Holo-Frequency (Phone)"
                                            className="w-full bg-black/50 border border-space-violet/40 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        />
                                    </div>

                                    <div className="relative">
                                        <Code className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <select
                                            required
                                            value={member.role}
                                            onChange={(e) => handleMemberChange(idx, 'role', e.target.value)}
                                            className="w-full bg-black/50 border border-space-violet/40 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none"
                                        >
                                            <option value="" disabled>Select Cosmic Specialty</option>
                                            <option value="frontend">Frontend Voyager</option>
                                            <option value="backend">Backend Navigator</option>
                                            <option value="fullstack">Fullstack Engineer</option>
                                            <option value="ai">AI Astrodynamicist</option>
                                            <option value="design">UI/UX Cosmic Architect</option>
                                        </select>
                                    </div>

                                    <div className="relative md:col-span-2">
                                        <input
                                            required
                                            type="text"
                                            value={member.college}
                                            onChange={(e) => handleMemberChange(idx, 'college', e.target.value)}
                                            placeholder="College/University Name"
                                            className="w-full bg-black/50 border border-space-violet/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        />
                                    </div>

                                    <div className="relative">
                                        <select
                                            required
                                            value={member.gender}
                                            onChange={(e) => handleMemberChange(idx, 'gender', e.target.value)}
                                            className="w-full bg-black/50 border border-space-violet/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none"
                                        >
                                            <option value="" disabled>Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="relative">
                                        <select
                                            required
                                            value={member.year}
                                            onChange={(e) => handleMemberChange(idx, 'year', e.target.value)}
                                            className="w-full bg-black/50 border border-space-violet/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none"
                                        >
                                            <option value="" disabled>Year of Study</option>
                                            <option value="1st Year">1st Year</option>
                                            <option value="2nd Year">2nd Year</option>
                                            <option value="3rd Year">3rd Year</option>
                                            <option value="4th Year">4th Year</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="relative md:col-span-2">
                                        <input
                                            required
                                            type="text"
                                            value={member.course}
                                            onChange={(e) => handleMemberChange(idx, 'course', e.target.value)}
                                            placeholder="Course & Branch (e.g. B.Tech Computer Science)"
                                            className="w-full bg-black/50 border border-space-violet/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {errorMessage && (
                        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg">
                            <AlertCircle className="w-6 h-6 flex-shrink-0" />
                            <p className="font-rajdhani text-lg">{errorMessage}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full relative group overflow-hidden mt-8"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#F1D08A] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                        <div className="bg-white/5 border border-[#D4AF37]/50 text-white font-orbitron text-xl py-4 px-8 flex items-center justify-center gap-4 relative z-10 group-hover:text-black transition-colors duration-300">
                            {status === 'loading' ? 'INITIATING LAUNCH...' : 'LAUNCH REGISTRATION (SUBMIT)'}
                            <ChevronRight className="w-6 h-6" />
                        </div>
                    </button>
                </form>
            </div>
        </div>
    );
}
