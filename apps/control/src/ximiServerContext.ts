import { createContext } from "react";
import { servers, XimiServer } from "../../../lib/ximiServers";

const XimiServerContext = createContext<{
  server: XimiServer;
  setServer: (x: XimiServer) => void;
}>({
  server: servers[0],
  setServer: () => {},
});

export { XimiServerContext };
