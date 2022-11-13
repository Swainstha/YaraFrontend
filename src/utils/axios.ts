import axios from 'axios';
let url = 'https://api.openaq.org';

export default axios.create({
  baseURL: url,
  headers: {
    'Content-Type': 'application/json',
  },
});

