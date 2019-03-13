var electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './build/my-app-64',
    outputDirectory: './',
    authors: '赵旭辉',
    exe: 'myapp.exe'
});

resultPromise.then(() =>{
    console.log('创建exe文件成功');
}, (e) => {
    console.log(e);
});
