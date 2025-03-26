export const throwGracefulError = (functionName: string, errorMessage: string) => {
  const message = `Error in ${functionName} function:${errorMessage}`;
  console.error(message);
  throw new Error(message);
};
