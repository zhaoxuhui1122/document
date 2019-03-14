import Vue from 'vue';
import {
    Button,
    Icon,
    Menu,
    Submenu,
    MenuItem,
    Input,
    Select,
    Option,
    OptionGroup,
    Modal,
    Avatar,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    DatePicker,
    LoadingBar,
    Notice,
    Message,
    Card,
    Page,
    Breadcrumb,
    Table,
    Tag,
    Form,
} from 'iview';

const BreadcrumbItem = Breadcrumb.Item ;
const FormItem = Form.Item ;

// 全局组件
const components = [
    Button,
    Icon,
    Menu,
    Submenu,
    MenuItem,
    Input,
    Select,
    Option,
    OptionGroup,
    Modal,
    Avatar,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    DatePicker,
    Card,
    Page,
    Breadcrumb,
    BreadcrumbItem,
    Table,
    Tag,
    Form,
    FormItem,
]
// 插件
const plugins = {
    LoadingBar,
    Notice,
    Message,
    Modal
}
components.forEach(item => {
    if (item.name === 'iSelect') {
        Vue.component('Select', item);
    } else if (item.name === 'iOption') {
        Vue.component('Option', item);
    }
    Vue.component(item.name, item);
})
Object.keys(plugins).forEach(key => {
    Vue.prototype[`$${ key }`] = plugins[key];
})
