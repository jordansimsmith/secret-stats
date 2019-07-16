import auth0 from 'auth0-js';

class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: 'are-you-hitler.auth0.com',
      audience: 'https://are-you-hitler-api',
      clientID: 'VdF04cFVzLURRRvn5rjhR7RE2tGtzTlz',
      redirectUri: 'http://localhost:5000/callback',
      responseType: 'token id_token',
      scope: 'openid profile',
    });
  }

  getProfile = () => this.profile;

  getIdToken = () => this.idToken;

  getAccessToken = () => this.accessToken;

  isAuthenticated = () => new Date().getTime() < this.expiresAt;

  signIn = () => this.auth0.authorize();

  handleAuthentication = () => {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) {
          return reject(err);
        }

        if (!authResult || !authResult.idToken || !authResult.accessToken) {
          return reject(err);
        }

        // success, set fields
        this.setSession(authResult);
        resolve();
      });
    });
  };

  silentAuth = () => {
    return new Promise((resolve, reject) => {
      this.auth0.checkSession({}, (err, authResult) => {
        if (err) {
          return reject(err);
        }
        this.setSession(authResult);
        resolve();
      });
    });
  };

  setSession = authResult => {
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;
    this.expiresAt = authResult.idTokenPayload.exp * 1000;
  };

  unsetSession = () => {
    this.accessToken = null;
    this.idToken = null;
    this.profile = null;
    this.expiresAt = null;
  };

  signOut = () => {
    this.unsetSession();
    this.auth0.logout({
      clientID: 'VdF04cFVzLURRRvn5rjhR7RE2tGtzTlz',
      returnTo: 'http://localhost:5000/',
    });
  };
}

// singleton instance
const auth0Client = new Auth();

export default auth0Client;
