import { RouteInfo } from '../../../shared/sidebar/sidebar.metadata';

export const ROUTES: RouteInfo[] = [
    {
        path: '/admin', title: 'Dashboard', icon: 'mdi mdi-gauge', class: '', label: '', labelClass: '', extralink: false, submenu: []
    },
    {
        path: '', title: 'User Management', icon: 'mdi mdi-bullseye', class: 'has-arrow', label: '', labelClass: '', extralink: false,
        submenu: [
            { path: '/admin/create', title: 'Create User', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
            { path: '/admin/update', title: 'Update User', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
            { path: '/admin/delete', title: 'Delete User', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
        ]
    }
];

