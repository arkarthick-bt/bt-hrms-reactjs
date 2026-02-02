import React from 'react';
import { Header } from '../components';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="wrapper d-flex flex-column min-vh-100 bg-light">
            <Header />
            <div className="body flex-grow-1 px-3">
                {children}
            </div>
        </div>
    );
};

export default MainLayout;
