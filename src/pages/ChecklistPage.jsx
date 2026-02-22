import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Circle, Calendar, User, Plus, X } from 'lucide-react';

export default function ChecklistPage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [activeTab, setActiveTab] = useState('Semua');
    const [showForm, setShowForm] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', category: 'Pernikahan', pic: 'CPP', due_date: '' });
    const [loading, setLoading] = useState(true);

    const categories = ['Semua', 'Tunangan', 'Pernikahan'];

    useEffect(() => {
        fetchTasks();
    }, []);

    async function fetchTasks() {
        setLoading(true);
        try {
            const data = await api.getTasks();
            setTasks(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function toggleTask(id, currentStatus) {
        const newStatus = currentStatus === 'done' ? 'todo' : 'done';
        await api.updateTask(id, { status: newStatus });
        setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    }

    async function addTask(e) {
        e.preventDefault();
        if (!newTask.title.trim()) return;
        try {
            const data = await api.createTask(newTask);
            if (data) {
                setTasks([...tasks, data]);
                setNewTask({ title: '', category: 'Pernikahan', pic: 'CPP', due_date: '' });
                setShowForm(false);
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function deleteTask(id) {
        await api.deleteTask(id);
        setTasks(tasks.filter(t => t.id !== id));
    }

    const filteredTasks = tasks.filter(t => activeTab === 'Semua' || t.category === activeTab);

    if (loading) {
        return <div className="flex-center" style={{ height: '60vh', color: 'var(--text-muted)' }}>Memuat tugas...</div>;
    }

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <header className="mb-md" style={{ paddingTop: '1rem', position: 'sticky', top: 0, backgroundColor: 'var(--bg-color)', zIndex: 10, paddingBottom: '1rem' }}>
                <div className="flex-between mb-sm">
                    <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Daftar Tugas</h1>
                    <button onClick={() => setShowForm(!showForm)} style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.4rem', borderRadius: '50%' }}>
                        {showForm ? <X size={20} /> : <Plus size={20} />}
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setActiveTab(cat)} style={{
                            padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)',
                            backgroundColor: activeTab === cat ? 'var(--primary)' : 'var(--surface)',
                            color: activeTab === cat ? 'white' : 'var(--text-muted)',
                            border: activeTab === cat ? 'none' : '1px solid var(--border)',
                            fontWeight: activeTab === cat ? 500 : 400, whiteSpace: 'nowrap', transition: 'all 0.2s'
                        }}>{cat}</button>
                    ))}
                </div>
            </header>

            {/* Add Task Form */}
            {showForm && (
                <form onSubmit={addTask} className="card mb-md" style={{ padding: '1rem' }}>
                    <input type="text" className="input-base" placeholder="Nama tugas..." required value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        <select className="input-base" style={{ marginBottom: 0 }} value={newTask.category} onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}>
                            <option value="Tunangan">Tunangan</option>
                            <option value="Pernikahan">Pernikahan</option>
                        </select>
                        <select className="input-base" style={{ marginBottom: 0 }} value={newTask.pic} onChange={(e) => setNewTask({ ...newTask, pic: e.target.value })}>
                            <option value="CPP">CPP</option>
                            <option value="CPW">CPW</option>
                        </select>
                    </div>
                    <input type="date" className="input-base" value={newTask.due_date} onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })} />
                    <button type="submit" className="btn-primary">Tambah Tugas</button>
                </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredTasks.length === 0 ? (
                    <div className="text-center" style={{ padding: '3rem 1rem', color: 'var(--text-muted)' }}>Belum ada tugas di kategori ini.</div>
                ) : (
                    filteredTasks.map(task => (
                        <div key={task.id} className="card" style={{ marginBottom: 0, padding: '1rem', opacity: task.status === 'done' ? 0.7 : 1, transition: 'all 0.3s' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                <button onClick={() => toggleTask(task.id, task.status)} style={{ marginTop: '2px' }}>
                                    {task.status === 'done' ? <CheckCircle2 size={24} color="var(--primary)" /> : <Circle size={24} color="var(--border)" />}
                                </button>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: 0, fontSize: '1rem', textDecoration: task.status === 'done' ? 'line-through' : 'none', color: task.status === 'done' ? 'var(--text-muted)' : 'var(--text-main)' }}>{task.title}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}><Calendar size={14} /> {task.due_date ? new Date(task.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}><User size={14} /> {task.pic}</div>
                                        <div style={{ fontSize: '0.7rem', backgroundColor: 'var(--bg-color)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--text-muted)' }}>{task.category}</div>
                                    </div>
                                </div>
                                <button onClick={() => deleteTask(task.id)} style={{ color: 'var(--text-muted)', padding: '4px' }}><X size={16} /></button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
