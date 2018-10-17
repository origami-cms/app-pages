import { API } from 'origami-zen/lib/API';
import { Store } from 'redux';

declare global {
    interface Window {
        Origami: {
            api: API;
            store: Store;
            actions: object;
        };
    }
}
