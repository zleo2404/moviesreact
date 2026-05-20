import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('cinema_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('cinema_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('cinema_user');
        }
    }, [user]);

    const logout = async (navigateCallback) => {
        try {
            await fetch('https://localhost:7275/api/Users/logout', { 
                method: 'POST', 
                credentials: 'include' 
            });
            setUser(null); 
            if (navigateCallback) navigateCallback('/');
        } catch (err) {
            console.error("Logout error", err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login: setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}