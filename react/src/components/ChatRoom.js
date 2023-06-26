import React, { useState, useEffect, useRef } from "react";
import MyMessage from "./MyMessage";
import axios from 'axios';
import { PaperAirplaneIcon } from "@heroicons/react/solid";

const ChatRoom = () => {
  // to get the messages and store it here
  const [messages, setMessages] = useState([]);
  // Current input field value
  const [text, setText] = useState("");
  // is send button enable or not
  const [sendButton, setSendButton] = useState(false);


  // dummy reference just to scroll
  const dummy = useRef(null);
  // to send the message through ctrl+enter
  const formRef = useRef(null);
  const messageInputRef = useRef(null);

  // This fetch all the messages from the firebase db and set it the message state
  useEffect(() => {
  }, []);

  useEffect(() => {
    function submitFormOnCtrlEnter(event) {
      if (
        (event.keyCode === 10 || event.keyCode === 13) &&
        event.ctrlKey &&
        text.trim()
      ) {
        sendMessage(event);
      }
    }

    if (formRef !== null) {
      formRef.current.addEventListener("keydown", submitFormOnCtrlEnter);
      return () =>
        formRef.current.removeEventListener("keydown", submitFormOnCtrlEnter);
    }
  }, [text, formRef, sendMessage]);

  // this identify isSendButton enable or not
  // if input field has a value or the image is selected only then it enables it
  useEffect(() => {
    if (text.trim()) {
      setSendButton(true);
    } else {
      setSendButton(false);
    }
  }, [text]);

  /* function just to scroll to the bottom to the dummy div */
  function scrollToBottom() {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }

  // Scroll every time as we send the messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // It send the message to the firebase storage
  function sendMessage(e) {
    e.preventDefault();

    // Checking if text or image is empty then don't send the message
    if (!text) return null;

    setMessages([
      ...messages,
      { id: 1, sender: "me", data: text },
    ]);

    var data = JSON.stringify({"content":text});

    var config = {
      method: 'post',
      url: 'http://localhost:8000/question',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };

    axios(config)
    .then(function (response) {
      if (response.status == 200)
      {
        setMessages([
          ...messages, // Put old items at the end
          { id: 1, sender: "me", data: text },
          { id: 2, sender: "ai", data: response.data.data }
        ]);
      //  setMessages(chatHistoryList)
      }
    })
    .catch(function (error) {
      console.log(error);
    });

    scrollToBottom();
    setText("");
    messageInputRef.current.style.height = "40px";
  }

  return (
    <div className="flex flex-col w-full gap-0 h-screen relative lg:mx-auto lg:my-0 ">

      {/* main Chat content */}
      <div className="flex flex-col px-3 overflow-x-hidden scrollbar-hide h-full w-full max-w-5xl mx-auto pb-4">
        {messages &&
          messages.map((message, i) => {
            // It checks do we need to show the name of the sender or not
            // It determines the is lastMessageSender or the CurrentMessageSender are the same
            // if they are same then don't show the details
            // else show the details
            let showDetails = true
            return (
              <MyMessage
                key={i}
                showDetails={showDetails}
                data={message}
              />
            );
          })}

        {/* Dummy div onScrollBottom we scroll to here */}
        <div ref={dummy}></div>
      </div>

      {/* input form */}
      <form
        ref={formRef}
        className="sticky w-full bottom-0 z-50 bg-gray-600 dark:text-black px-5 py-2 flex justify-center gap-4 items-center"
        onSubmit={sendMessage}
      >
        <textarea
          ref={messageInputRef}
          type="text"
          onInput={(e) => {
            e.target.style.height = "5px";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex items-center max-w-full w-full max-h-44 h-10 lg:max-w-screen-md py-2 placeholder-gray-200 text-white outline-none resize-none scrollbar-hide bg-transparent"
        />

        {/* 
          Submit Button 
          - if the text is empty only then show the filePicker
          - otherwise show the send button  
        */}
        <button
          className="p-2 text-white bg-blue-500 self-end rounded-full grid place-items-center"
          type="submit"
          onClick={sendMessage}
        >
          {sendButton ? (
            <PaperAirplaneIcon className="w-7 h-7" />
          ) : (
            <PaperAirplaneIcon className="w-7 h-7" />
          )}
        </button>

      </form>
    </div>
  );
};

export default ChatRoom;
