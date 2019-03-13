//主题颜色 可选 primary  dark
export const THEME = 'dark';
//base-url 数据请求基本路径
export const BASE_URL = process.env.NODE_ENV=='development'? 'http://localhost:8000':'/api';
//分页大小
export const PAGE_SIZE = 20;
//编辑器自动保存间隔时间
export const AUTO_SAVE_INTERVAL = 1000 * 12;
//用户类型
export const USER_TYPES = {
    'ADMIN' : '管理员',
    'DEV' : '开发人员',
    'PM' : '产品经理',
    'UI' : 'UI设计'
};
