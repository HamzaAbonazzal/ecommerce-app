// ====== Admin ======
export const saveAdminToken = (token) => {
  if (typeof window !== "undefined") localStorage.setItem("admin_token", token);
};
export const getAdminToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
};
export const removeAdminToken = () => {
  if (typeof window !== "undefined") localStorage.removeItem("admin_token");
};
export const isAdminAuthenticated = () => !!getAdminToken();

// ====== User ======
export const saveUserToken = (token) => {
  if (typeof window !== "undefined") localStorage.setItem("user_token", token);
};
export const getUserToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("user_token");
};
export const removeUserToken = () => {
  if (typeof window !== "undefined") localStorage.removeItem("user_token");
};
export const isUserAuthenticated = () => !!getUserToken();

export const saveToken = saveAdminToken;
export const getToken = getAdminToken;
export const removeToken = removeAdminToken;
export const isAuthenticated = isAdminAuthenticated;
