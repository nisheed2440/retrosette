import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  Stack,
  Typography,
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Button,
  IconButton,
} from "@mui/material";
import { Clear } from "@mui/icons-material";
import AlertDialog from "./alert-dialog";
import save from "../assets/save.svg";
import { NFC } from "../utils/nfc";

const spotifyRegex = new RegExp(
  /https:\/\/open\.spotify\.com\/(album|playlist|track|artist|show|episode)\/(\w+)/
);

export const SavePage: FC<{}> = () => {
  // NFC Ref
  const nfcRef = useRef<NFC>();
  // Abort controller
  const ctlrRef = useRef<AbortController>();
  // The initial value of the text field
  const [spotifyURL, setSpotifyURL] = useState("");
  // scanning flag
  const [scanning, setScanning] = useState(false);
  // URL error modal
  const [urlError, setUrlError] = useState(false);
  // NFC error modal
  const [nfcError, setNfcError] = useState(false);
  // NFC success modal
  const [nfcSuccess, setNfcSuccess] = useState(false);

  useEffect(() => {
    nfcRef.current = new NFC();
  }, [nfcRef]);

  /** Text input onchange callback */
  const handleChangeSpotifyURL = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSpotifyURL(event.target.value.trim());
    },
    [setSpotifyURL]
  );

  /** Clear icon button click callback */
  const handleClickClear = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement>) => {
      setSpotifyURL("");
    },
    [setSpotifyURL]
  );

  /** Clear icon button mouse down callback */
  const handleMouseDownClear = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    },
    []
  );

  /* Scan and write to NFC tag with timeout of 5 seconds */
  const writeToNFC = useCallback(
    async (type: string, id: string) => {
      if (nfcRef.current) {
        ctlrRef.current = new AbortController();
        try {
          // Let's wait for 5 seconds only.
          console.log(`spotify:${type}:${id}`);
          console.log("Writing to NFC");
          await nfcRef.current.write(`spotify:${type}:${id}`, {
            timeout: 5_000,
            ctlr: ctlrRef.current,
          });
          setNfcSuccess(true);
        } catch (err) {
          console.error("Something went wrong", err);
          setNfcError(true);
        } finally {
          setScanning(false);
        }
      }
    },
    [ctlrRef, nfcRef]
  );

  /** Save button callback */
  const handleClickSave = useCallback(async () => {
    setScanning(true);
    const matches = spotifyURL.match(spotifyRegex);
    console.log(spotifyURL, matches);
    if (!matches) {
      setScanning(false);
      setUrlError(true);
      return;
    }
    // Write to NFC tag
    await writeToNFC(matches[1], matches[2]);
  }, [setScanning, spotifyURL, writeToNFC]);

  /** Abort button callback */
  const handleClickAbort = useCallback(async () => {
    ctlrRef.current?.abort();
    setScanning(false);
  }, [setScanning, ctlrRef]);

  /** Close URL error dialog callback */
  const handleClickURLErrorClose = useCallback(() => {
    setUrlError(false);
  }, [setUrlError]);

  /** Close NFC error dialog callback */
  const handleClickNFCErrorClose = useCallback(() => {
    setNfcError(false);
  }, [setNfcError]);

  /** Close NFC success dialog callback */
  const handleClickNFCSuccessClose = useCallback(() => {
    setNfcSuccess(false);
  }, [setNfcSuccess]);

  return (
    <>
      <Stack sx={{ height: "100%" }}>
        <Box sx={{ flex: 1 }}>
          <Stack sx={{ height: "100%" }}>
            <Box
              sx={{ paddingTop: "110px", paddingX: "8px", textAlign: "center" }}
            >
              <img src={save} alt={"NFC Save Banner"} />
            </Box>
            <Box
              sx={{ paddingTop: "24px", paddingX: "8px", textAlign: "center" }}
            >
              <Typography variant="h5" sx={{ fontSize: "30px" }}>
                Save to NFC
              </Typography>
              {/* Placeholder for scanning */}
              {!scanning && (
                <Box
                  sx={{
                    height: "24px",
                  }}
                />
              )}
              {/* Text while scanning */}
              {scanning && (
                <Typography variant="body1" color={"GrayText"}>
                  Scanning and saving URI to NFC...
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                padding: "16px",
                flex: 1,
              }}
            >
              <Stack gap={2}>
                <FormControl variant="outlined" disabled={scanning}>
                  <InputLabel htmlFor="spotify-url">Spotify URL</InputLabel>
                  <OutlinedInput
                    label="Spotify URL"
                    id="spotify-url"
                    value={spotifyURL}
                    onChange={handleChangeSpotifyURL}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          disabled={scanning}
                          aria-label="clear field"
                          onClick={handleClickClear}
                          onMouseDown={handleMouseDownClear}
                          edge="end"
                        >
                          <Clear />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                {!scanning && (
                  <Button
                    disabled={spotifyURL === ""}
                    onClick={handleClickSave}
                    fullWidth
                    size="large"
                    variant="contained"
                  >
                    Save
                  </Button>
                )}
                {scanning && (
                  <Button
                    onClick={handleClickAbort}
                    fullWidth
                    size="large"
                    variant="contained"
                    color="error"
                  >
                    Abort
                  </Button>
                )}
              </Stack>
            </Box>
            <Box
              sx={{ paddingY: "26px", paddingX: "16px", textAlign: "center" }}
            >
              <Typography variant="body1" color={"GrayText"}>
                Paste the link you copied from spotify in the text input above
                and save it to and NFC tag. The timeout for saving is five
                seconds
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>
      {/* URL error dialog */}
      <AlertDialog
        isOpen={urlError}
        title="URL Error"
        content="The link entered is not a valid spotify URL"
        onClose={handleClickURLErrorClose}
      />
      {/* NFC error dialog */}
      <AlertDialog
        isOpen={nfcError}
        title="NFC Error"
        content="Seems like we could not write the data to the NFC"
        onClose={handleClickNFCErrorClose}
      />
      {/* NFC success dialog */}
      <AlertDialog
        isOpen={nfcSuccess}
        title="Success"
        content="Successfully saved data to the NFC"
        onClose={handleClickNFCSuccessClose}
      />
    </>
  );
};

export default SavePage;
