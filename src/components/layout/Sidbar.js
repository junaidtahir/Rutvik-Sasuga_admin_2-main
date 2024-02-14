import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// images
import logo from "../../assets/images/Logo.png";
import { db, auth } from "../../Firebase";
import { query, collection, onSnapshot, setDoc, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

// icons

import { RxCross2 } from "react-icons/rx";
import {
  Dashboard,
  Language,
  Logout,
  Notification,
  Reply,
  Setting,
  User,
} from "../../assets/sidbaricons/sidbarisons";
import { useNavigate } from "react-router-dom";
import { Routing } from "../shared/constants/routing";
import { useTranslation } from "react-i18next";
import phoneIcon from "../../assets/images/phone-icon.png";
import messageIcon from "../../assets/images/message-icon.png";
import languageIcon from "../../assets/images/language.png";

const Sidbar = ({ open, setOpen }) => {
  const [user] = useAuthState(auth);
  const [webCallCount, setWebCallCount] = useState(0);
  const [webMessageCount, setWebMessageCount] = useState(0);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = window.location.pathname;
  const userAuth = window.localStorage.getItem("accessToken");

  // if (auth === null) {
  //   toast.error("Enter your details");
  // }

  const sidbarnavigation = [
    {
      path: "/dashboard",
      name: `${t("Sidebar.Dashboard")}`,
      icon: <Dashboard />,
    },
    {
      path: "/usermanagement",
      name: `${t("Sidebar.UserManagement")}`,
      icon: <User />,
    },
    {
      path: "/pushnotification",
      name: `${t("Sidebar.PushNotification")}`,
      icon: <Notification />,
    },
    {
      path: "/reply",
      name: `${t("Sidebar.Reply")}`,
      icon: <Reply />,
    },
    {
      path: "/adminsetting",
      name: `${t("Sidebar.AdminSetting")}`,
      icon: <Setting />,
    },
    {
      path: "/changeLanguage",
      name: `${t("Sidebar.ChangeLanguage")}`,
      icon: <Language />,
    },
  ];
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "chatroom/" + user.uid + "/chats"));

      const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
        const fetchedChats = [];
        let totalWebCallCount = 0;
        let totalWebMessageCount = 0;

        QuerySnapshot.forEach((doc) => {
          // fetchedChats.push({ ...doc.data(), id: doc.id });
          let chat = doc.data();
          if (chat.web_call_count > 0) {
            totalWebCallCount += chat.web_call_count;
          }
          if (chat.web_message_count > 0) {
            totalWebMessageCount += chat.web_message_count;
          }
        });

        setWebCallCount(totalWebCallCount);
        setWebMessageCount(totalWebMessageCount);
      });
      return () => unsubscribe;
    }
  }, [user]);
  const HeandelLogOut = () => {
    localStorage.removeItem("accessToken");
    navigate(Routing.Login);
  };

  const handleNaviget = (path) => {
    if (userAuth) {
      navigate(path);
    } else {
      toast.error("Enter your details");
    }
  };

  return (
    <aside
      id="default-sidebar"
      className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full md:translate-x-0 ${
        open && " translate-x-0"
      }`}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-lightgray pt-[48px] pl-[24px] flex-col relative">
        <button
          className="md:hidden block absolute top-1 right-1"
          onClick={() => setOpen(false)}
        >
          <RxCross2 className="text-2xl ml-3" />
        </button>
        <div>
          <img src={logo} alt="logo" />
        </div>
        <ul className="mt-10 font-medium flex flex-col gap-4">
          {sidbarnavigation.map((navigation, index) => {
            return (
              <>
                <li
                  key={navigation.index}
                  className={`${
                    location === navigation.path
                      ? "bg-white shadow-Shidbar"
                      : ""
                  } rounded-lg pl-4 py-1`}
                  // key={index}
                >
                  <div
                    onClick={() => handleNaviget(navigation.path)}
                    className={`${
                      location === navigation.path
                        ? "text-darkBlack"
                        : "text-typography"
                    } flex items-center p-2 px-0 rounded-lg cursor-pointer ${
                      navigation.name == "Reply" && "relative"
                    }`}
                  >
                    {navigation.icon}
                    <span className="ml-3">{navigation.name}</span>
                    {navigation.name == "Reply" && (
                      <div
                        className="chat-notification-cont"
                        style={{ flexDirection: "row", top: "13px" }}
                      >
                        {webCallCount > 0 && (
                          <span className="alertCounts">
                            <span className="numbers">{webCallCount}</span>
                            <img src={phoneIcon} alt="messages" />
                          </span>
                        )}
                        {webMessageCount > 0 && (
                          <span className="alertCounts">
                            <span className="numbers">{webMessageCount}</span>
                            <img src={messageIcon} alt="messages" />
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              </>
            );
          })}
          <li className="rounded-lg pl-4">
            <button
              className="flex items-center p-2 px-0 rounded-lg text-typography"
              onClick={HeandelLogOut}
            >
              <Logout />
              <span className="ml-3">{t("Sidebar.LogOut")}</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidbar;
