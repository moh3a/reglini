export const APP_NAME = "reglini-dz";
export const APP_DESCRIPTION = "AliExpress in algerian dinars.";

export const NEXTAUTH_PROVIDERS = {
  "login-credentials": {
    id: "login-credentials",
    name: "Login",
    type: "credentials",
    signinUrl: "http://localhost:3000/api/auth/signin/login-credentials",
    callbackUrl: "http://localhost:3000/api/auth/callback/login-credentials",
  },
  "register-credentials": {
    id: "register-credentials",
    name: "Register",
    type: "credentials",
    signinUrl: "http://localhost:3000/api/auth/signin/register-credentials",
    callbackUrl: "http://localhost:3000/api/auth/callback/register-credentials",
  },
  facebook: {
    id: "facebook",
    name: "Facebook",
    type: "oauth",
    signinUrl: "http://localhost:3000/api/auth/signin/facebook",
    callbackUrl: "http://localhost:3000/api/auth/callback/facebook",
  },
  google: {
    id: "google",
    name: "Google",
    type: "oauth",
    signinUrl: "http://localhost:3000/api/auth/signin/google",
    callbackUrl: "http://localhost:3000/api/auth/callback/google",
  },
};
