import React, { useEffect, useState } from "react";
import { Container, AppBar, Typography, Box, Toolbar } from "@mui/material";
import "./App.css";
import ErrorPage from "./components/error-page";
import SavePage from "./components/save-page";
import { NFC } from "./utils/nfc";

function App() {
  const [nfcSupported, setNfcSupported] = useState(false);

  useEffect(() => {
    setNfcSupported(NFC.supportsNDEFReader());
  }, [setNfcSupported]);

  return (
    <Container maxWidth={"sm"}>
      <Box>
        <AppBar color={"default"}>
          <Toolbar variant="dense">
            <Typography variant="h6">Retro-sette</Typography>
          </Toolbar>
        </AppBar>
      </Box>
      {!nfcSupported && <ErrorPage />}
      {nfcSupported && <SavePage />}
    </Container>
  );
}

export default App;
