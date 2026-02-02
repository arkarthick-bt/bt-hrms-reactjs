import React from 'react';
import { usePermissions } from '../contexts/PermissionContext';

interface PermissionGateProps {
    children: React.ReactNode;
    permission: string | string[];
    fallback?: React.ReactNode;
}

/**
 * A component that only renders its children if the user has the required permission(s).
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
    children,
    permission,
    fallback = null,
}) => {
    const { hasPermission } = usePermissions();

    if (hasPermission(permission)) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};

export default PermissionGate;
