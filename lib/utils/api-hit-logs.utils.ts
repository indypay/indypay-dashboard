export function toEpochRange(startDate: Date, endDate: Date) {
  const from = new Date(startDate);
  from.setHours(0, 0, 0, 0);
  const to = new Date(endDate);
  to.setHours(23, 59, 59, 999);
  return { fromTime: from.getTime(), toTime: to.getTime() };
}

export function maskClientId(clientId?: string): string {
  if (!clientId) return '—';
  if (clientId.length <= 4) return `••••${clientId}`;
  return `••••${clientId.slice(-4)}`;
}

export function statusCodeColor(code: number): string {
  if (code >= 500) return 'red';
  if (code >= 400) return 'gold';
  if (code >= 200) return 'green';
  return 'default';
}

export function methodTagColor(method: string): string {
  const m = method.toUpperCase();
  if (m === 'GET') return 'blue';
  if (m === 'POST') return 'green';
  if (m === 'PUT' || m === 'PATCH') return 'orange';
  if (m === 'DELETE') return 'red';
  return 'default';
}
