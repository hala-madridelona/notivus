/* eslint-disable */
// @ts-nocheck

export const getUserDataFromJwtUser = (tokenUserData: any) => {
  const { access_token, refresh_token, expires_in, ...rest } = tokenUserData;
  return rest;
};
