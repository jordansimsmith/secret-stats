import auth0 from 'auth0-js';

class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: 'are-you-hitler.auth0.com',
      audience: 'https://are-you-hitler.auth0.com/userinfo',
      clientID: 'VdF04cFVzLURRRvn5rjhR7RE2tGtzTlz',
      redirectUri: 'http://localhost:5000/callback',
      responseType: 'id_token',
      scope: 'openid profile',
    });
  }

  getProfile = () => this.profile;

  getIdToken = () => this.idToken;

  isAuthenticated = () => new Date().getTime() < this.expiresAt;

  signIn = () => this.auth0.authorize();

  handleAuthentication = () => {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) {
          return reject(err);
        }

        if (!authResult || !authResult.idToken) {
          return reject(err);
        }

        // success, set fields
        this.idToken = authResult.idToken;
        this.profile = authResult.idTokenPayload;
        this.expiresAt = authResult.idTokenPayload.exp * 1000;
        resolve();
      });
    });
  };

  signOut = () => {
    this.idToken = null;
    this.profile = null;
    this.expiresAt = null;
  };
}

// singleton instance
const auth0Client = new Auth();

export default auth0Client;
