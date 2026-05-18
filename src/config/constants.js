export const INTERNAL_EMAIL_SUFFIX = '@qrecycle.internal';

export const role = {
    DRIVER: 'driver',
    ADMIN: 'admin',
    PARTNER: 'partner'
}

export const DASHBOARD_BY_ROLE = {
    [role.ADMIN]: '/admin',
    [role.DRIVER]: '/driver',
    [role.PARTNER]: '/partner/dashboard'
};

export const pickupStatus = {
    REQUESTED: 'requested',
    SCHEDULED: 'scheduled',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
}