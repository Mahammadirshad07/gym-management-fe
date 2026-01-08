import React, { useState } from 'react';
import { loginUser, updateWeight } from '../api';
import GymLoader from '../components/GymLoader';
import { Link } from 'react-router-dom'; // Added Link
import { LogOut, ArrowRight, Check, Dumbbell, CalendarDays, MapPin, ArrowLeft } from 'lucide-react';

export default function UserPortal() {
    const [mobile, setMobile] = useState('');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [weight, setWeight] = useState('');
    const [justUpdated, setJustUpdated] = useState(false);

    // LOGIN LOGIC
    const handleLogin = async (e) => {
        e.preventDefault();
        if(!mobile) return;
        setLoading(true);
        setTimeout(async () => {
            try {
                const res = await loginUser(mobile);
                setUser(res.data);
                setWeight(res.data.weight || '');
            } catch (error) { alert("Access Denied: Number not found."); }
            setLoading(false);
        }, 800);
    };

    // UPDATE LOGIC
    const handleUpdate = async () => {
        setLoading(true);
        try {
            await updateWeight(user.id, weight);
            setJustUpdated(true);
            setTimeout(() => setJustUpdated(false), 2000); 
        } catch (error) { alert("Failed to update"); }
        setLoading(false);
    };

    if (loading) return <div className="fixed inset-0 bg-black flex items-center justify-center z-50"><GymLoader/></div>;

    // STATE 1: LOGIN SCREEN (With Back Button)
    if (!user) {
        return (
            <div className="min-h-[100dvh] w-full bg-black text-white flex flex-col items-center justify-center relative font-sans overflow-hidden px-6">
                
                {/* NEW BACK BUTTON */}
                <Link to="/" className="absolute top-6 left-6 text-zinc-500 hover:text-white transition-colors p-2 z-50">
                    <ArrowLeft className="w-6 h-6" />
                </Link>

                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
                
                <div className="w-full max-w-sm z-10 flex flex-col gap-8">
                    <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto border border-zinc-800 shadow-2xl shadow-black ring-1 ring-zinc-800">
                            <Dumbbell className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter text-white">BODY<span className="text-zinc-600">FUEL</span></h1>
                            <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase font-bold mt-2">Member Portal</p>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] text-zinc-500 font-bold uppercase ml-1">Mobile Number</label>
                            <input 
                                type="tel" 
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                placeholder="98765 43210"
                                className="w-full bg-zinc-950 border border-zinc-800 text-center text-xl py-5 rounded-2xl text-white outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all placeholder:text-zinc-800"
                                autoFocus
                            />
                        </div>
                        <button type="submit" className="w-full bg-white text-black font-bold py-5 rounded-2xl hover:bg-zinc-200 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            Access Account <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // STATE 2: DASHBOARD (Same as before)
    const daysLeft = Math.ceil((new Date(user.subscription_end_date) - new Date()) / (1000 * 60 * 60 * 24));
    const isExpired = daysLeft < 0;

    return (
        <div className="min-h-[100dvh] bg-black text-white font-sans selection:bg-white selection:text-black pb-8">
            <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-zinc-900/50 pt-safe-top">
                <div className="max-w-md mx-auto px-5 py-4 flex justify-between items-center">
                    <div>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Welcome Back</p>
                        <h2 className="text-xl font-bold text-white leading-none mt-1">{user.name.split(' ')[0]}</h2>
                    </div>
                    <button onClick={() => setUser(null)} className="w-10 h-10 rounded-full bg-zinc-900/50 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 transition-all">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="px-5 pt-6 space-y-6 max-w-md mx-auto w-full">
                <div className="relative overflow-hidden rounded-[2rem] bg-zinc-900 border border-zinc-800 p-6 md:p-8 text-center shadow-2xl">
                    <div className={`absolute top-5 right-5 w-2.5 h-2.5 rounded-full ${!isExpired ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-red-500 shadow-[0_0_15px_#ef4444]'}`} />
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-3">Current Status</p>
                    <h3 className={`text-4xl font-black tracking-tight ${!isExpired ? 'text-white' : 'text-red-500'}`}>
                        {!isExpired ? 'ACTIVE' : 'EXPIRED'}
                    </h3>
                    <div className="mt-8 flex justify-center items-center gap-6 border-t border-zinc-800/50 pt-6">
                        <div className="flex-1">
                            <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Remaining</p>
                            <p className="text-2xl font-bold font-mono leading-none">{Math.max(0, daysLeft)}<span className="text-sm text-zinc-600 ml-1">D</span></p>
                        </div>
                        <div className="w-px h-8 bg-zinc-800"></div>
                        <div className="flex-1">
                            <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Plan Ends</p>
                            <p className="text-xl font-bold font-mono text-zinc-300 leading-none">{user.subscription_end_date.slice(5)}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 min-h-[100px]">
                        <CalendarDays className="w-5 h-5 text-zinc-500"/>
                        <div className="text-center">
                            <p className="text-[10px] text-zinc-600 uppercase font-bold">Joined</p>
                            <p className="text-sm font-bold text-zinc-300">{user.joining_date}</p>
                        </div>
                    </div>
                    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 min-h-[100px]">
                        <MapPin className="w-5 h-5 text-zinc-500"/>
                        <div className="text-center">
                            <p className="text-[10px] text-zinc-600 uppercase font-bold">Location</p>
                            <p className="text-sm font-bold text-zinc-300">{user.location}</p>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-2 pl-6 flex items-center gap-4 shadow-lg">
                        <div className="flex-1 py-1">
                            <label className="text-[10px] text-zinc-600 uppercase font-bold block mb-0.5">Update Weight (KG)</label>
                            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="bg-transparent text-2xl font-bold text-white outline-none w-full placeholder:text-zinc-800 h-8" placeholder="00.0" />
                        </div>
                        <button onClick={handleUpdate} className={`h-14 w-16 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg ${justUpdated ? 'bg-emerald-500 text-black translate-x-0' : 'bg-white text-black hover:bg-zinc-200 active:scale-90'}`}>
                            {justUpdated ? <Check className="w-6 h-6 animate-in zoom-in" /> : <ArrowRight className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
