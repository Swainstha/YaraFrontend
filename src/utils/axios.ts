import axios from 'axios';
let url = 'https://api.openaq.org/v2/measurements';

export default axios.create({
  baseURL: url,
  headers: {
    'Content-Type': 'application/json',
  },
});

