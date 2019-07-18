import axios from 'axios';
import auth from './auth';

const PROD_HOST = 'secretstats.org';
const API =
  process.env.NODE_ENV === 'production'
    ? `http://${PROD_HOST}/api`
    : 'http://localhost:3000';

// adds auth token
const config = () => ({
  headers: {Authorization: `Bearer ${auth.getAccessToken()}`},
});

const getUser = userID => axios.get(`${API}/users/${userID}`, config());

const getUsers = () => axios.get(`${API}/users`, config());

const createUser = user => axios.post(`${API}/users`, user, config());

const updateUser = (user, userID) =>
  axios.put(`${API}/users/${userID}`, user, config());

const deleteUser = userID => axios.delete(`${API}/users/${userID}`, config());

const getGames = userID => {
  const url = userID ? `${API}/games?user_id=${userID}` : `${API}/games`;

  return axios.get(url, config());
};

const createGame = game => axios.post(`${API}/games`, game, config());

const updateGame = (game, gameID) =>
  axios.put(`${API}/games/${gameID}`, game, config());

const deleteGame = gameID => axios.delete(`${API}/games/${gameID}`, config());

const getStats = userID =>
  axios.get(`${API}/stats?user_id=${userID}`, config());

export default {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getGames,
  createGame,
  updateGame,
  deleteGame,
  getStats,
};
