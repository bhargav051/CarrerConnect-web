import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useSelector, useDispatch } from "react-redux";
import { addFeed, appendFeed, clearFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((state) => state.feed);

  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState({
    age: "",
    designation: "",
    experience: "",
  });

  const fetchFeed = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("limit", 10);
      if (!reset && nextCursor) params.append("lastUserId", nextCursor);
      if (filters.age) params.append("age", filters.age);
      if (filters.designation) params.append("designation", filters.designation);
      if (filters.experience) params.append("experience", filters.experience);

      const res = await axios.get(`${BASE_URL}/user/feed?${params.toString()}`, { withCredentials: true });
      const users = res.data?.data || [];
      const newCursor = res.data?.nextCursor || null;

      if (reset) dispatch(addFeed(users));
      else dispatch(appendFeed(users));

      setNextCursor(newCursor);
      setHasMore(users.length > 0);
    } catch (err) {
      console.log("Error fetching feed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeed(true); }, []);

  useEffect(() => {
    if (feed && feed.length === 0 && hasMore && !loading) fetchFeed(false);
  }, [feed]);

  useEffect(() => {
    setNextCursor(null);
    setHasMore(true);
    dispatch(clearFeed());
    fetchFeed(true);
  }, [filters]);

  const currentUser = feed && feed.length > 0 ? feed[0] : null;

  return (
    <div className="flex flex-col items-center min-h-screen bg-base-300 py-10 px-4">
      
      {/* 🔹 Professional Filter Bar */}
      <div className="w-full max-w-md mb-8">
        <div className="collapse collapse-arrow bg-base-100 shadow-xl rounded-2xl border border-base-content/10">
          <input type="checkbox" className="peer" /> 
          <div className="collapse-title text-sm font-bold flex items-center gap-2 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            FILTERS
          </div>
          <div className="collapse-content px-4 pb-4">
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="form-control w-full">
                <label className="label-text text-xs mb-1 ml-1 opacity-70">Age</label>
                <input
                  type="number"
                  placeholder="Min Age"
                  className="input input-bordered input-sm w-full focus:input-primary"
                  value={filters.age}
                  onChange={(e) => setFilters({ ...filters, age: e.target.value })}
                />
              </div>

              <div className="form-control w-full">
                <label className="label-text text-xs mb-1 ml-1 opacity-70">Exp (Years)</label>
                <input
                  type="number"
                  placeholder="Min Years"
                  className="input input-bordered input-sm w-full focus:input-primary"
                  value={filters.experience}
                  onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                />
              </div>

              <div className="form-control w-full col-span-2">
                <label className="label-text text-xs mb-1 ml-1 opacity-70">Professional Role</label>
                <select
                  className="select select-bordered select-sm w-full focus:select-primary"
                  value={filters.designation}
                  onChange={(e) => setFilters({ ...filters, designation: e.target.value })}
                >
                  <option value="">All Designations</option>
                  <option value="Trainee">Trainee</option>
                  <option value="Junior Developer">Junior Developer</option>
                  <option value="Developer">Developer</option>
                  <option value="Senior Developer">Senior Developer</option>
                  <option value="Team Lead">Team Lead</option>
                  <option value="Manager">Manager</option>
                  <option value="HR">HR</option>
                </select>
              </div>
            </div>
            
            <button
              className="btn btn-ghost btn-xs w-full mt-4 text-error"
              onClick={() => setFilters({ age: "", designation: "", experience: "" })}
            >
              Reset All Filters
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 User Feed Display */}
      <div className="w-full flex justify-center">
        {currentUser ? (
          <div className="animate-in fade-in zoom-in duration-300">
            <UserCard user={currentUser} />
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center gap-4 mt-10">
            <span className="loading loading-ring loading-lg text-primary"></span>
            <p className="text-sm font-medium opacity-50">Finding matches...</p>
          </div>
        ) : (
          <div className="text-center mt-10 p-10 bg-base-100 rounded-3xl shadow-inner border border-dashed border-base-content/20">
            <h2 className="text-xl font-bold opacity-30">No More Profiles</h2>
            <p className="text-sm opacity-50">Try broadening your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;