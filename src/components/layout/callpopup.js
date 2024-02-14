import React from "react";
import { CallReciveicon, CallRejecticon, Crossicon } from "../../assets/icons";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import userimage2 from "../../assets/images/user2.jpg";
import { db } from "../../Firebase";
import { doc, setDoc } from "firebase/firestore";
import userProfile from "../../assets/images/user-profile.png";
import Modal from "react-modal";
const appRoot = document.getElementById("root"); // Replace 'root' with the actual root element id
const customStyles = {
  overlay: {
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Transparent background
  },
  content: {
    //         display: "flex",
    //         alignItems: "center",
    //    justifyContent: "center",
    //         width: "100%",
    //         height: "100%",
    //         background: "transparent",
    //         padding: 0,
    //         margin: 0,
    maxWidth: "100%", // Optional: set a maximum width for the modal
    width: "100%", // Optional: make the modal responsive
    border: "none", // Remove border (if any)
    background: "transparent", // Transparent background
    display: "flex", // Use flexbox for vertical centering
    alignItems: "center", // Center vertically
    justifyContent: "center", // Center horizontally
  },
};
Modal.setAppElement(appRoot);
const Calllpopup = ({
  toggleVideo,
  settoggleVideo,
  open,
  setOpen,
  title,
  setVideoCall,
  userImageChatSection,
  userEmail,
  userPhoneNumber,
  setIsReceiving,
}) => {
  const startCall = async () => {
    const callRef = doc(db, "call", "hO01sqCg552JEdhQMGae");
    await setDoc(
      callRef,
      { isCalling: true, isReceiving: true },
      { merge: true }
    ).then(async (docSnap) => {
      console.log("Call popup done start");
    });
    setVideoCall(true);
    setIsReceiving(true);
    setOpen(false);
  };
  const endCall = async () => {
    const callRef = doc(db, "call", "hO01sqCg552JEdhQMGae");
    await setDoc(
      callRef,
      { isCalling: false, isReceiving: false, callType: "" },
      { merge: true }
    ).then(async (docSnap) => {
      console.log("done end");
    });
    setOpen(false);
    setVideoCall(false);
    settoggleVideo(false);
    setIsReceiving(false);
  };
  console.log("userImageChatSection", userImageChatSection);
  return (
    <>
      {/* <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={setOpen}> */}
      {/* <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
                    </Transition.Child> */}
      {/* <div className="w-full pt-[10px] overflow-y-scroll" style={{height: "calc(100% - 62px)"}}> */}
      <Modal
        style={customStyles}
        isOpen={true}
        onRequestClose={() => setOpen(false)}
      >
        <div style={{ background: "#FFF", width: "40%", borderRadius: "10px" }}>
          {/* <div className="flex min-h-full items-end justify-center  text-center sm:items-center sm:p-0"> */}
          {/* <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-[10px] bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[654px]"> */}
          {/* <div > */}
          <div
            style={{ display: "flex", justifyContent: "end", padding: 10 }}
            className="cursor-pointer"
            onClick={() => {
              setOpen(false);
            }}
          >
            <Crossicon />
          </div>
          {/* </div> */}
          <div className="sm:flex sm:items-start px-[32px] justify-center">
            <div className="flex flex-col gap-4 py-[60px]">
              <div className="sm:flex sm:items-start px-[32px] justify-center">
                <div className="flex flex-col gap-4">
                  <div className="w-[72px] h-[72px] rounded-full bg-[#F4F4F6] mx-auto flex items-center justify-center">
                    <img
                      src={userImageChatSection ?? userProfile}
                      alt="user"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <p className="max-w-[270px] text-[14px] text-[#52678E] font-medium">
                      <b className="text-[18px]">{title}</b> is calling...
                    </p>
                    <b className="text-[18px]">
                      {userPhoneNumber ? userPhoneNumber : userEmail}
                    </b>
                  </div>
                  <div className="flex items-center justify-center gap-9">
                    <button
                      className="h-[35px] w-[35px] rounded-full bg-[#16B188] flex items-center justify-center"
                      onClick={() => startCall()}
                    >
                      <CallReciveicon />
                    </button>
                    <button
                      className="h-[35px] w-[35px] rounded-full bg-[#D8352F] flex items-center justify-center"
                      onClick={() => endCall()}
                    >
                      <CallRejecticon />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* </Dialog.Panel>
                            </Transition.Child> */}
          {/* </div> */}
        </div>
        {/* </Dialog>
            </Transition.Root> */}
      </Modal>
      {/* </div> */}
    </>
  );
};

export default Calllpopup;
