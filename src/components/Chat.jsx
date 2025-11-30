import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
    const { targetUserId } = useParams();
    const [messages, setMessages] = useState([]);

    const [input, setInput] = useState("");
    const user = useSelector((store) => store.user);
    const userId = user?._id;
    const firstName = user?.firstName;
    const lastName = user?.lastName;
    console.log("lastName:", lastName);

    // fetch initial messages
    const fetchMessages = async () => {
        try {
            const response = await axios.get(BASE_URL+ '/chat/'+ targetUserId, { 
                withCredentials: true 
            });
            console.log("Fetched messages:", response.data.chat.messages);
            const messagesData = response.data.chat.messages || [];
            const formattedMessages = messagesData.map((msg) => {
                return {
                    text: msg.text,
                    firstName: msg.sender.firstName,
                    lastName: msg.sender.lastName,
                    time: new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    id: msg._id,
                    senderId: msg.sender._id
                }
            });
            setMessages(formattedMessages);
        } catch (err) {
            console.log("Error fetching messages:", err);
        }
    }

    useEffect(() => {
        fetchMessages();
    }, [targetUserId]);

    // SEND MESSAGE
    const handleSend = () => {
        if (!input.trim()) return;

        const socket = createSocketConnection();
        socket.emit("sendMessage", {
            firstName,
            lastName,
            from: userId,
            to: targetUserId,
            text: input.trim(),
        });

        setInput("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSend();
    };

    // RECEIVE MESSAGE
    useEffect(() => {
        if (!userId || !targetUserId) return;

        const socket = createSocketConnection();
        socket.emit("joinChat", { userId, targetUserId });

        socket.on("messageReceived", ({ firstName, lastName, from, text }) => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    text,
                    firstName,
                    lastName,
                    senderId: from,
                    time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                },
            ]);
        });

        return () => {
            socket.disconnect();
        };
    }, [userId, targetUserId]);

    return (
        <div className="min-h-screen w-full bg-base-200 flex justify-center">
            <div className="mt-6 mb-6 flex h-[80vh] w-full max-w-3xl flex-col rounded-2xl bg-base-100 shadow-xl border border-base-300">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-base-300 px-6 py-4">
                    <div>
                        <p className="text-xs text-base-content/60">Chatting with</p>
                        <h1 className="text-xl font-semibold text-primary">
                            User ID: {targetUserId}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-success" />
                        <span className="text-xs text-base-content/70">Online</span>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-base-200">
                    {messages.map((msg) => (
                        <div key={msg.id} className={msg.senderId === userId ? "chat chat-end" : "chat chat-start"}>

                            {/* Name and time on top */}
                            <div className="chat-header mb-1">
                                <span className="text-xs font-semibold text-base-content">
                                    {`${msg.firstName} ${msg.lastName}`}
                                </span>
                                <time className="ml-2 text-[10px] text-base-content/60">
                                    {msg.time}
                                </time>
                            </div>

                            {/* Bubble */}
                            <div className="chat-bubble chat-bubble-neutral text-sm leading-relaxed">
                                {msg.text}
                            </div>

                            {/* Footer (optional status text) */}
                            {/* <div className="chat-footer opacity-60 text-[10px] mt-1">
        Delivered
      </div> */}
                        </div>
                    ))}
                </div>


                {/* Input */}
                <div className="border-t border-base-300 px-4 py-3">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            className="input input-bordered input-sm sm:input-md w-full"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            className="btn btn-primary btn-sm sm:btn-md"
                            onClick={handleSend}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
