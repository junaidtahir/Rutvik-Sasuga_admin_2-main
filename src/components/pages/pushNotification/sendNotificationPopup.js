import { Dialog, Transition } from "@headlessui/react";
import React, { useState } from "react";
import { Fragment } from "react";
import { Crossicon, Information } from "../../../assets/icons";
import Select from "react-select";
// import SentMsgsPopup from "./SentMsgsPopup";
import axios from "axios";
import { auth, db } from "../../../Firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useTranslation } from "react-i18next";
const SendNotificationPopup = ({
  open,
  setOpen,
  //   verify,
  //   setVerify,
  //   susupend,
  //   setSusupend,
  //   msgShow,
  //   setMsgShow,
  //   actionUserId,
  //   setactionUserId,
  //   selectedUser
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sentMsg, setSentMsg] = useState(false);
  const [user] = useAuthState(auth);
  const [type, setType] = useState([]);
  const Type = [
    { value: "PushNotification", label: "Push Notifications" },
    { value: "EmailNotifications", label: "Email Notifications" },
  ];
  const close = () => {
    setOpen(false);
    // setVerify(false);
    // setMsgShow(false);
    // setSusupend(false);
  };

  const handleSendNotification = async () => {
    console.log("type: " + type.value);
    console.log("title: " + title);
    console.log("message: " + message);
    if (type.value === "PushNotification") {
      const newNotificationCollection = collection(db, "notifications");
      addDoc(newNotificationCollection, {
        created_at: new Date(),
        message: message,
        type: "pushNotification",
      }).then((response) => {
        console.log("push added to database.");
      });
      fetch(
        "https://us-central1-sasuga-d222e.cloudfunctions.net/sendMulPushNotifications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            message: message,
            title: title,
          }),
        }
      )
        .then((response) => {
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
    } else if (type.value === "EmailNotifications") {
      const newEmailCollection = collection(db, "mail");
      await addDoc(newEmailCollection, {
        to: title,
        message: {
          html: message,
          subject: "Sasuga support",
        },
      }).then((response) => {
        const newNotificationCollection = collection(db, "notifications");
        addDoc(newNotificationCollection, {
          created_at: new Date(),
          message: message,
          type: "emailNotification",
        });
      });
      alert("Email sent");
    }
    setTitle("");
    setMessage("");
    close();
    setSentMsg(true);
  };

  const handleConfirm = async () => {
    // console.log(selectedUser)
    // const usersRef = doc(db, "users", selectedUser.id );
    //   await setDoc(usersRef, {isVerify: true} ,{ merge: true }).then(async (docSnap) => {
    // });
    close();
  };

  const handleSuspend = async () => {
    // console.log(selectedUser)
    // const usersRef = doc(db, "users", selectedUser.id );
    //   await setDoc(usersRef, {isSuspended: true} ,{ merge: true }).then(async (docSnap) => {
    // });
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
                    <h2 className="text-lg leading-7 text-[#252423] font-medium">
                      {t("SendMessage.SendMessage")}
                    </h2>
                    <div
                      className="absolute top-[51%] -translate-y-1/2 right-3 cursor-pointer"
                      onClick={close}
                    >
                      <Crossicon />
                    </div>
                  </div>
                  {/* Send Message POPUP */}
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"></div>
                    <div className="flex flex-col gap-6 mt-6 pb-10 flex-wrap px-3">
                      <div className="flex items-center gap-6 flex-wrap">
                        <p className="w-[88px] text-left text-base font-semibold leading-6 text-[#000]">
                          {t("Notification.Type")}:
                        </p>

                        <Select
                          value={type}
                          onChange={(e) => {
                            setType(e);
                          }}
                          options={Type}
                          placeholder={"Choose Type"}
                          className="md:w-[400px] w-full min-w-[180px] rounded-l-lg rounded-r-[0px] font-normal text-[14px] leading-[22px] notificationType mr-4"
                        />
                      </div>
                      <div className="flex items-center gap-6 flex-wrap">
                        <p className="w-[88px] text-left text-base font-semibold leading-6 text-[#000]">
                          {type.value == "EmailNotifications"
                            ? "To"
                            : `${t("Notification.Title")}:`}
                        </p>

                        <input
                          type="text"
                          className="md:w-[400px] w-full pl-4 border border-[#D5DDEC] py-3 rounded-lg placeholder:text-Typography placeholder:text-sm text-sm text-Typography focus:outline-none text-typography font-medium"
                          placeholder={
                            type.value == "EmailNotifications"
                              ? "Email"
                              : "Title"
                          }
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
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
                        onClick={handleSendNotification}
                      >
                        {t("SendMessage.Send")}
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* <SentMsgsPopup SentMsg={sentMsg} setSentMsg={setSentMsg} /> */}
    </>
  );
};

export default SendNotificationPopup;
