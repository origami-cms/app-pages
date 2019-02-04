import { Field } from '@origami/zen-lib/FormValidator';
import { AnyAction } from 'redux';
import immutable from 'seamless-immutable';
import { THEME_TEMPLATES_SET } from '../actions/Theme';


export { AnyAction } from 'redux';


export interface Page {
    id: string;
    title: string;
    url: string;
    properties: {
        [key: string]: any
    };
}

export interface PageTemplates {
    [name: string]: PageTemplate;
}

export interface PageTemplate {
    type: string;
    properties: PageTemplateProperties;
}


export type PageTemplateProperties = false | Field[];


export interface State {
    templates: PageTemplates;
}


const intitialState = immutable.from<State>({
    templates: {}
});


export default (state = intitialState, action: AnyAction) => {
    switch (action.type) {
        case THEME_TEMPLATES_SET:
            return state.set('templates', action.templates);

        default:
            return state;
    }
};
