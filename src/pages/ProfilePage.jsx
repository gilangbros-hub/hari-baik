import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Bell, Heart, LogOut, ChevronRight, Calendar } from 'lucide-react';

export default function ProfilePage() {
    const navigate = useNavigate();
    const { profile, updateProfile, signOut } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [tempDate, setTempDate] = useState(profile?.wedding_date || '2025-12-20');
    const [saving, setSaving] = useState(false);

    const handleSaveDate = async () => {
        setSaving(true);
        try {
            await updateProfile({ wedding_date: tempDate });
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/landing');
    };

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <header style={{ paddingTop: '1rem', textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0, fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>Profil Saya</h1>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '1rem', boxShadow: 'var(--shadow-md)' }}>
                    <span style={{ fontSize: '48px' }}>❤️</span>
                </div>
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{profile?.name || 'Pasangan'}</h2>
                <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>Peran: {profile?.role || 'CPP'} &bull; Mode: {profile?.mode === 'all-in-one' ? 'Lengkap' : profile?.mode || '-'}</p>
            </header>

            <div className="card">
                <div className="flex-between mb-sm">
                    <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={18} color="var(--primary)" /> Tanggal Pernikahan
                    </h3>
                    {!isEditing ? (
                        <button onClick={() => setIsEditing(true)} style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>Ubah</button>
                    ) : (
                        <button onClick={handleSaveDate} disabled={saving} style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
                    )}
                </div>
                {!isEditing ? (
                    <p style={{ fontSize: '1.1rem', margin: '0.5rem 0 0 0', fontWeight: 500 }}>
                        {profile?.wedding_date ? new Date(profile.wedding_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Belum diatur'}
                    </p>
                ) : (
                    <input type="date" className="input-base" style={{ marginTop: '0.5rem', marginBottom: 0 }} value={tempDate} onChange={(e) => setTempDate(e.target.value)} />
                )}
            </div>

            <h3 style={{ fontSize: '1rem', margin: '1.5rem 0 0.75rem 0', color: 'var(--text-muted)' }}>Pengaturan</h3>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <button style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><User size={20} color="var(--text-muted)" /><span style={{ fontWeight: 500 }}>Data Diri & Pasangan</span></div>
                    <ChevronRight size={18} color="var(--text-muted)" />
                </button>
                <button style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Bell size={20} color="var(--text-muted)" /><span style={{ fontWeight: 500 }}>Notifikasi Peringatan</span></div>
                    <ChevronRight size={18} color="var(--text-muted)" />
                </button>
                <button style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Settings size={20} color="var(--text-muted)" /><span style={{ fontWeight: 500 }}>Pengaturan Aplikasi</span></div>
                    <ChevronRight size={18} color="var(--text-muted)" />
                </button>
            </div>

            <button onClick={handleLogout} className="btn-outline" style={{ marginTop: '1.5rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                <LogOut size={18} style={{ marginRight: '0.5rem' }} /> Keluar Akun
            </button>

            <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Rencanakan Hari Baikmu v1.0.0<br />Dibuat dengan ❤️ di Indonesia</div>
        </div>
    );
}
