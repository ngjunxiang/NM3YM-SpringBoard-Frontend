import { RouteInfo } from '../../../shared/sidebar/sidebar.metadata';

export const ROUTES: RouteInfo[] = [
    {
        path: '/cm/dashboard', title: 'Dashboard', icon: 'mdi mdi-gauge', class: '', label: '', labelClass: '', extralink: false, submenu: []
    },
    {
        path: '', title: 'Requirements Management', icon: 'mdi mdi-bullseye', class: 'has-arrow', label: '', labelClass: '', extralink: false,
        submenu: [
            { path: '/cm/checklist', title: 'Checklist', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
            { path: '/cm/', title: 'Update User Account', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
            { path: '/cm/', title: 'Delete User Account', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
        ]
    }
];

