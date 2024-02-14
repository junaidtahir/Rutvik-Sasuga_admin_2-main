
import { Dialog, Transition } from "@headlessui/react";
import React, { useState } from "react";
import { Fragment } from "react";
import { Crossicon, Information } from "../../../assets/icons";
import SentMsgsPopup from "./SentMsgsPopup";
import axios from "axios";
import { auth, db } from "../../../Firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  setDoc,
  deleteDoc,
  getDocs
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useTranslation } from "react-i18next";
const SendMessagePopup = ({
  open,
  setOpen,
  verify,
  setVerify,
  deleteUser,
  setDeleteUser,
  susupend,
  setSusupend,
  msgShow,
  setMsgShow,
  actionUserId,
  setactionUserId,
  selectedUser,
}) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [sentMsg, setSentMsg] = useState(false);
  const [user] = useAuthState(auth);

  const close = () => {
    setOpen(false);
    setVerify(false);
    setDeleteUser(false);
    setMsgShow(false);
    setSusupend(false);
  };

  const handleSendMsg = async () => {
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }
    console.log(selectedUser);

    let dataObj = {
      location: selectedUser.country,
      name: selectedUser.name,
      photoUrl: selectedUser.photoUrl ? selectedUser.photoUrl : "",
      email: selectedUser.email,
      phone: selectedUser.phone,
    };

    const chatRef = doc(db, "chatroom", user.uid, "chats", actionUserId);
    await setDoc(chatRef, dataObj, { merge: true }).then(async (docSnap) => {
      const newMessageCollection = collection(
        db,
        `chatroom/${user.uid}/chats/${actionUserId}/messages`
      );
      await addDoc(newMessageCollection, {
        message: message,
        createdAt: serverTimestamp(),
        sender: user.uid,
      });
    });

    fetch("https://us-central1-sasuga-d222e.cloudfunctions.net/sendNotification",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          message: message,
          registrationToken: selectedUser.token,
          title: "client_credentials",
          image: "",
          mobile_number: "",
          email: "",
        }),
      }
    ).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((responseJson) => {
        console.log(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });

    setMessage("");
    close();
    setSentMsg(true);
  };

  const handleConfirm = async () => {
    console.log(selectedUser);
    const usersRef = doc(db, "users", selectedUser.id);
    await setDoc(usersRef, { isSuspended: false }, { merge: true }).then(
      async (docSnap) => {}
    );
    close();
  };
  const handleSuspend = async () => {
    console.log(selectedUser);
    const usersRef = doc(db, "users", selectedUser.id);
    await setDoc(usersRef, { isSuspended: true }, { merge: true }).then(
      async (docSnap) => {}
    );
    close();
  };
  const handleDeleteUser = async () => {
    let adminUID = user.uid;
    let userUID = selectedUser.id;
    // deleting user from users collection
    await deleteDoc(doc(db, "users", selectedUser.id)).then(async (docSnap) => {
      const querySnapshot = await getDocs(collection(db, "chatroom", adminUID, "chats", userUID, "messages"));
      querySnapshot.forEach(async (messagesDoc) => {
        // deleting every message from chatroom message collection
        await deleteDoc(messagesDoc.ref).then(async (docSnap) => {
        });
      });
      // finally deleting message doc.
      await deleteDoc(doc(db, "chatroom", adminUID, "chats", userUID)).then(async (docSnap) => {
        // alert("all messages deleted!")
      });
    });
    close();
  };
  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed top-1/2 -translate-y-1/2 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center  text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative  transform overflow-hidden rounded-[10px] bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[654px]">
                  <div className="py-3 px-[32px] sm:block w-full flex items-center justify-between relative border-b border-[#D5DDEC]">
                    {msgShow && (
                      <h2 className="text-lg leading-7 text-[#252423] font-medium">
                        {t("SendMessage.SendMessage")}
                      </h2>
                    )}
                    {deleteUser && (
                      <h2 className="text-lg leading-7 text-[#252423] font-medium">
                        {t("SendMessage.DeleteUser")}
                      </h2>
                    )}
                    {verify && (
                      <h2 className="text-lg leading-7 text-[#252423] font-medium">
                        {t("SendMessage.VerifyUser")}
                      </h2>
                    )}
                    {susupend && (
                      <h2 className="text-lg leading-7 text-[#252423] font-medium">
                        {t("SendMessage.SusupendUser")}
                      </h2>
                    )}
                    <div
                      className="absolute top-[51%] -translate-y-1/2 right-3 cursor-pointer"
                      onClick={close}
                    >
                      <Crossicon />
                    </div>
                  </div>
                  {/* Send Message POPUP */}
                  {msgShow && (
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"></div>
                      <div className="flex flex-col gap-6 mt-6 pb-10 flex-wrap px-3">
                        <div className="flex items-center gap-6 flex-wrap">
                          <p className="w-[88px] text-left text-base font-semibold leading-6 text-[#000]">
                            {t("SendMessage.To")}:
                          </p>

                          <input
                            type="text"
                            className="md:w-[400px] w-full pl-4 border border-[#D5DDEC] py-3 rounded-lg placeholder:text-Typography placeholder:text-sm text-sm text-Typography focus:outline-none text-typography font-medium"
                            placeholder="ID: IS0032"
                            id="PreviousPassword"
                            name="PreviousPassword"
                            value={selectedUser.name}
                            readOnly={true}
                          />
                        </div>
                        <div className="flex items-center gap-6 flex-wrap">
                          <p className="w-[88px] text-left text-base font-semibold leading-6 text-[#000]">
                            {t("SendMessage.Message")}:
                          </p>

                          <textarea
                            className="md:w-[400px] w-full px-4 border border-[#D5DDEC] py-3 rounded-lg placeholder:text-Typography placeholder:text-sm text-sm text-Typography focus:outline-none text-typography font-medium h-[132px]"
                            placeholder={t("SendMessage.TypeMessageHere")}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                        </div>
                        <button
                          className="md:max-w-[435px] h-[50px] text-center text-[#fff] bg-[#353A3F] rounded-md md:ml-[110px] ml-0"
                          onClick={handleSendMsg}
                        >
                          {t("SendMessage.Send")}
                        </button>
                      </div>
                    </div>
                  )}
                  {/* Delete User POPUP */}
                  {deleteUser && (
                    <div className="sm:flex sm:items-start px-[32px] justify-center">
                      <div className="flex flex-col gap-4 py-[60px]">
                        <div className="w-[72px] h-[72px] rounded-full bg-[#F4F4F6] mx-auto flex items-center justify-center">
                          <Information />
                        </div>
                        <div className="text-center">
                          <p className="max-w-[270px] text-[#52678E] font-medium">
                            {t("SendMessage.YouAreAboutToDelete")}{" "}
                            <span className="text-[#000] font-bold">
                              {selectedUser.id},
                            </span>{" "}
                            {t("SendMessage.ClickConfirmToDelete")}
                          </p>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                          <button
                            className="h-[38px] w-[87px] rounded-lg bg-[#16B188] text-white font-semibold"
                            onClick={handleDeleteUser}
                          >
                            {t("SendMessage.Confirm")}
                          </button>
                          <button
                            className="h-[38px] w-[87px] rounded-lg bg-transparent hover:bg-[#16B188] hover:text-white text-[#000] border border-[#D5DDEC] font-bold hover:font-semibold"
                            onClick={close}
                          >
                            {t("SendMessage.Cancel")}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Verify User POPUP */}
                  {verify && (
                    <div className="sm:flex sm:items-start px-[32px] justify-center">
                      <div className="flex flex-col gap-4 py-[60px]">
                        <div className="w-[72px] h-[72px] rounded-full bg-[#F4F4F6] mx-auto flex items-center justify-center">
                          <Information />
                        </div>
                        <div className="text-center">
                          <p className="max-w-[270px] text-[#52678E] font-medium">
                            {t("SendMessage.YouAreAboutToVerify")}{" "}
                            <span className="text-[#000] font-bold">
                              {selectedUser.id},
                            </span>{" "}
                            {t("SendMessage.ClickConfirmToVerify")}
                          </p>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                          <button
                            className="h-[38px] w-[87px] rounded-lg bg-[#16B188] text-white font-semibold"
                            onClick={handleConfirm}
                          >
                            {t("SendMessage.Confirm")}
                          </button>
                          <button
                            className="h-[38px] w-[87px] rounded-lg bg-transparent hover:bg-[#16B188] hover:text-white text-[#000] border border-[#D5DDEC] font-bold hover:font-semibold"
                            onClick={close}
                          >
                            {t("SendMessage.Cancel")}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {susupend && (
                    <div className="sm:flex sm:items-start px-[32px] justify-center">
                      <div className="flex flex-col gap-4 py-[60px]">
                        <div className="w-[72px] h-[72px] rounded-full bg-[#F4F4F6] mx-auto flex items-center justify-center">
                          <Information />
                        </div>
                        <div className="text-center">
                          <p className="max-w-[270px] text-[#52678E] font-medium">
                            {t("SendMessage.YouAreAboutToSuspend")}{" "}
                            <span className="text-[#000] font-bold w-full block">
                              {selectedUser.email === ""
                                ? selectedUser.phone
                                : selectedUser.email}
                              ,
                            </span>
                            {t("SendMessage.ClickConfirmToSuspend")}
                          </p>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                          <button
                            className="h-[38px] w-[87px] rounded-lg bg-[#16B188] text-white font-semibold"
                            onClick={handleSuspend}
                          >
                            {t("SendMessage.Confirm")}
                          </button>
                          <button
                            className="h-[38px] w-[87px] rounded-lg bg-transparent hover:bg-[#16B188] hover:text-white text-[#000] border border-[#D5DDEC] font-bold hover:font-semibold"
                            onClick={close}
                          >
                            {t("SendMessage.Cancel")}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <SentMsgsPopup SentMsg={sentMsg} setSentMsg={setSentMsg} />
    </>
  );
};

export default SendMessagePopup;