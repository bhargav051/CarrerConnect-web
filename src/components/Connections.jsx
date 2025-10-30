import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", { withCredentials: true });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections)
    return <h1 className="text-center mt-20 text-xl text-gray-500">Loading connections...</h1>;

  if (connections.length === 0)
    return <h1 className="text-center mt-20 text-2xl font-semibold text-gray-600">No Connections Found 😔</h1>;

  return (
    <div className="min-h-screen bg-base-100 py-10 px-4">
      <h1 className="text-center text-4xl font-bold text-primary mb-10">Your Connections</h1>

      <div className="flex flex-wrap justify-center gap-8">
        {connections.map((connection) => {
          const { _id, firstName, lastName, age, gender, photoUrl, about, skills = [] } = connection;

          return (
            <div
              key={_id}
              className="bg-white shadow-md hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden w-[340px]"
            >
              {/* Cover photo area */}
              <div className="h-32 bg-gradient-to-r from-primary to-secondary"></div>

              {/* Profile photo */}
              <div className="flex flex-col items-center -mt-12 px-4 pb-6">
                <img
                  src={photoUrl}
                  alt={`${firstName} ${lastName}`}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                />

                {/* Name & Info */}
                <h2 className="mt-3 text-xl font-semibold text-gray-800">
                  {firstName} {lastName}
                </h2>
                {age && gender && (
                  <p className="text-sm text-gray-500">{age} yrs, {gender}</p>
                )}

                {/* About */}
                {about && (
                  <p className="mt-3 text-sm text-center text-gray-600 px-3 line-clamp-3">
                    {about}
                  </p>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {skills.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs rounded-full bg-base-200 text-gray-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-5 flex gap-3">
                  <button className="btn btn-outline btn-sm">Message</button>
                  <button className="btn btn-secondary btn-sm">View Profile</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
