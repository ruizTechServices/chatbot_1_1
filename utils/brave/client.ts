import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const BRAVE_WEB_SEARCH_URL = 'https://api.search.brave.com/res/v1/web/search';
const BRAVE_LOCAL_POIS_URL = 'https://api.search.brave.com/res/v1/local/pois';
const BRAVE_LOCAL_DESCRIPTIONS_URL = 'https://api.search.brave.com/res/v1/local/descriptions';

interface SearchParams {
  q: string;
  [key: string]: any;
}

interface LocationParams {
  ids: string[];
  [key: string]: any;
}

export class BraveClient {
  private apiKey: string;

  constructor(apiKey: string = process.env.NEXT_PUBLIC_BRAVE_API_KEY as string) {
    this.apiKey = apiKey;
  }

  private getHeaders() {
    return {
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip',
      'X-Subscription-Token': this.apiKey,
    };
  }

  public async webSearch(params: SearchParams) {
    try {
      const response = await axios.get(BRAVE_WEB_SEARCH_URL, {
        headers: this.getHeaders(),
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error during web search:', error);
      throw error;
    }
  }

  public async localPoisSearch(params: LocationParams) {
    try {
      const response = await axios.get(BRAVE_LOCAL_POIS_URL, {
        headers: this.getHeaders(),
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error during local POIs search:', error);
      throw error;
    }
  }

  public async localDescriptionsSearch(params: LocationParams) {
    try {
      const response = await axios.get(BRAVE_LOCAL_DESCRIPTIONS_URL, {
        headers: this.getHeaders(),
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error during local descriptions search:', error);
      throw error;
    }
  }
}