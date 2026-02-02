import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';

type PermissionContextType = {
    hasPermission: (permission: string | string[]) => boolean;
    permissions: string[];
};

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, token, scopes: authScopes } = useAuth();
    const [permissions, setPermissions] = React.useState<string[]>([]);

    // Use scopes from AuthContext, fallback if empty
    React.useEffect(() => {
        if (!token || !user) {
            setPermissions([]);
            return;
        }

        if (authScopes && authScopes.length > 0) {
            setPermissions(authScopes);
        } else {
            // Check if we have standard user.permissions
            const userPermissions = (user.permissions as string[]) || [];
            if (userPermissions.length > 0) {
                setPermissions(userPermissions);
            } else {
                // Mocking default permissions for development
                setPermissions(['leave.view', 'attendance.view', 'profile.view', 'employees.view']);
            }
        }
    }, [user, token, authScopes]);

    const hasPermission = (permission: string | string[]) => {
        if (Array.isArray(permission)) {
            return permission.some((p) => permissions.includes(p));
        }
        return permissions.includes(permission);
    };

    const value = useMemo(() => ({
        hasPermission,
        permissions
    }), [permissions]);

    return (
        <PermissionContext.Provider value={value}>
            {children}
        </PermissionContext.Provider>
    );
};

export const usePermissions = () => {
    const context = useContext(PermissionContext);
    if (context === undefined) {
        throw new Error('usePermissions must be used within a PermissionProvider');
    }
    return context;
};
