/**
 * neditor完整配置项
 * 可以在这里配置整个编辑器的特性
 */
/**************************提示********************************
 * 所有被注释的配置项均为UEditor默认值。
 * 修改默认配置请首先确保已经完全明确该参数的真实用途。
 * 主要有两种修改方案，一种是取消此处注释，然后修改成对应参数；另一种是在实例化编辑器时传入对应参数。
 * 当升级编辑器时，可直接使用旧版配置文件替换新版配置文件,不用担心旧版配置文件中因缺少新功能所需的参数而导致脚本报错。
 **************************提示********************************/

(function () {
    /**
     * 编辑器资源文件根路径。它所表示的含义是：以编辑器实例化页面为当前路径，指向编辑器资源文件（即dialog等文件夹）的路径。
     * 鉴于很多同学在使用编辑器的时候出现的种种路径问题，此处强烈建议大家使用"相对于网站根目录的相对路径"进行配置。
     * "相对于网站根目录的相对路径"也就是以斜杠开头的形如"/myProject/neditor/"这样的路径。
     * 如果站点中有多个不在同一层级的页面需要实例化编辑器，且引用了同一UEditor的时候，此处的URL可能不适用于每个页面的编辑器。
     * 因此，UEditor提供了针对不同页面的编辑器可单独配置的根路径，具体来说，在需要实例化编辑器的页面最顶部写上如下代码即可。当然，需要令此处的URL等于对应的配置。
     * window.UEDITOR_HOME_URL = "/xxxx/xxxx/";
     */
    var URL = window.UEDITOR_HOME_URL || getUEBasePath();
    var islocal = /^127|^localhost/.test(location.hostname);

    /**
     * 配置项主体。注意，此处所有涉及到路径的配置别遗漏URL变量。
     */
    window.UEDITOR_CONFIG = {
        //为编辑器实例添加一个路径，这个不能被注释
        UEDITOR_HOME_URL : '/static/editor/',
        imageUrlPrefix : '',
        // 服务器统一请求接口路径
        serverUrl : location.origin,
        toolbars : [
            [
                'source',
                'undo',
                'redo',
                'formatmatch',
                'pasteplain',
                'paragraph',
                'fontfamily',
                'fontsize',
                'bold',
                'italic',
                'underline',
                'superscript',
                'subscript',
                'forecolor',
                'backcolor',
                'insertorderedlist',
                'insertunorderedlist',
                'lineheight',
                'justifyleft',
                'justifycenter',
                'justifyright',
                'link',
                'inserttable',
                'uploadImage',
                'insertcode',
                'searchreplace',
                'background',
                'xiumi'

            ]
        ],
        theme : 'notadd',
        //,themePath:URL +"themes/"

        zIndex : 1100, //编辑器层级的基数,默认是900
        autoFloatEnabled : true, // 是否保持toolbar的位置不动
        autoHeightEnabled : false, // 高度自动增加
        retainOnlyLabelPasted : false, // 粘贴只保留标签，去除标签所有属性
        pasteplain : false, // 是否默认为纯文本粘贴
        allowDivTransToP : false, // 不允许将div转位p标签，会造成样式丢失
        elementPathEnabled : false, // 元素路径统计
        wordCount : false, //字数统计
    };

    function getUEBasePath(docUrl, confUrl) {
        return getBasePath(docUrl || self.document.URL || self.location.href, confUrl || getConfigFilePath());
    }

    function getConfigFilePath() {
        var configPath = document.getElementsByTagName('script');

        return configPath[configPath.length - 1].src;
    }

    function getBasePath(docUrl, confUrl) {
        var basePath = confUrl;

        if (/^(\/|\\\\)/.test(confUrl)) {
            basePath = /^.+?\w(\/|\\\\)/.exec(docUrl)[0] + confUrl.replace(/^(\/|\\\\)/, '');
        } else if (! /^[a-z]+:/i.test(confUrl)) {
            docUrl = docUrl.split('#')[0].split('?')[0].replace(/[^\\\/]+$/, '');

            basePath = docUrl + '' + confUrl;
        }

        return optimizationPath(basePath);
    }

    function optimizationPath(path) {
        var protocol = /^[a-z]+:\/\//.exec(path)[0],
            tmp = null,
            res = [];

        path = path.replace(protocol, '').split('?')[0].split('#')[0];

        path = path.replace(/\\/g, '/').split(/\//);

        path[path.length - 1] = '';

        while (path.length) {
            if ((tmp = path.shift()) === '..') {
                res.pop();
            } else if (tmp !== '.') {
                res.push(tmp);
            }
        }

        return protocol + res.join('/');
    }

    window.UE = {
        getUEBasePath : getUEBasePath
    };
})();
