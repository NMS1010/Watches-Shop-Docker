import * as baseAPI from './baseAPI';

export const getStatistic = async () => {
    return await baseAPI.getData(`statistics/overview`);
};
export const getYearlyRevenue = async (year) => {
    return await baseAPI.getData(`statistics/revenue/${year}`);
};
export const getWeeklyRevenue = async (year, month, day) => {
    return await baseAPI.getData(`statistics/revenue/${year}/${month}/${day}`);
};
