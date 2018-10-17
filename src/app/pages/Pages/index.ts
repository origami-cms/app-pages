import { SideMenuLink, ZenRoute } from '@origamijs/zen';
import { html, LitElement } from '@polymer/lit-element';
import { themeTemplatesGet } from '../../actions';

export * from './List';
export * from './Create';
export * from './Edit';
export * from './Forms';

export class AppPagesPages extends LitElement {
    base: string = '/admin/pages/pages';

    routes: ZenRoute[] = [
        {path: '/create', element: 'app-pages-pages-create'},
        {path: '/:id', element: 'app-pages-pages-edit'},
        {path: '(.*)', element: 'app-pages-pages-list'}
    ];

    links: SideMenuLink[] = [
        { href: `${this.base}/`, icon: 'dashboard', text: 'Home' },
        { href: `${this.base}/pages`, icon: 'page', text: 'Pages' },
        { href: `${this.base}/templates`, icon: 'code', text: 'Templates' }
    ];


    render() {
        return html`
            <zen-router .base=${this.base} .routes=${this.routes}></zen-router>
        `;
    }


    async firstUpdated() {
        await window.Origami.store.dispatch<any>(themeTemplatesGet());
    }
}

if (!window.customElements.get('app-pages-pages')) {
    window.customElements.define('app-pages-pages', AppPagesPages);
}
