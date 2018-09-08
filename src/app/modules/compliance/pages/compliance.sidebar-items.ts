import { RouteInfo } from '../../../shared/sidebar/sidebar.metadata';

export const ROUTES: RouteInfo[] = [
    {
        path: '/compliance/dashboard', title: 'Dashboard', icon: 'mdi mdi-view-dashboard', class: '', label: '', labelClass: '', extralink: false, submenu: []
    },
    {
        path: '/compliance/checklist', title: 'Checklists', icon: 'mdi mdi-playlist-check', class: 'has-arrow', label: '', labelClass: '', extralink: false,
        submenu: [
            { path: '/compliance/checklist/manage', title: 'Manage Checklists', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
            { path: '/compliance/checklist/create', title: 'New Checklist', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
            { path: '/compliance/checklist/logs', title: 'View Logs', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
        ]
    }
];

