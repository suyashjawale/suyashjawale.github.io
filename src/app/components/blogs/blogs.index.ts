export const BLOG_LIST = [
    {
        slug: 'blog-a',
        title: 'My First Blog',
        summary: 'This is the summary of first blog.',
        loadComponent: () => import('./demo1/demo1').then(mod => mod.Demo1)
    },
    {
        slug: 'blog-b',
        title: 'Angular Tips & Tricks',
        summary: 'Improve your Angular workflow.',
        loadComponent: () => import('./demo2/demo2').then(mod => mod.Demo2)
    },
    {
        slug: 'blog-c',
        title: 'JavaScript Deep Dive',
        summary: 'Understanding closures and scopes.',
        loadComponent: () => import('./demo3/demo3').then(mod => mod.Demo3)
    }
];
