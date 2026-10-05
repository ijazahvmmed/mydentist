import type { OpeningHours } from '../../types/content';
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  return `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
}
export const formatHours = (hours: OpeningHours) =>
  `${formatTime(hours.opens)}–${formatTime(hours.closes)}`;
export function formatDays(days: string[]): string {
  const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const consecutive = days.every(
    (day, i) => i === 0 || week.indexOf(day) === week.indexOf(days[i - 1]) + 1
  );
  return days.length > 1 && consecutive ? `${days[0]}–${days[days.length - 1]}` : days.join(', ');
}
