// https://stackoverflow.com/a/336220
export const validateLogin = (email: string) => {
    const result = String(email)
      .match(
        /^[a-zA-Z0-9_]*$/
      );
    return result !== undefined && result !== null && result.length > 0;

  };
  