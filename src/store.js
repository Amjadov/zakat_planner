import { items, defaultSettings } from './data.js';

const STORE_KEY = 'zakat_planner_state';

const initialState = {
    selectedItems: [], // array of item ids
    prices: {}, // { itemId: price }
    settings: { ...defaultSettings },
    lang: 'ar'
};

export const store = {
    state: loadState(),

    listeners: [],

    subscribe(listener) {
        this.listeners.push(listener);
    },

    notify() {
        this.listeners.forEach(l => l(this.state));
        saveState(this.state);
    },

    setState(newState, suppressNotify = false) {
        this.state = { ...this.state, ...newState };
        if (!suppressNotify) {
            this.notify();
        } else {
            saveState(this.state);
        }
    },

    toggleItem(itemId) {
        const selected = new Set(this.state.selectedItems);
        if (selected.has(itemId)) {
            selected.delete(itemId);
        } else {
            selected.add(itemId);
        }
        this.setState({ selectedItems: Array.from(selected) });
    },

    setPrice(itemId, price, suppressNotify = false) {
        this.setState({
            prices: {
                ...this.state.prices,
                [itemId]: parseFloat(price) || 0
            }
        }, suppressNotify);
    },

    setSettings(newSettings, suppressNotify = false) {
        this.setState({
            settings: { ...this.state.settings, ...newSettings }
        }, suppressNotify);
    },

    setLang(lang) {
        this.setState({ lang });
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' || lang === 'ur' ? 'rtl' : 'ltr';
    }
};

function loadState() {
    const stored = localStorage.getItem(STORE_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            // Merge with initial to ensure structure
            return { ...initialState, ...parsed, settings: { ...initialState.settings, ...parsed.settings } };
        } catch (e) {
            console.error('Failed to load state', e);
        }
    }
    return initialState;
}

function saveState(state) {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
}
