import React, { useEffect, useState } from "react";
import { getHeaderName } from "../../utils/helper";

// icons
import { FaBars } from "react-icons/fa";

const Header = ({ open, setOpen }) => {
  const location = window.location.pathname;

  const [name, setName] = useState("");

  useEffect(() => {
    const result = getHeaderName(location);
    setName(result);
  }, [location]);

  return (
    <>
      <div className="md:pl-64 h-[62px] py-2 border-b border-bordercolor flex items-center relative">
        <button className="md:hidden block" onClick={() => setOpen(true)}>
          <FaBars className="text-2xl ml-3" />
        </button>
        <p className="text-black text-lg font-medium leading-6 ml-8">{name}</p>
      </div>
    </>
  );
};

export default Header;
