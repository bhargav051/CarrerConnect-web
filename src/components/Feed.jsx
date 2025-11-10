import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useSelector, useDispatch } from "react-redux";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((state) => state.feed);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // 🔹 Fetch feed users (cursor-based pagination)
  const fetchFeed = async () => {
    if (loading || !hasMore) return;
    try {
      setLoading(true);

      const url = nextCursor
        ? `${BASE_URL}/user/feed?lastUserId=${nextCursor}&limit=10`
        : `${BASE_URL}/user/feed?limit=10`;

      const res = await axios.get(url, { withCredentials: true });

      // ✅ Simplified destructuring
      const users = res.data.data || [];
      const newCursor = res.data.nextCursor || null;

      if (users.length > 0) {
        dispatch(addFeed(users));
        setNextCursor(newCursor);
      } else {
        setHasMore(false); // no more users left
      }
    } catch (err) {
      console.log("Error fetching feed:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Initial load
  useEffect(() => {
    if (!feed || feed.length === 0) {
      fetchFeed();
    }
  }, []);

  // 🔹 Fetch next batch automatically when feed empties
  useEffect(() => {
    if (feed && feed.length === 0 && hasMore && !loading) {
      fetchFeed();
    }
  }, [feed]);

  const currentUser = feed && feed[0];

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      {currentUser ? (
        <UserCard user={currentUser} className="max-w-md w-full" />
      ) : hasMore ? (
        <h2 className="text-lg font-semibold text-base-content/60">
          Loading...
        </h2>
      ) : (
        <h2 className="text-lg font-semibold text-base-content/60">
          No more users to show!
        </h2>
      )}
    </div>
  );
};

export default Feed;
