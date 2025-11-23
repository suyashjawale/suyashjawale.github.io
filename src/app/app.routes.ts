import { Routes } from '@angular/router';

export function getRoutes(): Routes {
    if (window.innerWidth > 768) {
        return [
            {
                path: '',
                loadComponent: () => import('./components/large/l-landing/l-landing').then(mod => mod.LLanding),
                children:[
                    {
                        path:'',
                        loadComponent: () => import('./components/large/l-home/l-home').then(mod => mod.LHome),
                    },
                    {
                        path:'blog',
                        loadComponent: () => import('./components/large/l-blog/l-blog').then(mod => mod.LBlog),
                    },
                    {
                        path:'collection',
                        loadComponent: () => import('./components/large/l-collection/l-collection').then(mod => mod.LCollection),
                    },
                    {
                        path:'projects',
                        loadComponent: () => import('./components/large/l-projects/l-projects').then(mod => mod.LProjects),
                    },
                    {
                        path:'snippets',
                        loadComponent: () => import('./components/large/l-snippets/l-snippets').then(mod => mod.LSnippets),
                    },
                    {
                        path:'posts',
                        loadComponent: () => import('./components/large/l-posts/l-posts').then(mod => mod.LPosts),
                    },
                    {
                        path:'playlist',
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
            children:[
                {
                    path:'',
                    loadComponent: () => import('./components/small/s-home/s-home').then(mod => mod.SHome),
                },
                {
                    path:'blog',
                    loadComponent: () => import('./components/small/s-blog/s-blog').then(mod => mod.SBlog),
                },
                {
                    path:'collection',
                    loadComponent: () => import('./components/small/s-collection/s-collection').then(mod => mod.SCollection),
                },
                {
                    path:'projects',
                    loadComponent: () => import('./components/small/s-projects/s-projects').then(mod => mod.SProjects),
                },
                {
                    path:'snippets',
                    loadComponent: () => import('./components/small/s-snippets/s-snippets').then(mod => mod.SSnippets),
                },
                {
                    path:'posts',
                    loadComponent: () => import('./components/small/s-posts/s-posts').then(mod => mod.SPosts),
                },
                {
                    path:'playlist',
                    loadComponent: () => import('./components/small/s-playlist/s-playlist').then(mod => mod.SPlaylist),
                },
                {
                    path:'search',
                    loadComponent: () => import('./components/small/s-search/s-search').then(mod => mod.SSearch),
                }
            ]
        }
    ]

}
