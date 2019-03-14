/*
* Create by zhaoxuhui on 2018/11/26
*/
import fs from 'fs';
import unzip from 'node-unzip-2';
import path from 'path';
/*
* 创建文件夹
* */
export const mkdir = src => {
    return new Promise(resolve => {
        fs.mkdir(src, err => {
            if (err) {
                resolve({
                    success : false,
                    data : err
                })
                return;
            }
            resolve({
                success : true
            })
        })
    })
}

/*
* 删除文件夹
* */

export const rmdir = path => {
    return new Promise(resolve => {
        let files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach(function (file, index) {
                const curPath = path + '/' + file;
                if (fs.statSync(curPath).isDirectory()) {
                    rmdir(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
        resolve(true);
    })
}

/*
* 解压文件
* */


export const unzipFile = (filePath, targetPath) => {
    return new Promise(resolve => {
        const stream = fs.createReadStream(filePath);
        stream.pipe(unzip.Extract({ path: targetPath }));
        stream.on('error', err => {
            resolve({
                success: false,
                data: err
            })
        });
        stream.on('end', () => {
            resolve({
                success: true
            })
        });
    })
}
/*
* 读取文件夹下的目录和文件
* */

const readFiles = filePath => {
    return new Promise(resolve => {
        fs.readdir(filePath, (err, files) => {
            resolve(files);
        })
    })
}

const stat = filedir => {
    return new Promise(resolve => {
        fs.stat(filedir,async  (eror, stats) =>{
            const isFile = stats.isFile();//是文件
            const isDir = stats.isDirectory();//是文件夹
            if (isFile) {
                resolve({
                    path : filedir,
                    type : 'file'
                })
            }
            if (isDir) {
                const children = await fileDisplay(filedir) ;
                resolve({
                    path : filedir,
                    type : 'directory',
                    children
                })
            }
        })
    })
}


function fileDisplay(filePath) {
    return new Promise(async resolve => {
        //根据文件路径读取文件，返回文件列表
        const files = await readFiles(filePath);
        const list = files.map(async filename => {
            var filedir = path.join(filePath, filename);
            const res = await stat((filedir));
            return res;
        })
        Promise.all(list).then(res=>{
            resolve(res);
        })
    })
}
//
export const readdir = src => {
    return new Promise(async resolve => {
        const files = await fileDisplay(src);
        resolve({
            success : true,
            data : files
        });
    })
}
