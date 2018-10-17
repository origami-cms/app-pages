import { Form } from '@origamijs/zen';
import { Field } from '@origamijs/zen-lib';
import { html, LitElement, property } from '@polymer/lit-element';
import { connect } from 'pwa-helpers/connect-mixin';
import { Page } from 'reducers/Pages';
import { PageTemplates, State } from 'reducers/Theme';
import CSS from './pages-create-css';
import { pagesCreate } from '../../../actions';


export class AppPagesPagesCreate extends LitElement {


    render() {
        return html`
            ${CSS}
            <div class="title card">
                <app-pages-pages-form
                    @submit=${this._handleSubmit}
                ></app-pages-pages-form>
                <zen-button
                    color="green"
                    size="medium"
                    icon="add"
                    @click=${this._submit.bind(this)}
                >Create page</zen-button>
            </div>
        ` ;
    }


    firstUpdated() {
        window.Origami.store.dispatch(
            // @ts-ignore
            window.Origami.actions.App.titleSet('Create page')
        );
    }


    private _submit() {
        this.shadowRoot!.querySelector('app-pages-pages-form').submit();
    }

    private async _handleSubmit(e: CustomEvent) {
        const page = await window.Origami.store.dispatch<any>(pagesCreate(e.detail));
    }

}

if (!window.customElements.get('app-pages-pages-create')) {
    window.customElements.define('app-pages-pages-create', AppPagesPagesCreate);
}

