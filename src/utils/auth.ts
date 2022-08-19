import { ITokenResponse } from "../../netlify/functions/utils";
import Cookies from "js-cookie";

export async function getAccessToken() {
  const token = Cookies.get("token");
  if (token) {
    return Promise.resolve({
      access_token: token,
      error: null,
    });
  }
  return fetch(".netlify/functions/authorize").then(async (res) => {
    const response = (await res.json()) as unknown as ITokenResponse;
    if (response.access_token) {
      document.cookie = `token=${response.access_token}; max-age=${response.expires_in}; path=/`;
    }
    return response;
  });
}
