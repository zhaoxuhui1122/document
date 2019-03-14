/*
* 下载文件
* */

function base64ToBlob(code) {
    let parts = code.split(';base64,');
    let contentType = parts[0].split(':')[1];
    let raw = window.atob(parts[1]);
    let rawLength = raw.length;
    let uInt8Array = new Uint8Array(rawLength);
    for (let i = 0 ; i<rawLength ; ++ i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], {type : contentType});
}

export default function downloadFile(fileName, content) {
    let aLink = document.createElement('a');
    let blob = base64ToBlob(content);
    let evt = document.createEvent('HTMLEvents');
    evt.initEvent('click', true, true);
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.click();
}
