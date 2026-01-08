import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Dumbbell, ShieldCheck, ArrowRight, Activity } from 'lucide-react';

// Import your other pages here
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserPortal from './pages/UserPortal';
import ProtectedRoute from './components/ProtectedRoute';

// ----------------------------------------------------------------------
// HOME COMPONENT (Inline)
// ----------------------------------------------------------------------
function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden selection:bg-white selection:text-black font-sans">
        
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Hero Content */}
      <div className="z-10 text-center space-y-12 w-full max-w-4xl px-6 animate-in fade-in zoom-in duration-700 slide-in-from-bottom-4">
          
          {/* LOGO SECTION */}
          <div className="space-y-6">
              <div className="relative w-24 h-24 mx-auto group">
                  <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full group-hover:bg-white/30 transition-all duration-500"></div>
                  <div className="relative w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-white/10 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
                      <Dumbbell className="w-12 h-12 text-black" strokeWidth={2} />
                  </div>
              </div>
              
              <div>
                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-tight">
                      BODY<span className="text-zinc-600">FUEL</span>
                  </h1>
                  <div className="flex items-center justify-center gap-3 mt-4 opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300 fill-mode-forwards">
                      <div className="h-px w-8 bg-zinc-800"></div>
                      <p className="text-zinc-500 text-xs md:text-sm font-bold uppercase tracking-[0.4em]">
                          Elite Performance Systems
                      </p>
                      <div className="h-px w-8 bg-zinc-800"></div>
                  </div>
              </div>
          </div>

          {/* NAVIGATION CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mx-auto pt-4">
              
              {/* MEMBER PORTAL CARD (FIXED BORDER & SHADOW) */}
              <Link to="/user" className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-zinc-700 to-black rounded-2xl opacity-50 blur group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative h-full bg-zinc-950 border border-zinc-800 group-hover:border-zinc-500 p-6 md:p-8 rounded-2xl transition-all duration-300 flex flex-col items-start gap-4 hover:-translate-y-1 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-300 border border-zinc-800">
                          <Activity className="w-6 h-6 text-zinc-400 group-hover:text-black" />
                      </div>
                      <div className="text-left w-full">
                          <div className="flex justify-between items-center">
                              <h3 className="text-white font-bold text-xl">Member Access</h3>
                              <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-white -translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                          </div>
                          <p className="text-zinc-500 text-xs font-mono mt-1 group-hover:text-zinc-400">View status & updates</p>
                      </div>
                  </div>
              </Link>

              {/* ADMIN ACCESS CARD */}
              <Link to="/admin" className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-white/20 to-black rounded-2xl opacity-0 blur group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative h-full bg-white border border-white p-6 md:p-8 rounded-2xl transition-all duration-300 flex flex-col items-start gap-4 hover:bg-zinc-200 hover:-translate-y-1 shadow-xl">
                      <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
                          <ShieldCheck className="w-6 h-6 text-black group-hover:text-white" />
                      </div>
                      <div className="text-left w-full">
                          <div className="flex justify-between items-center">
                              <h3 className="text-black font-bold text-xl">Admin Center</h3>
                              <ArrowRight className="w-5 h-5 text-black -translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                          </div>
                          <p className="text-zinc-600 text-xs font-mono mt-1 font-medium">Restricted Personnel</p>
                      </div>
                  </div>
              </Link>

          </div>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-60">
          <p className="text-zinc-800 text-[10px] font-bold uppercase tracking-widest">
              Secure System v2.1
          </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// MAIN APP COMPONENT
// ----------------------------------------------------------------------
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/user" element={<UserPortal />} />
        
        {/* Protected Admin Route */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
