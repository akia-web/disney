import type { navBarDto } from "~/interfaces/navbar.dto";


export const navBarRoutes: navBarDto[] = [
    {
        link: '/',
        iconName: 'mdi-light:image',
        name: 'Dreamsnap'
    },
    {
        link: '/personnages',
        iconName: 'mdi-light:account',
        name: 'Persos'
    },
]