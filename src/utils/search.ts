import { getAccessToken } from "./auth";

export async function getSearchResults(query: string) {
  const output = await getAccessToken();
  if (output.error) {
    return {
      error: output.error,
    };
  }
  return fetch(
    "https://api.spotify.com/v1/search?type=album&limit=50&q=" + query,
    {
      headers: {
        Authorization: "Bearer " + output.access_token,
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json());
}
