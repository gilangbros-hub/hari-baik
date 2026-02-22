import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '2rem 1rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--surface)' }}>
            <div className="text-center mb-xl" style={{ marginTop: '2rem' }}>
                <Heart size={48} color="var(--primary)" style={{ margin: '0 auto', marginBottom: '1rem' }} />
                <h1 style={{ fontSize: '2.2rem', lineHeight: 1.2 }}>Rencanakan<br />Hari Baikmu</h1>
                <p style={{ color: 'var(--text-muted)' }}>Teman setia menuju pernikahan impian Anda.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, justifyContent: 'center' }}>
                <button
                    className="card"
                    onClick={() => navigate('/register')}
                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left', backgroundColor: 'var(--bg-color)' }}
                >
                    <div style={{ backgroundColor: 'var(--primary-light)', padding: '1rem', borderRadius: '50%', color: 'white' }}>
                        <Heart size={24} />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Baru Memulai</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cari inspirasi & vendor</p>
                    </div>
                </button>

                <button
                    className="card"
                    onClick={() => navigate('/register')}
                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left', backgroundColor: 'var(--bg-color)' }}
                >
                    <div style={{ backgroundColor: 'var(--primary)', padding: '1rem', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px' }}>
                        <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>💍</span>
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Sudah Tunangan</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Mulai susun checklist & dana</p>
                    </div>
                </button>
            </div>

            <div className="text-center mt-xl mb-lg">
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Sudah punya akun? <button onClick={() => navigate('/login')} style={{ color: 'var(--primary)', fontWeight: 600 }}>Masuk di sini</button>
                </p>
            </div>
        </div>
    );
}
