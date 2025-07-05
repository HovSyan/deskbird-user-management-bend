export const tomorrow = (from = new Date()) => new Date(new Date().setDate(from.getDate() + 1));
