import { RouteInfo } from '../../../shared/sidebar/sidebar.metadata';

export const ROUTES: RouteInfo[] = [
    {
        path: '/rm/dashboard', title: 'Dashboard', icon: 'mdi mdi-view-dashboard', class: '', label: '', labelClass: '', extralink: false, submenu: []
    },
    {
        path: '/rm/onboard', title: 'Onboard', icon: 'mdi mdi-account-multiple', class: 'has-arrow', label: '', labelClass: '', extralink: false,
        submenu: [
            { path: '/rm/onboard/create', title: 'Create', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
        ]
    }
];

