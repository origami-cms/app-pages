import { ButtonOptions } from '@origami/zen';
import { FormValues } from '@origami/zen-lib/FormValidator';
import { html, LitElement, property } from '@polymer/lit-element';
import { connect } from 'pwa-helpers/connect-mixin';
import { pagesGet, pagesUpdate, pagesRemove } from '../../../actions';
import { DATA_PREFIX } from '../Forms';
import CSS from './pages-edit-css';


export class AppPagesPagesEdit extends connect(window.Origami.store)(LitElement) {
    values: FormValues = {};

    @property({type: Boolean})
    dirty: boolean = false;

    get actions(): ButtonOptions[] {
        const actions = [
            {color: 'red', text: 'Remove', icon: 'remove', onclick: this._remove.bind(this)},
        ];

        if (this.dirty) {
            actions.unshift(
                {color: 'green', text: 'Save', icon: 'tick', onclick: this._submit.bind(this)}
            );
        }

        return actions;
    }

    render() {
        return html`
            ${CSS}
            <div class="title card">
                <app-pages-pages-form
                    .actions=${this.actions}
                    @dirty=${this._handleDirty.bind(this)}
                    @submit=${this._handleSubmit.bind(this)}
                    .values=${this.convertedValues}
                ></app-pages-pages-form>
            </div>
        ` ;
    }

    get convertedValues() {
        const values = {...this.values};
        if (values.data) {
            Object.keys(values.data).forEach(k => {
                values[DATA_PREFIX + k] = values.data[k];
            });
            delete values.data;
        }
        return values;
    }

    get id() {
        return window.location.pathname.split('/').pop();
    }

    firstUpdated() {
        window.Origami.store.dispatch(
            // @ts-ignore
            window.Origami.actions.App.titleSet('Edit page')
        );
        window.Origami.store.dispatch(pagesGet(this.id));
    }

    _stateChanged(s: any) {
        const id = this.id;
        this.values = s.resources.pages.pages.find(p => p.id === id);
    }

    private _handleDirty(e: CustomEvent<{dirty: boolean}>) {
        if (this.dirty !== e.detail.dirty) this.dirty = e.detail.dirty;
    }


    private _submit() {
        this.shadowRoot!.querySelector('app-pages-pages-form').submit();
    }

    private async _handleSubmit(e: CustomEvent) {
        const page = await window.Origami.store.dispatch<any>(pagesUpdate(this.id, e.detail));
    }


    private _remove() {
        return window.Origami.store.dispatch<any>(pagesRemove(this.id));
    }

}

if (!window.customElements.get('app-pages-pages-edit')) {
    window.customElements.define('app-pages-pages-edit', AppPagesPagesEdit);
}

