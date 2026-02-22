export const defaultChecklist = [
    { id: '1', title: 'Tentukan Tanggal & Konsep', category: 'Tunangan', status: 'done', pic: 'CPP', dueDate: '2023-10-01' },
    { id: '2', title: 'Beli Cincin Tunangan', category: 'Tunangan', status: 'done', pic: 'CPP', dueDate: '2023-10-15' },
    { id: '3', title: 'Booking Venue Tunangan', category: 'Tunangan', status: 'done', pic: 'CPW', dueDate: '2023-11-01' },
    { id: '4', title: 'Survey Venue Pernikahan', category: 'Pernikahan', status: 'in-progress', pic: 'CPW', dueDate: '2024-02-01' },
    { id: '5', title: 'DP Catering', category: 'Pernikahan', status: 'todo', pic: 'CPP', dueDate: '2024-03-01' },
    { id: '6', title: 'Cari MUA, Foto & Video', category: 'Pernikahan', status: 'todo', pic: 'CPW', dueDate: '2024-04-01' },
];

export const defaultBudget = {
    total: 150000000,
    categories: [
        { id: 'c1', name: 'Venue & Catering', allocated: 80000000, spent: 10000000, color: '#B76E79' },
        { id: 'c2', name: 'MUA & Busana', allocated: 20000000, spent: 5000000, color: '#e6a8b1' },
        { id: 'c3', name: 'Dokumentasi', allocated: 15000000, spent: 5000000, color: '#8c4c56' },
        { id: 'c4', name: 'Dekorasi', allocated: 25000000, spent: 0, color: '#d69ca4' },
        { id: 'c5', name: 'Lain-lain', allocated: 10000000, spent: 2000000, color: '#E8DCD4' },
    ]
};

export const defaultVendors = [
    {
        id: 'v1',
        name: 'Griya Persada Venue',
        category: 'Venue',
        location: 'Jakarta Selatan',
        rating: 4.8,
        reviews: 124,
        priceRange: 'Rp 30jt - 50jt',
        image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80',
        contact: '6281234567890'
    },
    {
        id: 'v2',
        name: 'Rasa Nusantara Catering',
        category: 'Catering',
        location: 'Jakarta Timur',
        rating: 4.9,
        reviews: 210,
        priceRange: 'Mulai Rp 150k/pax',
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80',
        contact: '6289876543210'
    },
    {
        id: 'v3',
        name: 'Estetika Studio',
        category: 'Dokumentasi',
        location: 'Tangerang',
        rating: 4.7,
        reviews: 89,
        priceRange: 'Rp 8jt - 15jt',
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80',
        contact: '628111222333'
    },
    {
        id: 'v4',
        name: 'Ayu MUA Jakarta',
        category: 'MUA',
        location: 'Jakarta Barat',
        rating: 5.0,
        reviews: 156,
        priceRange: 'Rp 5jt - 10jt',
        image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80',
        contact: '628555666777'
    }
];
