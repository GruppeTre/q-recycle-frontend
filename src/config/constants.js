export const INTERNAL_EMAIL_SUFFIX = '@qrecycle.internal';

export const role = {
    DRIVER: 'driver',
    ADMIN: 'admin',
    PARTNER: 'partner'
}

export const DASHBOARD_BY_ROLE = {
    [role.ADMIN]: '/admin/dashboard',
    [role.DRIVER]: '/driver/dashboard',
    [role.PARTNER]: '/partner/dashboard'
};