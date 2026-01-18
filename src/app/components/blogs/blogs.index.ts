export const BLOG_LIST = [
    {
        slug: 'blog-a',
        title: 'My First Blog',
        thumbnail : 'projects/instagramcli.webp',
        publishedTime : new Date("2025-08-12"),
        summary: 'This is the summary of first blog.',
        loadComponent: () => import('./demo1/demo1').then(mod => mod.Demo1)
    }
];
