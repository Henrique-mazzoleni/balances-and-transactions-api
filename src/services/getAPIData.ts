import axios from 'axios';

// this function extracts the data from the api given for this exercise
export async function accessAPIData(endpoint: string, apiKey: string) {
  try {
    // validates if the api url was loaded as a environment variable
    if (process.env.API_URL) {
      const { data } = await axios.get(process.env.API_URL + endpoint, {
        // loads the api key through the header
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

export function getHistoricalBalance() {
  return { hello: 'world' };
}
