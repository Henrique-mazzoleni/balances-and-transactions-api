import axios from 'axios';

export function getHistoricalBalance() {
  return { hello: 'world' };
}

export async function getBalance(apiKey: string) {
  try {
    if (process.env.API_URL) {
      const { data } = await axios.get(process.env.API_URL + '/balances', {
        headers: { 'x-api-key': apiKey },
      });
      return data;
    } else {
      throw new Error('API URL missing.');
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getTransactions(apiKey: string) {
  try {
    if (process.env.API_URL) {
      const { data } = await axios.get(process.env.API_URL + '/transactions', {
        headers: { 'x-api-key': apiKey },
      });
      return data;
    } else {
      throw new Error('API URL missing.');
    }
  } catch (error) {
    console.log(error);
  }
}
