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
    <div className="min-h-screen bg-base-100 py-12 px-6">
      <h1 className="text-center text-4xl font-bold text-primary mb-10">Your Connections</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {connections.map((connection) => {
          const { _id, firstName, lastName, age, gender, photoUrl, about, skills = [] } = connection;

          return (
            <div
              key={_id}
              className="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden"
            >
              {/* Cover + avatar overlay */}
              <div className="relative">
                <div className="h-36 bg-gradient-to-r from-primary to-secondary" />
                <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12">
                  <div className="w-36 h-36 rounded-full border-6 border-white shadow-2xl overflow-hidden bg-white">
                    <img src={photoUrl} alt={`${firstName} ${lastName}`} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <div className="pt-16 pb-6 px-6 text-center">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {firstName} {lastName}
                </h2>
                {(age || gender) && (
                  <p className="text-sm text-gray-500 mt-1">{age ? `${age} yrs` : ''}{age && gender ? ' • ' : ''}{gender || ''}</p>
                )}

                {about && (
                  <p className="mt-3 text-sm text-center text-gray-600 px-2 line-clamp-4">
                    {about}
                  </p>
                )}

                {skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {skills.map((s, i) => (
                      <span key={i} className="px-3 py-1 text-xs rounded-full bg-base-200 text-gray-700">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex items-center justify-center gap-4">
                  <button className="btn btn-primary btn-sm py-2 px-4">Message</button>
                  <button className="btn btn-primary btn-sm py-2 px-4">View Profile</button>
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
