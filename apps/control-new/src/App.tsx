import { LiveKitRoom } from "@livekit/components-react";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { Button, RoomList } from "ui/tailwind";
import { FaSpinner } from "react-icons/fa6";
import { Header, Layout } from "ui/tailwind";
import { Dialog, Transition } from "@headlessui/react";
import useSWR from "swr";
import { ErrorMessage, Field, Formik, useFormikContext } from "formik";
import { createRoomSchema } from "validation-schema";
import * as Yup from "yup";
import { Fragment } from "react";
import { Toaster, toast } from "react-hot-toast";

function App() {
  const [roomname, setRoomname] = useState<string>();
  const [token, setToken] = useState<string>();
  const [connect, setConnect] = useState<boolean>(false);

  return (
    <LiveKitRoom
      token={token}
      serverUrl="ws://localhost:7880"
      connect={connect}
    >
      <Screen
        room={roomname}
        setToken={setToken}
        setConnect={setConnect}
        setRoomname={setRoomname}
      />
    </LiveKitRoom>
  );
}

export default App;

const Screen: React.FC<{
  room?: string;
  setToken: Dispatch<SetStateAction<string | undefined>>;
  setConnect: Dispatch<SetStateAction<boolean>>;
  setRoomname: Dispatch<SetStateAction<string | undefined>>;
}> = ({ room }) => {
  return (
    <Layout>
      <Header roomName={room} version={__APP_VERSION__} />
      {room === undefined ? <RoomListScreen /> : <div>join</div>}
      <Toaster />
    </Layout>
  );
};

const RoomListScreen = () => {
  const { data, isValidating, error, mutate } = useSWR(
    "list-rooms",
    async () => {
      const r = await fetch(
        `${import.meta.env.VITE_XIMI_SERVER_HOST || ""}/rooms`,
      );
      return await r.json();
    },
    {
      refreshInterval: 5000,
    },
  );

  const [showLoading, setShowLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

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
          <RoomList rooms={data} />
        </div>
      </div>

      <div
        className={`absolute loading top-4 right-4 text-text transition-opacity animate-spin
					${showLoading ? "opacity-100" : "opacity-0"}`}
      >
        <FaSpinner />
      </div>
      <div className="fixed bottom-4 left-[50%] translate-x-[-50%]">
        <Button
          size="base"
          onClick={async () => {
            setShowCreateModal(() => true);
            // await createRoom(`RM${Math.floor(Math.random() * 25)}`);
            // mutate();
          }}
        >
          Create room
        </Button>
      </div>

      <Transition show={showCreateModal} as={Fragment}>
        <Dialog
          className="relative"
          // open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        >
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
                Create a new room
              </Dialog.Title>

              <Formik<Yup.InferType<typeof createRoomSchema>>
                validationSchema={createRoomSchema}
                initialValues={{ roomName: "", passcode: "" }}
                validateOnMount={true}
                onSubmit={async ({ roomName, passcode }) => {
                  try {
                    const response = await fetch(
                      `${import.meta.env.VITE_XIMI_SERVER_HOST || ""}/room`,
                      {
                        method: "POST",
                        body: JSON.stringify({ roomName, passcode }),
                        headers: {
                          "Content-Type": "application/json",
                        },
                      },
                    );
                    return response;
                  } catch (err) {
                    toast.error("An error has occurred");
                  }
                }}
              >
                {({ isValid, isSubmitting, submitForm, resetForm, values }) => (
                  <form>
                    <div className="p-4 border-y border-brand">
                      <div className="flex flex-col items-center my-2 gap-1">
                        <label className="text-sm uppercase">Room name</label>
                        <Field
                          name="roomName"
                          className="text-2xl text-center border bg-bg border-grey [&:focus]:border-brand appearance-none outline-none rounded-sm uppercase"
                          placeholder="Myroom"
                          disabled={isSubmitting}
                        />

                        <div className="text-sm text-negative">
                          <ErrorMessage name="roomName" />
                          &nbsp;
                        </div>
                        <CheckRoomExists />
                      </div>

                      <div className="flex flex-col items-center my-2 gap-1">
                        <label className="text-sm uppercase">Passcode</label>

                        <Field
                          name="passcode"
                          type="password"
                          disabled={isSubmitting}
                          className="text-2xl text-center border bg-bg border-grey [&:focus]:border-brand appearance-none outline-none rounded-sm"
                          placeholder="*****"
                        />
                        <div className="text-sm text-negative">
                          <ErrorMessage name="passcode" />
                          &nbsp;
                        </div>
                      </div>
                    </div>
                    <div className="flex p-4 gap-4">
                      <Button onClick={() => setShowCreateModal(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={async () => {
                          const _roomName = values.roomName.toUpperCase();
                          const response =
                            (await submitForm()) as unknown as Response;
                          if (
                            response.status === 200 ||
                            response.status === 201
                          ) {
                            setShowCreateModal(() => false);
                            resetForm();
                            mutate();
                            toast.success(`Created room ${_roomName}`);
                          } else {
                            setShowCreateModal(() => false);
                            const data = await response?.json();
                            if (Array.isArray(data?.message)) {
                              (data.message as string[]).forEach((m) =>
                                toast.error(m),
                              );
                            } else {
                              toast.error("An error has occurred. ");
                            }
                          }
                        }}
                        disabled={!isValid || isSubmitting}
                      >
                        {isSubmitting ? "Submitting" : "Submit"}
                      </Button>
                    </div>
                  </form>
                )}
              </Formik>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  );
};

const CheckRoomExists = () => {
  const { setFieldError, values } =
    useFormikContext<Yup.InferType<typeof createRoomSchema>>();

  useEffect(() => {
    if (values.roomName === "") {
      return;
    }
    try {
      fetch(
        `${import.meta.env.VITE_XIMI_SERVER_HOST || ""}/room/${
          values.roomName
        }/exists`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      ).then((res) => {
        res.json().then((exists) => {
          if (exists) {
            setFieldError("roomName", `room ${values.roomName} already exists`);
          }
        });
      });
    } catch (err) {
      console.log("Error validating room exists");
    }
  }, [values.roomName, setFieldError]);

  return null;
};
