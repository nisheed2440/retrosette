// typescript declare NDEFReader on window object

type TNDEFReader = {
  onreading: () => void;
  addEventListener: (
    event: string,
    listener: (event: any) => void,
    options?: any
  ) => void;
  removeEventListener: (event: string, listener: () => void) => void;
  scan: (options?: any) => Promise<void>;
  write: (
    message: { records: any[] },
    options: { signal: AbortSignal }
  ) => Promise<void>;
};

type TWriteOptions = {
  timeout: number;
  ctlr: AbortController;
};

declare global {
  var NDEFReader: any;
}

export class NFC {
  private _ndefSupported: boolean;
  private _ndef: TNDEFReader | null;
  private _ctlr: AbortController | null = null;

  constructor() {
    if (!NFC.supportsNDEFReader()) {
      this._ndefSupported = false;
      this._ndef = null;
    } else {
      this._ndefSupported = true;
      this._ndef = new NDEFReader();
    }
  }

  public get nfcSupported(): boolean {
    return this._ndefSupported;
  }

  public cancelRead(): void {
    this._ctlr?.abort();
  }

  public async read(): Promise<string> {
    return new Promise((resolve, reject) => {
      this._ctlr = new AbortController();
      this._ctlr.signal.onabort = reject;
      // Event listener for reading errors
      this._ndef?.addEventListener("readingerror", () => {
        this._ctlr?.abort("NDEF reader error");
      });
      // Event listener for reading NFC tags
      this._ndef?.addEventListener(
        "reading",
        ({ message }) => {
          const decoder = new TextDecoder();
          // Read the records in the message with type "url"
          for (const record of message.records) {
            if (record.recordType === "url") {
              this._ctlr?.abort();
              return resolve(decoder.decode(record.data));
            }
          }
          // If no record with type "url" was found, reject the promise
          this._ctlr?.abort("No URL record found");
        },
        { once: true }
      );
      // Start reading NFC tags
      this._ndef
        ?.scan({ signal: this._ctlr.signal })
        .catch((err) => reject(err));
    });
  }

  public async write(uri: string, options: TWriteOptions): Promise<any> {
    const { timeout, ctlr } = options;
    return new Promise((resolve, reject) => {
      ctlr.signal.onabort = () => reject("Time is up, bailing out!");
      setTimeout(() => ctlr.abort(), timeout);
      // Write URI to NFC as soon as it is read
      this._ndef
        ?.write(
          {
            records: [{ recordType: "url", data: uri }],
          },
          { signal: ctlr.signal }
        )
        .then(resolve, reject);
    });
  }

  static supportsNDEFReader(): boolean {
    return "NDEFReader" in window;
  }
}
