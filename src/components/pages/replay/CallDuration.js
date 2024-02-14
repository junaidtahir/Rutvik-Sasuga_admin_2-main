import React, { useState, useEffect } from "react";

const CallDuration = ({ isIncoming }) => {
  console.log("🚀 ~ file: CallDuration.js:4 ~ CallDuration ~ isIncoming:", isIncoming)
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration((duration) => duration + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const formattedTime = formatTime(callDuration);

  return (
    <div className="absolute bottom-[85px]">
      <p style={{ position: "relative", zIndex: "99999", color: "#ffff" }}>
        {formattedTime}
      </p>
      {isIncoming && (
        <p style={{ position: "relative", zIndex: "99999", color: "#ffff" }}>
          {"Indoming call...."}
        </p>
      )}
    </div>
  );
};

export default CallDuration;
