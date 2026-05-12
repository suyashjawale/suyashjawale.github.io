export const PROJECT_LIST = [
    {
        slug: 'instagram-cli',
        title: 'InstagramCLI',
        thumbnail: '/projects/instagram-cli/instagramcli.webp',
        publishedTime: new Date(),
        summary: '',
        loadComponent: () => import('./instagram-cli/instagram-cli').then(mod => mod.InstagramCLI)
    },
    {
        slug: 'model-x',
        title: 'ModelX',
        thumbnail: '/projects/model-x/modelx.png',
        publishedTime: new Date(),
        summary: '',
        loadComponent: () => import('./model-x/model-x').then(mod => mod.ModelX)
    },
    {
        slug: 'video-sync',
        title: 'Video Sync',
        thumbnail: '/projects/',
        publishedTime: new Date(),
        summary: '',
        loadComponent: () => import('./video-sync/video-sync').then(mod => mod.VideoSync)
    }
    ,
    {
        slug: 'bmw-atlas',
        title: 'BMW Atlas',
        thumbnail: '/projects/',
        publishedTime: new Date(),
        summary: '',
        loadComponent: () => import('./bmw-atlas/bmw-atlas').then(mod => mod.BMWAtlas)
    }
];
