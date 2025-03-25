const _envVars = {
    backendURI: import.meta.env.VITE_BACKEND_APP_URI,
    serverURI: import.meta.env.VITE_SERVER_URI,
    appURI: import.meta.env.VITE_APP_URI,
    frontendURI: import.meta.env.VITE_APP_URI,
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID
  };
  
  // getEnvConfig is a function that returns the value of an environment variable
  export const getEnvConfig = {
    get(key) {
      const value = _envVars[key];
      if (!value) {
        console.error(`Missing environment variable ${key}`);
      }
      return value;
    },
  };
  