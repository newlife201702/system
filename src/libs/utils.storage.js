const baseName = "dw";

export default {};

export const token = `${baseName}_token`; // 用户token
export const token_type = `${baseName}_token_type`;
export const expires_in = `${baseName}_expires_in`;
export const refresh_token = `${baseName}_refresh_token`;
export const user = `${baseName}_user`;
export const openedPage = `${baseName}_opened_page`;

export const set = (name, value) => {
  localStorage.setItem(name, JSON.stringify(value));
};
export const get = (name) => {
  const value = localStorage.getItem(name);
  return value ? JSON.parse(value) : null;
};

export const remove = (name) => {
  localStorage.removeItem(name);
};
