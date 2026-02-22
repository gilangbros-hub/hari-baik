import React, { useState } from 'react';
import { defaultVendors } from '../data/mockData';
import { Star, MapPin, MessageCircle, Filter, Search } from 'lucide-react';

export default function VendorPage() {
    const [vendors] = useState(defaultVendors);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('Semua');

    const categories = ['Semua', 'Venue', 'Catering', 'Dekorasi', 'Dokumentasi', 'MUA'];

    const filteredVendors = vendors.filter(v => {
        const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = activeCategory === 'Semua' || v.category === activeCategory;
        return matchesSearch && matchesCat;
    });

    const openWhatsApp = (phone) => {
        // In real app: window.open(`https://wa.me/${phone}`, '_blank');
        alert(`Membuka WhatsApp ke: ${phone}`);
    };

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <header style={{ paddingTop: '1rem', position: 'sticky', top: 0, backgroundColor: 'var(--bg-color)', zIndex: 10, paddingBottom: '1rem' }}>
                <h1 style={{ margin: 0, fontSize: '1.5rem', marginBottom: '1rem' }}>Temukan Vendor</h1>

                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                    <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Cari vendor atau kategori..."
                        className="input-base"
                        style={{ paddingLeft: '3rem', marginBottom: 0, borderRadius: 'var(--radius-full)' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                padding: '0.4rem 1rem',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: activeCategory === cat ? 'var(--text-main)' : 'var(--surface)',
                                color: activeCategory === cat ? 'white' : 'var(--text-main)',
                                border: activeCategory === cat ? 'none' : '1px solid var(--border)',
                                fontSize: '0.85rem',
                                fontWeight: activeCategory === cat ? 500 : 400,
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingTop: '0.5rem' }}>
                {filteredVendors.map(vendor => (
                    <div key={vendor.id} className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 0 }}>
                        <div style={{ height: '200px', backgroundImage: `url(${vendor.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        </div>
                        <div style={{ padding: '1.25rem' }}>
                            <div className="flex-between mb-sm">
                                <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--primary-light)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 500 }}>
                                    {vendor.category}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
                                    <Star size={16} color="var(--warning)" fill="var(--warning)" />
                                    {vendor.rating} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({vendor.reviews})</span>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0' }}>{vendor.name}</h3>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                <MapPin size={16} /> {vendor.location}
                            </div>

                            <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '1.25rem' }}>
                                {vendor.priceRange}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="btn-outline" style={{ flex: 1, padding: '0.6rem', fontSize: '0.9rem' }}>
                                    Lihat Detail
                                </button>
                                <button
                                    className="btn-primary"
                                    style={{ flex: 1, padding: '0.6rem', fontSize: '0.9rem', backgroundColor: '#25D366', color: 'white', border: 'none' }}
                                    onClick={() => openWhatsApp(vendor.contact)}
                                >
                                    <MessageCircle size={18} style={{ marginRight: '0.5rem' }} /> Tanya WA
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredVendors.length === 0 && (
                    <div className="text-center" style={{ padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                        Vendor tidak ditemukan.
                    </div>
                )}
            </div>
        </div>
    );
}
