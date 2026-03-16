import type { DateRangePreset } from 'components/DatePicker/DatePicker';

export const TRANSACTIONS_DATEPICKER_PRESETS : DateRangePreset[] = [
  { index: 0, label: "Last 7 Days", getRange: () => ({ from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), to: new Date() }) },
  { index: 1, label: "This Month", getRange: () => {
    const now = new Date();
    return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: new Date() };
  }},
  { index: 2, label: "Last Month", getRange: () => {
    const now = new Date();
    return { from: new Date(now.getFullYear(), now.getMonth() - 1, 1), to: new Date(now.getFullYear(), now.getMonth(), 0) };
  }},
  { index: 3, label: "Last 3 Months", getRange: () => {
    const now = new Date();
    return { from: new Date(now.getFullYear(), now.getMonth() - 3, 1), to: new Date(now.getFullYear(), now.getMonth(), 0) };
  }},
  {
    index: 4, label: "Last year", getRange: () => {
      const now = new Date();
      return { from: new Date(now.getFullYear() - 1, 0, 1), to: new Date(now.getFullYear() - 1, 11, 31) };
  }},
  { index: 5, label: "YTD", getRange: () => {
    const now = new Date();
    return { from: new Date(now.getFullYear(), 0, 1), to: now };
  }},
];
