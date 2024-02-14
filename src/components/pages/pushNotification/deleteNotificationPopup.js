import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { Fragment } from "react";
import { Crossicon, Information } from "../../../assets/icons";

const DeleteNotificationPopup = ({
  selectedUser,
  openDelete,
  setOpenDelete,
  deleteNotification,
}) => {
  const { t } = useTranslation();
  const handleDeleteUser = () => {
    setOpenDelete(!openDelete);
  };
  return (
    <Transition.Root show={openDelete} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleDeleteUser}>
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
                    {t("SendMessage.DeleteUser")}
                  </h2>
                  <div
                    className="absolute top-[51%] -translate-y-1/2 right-3 cursor-pointer"
                    onClick={() => setOpenDelete(!openDelete)}
                  >
                    <Crossicon />
                  </div>
                </div>
                {/* Delete User POPUP */}

                <div className="sm:flex sm:items-start px-[32px] justify-center">
                  <div className="flex flex-col gap-4 py-[60px]">
                    <div className="w-[72px] h-[72px] rounded-full bg-[#F4F4F6] mx-auto flex items-center justify-center">
                      <Information />
                    </div>
                    <div className="text-center">
                      <p className="max-w-[270px] text-[#52678E] font-medium">
                        {t("SendMessage.YouAreAboutToDelete")}{" "}
                        <span className="text-[#000] font-bold block">
                          {selectedUser}
                        </span>{" "}
                        {t("SendMessage.ClickConfirmToDelete")}
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <button
                        className="h-[38px] w-[87px] rounded-lg bg-[#16B188] text-white font-semibold"
                        onClick={() => deleteNotification()}
                      >
                        {t("SendMessage.Confirm")}
                      </button>
                      <button
                        className="h-[38px] w-[87px] rounded-lg bg-transparent hover:bg-[#16B188] hover:text-white text-[#000] border border-[#D5DDEC] font-bold hover:font-semibold"
                        onClick={() => setOpenDelete(!openDelete)}
                      >
                        {t("SendMessage.Cancel")}
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default DeleteNotificationPopup;
