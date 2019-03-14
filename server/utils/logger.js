/**
 2  * 输出日志文件
 4  */

import log4js from 'log4js'
import path from 'path'

export default {
    info(txt) {
        this.setLevel('info');
        let logger = log4js.getLogger("info");
        logger.info(txt);
    },
    error(txt) {
        this.setLevel('error');
        let logger = log4js.getLogger("error");
        logger.error(txt);
    },
    warn(txt) {
        this.setLevel('warn');
        let logger = log4js.getLogger("warn");
        logger.warn(txt);
    },
    debug(txt) {
        this.setLevel('debug');
        let logger = log4js.getLogger("debug");
        logger.debug(txt);
    },
    setLevel(type) {
        log4js.configure({
            appenders: {
                file: {
                    type: 'file',
                    filename: path.resolve(__dirname, '../logs/' + type + '/default.log'),
                    maxLogSize: 10 * 1024 * 1024,
                    numBackups: 5,
                    // compress: true,
                    encoding: 'utf-8',
                    mode: 0o0640,
                    flags: 'w+'
                },
                dateFile: {
                    type: 'dateFile',
                    filename: path.resolve(__dirname, '../logs/' + type + '/important.log'),
                    pattern: 'yyyy-MM-dd-hh',
                    // compress: true
                },
                out: {
                    type: 'stdout'
                }
            },
            categories: {
                default: {
                    appenders: ['file', 'dateFile', 'out'],
                    level: type
                }
            }
        });
    }
}
