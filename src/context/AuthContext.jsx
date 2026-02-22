import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getToken } from '../lib/api';

const AuthContext = createContext({});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session on mount
        checkSession();
    }, []);

    async function checkSession() {
        try {
            const token = getToken();
            if (!token) {
                setLoading(false);
                return;
            }

            const sessionData = await api.getSession();
            if (sessionData) {
                setUser(sessionData.user);
                setProfile(sessionData.profile);
            }
        } catch {
            setUser(null);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    }

    async function signUp(email, password, name, role) {
        const data = await api.signup(email, password, name, role);
        if (data.user) {
            setUser(data.user);
            // Fetch the full profile
            try {
                const profileData = await api.getProfile();
                setProfile(profileData);
            } catch {
                // Profile will be loaded on next session check
            }
        }
        return data;
    }

    async function signIn(email, password) {
        const data = await api.login(email, password);
        if (data.user) {
            setUser(data.user);
            // Fetch the full profile
            try {
                const profileData = await api.getProfile();
                setProfile(profileData);
            } catch {
                // Profile will be loaded on next session check
            }
        }
        return data;
    }

    async function signOut() {
        await api.logout();
        setUser(null);
        setProfile(null);
    }

    async function updateProfile(updates) {
        const data = await api.updateProfile(updates);
        setProfile(data);
        return data;
    }

    const value = {
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
