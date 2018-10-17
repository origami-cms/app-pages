import { html, LitElement } from '@polymer/lit-element';
import CSS from './pages-list-css';

// @ts-ignore
export class AppPagesPagesList extends LitElement {

    render() {
        return html`
            ${CSS}
            <ui-resource-table resource="pages" uriBase="/pages/pages">
                <zen-table-column key="title" heading="title" icon="page"></zen-table-column>
                <zen-table-column key="type" heading="page template" icon="code"></zen-table-column>
            </ui-resource-table>
        `;
    }

    firstUpdated() {
        window.Origami.store.dispatch(
            // @ts-ignore
            window.Origami.actions.App.titleSet('Pages')
        );
    }
}

if (!window.customElements.get('app-pages-pages-list')) {
    window.customElements.define('app-pages-pages-list', AppPagesPagesList);
}
