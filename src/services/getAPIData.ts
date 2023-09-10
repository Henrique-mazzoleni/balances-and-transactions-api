import axios, { AxiosError } from 'axios';

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
      return {
        errorCode: 'BAD_REQUEST',
        description: 'Missing API URL. API URL missing from env vars.',
      };
    }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      return {
        errorCode: 'UNAUTHORIZED',
        description: 'Invalid API key.',
      };
    }
    console.log(error);
    return {
      errorCode: 'INTENRAL_SERVER_ERROR',
      description:
        'Something went wrong with the API call. Check the server logs.',
    };
  }
}
