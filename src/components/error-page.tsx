import React, { FC } from "react";
import { Stack, Typography, Box } from "@mui/material";
import error from "../assets/error.svg";
import nfcError from "../assets/nfc-red.svg";

export const ErrorPage: FC<{}> = () => {
  return (
    <Stack sx={{ height: "100%" }}>
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <Stack sx={{ height: "100%" }}>
          <Box
            sx={{ paddingTop: "110px", paddingX: "8px", textAlign: "center" }}
          >
            <img src={error} alt={"NFC Error Banner"} />
          </Box>
          <Box
            sx={{ paddingTop: "24px", paddingX: "8px", textAlign: "center" }}
          >
            <Typography variant="h5" sx={{ fontSize: "30px" }}>
              Seems like your browser doesn’t support NFC
            </Typography>
          </Box>
          <Box
            sx={{
              padding: "16px",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <img src={nfcError} alt={"NFC Error"} />
          </Box>
          <Box sx={{ paddingY: "26px", paddingX: "16px", textAlign: "center" }}>
            <Typography variant="body1" color={"GrayText"}>
              Currently only latest Chrome browser on Android supports NFC
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
};

export default ErrorPage;
