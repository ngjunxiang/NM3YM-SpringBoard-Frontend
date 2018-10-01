import { RouteInfo } from '../../../shared/sidebar/sidebar.metadata';

export const ROUTES: RouteInfo[] = [
    {
        path: '', title: 'Admin Panel', icon: 'mdi mdi-account-edit', class: 'has-arrow', label: '', labelClass: '', extralink: false,
        submenu: [
            { path: '/admin/panel/viewall', title: 'View All Users', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
            { path: '/admin/panel/create', title: 'Create User Account', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
            { path: '/admin/panel/update', title: 'Update User Account', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
            { path: '/admin/panel/delete', title: 'Delete User Account', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
        ]
    }
];

