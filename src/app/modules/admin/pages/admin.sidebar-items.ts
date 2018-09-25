import { RouteInfo } from '../../../shared/sidebar/sidebar.metadata';

export const ROUTES: RouteInfo[] = [
    {
        path: '/admin/panel', title: 'Admin Panel', icon: 'mdi mdi-view-dashboard', class: '', label: '', labelClass: '', extralink: false, submenu: []
    },
    {
        path: '', title: 'User Management', icon: '', class: 'has-arrow', label: '', labelClass: '', extralink: false,
        submenu: [
            { path: '/admin/usrmgmt/create', title: 'Create User Account', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
            { path: '/admin/usrmgmt/update', title: 'Update User Account', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
            { path: '/admin/usrmgmt/delete', title: 'Delete User Account', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
        ]
    }
];

