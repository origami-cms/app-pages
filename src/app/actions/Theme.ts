import { Dispatch } from 'redux';

export const THEME_TEMPLATES_SET = 'THEME_TEMPLATES_SET';

export const themeTemplatesGet = () =>
    async (dispatch: Dispatch) => {
        const { data: templates } = await window.Origami.api.get('/theme/templates');
        dispatch({ type: THEME_TEMPLATES_SET, templates });
        return templates;
    };
