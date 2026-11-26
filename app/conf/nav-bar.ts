import type { navBarDto } from "~/interfaces/navbar.dto";


export const navBarRoutes: navBarDto[] = [
    {
        link: '/',
        iconName: 'bi:clipboard-check',
        name: 'ToDo'
    },
    {
        link: '/dreamsnap',
        iconName: 'mdi-light:image',
        name: 'Dreamsnap'
    },
    {
        link: '/personnages',
        iconName: 'mdi-light:account',
        name: 'Persos'
    },
    {
        link: '/compagnons',
        iconName: 'fluent-emoji-high-contrast:owl',
        name: 'Compagnons'
    },
]