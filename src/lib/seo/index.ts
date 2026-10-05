export const brand = 'Dr Kiran’s MyDentist';
export const absolute = (path: string, site?: URL) => (site ? new URL(path, site).href : undefined);
export const jsonLD = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');
