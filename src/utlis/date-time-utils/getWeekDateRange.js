export function getWeekDateRange(weekNumber, year = new Date().getFullYear()) {
  const firstDayOfYear = new Date(year, 0, 1);
  const daysOffset = (weekNumber - 1) * 7;
  const startDate = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + daysOffset));
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
}
