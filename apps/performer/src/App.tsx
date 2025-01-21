import { LiveKitRoom } from "@livekit/components-react";
import {
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useContext,
} from "react";
import { Button, RoomList } from "ui/tailwind";
import { FaSpinner } from "react-icons/fa6";
import { Header, Layout } from "ui/tailwind";
import { Dialog, Transition } from "@headlessui/react";
import useSWR from "swr";
import { ErrorMessage, Field, Formik, useFormikContext } from "formik";
import { joinRoomSchema } from "validation-schema/dist/index.mjs";
import * as Yup from "yup";
import { Fragment } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Stage } from "./Stage";
import { joinRoomSchemaForRoom } from "validation-schema";
import { XimiServerContext } from "./ximiServerContext";
import { XimiServer, servers } from "../../../lib/ximiServers";

function ServerSwitcher({ enabled }: { enabled: boolean }) {
  const { server, setServer } = useContext(XimiServerContext);
  return (
    <select
      disabled={!enabled}
      value={server.id}
      className="py-0.5 px-1 border rounded bg-bg text-text border-brand"
      onChange={(e) => {
        const newVal = servers.find((a) => a.id === e.target.value);
        if (newVal === undefined) {
          return;
        }
        setServer(newVal);
      }}
    >
      {servers.map((server) => (
        <option key={server.id} value={server.id}>
          {server.name}
        </option>
      ))}
    </select>
  );
}

