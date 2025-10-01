const isBrowser = typeof window !== "undefined";

export const getAccessTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("accessToken") : null;
export const getRefreshTokenFormLocalStorage = () =>
  isBrowser ? localStorage.getItem("refreshToken") : null;
export const setAccessTokenToLocalStorage = (accessToken: string) =>
  isBrowser && localStorage.setItem("accessToken", accessToken);

export const setRefreshTokenToLocalStorage = (refreshToken: string) =>
  isBrowser && localStorage.setItem("refreshToken", refreshToken);

export const removeTokenFormLocalStorage = () => {
  isBrowser && localStorage.removeItem("accessToken");
  isBrowser && localStorage.removeItem("refreshToken");
};

export const getAvatarFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("avatar") : null;
export const setAvatarToLocalStorage = (avatar: string) =>
  isBrowser && localStorage.setItem("avatar", avatar);
export const removeAvatarFromLocalStorage = () => {
  isBrowser && localStorage.removeItem("avatar");
};

export const getPlanIdFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("planId") : null;
export const setPlanIdToLocalStorage = (planId: number) =>
  isBrowser && localStorage.setItem("planId", planId.toString());
export const removePlanIdFromLocalStorage = () => {
  isBrowser && localStorage.removeItem("planId");
};
