import Vue from 'vue';
import contextmenuComponent from './contextmenu.vue';

let el = null;

function getElement(option) {
    if (el) {
        el.remove();
    }
    const Instance = new Vue({
        render(h) {
            return h(contextmenuComponent, {
                props : option
            });
        }
    });
    el = Instance.$mount().$el;
    return el;
}

export default {
    init(option = {}) {
        const element = getElement(option);
        document.body.appendChild(element);
    },
    remove() {
        el.remove();
    }
};
