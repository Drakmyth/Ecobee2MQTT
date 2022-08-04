import { server } from "./app.js";

const port = globalThis.CONFIG.bridge.port;
server.listen(port, () => {
    console.log(`Server listening on ${port}`);
});
