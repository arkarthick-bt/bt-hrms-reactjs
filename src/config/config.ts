// Server Configuration
export const API_BASE_URL = 'http://localhost:8082/bt-hrms/api/v1';

// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REGISTER: '/auth/register',
        REFRESH_TOKEN: '/auth/refresh',
    },
    EMPLOYEES: {
        LIST: '/employees',
        GET: '/employees/:id',
        CREATE: '/employees',
        UPDATE: '/employees/:id',
        DELETE: '/employees/:id',
    },
    ATTENDANCE: {
        LIST: '/attendance',
        MARK: '/attendance/mark',
        REPORT: '/attendance/report',
    },
    PAYROLL: {
        LIST: '/payroll',
        GENERATE: '/payroll/generate',
    },
    ROLES: {
        SCOPES: '/roles/scope',
        LIST: '/roles/getRole',
        GET_PERMISSIONS: '/roles/getPermission/:roleId',
        ASSIGN_PERMISSIONS: '/roles/assignPermission',
    },
};

// App Configuration
export const APP_CONFIG = {
    APP_NAME: 'BonTon Softwares',
    APP_VERSION: '1.0.0',
    TIMEZONE: 'UTC',
    DATE_FORMAT: 'DD/MM/YYYY',
    TIME_FORMAT: 'HH:mm:ss',
};

// Auth Configuration
export const AUTH_CONFIG = {
    TOKEN_KEY: 'auth_token',
    REFRESH_TOKEN_KEY: 'refresh_token',
    TOKEN_EXPIRY_TIME: 3600, // seconds
};

// API Timeout
export const API_TIMEOUT = 30000; // milliseconds