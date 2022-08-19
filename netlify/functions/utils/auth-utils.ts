import fetch from "node-fetch";
// Get the client id and secret from the environment variables
const { CLIENT_ID, CLIENT_SECRET } = process.env;

export interface ITokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  error?: string;
}

export async function getAccessToken() {
  const output = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
    },
    body: "grant_type=client_credentials",
  })
    .then((res) => res.json())
    .catch((e) => e);
  return output as ITokenResponse;
}
