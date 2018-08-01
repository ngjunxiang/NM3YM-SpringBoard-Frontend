import { RouteInfo } from '../../../shared/sidebar/sidebar.metadata';

export const ROUTES: RouteInfo[] = [
    {
        path: '/rm/dashboard', title: 'Dashboard', icon: 'mdi mdi-view-dashboard', class: '', label: '', labelClass: '', extralink: false, submenu: []
    },
    {
        path: '/rm/checklist', title: 'Checklists', icon: 'mdi mdi-playlist-check', class: 'has-arrow', label: '', labelClass: '', extralink: false,
        submenu: [
            { path: '/rm/checklist/view', title: 'View Checklists', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
        ]
    }
];

