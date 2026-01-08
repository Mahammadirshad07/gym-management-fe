import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginAdmin } from '../api'; // Importing the real API call
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import GymLoader from '../components/GymLoader';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
        alert("Please enter both username and password");
        return;
    }

    setIsLoading(true);

    try {
        // CALL THE BACKEND (Django)
        const response = await loginAdmin(username, password);
        
        // If successful, Django returns { admin: true }
        if (response.data.admin) {
             // 800ms delay just to show the cool loader animation
            setTimeout(() => {
                localStorage.setItem('admin_token', 'true'); 
                navigate('/admin/dashboard');
            }, 800);
        }
    } catch (error) {
        // If Django returns 401 (Unauthorized)
        console.error("Login failed", error);
        alert("Access Denied: Invalid Credentials");
        setIsLoading(false);
    }
  };

  // SHOW LOADER IF LOADING
  if (isLoading) {
      return (
          <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
              <GymLoader />
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative font-sans selection:bg-white selection:text-black">
        
        {/* BACK BUTTON */}
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:bg-zinc-800">
                <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest hidden sm:block">Back to Home</span>
        </Link>

        {/* Subtle Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="w-full max-w-sm z-10 space-y-8">
            
            {/* Header Section */}
            <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-zinc-950 rounded-3xl flex items-center justify-center mx-auto border border-zinc-800 shadow-2xl shadow-black ring-1 ring-zinc-800/50">
                    <ShieldCheck className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-white">BODY<span className="text-zinc-600">FUEL</span></h1>
                    <div className="flex items-center justify-center gap-2 mt-3">
                        <div className="h-px w-8 bg-zinc-800"></div>
                        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-bold">Admin Center</p>
                        <div className="h-px w-8 bg-zinc-800"></div>
                    </div>
                </div>
            </div>

            {/* Login Card */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-1 shadow-2xl">
                <div className="bg-black/50 rounded-[1.3rem] p-6 space-y-6 border border-zinc-900/50">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] text-zinc-500 font-bold uppercase ml-1">Username</label>
                            <div className="relative group">
                                <Input 
                                    placeholder="Enter Admin ID" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    className="bg-zinc-900 border-zinc-800 text-white h-12 rounded-xl focus:border-white/20 focus:ring-0 transition-colors pl-4 placeholder:text-zinc-700"
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-[10px] text-zinc-500 font-bold uppercase ml-1">Password</label>
                            <div className="relative group">
                                <Input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className="bg-zinc-900 border-zinc-800 text-white h-12 rounded-xl focus:border-white/20 focus:ring-0 transition-colors pl-4 placeholder:text-zinc-700 font-mono tracking-widest"
                                />
                                <Lock className="absolute right-4 top-3.5 w-4 h-4 text-zinc-700" />
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full bg-white hover:bg-zinc-200 text-black font-bold h-12 rounded-xl mt-2 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            Authenticate <ArrowRight className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </div>

            <p className="text-center text-zinc-800 text-[10px] font-bold uppercase tracking-widest">
                Protected System • Authorized Personnel Only
            </p>
        </div>
    </div>
  );
}
