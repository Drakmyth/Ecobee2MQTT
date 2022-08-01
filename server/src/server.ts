import app from "./app.js";

const port = globalThis.CONFIG.bridge.port;
app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});
