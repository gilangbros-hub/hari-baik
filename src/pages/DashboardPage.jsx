import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Calendar, Wallet, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip);

export default function DashboardPage() {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [budgetCats, setBudgetCats] = useState([]);
    const [totalBudget, setTotalBudget] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);
    const [daysLeft, setDaysLeft] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (profile) {
            fetchData();
            const target = new Date(profile.wedding_date).getTime();
            const now = new Date().getTime();
            setDaysLeft(Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24))));
        }
    }, [profile]);

    async function fetchData() {
        setLoading(true);
        try {
            // Fetch tasks
            const taskData = await api.getTasks();
            setTasks(taskData || []);

            const catData = await api.getBudgetCategories();
            setBudgetCats(catData || []);

            const allocated = (catData || []).reduce((s, c) => s + Number(c.allocated), 0);
            setTotalBudget(allocated);

            const payData = await api.getPayments();
            const spent = (payData || []).reduce((s, p) => s + Number(p.amount), 0);
            setTotalSpent(spent);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const progressPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
    const budgetProgress = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

    const upcomingTasks = tasks.filter(t => t.status !== 'done').slice(0, 3);

    const donutData = {
        labels: ['Selesai', 'Belum'],
        datasets: [{ data: [completedTasks, Math.max(0, tasks.length - completedTasks)], backgroundColor: ['#B76E79', '#E8DCD4'], borderWidth: 0 }]
    };
    const donutOptions = { cutout: '75%', plugins: { tooltip: { enabled: false } }, responsive: true, maintainAspectRatio: true };

    if (loading) {
        return <div className="flex-center" style={{ height: '60vh', color: 'var(--text-muted)' }}>Memuat data...</div>;
    }

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <header className="flex-between mb-lg" style={{ paddingTop: '1rem' }}>
                <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Selamat merencanakan,</p>
                    <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Hi, {profile?.name || 'Pasangan'} 👋</h2>
                </div>
                <div style={{ backgroundColor: 'var(--surface)', padding: '0.5rem', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}>
                    <span style={{ fontSize: '20px' }}>❤️</span>
                </div>
            </header>

            {/* Countdown */}
            <div className="card text-center" style={{ backgroundColor: 'var(--primary)', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <span style={{ position: 'absolute', right: '-20px', top: '-20px', fontSize: '120px', opacity: 0.1 }}>❤️</span>
                <h3 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 500, marginBottom: '0.5rem' }}>Countdown Hari H</h3>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '1rem 0' }}>
                    <div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>{daysLeft}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '4px' }}>HARI LAGI</div>
                    </div>
                </div>
                <p style={{ fontSize: '0.85rem', opacity: 0.9, margin: 0 }}>{profile?.wedding_date ? new Date(profile.wedding_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Progress Ring */}
                <div className="card" onClick={() => navigate('/checklist')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckSquare size={16} color="var(--primary)" /> Tugas
                    </h3>
                    <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto', flex: 1 }}>
                        {tasks.length > 0 ? <Doughnut data={donutData} options={donutOptions} /> : <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '6px solid var(--border)' }}></div>}
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 600, fontSize: '1rem', color: 'var(--primary)' }}>{progressPercent}%</div>
                    </div>
                    <p className="text-center mt-sm" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 0 }}>{completedTasks}/{tasks.length} Selesai</p>
                </div>

                {/* Budget Snapshot */}
                <div className="card" onClick={() => navigate('/budget')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Wallet size={16} color="var(--warning)" /> Dana Keluar
                    </h3>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h2 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>{(totalSpent / 1000000).toFixed(1)} JT</h2>
                        <div style={{ backgroundColor: 'var(--border)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ backgroundColor: 'var(--primary)', width: `${Math.min(100, budgetProgress)}%`, height: '100%' }}></div>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: 0 }}>{budgetProgress}% dari target</p>
                    </div>
                </div>
            </div>

            {/* Upcoming Tasks */}
            <h3 className="mt-lg mb-sm" style={{ fontSize: '1.1rem' }}>Tugas Mendatang</h3>
            <div className="card" style={{ padding: '0.5rem' }}>
                {upcomingTasks.length === 0 ? (
                    <p style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Belum ada tugas.</p>
                ) : (
                    upcomingTasks.map((task, idx) => (
                        <div key={task.id} style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', borderBottom: idx < upcomingTasks.length - 1 ? '1px solid var(--border)' : 'none' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid var(--primary)', marginRight: '1rem' }}></div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>{task.title}</h4>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                    <Calendar size={12} /> {task.due_date ? new Date(task.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
                                </p>
                            </div>
                            <div style={{ fontSize: '0.7rem', backgroundColor: 'var(--bg-color)', padding: '0.2rem 0.6rem', borderRadius: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>{task.pic}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
