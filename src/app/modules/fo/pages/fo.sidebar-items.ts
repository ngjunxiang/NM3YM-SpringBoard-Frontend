import { RouteInfo } from '../../../shared/sidebar/sidebar.metadata';

export const ROUTES: RouteInfo[] = [
    {
        path: '/fo/dashboard', title: 'Dashboard', icon: 'mdi mdi-view-dashboard', class: '', label: '', labelClass: '', extralink: false, submenu: []
    },
    {
        path: '/fo/onboard', title: 'Client Onboarding', icon: 'mdi mdi-account-multiple', class: 'has-arrow', label: '', labelClass: '', extralink: false,
        submenu: [
            { path: '/fo/onboard/create', title: 'New', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
            { path: '/fo/onboard/manage', title: 'Manage', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
        ]
    },
    {
        path: '/fo/faq', title: 'FAQ', icon: 'mdi mdi-comment-question-outline', class: 'has-arrow', label: '', labelClass: '', extralink: false, 
        submenu: [
            { path: '/fo/faq/ask', title: 'Ask', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
            { path: '/fo/faq/myquestions', title: 'My Questions', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
            { path: '/fo/faq/viewall', title: 'View All', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
        ]
    }
];

