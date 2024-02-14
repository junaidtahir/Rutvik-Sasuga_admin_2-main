import React from "react";
import Sidbar from "./Sidbar";
import Header from "./Header";
import { useState } from "react";
import Notification from "../../Notification";
const MainLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div>
      <Notification />
        <div className="fixed inset-y-0 z-50 flex flex-col">
          <Sidbar open={open} setOpen={setOpen} />
        </div>
        <div>
          <Header open={open} setOpen={setOpen} />
          <main className="h-[calc(100vh-62px)] md:w-[calc(100%-256px)] ml-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
