export const BLOG_LIST = [
    {
        slug: 'blog-a',
        title: 'My First Blog',
        thumbnail : 'instagramcli.webp',
        publishedTime : new Date("2025-08-12"),
        summary: 'This is the summary of first blog.',
        loadComponent: () => import('./demo1/demo1').then(mod => mod.Demo1)
    },
    {
        slug: 'blog-b',
        title: 'Angular Tips & Tricks',
        thumbnail : 'modelx.png',
        publishedTime : new Date("2025-08-12"),
        summary: 'Improve your Angular workflow.',
        loadComponent: () => import('./demo2/demo2').then(mod => mod.Demo2)
    },
    {
        slug: 'blog-c',
        title: 'JavaScript Deep Dive',
        thumbnail : 'instagramcli.webp',
        publishedTime : new Date("2025-08-12"),
        summary: 'Understanding closures and scopes.',
        loadComponent: () => import('./demo3/demo3').then(mod => mod.Demo3)
    }
];
