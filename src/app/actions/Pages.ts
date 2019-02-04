// tslint:disable-next-line:no-submodule-imports
import {APIActions} from '@origami/zen-lib/API';
import { Dispatch } from 'redux';

export const PAGE_PROPERTIES_SET = 'PAGE_PROPERTIES_SET';
export const PAGE_DATA_SET = 'PAGE_DATA_SET';
export const PAGE_TEMPLATES_SET = 'PAGE_TEMPLATES_SET';

export const {
    pagesCreate,
    pagesGet,
    pagesUpdate,
    pagesRemove
} = APIActions('pages', window.Origami.api);


export const pagesPropertiesGet = async (id: string) =>
    async (dispatch: Dispatch) => {
        const { data: properties } = await window.Origami.api.get(`/pages/${id}/properties`);
        dispatch({ type: PAGE_PROPERTIES_SET, id, properties });
    };


export const pagesDataUpdate = async (id: string, data: object) =>
    async (dispatch: Dispatch) => {
        await window.Origami.api.put(`/pages/${id}/properties`, data);
        dispatch({ type: PAGE_DATA_SET, id, data });
    };


// export const pagesTreeGet = async (parent = '') =>
//     async (dispatch: Dispatch) => {
//         const { data: pages } = await API.get(`/pages/tree/${parent}`);
//         dispatch({ type: PAGES_TREE_SET, parent, pages });
//     };


// export const pagesTreeMove = (pages: Page[], parent: string) =>
//     () => {
//         const execs: Promise<APIResponse>[] = [];
//         pages.forEach(p => {
//             execs.push(API.post(`/pages/${p.id}/move`, { parent }));
//         });

//         return Promise.all(execs);
//     };
