import React from "react";
import { Check, Crossicon } from "../../../assets/icons";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useTranslation } from 'react-i18next';

const SentMsgsPopup = ({ SentMsg, setSentMsg }) => {
  const { t } = useTranslation();
  return (
    <>
      <Transition.Root show={SentMsg} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setSentMsg}>
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

          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-screen overflow-y-auto">
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-[10px] bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[654px]">
                  <div className="py-5 px-[40px] sm:block w-full flex items-center justify-between relative ">
                    <div
                      className="absolute top-[80%] -translate-y-1/2 right-3 cursor-pointer"
                      onClick={() => {
                        setSentMsg(false);
                      }}
                    >
                      <Crossicon />
                    </div>
                  </div>
                  <div className="sm:flex sm:items-start px-[32px] justify-center">
                    <div className="flex flex-col gap-4 py-[60px]">
                      <div className="w-[72px] h-[72px] rounded-full bg-[#16B18833] mx-auto flex items-center justify-center">
                        <Check />
                      </div>
                      <div className="text-center">
                        <p className="max-w-[270px] text-[#252423] font-medium ">
                          {t('SendMessage.MessageSent')}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="max-w-[270px] text-[#52678E] font-medium">
                          {t('SendMessage.YourMessageHasBeenSentSuccessfully')}
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default SentMsgsPopup;
