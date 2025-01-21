export type XimiServer = {
  name: string;
  id: "localhost" | "ximi-livekit" | "livekit-cloud";
  serverUrl: string;
};

const servers: XimiServer[] = [
  /** First option is default */

  {
    name: "XIMI Hosted Livekit",
    id: "ximi-livekit",
    serverUrl: "https://next.server.ximi.network",
  },

  {
    name: "Livekit Cloud",
    id: "livekit-cloud",
    serverUrl: "https://lk-node-server.ximi.network",
  },
];

if (import.meta.env.DEV) {
  servers.splice(0, 0, {
    name: "localhost",
    id: "localhost",
    serverUrl: "http://localhost:4000",
  });
}

export { servers };
