import { Routes } from '@angular/router';
import { BLOG_LIST } from './components/blogs/blogs.index';
import { PROJECT_LIST } from './components/projects/projects.index';

export const routes: Routes = [
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
                path: 'project',
                children: PROJECT_LIST.map(project => ({
                    path: project.slug,
                    loadComponent: () => Promise.resolve(project.loadComponent())
                }))
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
];