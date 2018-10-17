import { ButtonOptions, Form } from '@origamijs/zen';
import { Field } from '@origamijs/zen-lib';
import { html, LitElement, property } from '@polymer/lit-element';
import { connect } from 'pwa-helpers/connect-mixin';
import { Page } from 'reducers/Pages';
import { PageTemplates, State } from 'reducers/Theme';
import CSS from './form-css';

export const DATA_PREFIX = 'data.';

export class AppPagesPagesForm extends connect(window.Origami.store)(LitElement) {
    get form(): Field[] {
        return [
            {name: 'title', type: 'text', placeholder: 'About us', label: 'Page Title'},
            {name: 'url', type: 'text', placeholder: '/about-us', label: 'Page URL'},
            {
                name: 'type',
                type: 'select',
                placeholder: 'Choose a template',
                label: 'Page Template',
                options: Object.keys(this.templates)
            }
        ];
    }

    @property()
    values: Partial<Page> = {};

    @property()
    dirtyValues: Partial<Page> = {};

    @property()
    actions: ButtonOptions[] = [];


    constructor() {
        super();
        this._row = this._row.bind(this);
        this.submit = this.submit.bind(this);
        this._handleChange = this._handleChange.bind(this);
    }

    get propertiesForm(): Field[] | false {
        const type = this.dirtyValues.type || this.values.type;
        if (!type) return false;

        const temp = this.templates[type];
        if (temp && temp.properties) {
            return temp.properties
                .asMutable({deep: true})
                .map(f => {
                    f.name = DATA_PREFIX + f.name;
                    return f;
                });
        }
        return false;
    }

    private get _form(): Form {
        return this.shadowRoot!.querySelector('zen-form');
    }

    @property()
    templates: PageTemplates = {};

    render() {
        const {propertiesForm, form} = this;

        return html`
            ${CSS}
            <zen-form
                .values=${this.values}
                @change=${(e: Event) => this._handleChange(e.target as Form)}
                @dirtyChange=${(e: Event) => this._handleDirtyChange(e.target as Form)}
                @submit=${(e: Event) => this._handleSubmit(e.target as Form)}
                saveable
            >
                <header>
                    <h3>
                        <zen-icon type="page"></zen-icon>
                        <span>Page settings</span>
                    </h3>

                    <zen-button-group .buttons=${this.actions} size="medium"></zen-button-group>
                </header>

                ${form.map(this._row)}

                ${propertiesForm
                    ? html`
                        <h3>
                            <zen-icon type="sliders"></zen-icon>
                            <span>Page properties</span>
                        </h3>
                        ${propertiesForm.map(this._row)}`
                    : null
                }
            </zen-form>
        `;
    }


    private _row(field: Field) {
        const errors = this._form ? this._form.fieldErrors : {};
        return html`<zen-form-row
            name=${field.name}
            @submit=${this.submit}
            .field=${field}
            .error=${errors[field.name]}
        ></zen-form-row>`;
    }


    _stateChanged(s: {theme: State}) {
        if (Object.keys(this.templates).length !== Object.keys(s.theme.templates).length) {
            this.templates = s.theme.templates;
        }
    }

    private _handleDirtyChange(form: Form) {
        this.dirtyValues = form.dirtyValues;

        this.dispatchEvent(new CustomEvent('dirty', {
            detail: {dirty: form.dirty}
        }));
    }

    private submit() {
        const f = this._form;
        f.save();
        f.submit();
    }

    private _handleChange(form: Form) {
        this.values = {...this.values, ...form.values};
    }

    private _handleSubmit(form: Form) {
        const values = {...form.values};
        values.data = {};

        Object.keys(values)
            .filter(k => k.startsWith(DATA_PREFIX))
            .forEach(k => {
                values.data[k.slice(DATA_PREFIX.length)] = values[k];
                delete values[k];
            });
        this.dispatchEvent(new CustomEvent('submit', {
            detail: values
        }));
    }

}

if (!window.customElements.get('app-pages-pages-form')) {
    window.customElements.define('app-pages-pages-form', AppPagesPagesForm);
}

