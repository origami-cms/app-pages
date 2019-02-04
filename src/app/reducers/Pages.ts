import { APIReducer, ResourceState } from '@origami/zen-lib/API';
import { PAGE_DATA_SET, PAGE_PROPERTIES_SET } from '../actions/Pages';
import { AnyAction } from 'redux';
import { ImmutableArray, ImmutableObject } from 'seamless-immutable';

export { AnyAction } from 'redux';


export interface Page {
    id: string;
    title: string;
    url: string;
    type: string;
    properties: {
        [key: string]: any
    };
}

export interface State extends ImmutableObject<ResourceState> {
    pages: ImmutableArray<Page>;
    pageTree: ImmutableArray<Page>;
}

export type IPage = ImmutableArray<Page>;


// // Find a page deeply nesteds in the tree store with an id
// const findDeepById = (tree: ImmutableArray<Page> | Page[], id: string): false | ImmutableObject<Page> => {
//     // HACK: Work this out
//     // @ts-ignore
//     return tree.find((page: ImmutableObject<Page>) => {
//         if (!tree) return false;

//         const exists = find(tree, { id });
//         if (exists) return exists;
//         if (page.children) return findDeepById(page.children, id);
//         return false;
//     });
// };


export default APIReducer('pages', (state: State, action: AnyAction) => {
    const pageNotFound = new Error('Page not found');
    let pageIndex;
    if (action.id) {
        pageIndex = state.pages.findIndex(page => {
            if (page.id === action.id) return true;
            return false;
        });
        pageIndex = pageIndex.toString();
    }

    switch (action.type) {
        case PAGE_PROPERTIES_SET:
            if (!pageIndex) throw pageNotFound;
            return state.setIn(
                ['pages', pageIndex, 'properties'],
                action.properties
            );

        case PAGE_DATA_SET:
            if (!pageIndex) throw pageNotFound;
            return state.setIn(
                ['pages', pageIndex, 'data'],
                action.data
            );

        // case PAGES_TREE_SET:
        //     let pageTree = !state.pageTree ? [] : state.pageTree.asMutable(
        //         { deep: true }
        //     );
        //     const adding = action.page ? [action.page] : action.pages;
        //     // If there is a parent, find it in the tree, and add it as a child
        //     if (action.parent) {
        //         const parent = findDeepById(pageTree, action.parent) as Page;
        //         if (!parent) throw new Error('Could not find parent');
        //         // If there are no children, create an empty array for it
        //         if (!parent.children) parent.children = immutable([]);
        //         parent.children = (parent.children as Page[]).concat(adding) as IPage;
        //         // Otherwise add it to the root
        //     } else pageTree = adding;

        //     return state.set('pageTree', pageTree);

        default:
            return state;
    }
});
