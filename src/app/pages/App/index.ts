import { SideMenuLink, ZenRoute } from '@origami/zen';
import { html, LitElement } from '@polymer/lit-element';
import CSS from './app-css';

export class AppPages extends LitElement {
    base: string = '/admin/pages';

    routes: ZenRoute[] = [
        {path: '/pages(.*)', element: 'app-pages-pages'},
        {path: '(.*)', element: 'app-pages-dashboard', exact: true}
    ];

    links: SideMenuLink[] = [
        {href: `${this.base}/`, icon: 'dashboard', text: 'Home'},
        {href: `${this.base}/pages`, icon: 'page', text: 'Pages'},
        {href: `${this.base}/templates`, icon: 'code', text: 'Templates'}
    ];

    render() {
        return html`
            ${CSS}
            <zen-side-menu
                class="card"
                .links=${this.links}
            ></zen-side-menu>

            <zen-router
                .base=${this.base}
                .routes=${this.routes}
            ></zen-router>
        `;
    }

    firstUpdated() {
        window.Origami.store.dispatch(
            // @ts-ignore
            window.Origami.actions.App.titleSet('Pages')
        );
    }
}

if (!window.customElements.get('app-pages')) {
    window.customElements.define('app-pages', AppPages);
}
