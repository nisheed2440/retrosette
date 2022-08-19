import { Handler } from "@netlify/functions";
import { getAccessToken } from "./utils";

const handler: Handler = async () => {
  const output = await getAccessToken();
  return {
    statusCode: output.error ? 400 : 200,
    mimetype: "application/json",
    body: JSON.stringify(output),
  };
};

export { handler };
