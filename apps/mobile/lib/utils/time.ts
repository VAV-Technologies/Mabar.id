/**
 * Get greeting key based on current time
 */
export function getGreetingKey(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

/**
 * Format a date relative to now
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const target = typeof date === 'string' ? new Date(date) : date;
  const diff = now.getTime() - target.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return target.toLocaleDateString();
  }
  if (days > 1) {
    return `${days} days ago`;
  }
  if (days === 1) {
    return 'Yesterday';
  }
  if (hours > 1) {
    return `${hours} hours ago`;
  }
  if (hours === 1) {
    return '1 hour ago';
  }
  if (minutes > 1) {
    return `${minutes} minutes ago`;
  }
  if (minutes === 1) {
    return '1 minute ago';
  }
  return 'Just now';
}

/**
 * Format time remaining until a date
 */
export function formatTimeRemaining(date: Date | string): string {
  const now = new Date();
  const target = typeof date === 'string' ? new Date(date) : date;
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) return 'Expired';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

/**
 * Check if a date is expired
 */
export function isExpired(date: Date | string): boolean {
  const target = typeof date === 'string' ? new Date(date) : date;
  return target.getTime() < Date.now();
}

/**
 * Check if expiring within hours
 */
export function isExpiringSoon(date: Date | string, withinHours: number = 2): boolean {
  const target = typeof date === 'string' ? new Date(date) : date;
  const diff = target.getTime() - Date.now();
  return diff > 0 && diff < withinHours * 60 * 60 * 1000;
}
