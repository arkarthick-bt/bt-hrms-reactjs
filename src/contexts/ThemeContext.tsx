import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeType = 'blue' | 'green' | 'purple' | 'dark';

type ThemeContextType = {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<ThemeType>(() => {
        return (localStorage.getItem('bonton-theme') as ThemeType) || 'blue';
    });

    useEffect(() => {
        localStorage.setItem('bonton-theme', theme);
        // Apply to data-theme attribute
        document.documentElement.setAttribute('data-theme', theme);
        // Also keep coreui-theme sync for coreui components fallback
        document.documentElement.setAttribute('data-coreui-theme', theme === 'dark' ? 'dark' : 'light');
    }, [theme]);

    const setTheme = (newTheme: ThemeType) => {
        setThemeState(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