function App() {
  const [roomname, setRoomname] = useState<string>();
  const [identity, setIdentity] = useState<string>();
  const [token, setToken] = useState<string>();
  const [connect, setConnect] = useState<boolean>(false);
  const [server, setServer] = useState<XimiServer>(servers[0]);

  const { data: livekitUrl, isValidating } = useSWR(
    `livekitUrl-${server.id}`,
    async () => {
      const req = await fetch(`${server.serverUrl}/livekit-url`);
      const { livekitUrl } = await req.json();
      return livekitUrl;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  console.log({ isValidating, livekitUrl });

  return (
    <XimiServerContext.Provider value={{ server, setServer }}>
      <LiveKitRoom
        token={token}
        serverUrl={livekitUrl}
        connect={connect && !isValidating && typeof livekitUrl === "string"}
      >
        <Screen
          room={roomname}
          identity={identity}
          setToken={setToken}
          setConnect={setConnect}
          setRoomname={setRoomname}
          setIdentity={setIdentity}
        />
      </LiveKitRoom>
    </XimiServerContext.Provider>
  );
}

export default App;

const Screen: React.FC<{
  room?: string;
  identity?: string;
  setToken: Dispatch<SetStateAction<string | undefined>>;
  setConnect: Dispatch<SetStateAction<boolean>>;
  setRoomname: Dispatch<SetStateAction<string | undefined>>;
  setIdentity: Dispatch<SetStateAction<string | undefined>>;
}> = ({ identity, room, setToken, setConnect, setRoomname, setIdentity }) => {
  return (
    <Layout>
      <Header
        roomName={room}
        version={__APP_VERSION__}
        identity={identity}
        ServerSwitcher={<ServerSwitcher enabled={room === undefined} />}
      />
      {room === undefined || identity === undefined ? (
        <RoomListScreen
          setToken={setToken}
          setConnect={setConnect}
          setRoomname={setRoomname}
          setIdentity={setIdentity}
        />
      ) : (
        <Stage />
      )}
      <Toaster />
    </Layout>
  );
};

const RoomListScreen: React.FC<{
  setToken: Dispatch<SetStateAction<string | undefined>>;
  setConnect: Dispatch<SetStateAction<boolean>>;
  setRoomname: Dispatch<SetStateAction<string | undefined>>;
  setIdentity: Dispatch<SetStateAction<string | undefined>>;
}> = ({ setToken, setConnect, setRoomname, setIdentity }) => {
  const { server } = useContext(XimiServerContext);
  const { data, isValidating, error } = useSWR(
    `list-rooms-${server.id}`,
    async () => {
      const r = await fetch(`${server.serverUrl}/rooms`);
      return await r.json();
    },
    {
      refreshInterval: 5000,
    },
  );

  const [showLoading, setShowLoading] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joiningRoom, setJoiningRoom] = useState<string>("");

  useEffect(() => {
    if (isValidating) {
      setShowLoading(() => true);
    } else {
      window.setTimeout(() => {
        setShowLoading(() => false);
      }, 1000);
    }
  }, [isValidating]);

  if (error) {
    console.error(error);
    return <>Error!</>;
  }

  return (
    <div className="relative p-4">
      <div className="flex flex-col items-center max-w-2xl mx-auto">
        <h1 className="relative inline-block mb-4 text-4xl text-center text-transparent uppercase bg-clip-text bg-gradient-to-l from-brand to-accent">
          Rooms
          <span className="text-lg bg-transparent text-text  px-2 py-1 rounded-md leading-none border border-brand absolute block right-[-15px] top-[50%] translate-y-[-50%] translate-x-[100%]">
            {data?.length || 0}
          </span>
        </h1>
        <div
          className=" max-h-[70vh] overflow-auto w-full"
          style={{
            scrollbarGutter: "stable",
          }}
        >
          <RoomList
            rooms={data}
            onClick={(roomName) => {
              setJoiningRoom(roomName);
              setShowJoinModal(true);
            }}
          />
        </div>
      </div>

      <div
        className={`absolute loading top-4 right-4 text-text transition-opacity animate-spin
					${showLoading ? "opacity-100" : "opacity-0"}`}
      >
        <FaSpinner />
      </div>

      <Transition show={showJoinModal} as={Fragment}>
        <Dialog className="relative" onClose={() => setShowJoinModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="transition duration-100 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-1"
            leave="transition duration-75 ease-out"
            leaveFrom="transform opacity-100"
            leaveTo="transform opacity-0"
          >
            <div className="fixed inset-0 z-10 bg-bg/80">&nbsp;</div>
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-90"
          >
            <Dialog.Panel className="z-20 w-full max-w-lg p-0 border rounded-md bg-bg border-brand text-text top-[50%] left-[50%] fixed transform translate-x-[-50%] translate-y-[-50%]">
              <Dialog.Title className="py-2 text-xl text-center">
                Join Room {joiningRoom}
              </Dialog.Title>

              <Formik<Yup.InferType<ReturnType<typeof joinRoomSchemaForRoom>>>
                validationSchema={joinRoomSchemaForRoom(
                  server.serverUrl,
                  joiningRoom,
                )}
                initialValues={{
                  passcode: "",
                  identity: "",
                  // roomName: joiningRoom,
                }}
                validateOnMount={true}
                onSubmit={async (
                  { passcode, identity: _identity },
                  { setFieldError, resetForm },
                ) => {
                  const identity = _identity.toUpperCase();
                  try {
                    // first, get a token
                    const response = await fetch(
                      `${server.serverUrl}/room/token/performer`,
                      {
                        method: "POST",
                        body: JSON.stringify({
                          identity,
                          passcode,
                          roomName: joiningRoom,
                        }),
                        headers: {
                          "Content-Type": "application/json",
                        },
                      },
                    );

                    const data = await response.json();

                    if (typeof data.token === "string") {
                      setToken(() => data.token);
                      setRoomname(() => joiningRoom);
                      setIdentity(() => identity);
                      setConnect(() => true);
                      resetForm();
                      setShowJoinModal(false);
                    } else {
                      if (data?.message === "Incorrect passcode") {
                        setFieldError("passcode", "Passcode incorrect");
                      } else {
                        throw new Error(data?.message);
                      }
                    }
                  } catch (err) {
                    setShowJoinModal(false);
                    toast.error("An error has occurred");
                  }
                }}
              >
                {({ isValid, isSubmitting, submitForm, resetForm }) => {
                  return (
                    <form>
                      <JoinRoomName joiningRoom={joiningRoom} />
                      <div className="p-4 border-y border-brand">
                        <div className="flex flex-col items-center my-2 gap-1">
                          <label className="text-sm uppercase">Name</label>
                          <Field
                            name="identity"
                            className="text-2xl text-center border bg-bg border-grey [&:focus]:border-brand appearance-none outline-none rounded-sm uppercase"
                            placeholder="Alice"
                            disabled={isSubmitting}
                            data-1p-ignore
                            autoComplete="off"
                          />

                          <div className="text-sm text-negative">
                            <ErrorMessage name="identity" />
                            &nbsp;
                          </div>
                        </div>

                        <div className="flex flex-col items-center my-2 gap-1">
                          <label className="text-sm uppercase">Passcode</label>

                          <Field
                            name="passcode"
                            type="password"
                            disabled={isSubmitting}
                            className="text-2xl text-center border bg-bg border-grey [&:focus]:border-brand appearance-none outline-none rounded-sm"
                            placeholder="*****"
                            data-1p-ignore
                            autoComplete="off"
                          />
                          <div className="text-sm text-negative">
                            <ErrorMessage name="passcode" />
                            &nbsp;
                          </div>
                        </div>
                      </div>
                      <div className="flex p-4 gap-4">
                        <Button
                          onClick={() => {
                            setShowJoinModal(false);
                            resetForm();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          onClick={async () => {
                            await submitForm();
                          }}
                          disabled={!isValid || isSubmitting}
                        >
                          {isSubmitting ? "Submitting" : "Submit"}
                        </Button>
                      </div>
                    </form>
                  );
                }}
              </Formik>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  );
};

const JoinRoomName = ({ joiningRoom }: { joiningRoom: string }) => {
  const { setFieldValue } =
    useFormikContext<Yup.InferType<ReturnType<typeof joinRoomSchema>>>();

  useEffect(() => {
    setFieldValue("roomName", joiningRoom);
  }, [joiningRoom, setFieldValue]);
  return <></>;
};
