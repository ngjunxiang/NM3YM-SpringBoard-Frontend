import { RouteInfo } from '../../../shared/sidebar/sidebar.metadata';

export const ROUTES: RouteInfo[] = [
    {
        path: '/cm/dashboard', title: 'Dashboard', icon: 'mdi mdi-view-dashboard', class: '', label: '', labelClass: '', extralink: false, submenu: []
    },
    {
        path: '/cm/checklist', title: 'Checklists', icon: 'mdi mdi-playlist-check', class: 'has-arrow', label: '', labelClass: '', extralink: false,
        submenu: [
            { path: '/cm/checklist/manage', title: 'Manage Checklists', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
            { path: '/cm/checklist/logs', title: 'View Logs', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
        ]
    }
];

