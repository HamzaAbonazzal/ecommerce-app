const isDev = process.env.NODE_ENV === "development";

export const logError = (...args) => {
  if (isDev) console.error(...args);
};

export const logWarn = (...args) => {
  if (isDev) console.warn(...args);
};

export const logInfo = (...args) => {
  if (isDev) console.log(...args);
};
