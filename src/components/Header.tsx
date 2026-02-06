import React, { useState } from 'react';
import {
    CHeader,
    CContainer,
    CHeaderNav,
    CNavItem,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CButton,
    CTooltip,
    CToaster,
    CToast,
    CToastBody,
    CBadge,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
    cilUser,
    cilAccountLogout,
    cilHome,
    cilSearch,
    cilBell,
    cilSettings,
    cilMoon,
    cilSun,
} from '@coreui/icons';
import { useAuth, useTheme } from '../contexts';
import { API_BASE_URL, API_ENDPOINTS } from '../config/config';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const { user, logout, scopes } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Search functionality
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);

    const themes = [
        { id: 'blue', color: '#2563EB', name: 'Ocean Blue', gradient: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)' },
        { id: 'green', color: '#059669', name: 'Forest Green', gradient: 'linear-gradient(135deg, #059669 0%, #10B981 100%)' },
        { id: 'purple', color: '#7C3AED', name: 'Royal Purple', gradient: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)' },
        { id: 'dark', color: '#1E293B', name: 'Midnight Dark', gradient: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)' }
    ];

    const searchableModules = [
        { name: 'Home', path: '/', permission: 'home.view', icon: '🏠', color: 'var(--primary)' },
        { name: 'Dashboard', path: '/dashboard', permission: 'dashboard.view', icon: '📊', color: 'var(--mod-primary)' },
        { name: 'Employee Directory', path: '/employees', permission: 'employee.view', icon: '👥', color: 'var(--mod-secondary)' },
        { name: 'Leave Management', path: '/leave', permission: 'leave.view', icon: '📅', color: 'var(--mod-accent)' },
        { name: 'Payroll & Salary', path: '/payroll', permission: 'payroll.view', icon: '💰', color: 'var(--mod-primary)' },
        { name: 'Attendance Tracker', path: '/attendance', permission: 'attendance.view', icon: '⏱️', color: 'var(--mod-secondary)' },
        { name: 'Performance Reviews', path: '/performance', permission: 'performance.view', icon: '📈', color: 'var(--mod-accent)' },
        { name: 'Roles & Permissions', path: '/roles', permission: 'role.view', icon: '🔒', color: 'var(--mod-secondary)' },
        { name: 'Profile Settings', path: '/profile', permission: 'profile.view', icon: '👤', color: 'var(--accent)' },
    ];

    const filteredModules = searchableModules.filter(module =>
        (scopes.includes(module.permission) || module.permission === 'profile.view' || module.permission === 'home.view') &&
        module.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        searchQuery.length > 0
    );

    const handleLogout = async () => {
        setToastMessage(`Goodbye, ${user?.displayName || 'User'}! 👋`);
        setShowToast(true);

        setTimeout(async () => {
            await logout(API_BASE_URL + API_ENDPOINTS.AUTH.LOGOUT);
            setShowToast(false);
            navigate('/login');
        }, 1200);
    };

    const currentTheme = themes.find(t => t.id === theme) || themes[0];

    return (
        <CHeader position="sticky" className="elegant-header mb-4">
            <CContainer fluid className="px-4">
                <CHeaderNav className="d-flex align-items-center me-auto">
                    {/* Logo */}
                    <CNavItem className="me-4">
                        <div 
                            onClick={() => navigate('/')} 
                            className="logo-container d-flex align-items-center"
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="logo-icon">
                                <span className="logo-text">BT</span>
                            </div>
                            <div className="d-none d-lg-block ms-2">
                                <div className="brand-name">BonTon</div>
                                <div className="brand-tagline">HRMS</div>
                            </div>
                        </div>
                    </CNavItem>

                    {/* Home Button */}
                    <CNavItem className="me-3 d-none d-md-block">
                        <CTooltip content="Home">
                            <CButton 
                                variant="ghost" 
                                onClick={() => navigate('/')}
                                className="icon-btn"
                            >
                                <CIcon icon={cilHome} size="lg" />
                            </CButton>
                        </CTooltip>
                    </CNavItem>

                    {/* Search Bar */}
                    <CNavItem className="position-relative d-none d-lg-block search-container">
                        <div className="search-wrapper">
                            <CIcon icon={cilSearch} className="search-icon" />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search modules..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowResults(true);
                                }}
                                onFocus={() => setShowResults(true)}
                                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                            />
                            {searchQuery && (
                                <button 
                                    className="search-clear"
                                    onClick={() => setSearchQuery('')}
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        {/* Search Results */}
                        {showResults && filteredModules.length > 0 && (
                            <div className="search-results">
                                {filteredModules.map((module) => (
                                    <div
                                        key={module.path}
                                        className="search-result-item"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            navigate(module.path);
                                            setSearchQuery('');
                                            setShowResults(false);
                                        }}
                                    >
                                        <div className="result-icon" style={{ background: module.color }}>
                                            {module.icon}
                                        </div>
                                        <span className="result-name">{module.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CNavItem>
                </CHeaderNav>

                <CHeaderNav className="ms-auto d-flex align-items-center">
                    {/* Notifications */}
                    <CNavItem className="me-2 d-none d-md-block">
                        <CTooltip content="Notifications">
                            <CButton variant="ghost" className="icon-btn position-relative">
                                <CIcon icon={cilBell} size="lg" />
                                <CBadge 
                                    color="danger" 
                                    position="top-end" 
                                    shape="rounded-pill"
                                    className="notification-badge"
                                >
                                    3
                                </CBadge>
                            </CButton>
                        </CTooltip>
                    </CNavItem>

                    {/* Theme Switcher */}
                    <CDropdown variant="nav-item" alignment="end" className="me-2">
                        <CDropdownToggle caret={false} className="p-0 border-0 bg-transparent">
                            <CTooltip content="Change Theme">
                                <div className="theme-toggle-btn">
                                    <div 
                                        className="theme-preview" 
                                        style={{ background: currentTheme.gradient }}
                                    />
                                </div>
                            </CTooltip>
                        </CDropdownToggle>
                        <CDropdownMenu className="theme-menu">
                            <div className="theme-menu-header">Choose Theme</div>
                            <div className="theme-grid">
                                {themes.map((t) => (
                                    <div
                                        key={t.id}
                                        onClick={() => setTheme(t.id as any)}
                                        className={`theme-option ${theme === t.id ? 'active' : ''}`}
                                    >
                                        <div 
                                            className="theme-color" 
                                            style={{ background: t.gradient }}
                                        >
                                            {theme === t.id && <span className="check-mark">✓</span>}
                                        </div>
                                        <div className="theme-name">{t.name}</div>
                                    </div>
                                ))}
                            </div>
                        </CDropdownMenu>
                    </CDropdown>

                    {/* User Profile */}
                    <CDropdown variant="nav-item" alignment="end">
                        <CDropdownToggle className="p-0 border-0 bg-transparent" caret={false}>
                            <div className="user-profile-btn">
                                <div className="user-avatar">
                                    {(user?.displayName || user?.name || user?.username || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div className="d-none d-sm-block ms-2 user-info">
                                    <div className="user-name">
                                        {user?.displayName || user?.name || user?.username || 'User'}
                                    </div>
                                    <div className="user-role">Administrator</div>
                                </div>
                            </div>
                        </CDropdownToggle>
                        <CDropdownMenu className="user-menu">
                            <div className="user-menu-header">
                                <div className="user-menu-avatar">
                                    {(user?.displayName || user?.name || user?.username || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div className="user-menu-info">
                                    <div className="user-menu-name">{user?.displayName || user?.name || user?.username}</div>
                                    <div className="user-menu-email">{user?.email || 'user@bonton.com'}</div>
                                </div>
                            </div>
                            <div className="dropdown-divider"></div>
                            <CDropdownItem onClick={() => navigate('/profile')} className="menu-item">
                                <CIcon icon={cilUser} className="me-3" />
                                My Profile
                            </CDropdownItem>
                            <CDropdownItem onClick={() => navigate('/settings')} className="menu-item">
                                <CIcon icon={cilSettings} className="me-3" />
                                Settings
                            </CDropdownItem>
                            <div className="dropdown-divider"></div>
                            <CDropdownItem onClick={handleLogout} className="menu-item logout-item">
                                <CIcon icon={cilAccountLogout} className="me-3" />
                                Logout
                            </CDropdownItem>
                        </CDropdownMenu>
                    </CDropdown>
                </CHeaderNav>
            </CContainer>

            <style>{`
                .elegant-header {
                    background: var(--surface);
                    border-bottom: 1px solid var(--border);
                    box-shadow: var(--shadow-sm);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    transition: all var(--transition-base);
                }

                /* Logo */
                .logo-container {
                    transition: transform var(--transition-base);
                }

                .logo-container:hover {
                    transform: scale(1.05);
                }

                .logo-icon {
                    width: 40px;
                    height: 40px;
                    background: var(--gradient-primary);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: var(--shadow);
                    transition: all var(--transition-base);
                }

                .logo-icon:hover {
                    box-shadow: var(--shadow-md);
                    transform: rotate(-5deg);
                }

                .logo-text {
                    color: white;
                    font-weight: 700;
                    font-size: 18px;
                    font-family: 'Poppins', sans-serif;
                }

                .brand-name {
                    font-weight: 700;
                    font-size: 16px;
                    color: var(--text-primary);
                    line-height: 1.2;
                    font-family: 'Poppins', sans-serif;
                }

                .brand-tagline {
                    font-size: 10px;
                    color: var(--text-muted);
                    font-weight: 600;
                    letter-spacing: 2px;
                }

                /* Icon Buttons */
                .icon-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-secondary);
                    transition: all var(--transition-fast);
                    border: 1px solid transparent;
                }

                .icon-btn:hover {
                    background: var(--surface-hover);
                    color: var(--primary);
                    border-color: var(--border);
                    transform: translateY(-2px);
                }

                .notification-badge {
                    font-size: 9px;
                    padding: 2px 5px;
                    min-width: 18px;
                }

                /* Search */
                .search-container {
                    width: 350px;
                }

                .search-wrapper {
                    position: relative;
                    width: 100%;
                }

                .search-input {
                    width: 100%;
                    height: 40px;
                    padding: 0 40px 0 40px;
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    background: var(--surface-hover);
                    color: var(--text-primary);
                    font-size: 14px;
                    transition: all var(--transition-fast);
                }

                .search-input:focus {
                    outline: none;
                    border-color: var(--primary);
                    background: var(--surface);
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
                }

                .search-input::placeholder {
                    color: var(--text-muted);
                }

                .search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                    pointer-events: none;
                }

                .search-clear {
                    position: absolute;
                    right: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 24px;
                    height: 24px;
                    border: none;
                    background: var(--surface-hover);
                    color: var(--text-muted);
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 18px;
                    line-height: 1;
                    transition: all var(--transition-fast);
                }

                .search-clear:hover {
                    background: var(--border);
                    color: var(--text-primary);
                }

                .search-results {
                    position: absolute;
                    top: calc(100% + 8px);
                    left: 0;
                    right: 0;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    box-shadow: var(--shadow-lg);
                    max-height: 400px;
                    overflow-y: auto;
                    z-index: 1050;
                    animation: slideDown 0.2s ease-out;
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .search-result-item {
                    display: flex;
                    align-items: center;
                    padding: 12px 16px;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    border-bottom: 1px solid var(--border);
                }

                .search-result-item:last-child {
                    border-bottom: none;
                }

                .search-result-item:hover {
                    background: var(--surface-hover);
                }

                .result-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    margin-right: 12px;
                }

                .result-name {
                    font-size: 14px;
                    font-weight: 500;
                    color: var(--text-primary);
                }

                /* Theme Toggle */
                .theme-toggle-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    padding: 4px;
                    background: var(--surface-hover);
                    border: 1px solid var(--border);
                    cursor: pointer;
                    transition: all var(--transition-fast);
                }

                .theme-toggle-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow);
                }

                .theme-preview {
                    width: 100%;
                    height: 100%;
                    border-radius: 7px;
                }

                .theme-menu {
                    min-width: 280px;
                    padding: 16px !important;
                }

                .theme-menu-header {
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 12px;
                }

                .theme-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                }

                .theme-option {
                    cursor: pointer;
                    transition: all var(--transition-fast);
                }

                .theme-option:hover {
                    transform: translateY(-2px);
                }

                .theme-color {
                    width: 100%;
                    height: 60px;
                    border-radius: 8px;
                    margin-bottom: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all var(--transition-fast);
                    border: 2px solid transparent;
                }

                .theme-option.active .theme-color {
                    border-color: var(--primary);
                    box-shadow: var(--shadow-md);
                }

                .check-mark {
                    color: white;
                    font-size: 20px;
                    font-weight: bold;
                }

                .theme-name {
                    font-size: 12px;
                    font-weight: 500;
                    color: var(--text-secondary);
                    text-align: center;
                }

                /* User Profile */
                .user-profile-btn {
                    display: flex;
                    align-items: center;
                    padding: 4px 12px 4px 4px;
                    border-radius: 12px;
                    background: var(--surface-hover);
                    border: 1px solid var(--border);
                    cursor: pointer;
                    transition: all var(--transition-fast);
                }

                .user-profile-btn:hover {
                    background: var(--surface);
                    border-color: var(--primary);
                    transform: translateY(-2px);
                    box-shadow: var(--shadow);
                }

                .user-avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: var(--gradient-primary);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 14px;
                }

                .user-info {
                    text-align: left;
                }

                .user-name {
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--text-primary);
                    line-height: 1.2;
                }

                .user-role {
                    font-size: 11px;
                    color: var(--text-muted);
                }

                .user-menu {
                    min-width: 260px;
                    padding: 0 !important;
                }

                .user-menu-header {
                    padding: 20px;
                    background: var(--gradient-primary);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .user-menu-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 18px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                }

                .user-menu-info {
                    flex: 1;
                }

                .user-menu-name {
                    font-size: 14px;
                    font-weight: 600;
                    color: white;
                    margin-bottom: 2px;
                }

                .user-menu-email {
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.8);
                }

                .menu-item {
                    padding: 12px 20px !important;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all var(--transition-fast) !important;
                }

                .logout-item {
                    color: #EF4444 !important;
                }

                .logout-item:hover {
                    background: rgba(239, 68, 68, 0.1) !important;
                }

                @media (max-width: 768px) {
                    .search-container {
                        display: none !important;
                    }
                }
            `}</style>

            <CToaster placement="top-end" className="p-3">
                {showToast && (
                    <CToast autohide={false} visible={showToast} className="elegant-toast">
                        <CToastBody className="fw-bold">{toastMessage}</CToastBody>
                    </CToast>
                )}
            </CToaster>
        </CHeader>
    );
};

export default Header;
