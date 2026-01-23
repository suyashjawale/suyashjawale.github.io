export const BLOG_LIST = [
    {
        slug: 'lifecycle-of-milk',
        title: 'The Lifecycle Of Milk',
        thumbnail : '/blogs/lifecycle-of-milk/pexels-chevanon-302901.jpg',
        publishedTime : new Date(),
        summary: 'My research on milk',
        loadComponent: () => import('./lifecycle-of-milk/lifecycle-of-milk').then(mod => mod.LifecycleOfMilk)
    }
];
