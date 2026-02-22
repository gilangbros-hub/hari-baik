import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function LoginPage() {
    const navigate = useNavigate();
    const [_, setUser] = useLocalStorage('rhb_user', null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setUser({ name: 'Guest User', role: 'CPW', mode: 'all-in-one' });
        navigate('/');
    };

    return (
        <div style={{ padding: '2rem 1rem', minHeight: '100vh', backgroundColor: 'var(--surface)' }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>← Kembali</button>

            <h1 className="mb-sm">Selamat Datang</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Masuk untuk melanjutkan perencanaan Anda.</p>

            <form onSubmit={handleSubmit}>
                <div className="mb-md">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Email</label>
                    <input type="email" className="input-base" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-lg">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Password</label>
                    <input type="password" className="input-base" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn-primary mb-md">Masuk</button>

                <div style={{ position: 'relative', textAlign: 'center', margin: '2rem 0' }}>
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
                    <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'var(--surface)', padding: '0 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>ATAU</span>
                </div>

                <button type="button" className="btn-outline" style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-main)', borderColor: 'var(--border)' }}>
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="20" height="20" />
                    Masuk dengan Google
                </button>
            </form>
        </div>
    );
}
