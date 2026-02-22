import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Bell, Heart, LogOut, ChevronRight, Calendar } from 'lucide-react';

export default function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useLocalStorage('rhb_user', { name: 'Pasangan', role: 'CPP', mode: 'all-in-one' });
    const [weddingDate, setWeddingDate] = useLocalStorage('rhb_date', '2025-12-20');

    const [isEditing, setIsEditing] = useState(false);
    const [tempDate, setTempDate] = useState(weddingDate);

    const handleSaveDate = () => {
        setWeddingDate(tempDate);
        setIsEditing(false);
    };

    const logout = () => {
        setUser(null);
        navigate('/landing');
    };

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <header style={{ paddingTop: '1rem', textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0, fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>Profil Saya</h1>

                <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '1rem', boxShadow: 'var(--shadow-md)' }}>
                    <Heart size={48} />
                </div>
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{user?.name || 'Pasangan User'}</h2>
                <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>Peran: {user?.role || 'CPP'} &bull; Mode: {user?.mode === 'all-in-one' ? 'Lengkap' : 'Terfokus'}</p>
            </header>

            <div className="card">
                <div className="flex-between mb-sm">
                    <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={18} color="var(--primary)" /> Tanggal Pernikahan
                    </h3>
                    {!isEditing ? (
                        <button onClick={() => setIsEditing(true)} style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>Ubah</button>
                    ) : (
                        <button onClick={handleSaveDate} style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>Simpan</button>
                    )}
                </div>

                {!isEditing ? (
                    <p style={{ fontSize: '1.1rem', margin: '0.5rem 0 0 0', fontWeight: 500 }}>
                        {new Date(weddingDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                ) : (
                    <input
                        type="date"
                        className="input-base"
                        style={{ marginTop: '0.5rem', marginBottom: 0 }}
                        value={tempDate}
                        onChange={(e) => setTempDate(e.target.value)}
                    />
                )}
            </div>

            <h3 style={{ fontSize: '1rem', margin: '1.5rem 0 0.75rem 0', color: 'var(--text-muted)' }}>Pengaturan</h3>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <button style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <User size={20} color="var(--text-muted)" />
                        <span style={{ fontWeight: 500 }}>Data Diri & Pasangan</span>
                    </div>
                    <ChevronRight size={18} color="var(--text-muted)" />
                </button>

                <button style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Bell size={20} color="var(--text-muted)" />
                        <span style={{ fontWeight: 500 }}>Notifikasi Peringatan</span>
                    </div>
                    <ChevronRight size={18} color="var(--text-muted)" />
                </button>

                <button style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Settings size={20} color="var(--text-muted)" />
                        <span style={{ fontWeight: 500 }}>Pengaturan Aplikasi</span>
                    </div>
                    <ChevronRight size={18} color="var(--text-muted)" />
                </button>
            </div>

            <button onClick={logout} className="btn-outline" style={{ marginTop: '1.5rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                <LogOut size={18} style={{ marginRight: '0.5rem' }} /> Keluar Akun
            </button>

            <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                Rencanakan Hari Baikmu v1.0.0<br />Dibuat dengan ❤️ di Indonesia
            </div>
        </div>
    );
}
