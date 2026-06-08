import Cookies from "js-cookie";

export const setCookie = (key : any, value: any, exp = 30) => {
  Cookies.set(key, value, {
    expires: exp,
  });
};

export const getCookie = (key: string) => {
  return Cookies.get(key);
};

export const removeCookie = (key: any) => {
  Cookies.remove(key);
};
