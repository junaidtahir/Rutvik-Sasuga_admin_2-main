import React from 'react'
import { CallReciveicon, CallRejecticon, Crossicon } from "../../../assets/icons";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import userimage2 from "../../../assets/images/user2.jpg";


const Calllpopup = ({ open, setOpen }) => {
    return (
        <>
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={setOpen}>
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
                                                setOpen(false);
                                            }}
                                        >
                                            <Crossicon />
                                        </div>
                                    </div>
                                    <div className="sm:flex sm:items-start px-[32px] justify-center">
                                        <div className="flex flex-col gap-4 py-[60px]">
                                            <div className="sm:flex sm:items-start px-[32px] justify-center">
                                                <div className="flex flex-col gap-4">
                                                    <div className="w-[72px] h-[72px] rounded-full bg-[#F4F4F6] mx-auto flex items-center justify-center">
                                                        <img src={userimage2} alt='user' className='w-full h-full object-cover' />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="max-w-[270px] text-[14px] text-[#52678E] font-medium">
                                                            <b className='text-[18px]'>Czke</b> is calling...
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-center gap-9">
                                                        <button
                                                            className="h-[35px] w-[35px] rounded-full bg-[#16B188] flex items-center justify-center"
                                                            onClick={() => setOpen(false)}
                                                        >
                                                            <CallReciveicon />
                                                        </button>
                                                        <button
                                                            className="h-[35px] w-[35px] rounded-full bg-[#D8352F] flex items-center justify-center"
                                                            onClick={() => setOpen(false)}
                                                        >
                                                            <CallRejecticon />
                                                        </button>
                                                    </div>
                                                </div>
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
    )
}

export default Calllpopup
