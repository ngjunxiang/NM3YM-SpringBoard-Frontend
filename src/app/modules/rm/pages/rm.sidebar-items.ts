import { RouteInfo } from '../../../shared/sidebar/sidebar.metadata';

export const ROUTES: RouteInfo[] = [
    {
        path: '/rm/dashboard', title: 'Dashboard', icon: 'mdi mdi-view-dashboard', class: '', label: '', labelClass: '', extralink: false, submenu: []
    },
    {
        path: '/rm/onboard', title: 'Client Onboarding', icon: 'mdi mdi-account-multiple', class: 'has-arrow', label: '', labelClass: '', extralink: false,
        submenu: [
            { path: '/rm/onboard/create', title: 'New', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
            { path: '/rm/onboard/manage', title: 'Manage', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
        ]
    },
    {
        path: '/rm/faq', title: 'FAQ', icon: 'mdi mdi-comment-question-outline', class: '', label: '', labelClass: '', extralink: false, submenu: []
    }
];

