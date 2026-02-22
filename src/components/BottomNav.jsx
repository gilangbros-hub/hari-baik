import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CheckSquare, Wallet, Store, User } from 'lucide-react';

export default function BottomNav() {
    const navItems = [
        { to: '/', icon: <Home size={24} />, label: 'Beranda' },
        { to: '/checklist', icon: <CheckSquare size={24} />, label: 'Tugas' },
        { to: '/budget', icon: <Wallet size={24} />, label: 'Dana' },
        { to: '/vendor', icon: <Store size={24} />, label: 'Vendor' },
        { to: '/profile', icon: <User size={24} />, label: 'Profil' },
    ];

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '480px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-around',
            padding: '0.75rem 0 1.25rem 0',
            zIndex: 50,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.04)'
        }}>
            {navItems.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    style={({ isActive }) => ({
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                        textDecoration: 'none',
                        fontSize: '0.7rem',
                        fontWeight: isActive ? '600' : '400',
                        transition: 'all 0.2s',
                        gap: '4px',
                        transform: isActive ? 'translateY(-2px)' : 'none'
                    })}
                >
                    {item.icon}
                    <span>{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
}
