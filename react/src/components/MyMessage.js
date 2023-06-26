import React from "react";

const MyMessage = ({ data, showDetails }) => {
  /* 
    props 
      - data : the data which we get from the firebase and it is single document 
      - showDetails : it means that do we need to show the message sender's details
  */

  const isUserSender = data.sender == "me";

  return (
    <div className={`message ${isUserSender ? "sent" : "received"}`}>
      <div className="flex flex-col">
        {/*
         * We only want to show the receiver image
         * it will show the image and name of the sender of the current message
         */}

        {!isUserSender && showDetails && (
          <span>AI</span>
        )}

        {/* Message Container */}
        <section
          className={`text-sm bg-black w-full  max-w-xs text-white p-2 relative rounded-xl sm:max-w-lg flex flex-col shadow-md ${
            !isUserSender && " -mt-6"
          }`}
        >
          {data.data}
          <div
            style={{ fontSize: "10px" }}
            className=" text-gray-300 flex justify-end items-center pt-0.5"
          >

          </div>
        </section>
      </div>
    </div>
  );
};

export default MyMessage;
