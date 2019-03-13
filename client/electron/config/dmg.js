/*
* Create by zhaoxuhui on 2018/12/5
*/
const dmg = require('electron-installer-dmg');
const config = require('./index');

dmg({
    appPath:'./build/mac', //electron-packager. 打包出来的文件地址
    title:'document',
    name:config.appName,// 打包出来的dmg文件名称
    icon:'./static/logo.png',//
    overwrite:true,// 是否覆盖上一次生成的文件
    iconSize:80 // icon文件大小
}, function  (err) {
    if(err){
        console.log(err);
        return ;
    }
    console.log('创建dmg文件成功！');
})
