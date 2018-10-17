import Pages from './Pages';
import Theme from './Theme';

// @ts-ignore injectReducer exists
export const pages = window.Origami.injectReducer('resources.pages', Pages);
// @ts-ignore injectReducer exists
export const theme = window.Origami.injectReducer('theme', Theme);
