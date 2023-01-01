export interface PageMeta {
    label: string;
    url: string;
    isHidden: boolean;
    renderJs?: string;
}

function pageMeta(label: string, pageFolder: string, renderJs: string, isHidden: boolean = false) {
    return { 
        label,
        isHidden,
        url: `src/pages/${pageFolder}/index.html`,
        renderJs
    };
}

function linkMeta(label: string, url: string, isHidden: boolean = false) {
    return { 
        label,
        isHidden,
        url,
        renderJs: undefined
    };
}

export const pages: PageMeta[] = [
    pageMeta('Pop-Up', 'popup', '<Popup />'),
    pageMeta('Options', 'options', '<Options />'),
    pageMeta('Deployment Watcher', 'deployment-watcher', '<DeploymentWatcher />'),
    linkMeta('Google', 'https://google.com')
];