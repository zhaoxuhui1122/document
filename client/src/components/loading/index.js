import Vue from 'vue';
import glolaLoading from './loading.vue';
let loadingEl = null;

function initComponent(options = {}) {
    if (loadingEl) {
        return loadingEl;
    }
    const Instance = new Vue({
        render(h) {
            return h(glolaLoading, {
                props: {
                    ...options
                }
            });
        }
    });
    const component = Instance.$mount();

    return component.$el;
}
export default {
    init(options) {
        loadingEl = initComponent(options);
        document.querySelectorAll('body')[0].appendChild(loadingEl);
    },
    done() {
        loadingEl.remove();
    }
};
