import schedule from 'node-schedule';
import {rmdir} from '../../utils/fs';
import logger from '../../utils/logger';
/*定时清除日志*/
export default async () => {
    const rule = new schedule.RecurrenceRule();
    rule.date = [1];
    schedule.scheduleJob(rule,async () => {
        await rmdir('logs');
        logger.info('清除日志文件！');
    });
}
