import { useParams } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
    const { targetUserId } = useParams();

    // STATE MANAGEMENT
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [page, setPage] = useState(1);  // track current page for pagination
    const [hasMore, setHasMore] = useState(true); // track if more messages are available
    const [loading, setLoading] = useState(false); // prevent duplicate fetches

    // REDUX/ USER INFO
    const user = useSelector((store) => store.user);
    const userId = user?._id;
    const firstName = user?.firstName;
    const lastName = user?.lastName;
    console.log("lastName:", lastName);

    // REFS FOR SCROLL MANAGEMENT
    const chatContainerRef = useRef(null); // The scrollable div
    const endOfMessagesRef = useRef(null); // Invisible div at bottom

    // FETCH MESSAGES
    const fetchMessages = async (pageNum) => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/chat/${targetUserId}?page=${pageNum}&limit=20`, {
                withCredentials: true 
            });

            const messagesData = response.data.chat.messages || [];
            const totalPages = response.data.totalPages;

            // FORMAT AND SET MESSAGES
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

            // HANDLE STATE UPDATES FOR PAGINATION
            if(pageNum === 1) {
                // Initial load: Set messages directly
                setMessages(formattedMessages);
                // Scroll to bottom immediately
                setTimeout(() => {
                    endOfMessagesRef.current?.scrollIntoView({ behavior: "auto" });
                }, 100);
            }else {
                // Infinite Scroll load: Prepend older messages to the top
                setMessages((prev) => [...formattedMessages, ...prev]);
            }

            // Check if we reached the last page
            setHasMore(pageNum < totalPages);
            setLoading(false);
        } catch (err) {
            console.log("Error fetching messages:", err);
        }
    }

    // 2. EFFECT: Initial Load (Page 1)
    useEffect(() => {
        // Reset state when changing chat targets
        setMessages([]);
        setPage(1);
        setHasMore(true);
        fetchMessages(1);
    }, [targetUserId]);

    // 3. HANDLER: Infinite Scroll Logic
    const handleScroll = () => {
        const container = chatContainerRef.current;
        if (!container) return;

        // If user is at top (scrollTop === 0) and we have more messages
        if (container.scrollTop === 0 && hasMore && !loading) {
            // Save current scroll height BEFORE loading new data
            const previousHeight = container.scrollHeight;

            const nextPage = page + 1;
            setPage(nextPage);

            fetchMessages(nextPage).then(() => {
                // AFTER loading, adjust scroll so user stays at same relative position
                // New scroll top = (New Total Height) - (Old Total Height)
                // This prevents the scrollbar from jumping to the very top
                requestAnimationFrame(() => {
                    container.scrollTop = container.scrollHeight - previousHeight;
                });
            });
        }
    };

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
                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                },
            ]);
            // Auto scroll to bottom on new message
            setTimeout(() => {
                endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        });

        return () => socket.disconnect();
    }, [userId, targetUserId]);

    return (
        <div className="min-h-screen w-full bg-base-200 flex justify-center">
            <div className="mt-6 mb-6 flex h-[80vh] w-full max-w-3xl flex-col rounded-2xl bg-base-100 shadow-xl border border-base-300">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-base-300 px-6 py-4">
                    <div>
                        <p className="text-xs text-base-content/60">Chatting with</p>
                        <h1 className="text-xl font-semibold text-primary">User ID: {targetUserId}</h1>
                    </div>
                </div>

                {/* Messages Container with Scroll Event */}
                <div 
                    ref={chatContainerRef} // Ref attached here
                    onScroll={handleScroll} // Scroll listener attached here
                    className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-base-200"
                >
                    {/* Loading Spinner for Old Messages */}
                    {loading && page > 1 && (
                        <div className="text-center text-xs text-gray-500 py-2">Loading history...</div>
                    )}

                    {messages.map((msg) => (
                        <div key={msg.id} className={msg.senderId === userId ? "chat chat-end" : "chat chat-start"}>
                            <div className="chat-header mb-1">
                                <span className="text-xs font-semibold text-base-content">{`${msg.firstName} ${msg.lastName}`}</span>
                                <time className="ml-2 text-[10px] text-base-content/60">{msg.time}</time>
                            </div>
                            <div className="chat-bubble chat-bubble-neutral text-sm leading-relaxed">{msg.text}</div>
                        </div>
                    ))}
                    
                    {/* Invisible div to target for auto-scrolling to bottom */}
                    <div ref={endOfMessagesRef} />
                </div>

                {/* Input Area */}
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
                        <button className="btn btn-primary btn-sm sm:btn-md" onClick={handleSend}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
