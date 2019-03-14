import schedule from 'node-schedule';
import {rmdir,mkdir} from '../../utils/fs';
import logger from '../../utils/logger';
/*定时清除tmp文件夹内容*/
export default async () => {
    const rule = new schedule.RecurrenceRule();
    rule.hour = [3];// 凌晨三点清除
    schedule.scheduleJob(rule,async () => {
        await rmdir('tmp');
        await mkdir('tmp');
        logger.info('清空缓存文件夹');
    });
}

