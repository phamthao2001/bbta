const storeToken: Record<string, any> = {};

const generateToken = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const length = 128;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const genToken = (payload: any) => {
  const token = generateToken();
  storeToken[token] = payload;
  return token;
};

const getToken = (token: string) => {
  return storeToken[token];
};

export const genToken_utils = { genToken, getToken };
