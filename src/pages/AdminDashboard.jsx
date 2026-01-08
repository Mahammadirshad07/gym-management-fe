import React, { useEffect, useState } from 'react';
import { getAllUsers, createUser, updateSubscription, deleteUser } from '../api';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, X, ArrowRight, LogOut, Calendar as CalendarIcon, Dumbbell, Loader2, CheckCircle2, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Toaster, toast } from 'sonner';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getAllUsers()
      .then(res => {
          setUsers(res.data);
          setTimeout(() => setLoading(false), 300);
      })
      .catch(err => {
          console.error(err);
          setLoading(false);
      });
  }, [refresh]);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.mobile_number.includes(search)
  );
  
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black pb-24">
      
      {/* TOAST NOTIFICATION CONTAINER */}
      <Toaster position="top-center" theme="dark" />

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-zinc-900/50">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-black shadow-lg shadow-white/10 shrink-0">
                    <Dumbbell className="w-5 h-5" strokeWidth={2.5} />
                </div>
                
                <h1 className="font-bold tracking-tight text-lg leading-none">
                    BODY<span className="text-zinc-500">FUEL</span> 
                    <span className="hidden sm:inline-block text-[10px] bg-zinc-900 px-2 py-0.5 rounded text-zinc-500 ml-2 uppercase tracking-wider font-mono align-middle">Command</span>
                </h1>
            </div>
            
            <div className="flex items-center gap-4">
                <Button onClick={handleLogout} variant="ghost" size="sm" className="text-zinc-500 hover:text-white hover:bg-zinc-900 gap-2">
                    <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Exit System</span>
                    <LogOut className="w-4 h-4" />
                </Button>
            </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-6 md:pt-10 space-y-6 md:space-y-8">
        
        {/* ACTIONS & SEARCH */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Member Database</h2>
                <p className="text-zinc-500 text-sm mt-1">
                    {loading ? "Syncing database..." : `Manage ${users.length} active members.`}
                </p>
            </div>
            
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                <div className="relative group w-full md:w-64">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search members..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 text-sm py-2.5 pl-10 pr-4 rounded-xl text-white outline-none focus:border-white/20 transition-all placeholder:text-zinc-600 h-11"
                    />
                </div>
                <button 
                    onClick={() => setShowCreate(!showCreate)}
                    className={`h-11 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 w-full sm:w-auto ${showCreate ? 'bg-zinc-800 text-white' : 'bg-white text-black hover:bg-zinc-200'}`}
                >
                    {showCreate ? <X className="w-4 h-4"/> : <Plus className="w-4 h-4"/>}
                    {showCreate ? 'Cancel' : 'Add Member'}
                </button>
            </div>
        </div>

        {/* CREATE MEMBER PANEL */}
        {showCreate && (
            <div className="animate-in slide-in-from-top-4 fade-in duration-300">
                <CreateMemberForm onSuccess={() => { setRefresh(!refresh); setShowCreate(false); }} />
            </div>
        )}

        {/* DATA GRID WITH SKELETON LOADER */}
        <div className="grid grid-cols-1 gap-4">
            {loading ? (
                // SKELETON LOADER
                Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 flex items-center gap-6 animate-pulse">
                        <div className="w-12 h-12 bg-zinc-900 rounded-xl shrink-0"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-zinc-900 rounded w-1/3"></div>
                            <div className="h-3 bg-zinc-900 rounded w-1/4"></div>
                        </div>
                        <div className="hidden md:block w-32 h-8 bg-zinc-900 rounded-lg"></div>
                    </div>
                ))
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
                    <p className="text-zinc-500 text-sm">No members found matching "{search}"</p>
                </div>
            ) : (
                filteredUsers.map((user) => (
                    <MemberCard key={user.id} user={user} onUpdate={() => setRefresh(!refresh)} />
                ))
            )}
        </div>
      </main>
    </div>
  );
}

