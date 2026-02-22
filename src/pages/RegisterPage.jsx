import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { signUp } = useAuth();
    const [formData, setFormData] = useState({ name: '', role: 'CPP', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signUp(formData.email, formData.password, formData.name, formData.role);
            navigate('/mode');
        } catch (err) {
            setError(err.message || 'Pendaftaran gagal. Coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem 1rem', minHeight: '100vh', backgroundColor: 'var(--surface)' }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
                ← Kembali
            </button>

            <h1 className="mb-sm">Buat Akun</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Daftar untuk menyimpan profil Anda.</p>

            {error && (
                <div style={{ backgroundColor: '#fde8e8', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-md">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Nama Lengkap</label>
                    <input type="text" className="input-base" placeholder="John Doe" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>

                <div className="mb-md">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Peran Anda</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" className={formData.role === 'CPP' ? 'btn-primary' : 'btn-outline'} style={{ flex: 1 }} onClick={() => setFormData({ ...formData, role: 'CPP' })}>CPP</button>
                        <button type="button" className={formData.role === 'CPW' ? 'btn-primary' : 'btn-outline'} style={{ flex: 1 }} onClick={() => setFormData({ ...formData, role: 'CPW' })}>CPW</button>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>* Calon Pasangan Pria / Wanita</p>
                </div>

                <div className="mb-md">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Email</label>
                    <input type="email" className="input-base" placeholder="nama@email.com" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>

                <div className="mb-lg">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Password</label>
                    <input type="password" className="input-base" placeholder="••••••••" required minLength={6} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>

                <button type="submit" className="btn-primary mb-md" disabled={loading}>
                    {loading ? 'Mendaftar...' : 'Lanjutkan'}
                </button>

                <div style={{ position: 'relative', textAlign: 'center', margin: '2rem 0' }}>
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
                    <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'var(--surface)', padding: '0 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>ATAU</span>
                </div>

                <button type="button" className="btn-outline" style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-main)', borderColor: 'var(--border)' }}>
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="20" height="20" />
                    Daftar dengan Google
                </button>
            </form>
        </div>
    );
}
