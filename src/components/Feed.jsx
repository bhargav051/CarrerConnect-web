import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
    const feed = useSelector((store) => store.feed);   // read the feed
    const dispatch = useDispatch();

    const getFeed = async () => {
        if(feed) return;
        try {
            const res = await axios.get(BASE_URL + "/user/feed", {withCredentials: true});
            console.log("feed", res);
            dispatch(addFeed(res?.data?.Data)); // add feed to redux store
        } catch (err) {
            console.log("Error: " + err);
        }
    }

    useEffect(() => {
        getFeed();
    }, []);
    return feed && (<div className="flex justify-center my-10">
        <UserCard user={feed[2]}/>
        </div>)
};

export default Feed;