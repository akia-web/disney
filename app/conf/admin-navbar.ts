import type { navBarDto } from "~/interfaces/navbar.dto";

export const adminNavBarRoutes: navBarDto[] = [
    {
        link: '/admin/personnages',
        iconName: 'mdi-light:account',
        name: 'Personnages'
    },
    {
        link: '/admin/jobs',
        iconName: 'mdi-light:account',
        name: 'Jobs'
    },
]