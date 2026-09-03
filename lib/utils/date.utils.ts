import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend dayjs with the required plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Set the default timezone to 'Asia/Kolkata' (Indian Standard Time)
dayjs.tz.setDefault('Asia/Kolkata');

export const todayStartDate = () => {
  return dayjs().tz().startOf('day').toDate();
};

export const todayEndDate = () => {
  return dayjs().tz().endOf('day').toDate();
};

export const getDate = (date?: string | Date) => {
  return dayjs(date).tz().toDate();
};

export const formatDateForAPI = (date: Date): string => {
  return date.toISOString();
};
