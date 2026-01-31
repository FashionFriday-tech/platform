export const getGlobalSlot = (utc: number) => Math.floor(utc / (15 * 60 * 1000)); // 15 min slot
export const getPageSlot = (utc: number) => Math.floor(utc / 5000); // 5 sec slot
