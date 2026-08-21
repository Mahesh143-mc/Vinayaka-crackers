/**
 * Standardized Date Range Filter Utility
 */

export const DATE_FILTER_OPTIONS = [
  { id: 'all', label: 'All Time' },
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'last7days', label: 'Last 7 Days' },
  { id: 'thisMonth', label: 'This Month' },
  { id: 'lastMonth', label: 'Last Month' },
  { id: 'custom', label: 'Custom Range' }
];

export const isWithinDateRange = (itemDate, filterType = 'all', customStart = '', customEnd = '') => {
  if (!filterType || filterType === 'all') return true;
  if (!itemDate) return false;

  let d = null;
  if (typeof itemDate?.toDate === 'function') {
    d = itemDate.toDate();
  } else if (itemDate?.seconds) {
    d = new Date(itemDate.seconds * 1000);
  } else if (typeof itemDate === 'string' || typeof itemDate === 'number') {
    d = new Date(itemDate);
  } else if (itemDate instanceof Date) {
    d = itemDate;
  }

  if (!d || isNaN(d.getTime())) return true;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  if (filterType === 'today') {
    return d >= todayStart && d <= todayEnd;
  }

  if (filterType === 'yesterday') {
    const yestStart = new Date(todayStart);
    yestStart.setDate(yestStart.getDate() - 1);
    const yestEnd = new Date(todayEnd);
    yestEnd.setDate(yestEnd.getDate() - 1);
    return d >= yestStart && d <= yestEnd;
  }

  if (filterType === 'last7days') {
    const sevenDaysAgo = new Date(todayStart);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    return d >= sevenDaysAgo && d <= todayEnd;
  }

  if (filterType === 'thisMonth') {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    return d >= monthStart && d <= todayEnd;
  }

  if (filterType === 'lastMonth') {
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    return d >= lastMonthStart && d <= lastMonthEnd;
  }

  if (filterType === 'custom' && customStart && customEnd) {
    const start = new Date(customStart + 'T00:00:00');
    const end = new Date(customEnd + 'T23:59:59');
    return d >= start && d <= end;
  }

  return true;
};