// ----------------------------------------------------------------------
// MEMBER CARD
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// MEMBER CARD (With Toast Confirmation)
// ----------------------------------------------------------------------
function MemberCard({ user, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [subEnd, setSubEnd] = useState(user.subscription_end_date ? new Date(user.subscription_end_date) : null);
    
    const today = new Date();
    const endDate = new Date(user.subscription_end_date);
    const isExpired = endDate < today;

    // SAVE LOGIC
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const dateStr = subEnd ? format(subEnd, "yyyy-MM-dd") : "";
            await updateSubscription(user.id, { subscription_end_date: dateStr });
            
            toast.success("Subscription Updated", {
                description: `Extended access for ${user.name}`,
                icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
            });

            setIsEditing(false);
            onUpdate();
        } catch (error) { 
            toast.error("Update Failed"); 
        } finally {
            setIsSaving(false);
        }
    };

    // DELETE LOGIC (Triggered by Toast Action)
    const performDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteUser(user.id);
            toast.success("Member Removed", { 
                icon: <Trash2 className="w-4 h-4 text-red-500"/> 
            });
            onUpdate();
        } catch (error) {
            toast.error("Delete Failed");
            setIsDeleting(false);
        }
    };

    // INITIAL CLICK (Shows the Toast)
    const handleDeleteClick = () => {
        toast("Delete Member?", {
            description: `Permanently remove ${user.name} from database?`,
            action: {
                label: "Delete",
                onClick: performDelete, // Calls the function above
            },
            cancel: {
                label: "Cancel",
            },
            // Style the delete button to be red
            actionButtonStyle: { backgroundColor: '#ef4444', color: 'white' },
        });
    };

    return (
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 group transition-all hover:bg-zinc-900/20">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${!isExpired ? 'bg-zinc-900 text-white' : 'bg-red-950 text-red-500'}`}>
                    {user.name.charAt(0)}
                </div>
                <div className="min-w-0">
                    <h3 className="font-bold text-white text-lg leading-none truncate">{user.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-zinc-500 font-mono">
                        <span>{user.mobile_number}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-800 hidden sm:block"></span>
                        <span className="truncate max-w-[120px]">{user.location}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between w-full md:w-auto md:gap-8 border-t border-zinc-900 md:border-0 pt-3 md:pt-0">
                <div className="text-sm">
                    <p className="text-[10px] text-zinc-600 uppercase font-bold mb-0.5">Trainer</p>
                    <p className="font-medium text-zinc-300 truncate max-w-[100px]">{user.trainer_name || '—'}</p>
                </div>
                
                <div className="text-sm text-right md:text-left">
                    <p className="text-[10px] text-zinc-600 uppercase font-bold mb-0.5">Expires</p>
                    {isEditing ? (
                         <div className="w-32"><DatePicker selected={subEnd} onSelect={setSubEnd} /></div>
                    ) : (
                        <p className={`font-mono font-bold ${isExpired ? 'text-red-500' : 'text-white'}`}>
                            {user.subscription_end_date}
                        </p>
                    )}
                </div>
            </div>

            <div className="w-full md:w-auto flex justify-end gap-2">
                {isEditing ? (
                    <>
                         <button onClick={() => setIsEditing(false)} disabled={isSaving} className="flex-1 md:flex-none px-3 py-2 text-xs font-bold text-zinc-500 hover:text-white bg-zinc-900 rounded-lg disabled:opacity-50">Cancel</button>
                         <button onClick={handleSave} disabled={isSaving} className="flex-1 md:flex-none w-20 px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-zinc-200 flex items-center justify-center">
                            {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save'}
                         </button>
                    </>
                ) : (
                    <>
                        {/* DELETE BUTTON */}
                        <button 
                            onClick={handleDeleteClick}
                            disabled={isDeleting}
                            className="w-10 h-10 flex items-center justify-center rounded-lg border border-zinc-800 text-zinc-500 hover:text-white hover:bg-red-500/10 hover:border-red-500/50 transition-all active:scale-95"
                            title="Delete Member"
                        >
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Trash2 className="w-4 h-4" />}
                        </button>

                        {/* EDIT BUTTON */}
                        <button 
                            onClick={() => setIsEditing(true)} 
                            className="w-full md:w-auto px-4 py-2 bg-zinc-900 text-zinc-400 text-xs font-bold rounded-lg hover:text-white hover:bg-zinc-800 transition-colors border border-zinc-800"
                        >
                            Edit Access
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}


// ----------------------------------------------------------------------
// CREATE FORM
// ----------------------------------------------------------------------
function CreateMemberForm({ onSuccess }) {
    const [formData, setFormData] = useState({ name: '', mobile_number: '', location: '', trainer_name: '' });
    const [joinDate, setJoinDate] = useState();
    const [subStart, setSubStart] = useState();
    const [subEnd, setSubEnd] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            joining_date: joinDate ? format(joinDate, "yyyy-MM-dd") : "",
            subscription_start_date: subStart ? format(subStart, "yyyy-MM-dd") : "",
            subscription_end_date: subEnd ? format(subEnd, "yyyy-MM-dd") : "",
            is_paid: true
        };
        if(!finalData.joining_date || !finalData.subscription_end_date) {
            alert("Please select all dates");
            return;
        }
        try {
            await createUser(finalData);
            onSuccess();
            toast.success("Member Registered");
        } catch (error) { toast.error("Registration Failed"); }
    };
    
    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 md:p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-white rounded-full"></div>
                New Member Registration
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <InputGroup label="Full Name" name="name" ph="Ex. John Doe" onChange={handleChange} />
                    <InputGroup label="Mobile Number" name="mobile_number" ph="9876543210" onChange={handleChange} />
                    <InputGroup label="Location" name="location" ph="City/Area" onChange={handleChange} />
                    <InputGroup label="Trainer (Optional)" name="trainer_name" ph="Coach Name" onChange={handleChange} />
                </div>
                <div className="h-px bg-zinc-800 w-full my-2"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <div className="space-y-1.5"><label className="text-[10px] text-zinc-500 uppercase font-bold ml-1">Joining Date</label><DatePicker selected={joinDate} onSelect={setJoinDate} /></div>
                    <div className="space-y-1.5"><label className="text-[10px] text-zinc-500 uppercase font-bold ml-1">Sub Start</label><DatePicker selected={subStart} onSelect={setSubStart} /></div>
                    <div className="space-y-1.5"><label className="text-[10px] text-zinc-500 uppercase font-bold ml-1">Sub End</label><DatePicker selected={subEnd} onSelect={setSubEnd} /></div>
                </div>
                <div className="pt-4 flex justify-end">
                    <button type="submit" className="w-full md:w-auto bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-transform active:scale-95 flex items-center justify-center gap-2">Confirm Registration <ArrowRight className="w-4 h-4"/></button>
                </div>
            </form>
        </div>
    )
}

function DatePicker({ selected, onSelect }) {
    return (
        <Popover>
            <PopoverTrigger asChild><Button variant={"outline"} className={cn("w-full bg-zinc-950 border-zinc-800 text-left font-normal h-11 rounded-xl text-white hover:bg-zinc-900 hover:text-white justify-start px-3",!selected && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4 text-zinc-500 shrink-0" /><span className="truncate">{selected ? format(selected, "PPP") : <span className="text-zinc-600">Pick date</span>}</span></Button></PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-zinc-950 border-zinc-800" align="start"><Calendar mode="single" selected={selected} onSelect={onSelect} initialFocus className="bg-zinc-950 text-white" /></PopoverContent>
        </Popover>
    )
}

function InputGroup({ label, name, ph, onChange }) {
    return (
        <div className="space-y-1.5"><label className="text-[10px] text-zinc-500 uppercase font-bold ml-1">{label}</label><input name={name} placeholder={ph} onChange={onChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-white/30 outline-none transition-colors placeholder:text-zinc-700" required /></div>
    )
}
