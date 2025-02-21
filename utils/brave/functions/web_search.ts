import { BraveClient } from '../client';

export async function webSearch(braveClient: BraveClient, query: string) {
  try {
    const params = { q: query };
    const results = await braveClient.webSearch(params);
    return results;
  } catch (error) {
    console.error('Error in web search function:', error);
    throw error;
  }
}