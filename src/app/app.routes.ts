import { Routes } from '@angular/router';
import { BLOG_LIST } from './components/blogs/blogs.index';

export function getRoutes(): Routes {
    if (window.innerWidth > 768) {
        return [
            {
                path: '',
                loadComponent: () => import('./components/large/l-landing/l-landing').then(mod => mod.LLanding),
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./components/large/l-home/l-home').then(mod => mod.LHome),
                    },
                    {
                        path: 'blog',
                        loadComponent: () => import('./components/large/l-blog/l-blog').then(mod => mod.LBlog),
                    },
                    {
                        path: 'collection',
                        loadComponent: () => import('./components/large/l-collection/l-collection').then(mod => mod.LCollection),
                    },
                    {
                        path: 'projects',
                        loadComponent: () => import('./components/large/l-projects/l-projects').then(mod => mod.LProjects),
                    },
                    {
                        path: 'snippets',
                        loadComponent: () => import('./components/large/l-snippets/l-snippets').then(mod => mod.LSnippets),
                    },
                    {
                        path: 'posts',
                        loadComponent: () => import('./components/large/l-posts/l-posts').then(mod => mod.LPosts),
                    },
                    {
                        path: 'playlist',
                        loadComponent: () => import('./components/large/l-playlist/l-playlist').then(mod => mod.LPlaylist),
                    },
                ]
            }
        ]
    }

    return [
        {
            path: '',
            loadComponent: () => import('./components/small/s-landing/s-landing').then(mod => mod.SLanding),
            children: [
                {
                    path: '',
                    loadComponent: () => import('./components/small/s-home/s-home').then(mod => mod.SHome),
                },
                {
                    path: 'blogs',
                    loadComponent: () => import('./components/small/s-blogs/s-blogs').then(mod => mod.SBlogs),
                },
                {
                    path: 'blog',
                    children: BLOG_LIST.map(blog => ({
                        path: blog.slug,
                        loadComponent: () => Promise.resolve(blog.loadComponent())
                    }))
                },
                {
                    path: 'collection',
                    loadComponent: () => import('./components/small/s-collection/s-collection').then(mod => mod.SCollection),
                },
                {
                    path: 'projects',
                    loadComponent: () => import('./components/small/s-projects/s-projects').then(mod => mod.SProjects),
                },
                {
                    path: 'project/:name',
                    loadComponent: () => import('./components/small/s-project/s-project').then(mod => mod.SProject),
                },
                {
                    path: 'snippets',
                    loadComponent: () => import('./components/common/snippets/snippets').then(mod => mod.Snippets),
                },
                {
                    path: 'wisdom',
                    loadComponent: () => import('./components/common/wisdom/wisdom').then(mod => mod.Wisdom),
                },
                {
                    path: 'posts',
                    loadComponent: () => import('./components/small/s-posts/s-posts').then(mod => mod.SPosts),
                },
                {
                    path: 'playlist',
                    loadComponent: () => import('./components/small/s-playlist/s-playlist').then(mod => mod.SPlaylist),
                },
                {
                    path: 'search',
                    loadComponent: () => import('./components/small/s-search/s-search').then(mod => mod.SSearch),
                },
                {
                    path: 'updates',
                    loadComponent: () => import('./components/small/s-updates/s-updates').then(mod => mod.SUpdates),
                },
                {
                    path: 'resume',
                    loadComponent: () => import('./components/common/resume/resume').then(mod => mod.Resume),
                },
                {
                    path: 'collection/:name',
                    loadComponent: () => import('./components/small/collection-item/collection-item').then(mod => mod.CollectionItem)
                }
            ]
        }
    ]

}
