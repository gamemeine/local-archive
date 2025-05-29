export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000',
  auth: {
    domain: 'dev-y5sk84ei4zmzfbxz.us.auth0.com',
    clientId: 'qxhq7I1ID86t9Zf0PSjkzpuGoXdtkF9Z',
    authorizationParams: {
      redirect_uri: window.location.origin,
    },
  },
  mapbox: {
    accessToken:
      'pk.eyJ1Ijoib3V0Y2FzdHBpcmF0ZSIsImEiOiJjbTkxYTB4NGQwdW53MmxzaTU0c3BtZ3htIn0.__5N8i1VYPNOu0AcNA9_PA',
  },
};
