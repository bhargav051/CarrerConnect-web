import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequest = async(status, _id) => {
    try{
        const res = axios.post(BASE_URL + "/request/review/" + status + "/" + _id, {}, {
            withCredentials : true
        });
        // remove the request from the store after accepting or rejecting the request
        dispatch(removeRequest(_id));
    } catch(err) {
        console.log("Error :", err);
    }
  }

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests", {
        withCredentials: true,
      });
      dispatch(addRequests(res?.data?.data));
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return <h1 className="text-center mt-20 text-xl text-gray-500">Loading requests...</h1>;
  if (requests.length === 0) return <h1 className="text-center mt-20 text-2xl font-semibold text-gray-600">No Requests Found 😔</h1>;

  return (
    <div className="max-w-4xl mx-auto my-10 px-4">
      <h1 className="text-center text-4xl font-bold text-primary mb-10">Connection Requests</h1>

      <div className="space-y-6">
        {requests.map((request) => {
          const { _id, firstName, lastName, age, gender, photoUrl, about } = request.fromUserId;

          return (
            <div
              key={_id}
              className="flex flex-col md:flex-row items-center justify-between bg-base-200 shadow-md rounded-2xl p-5 hover:shadow-xl transition-all duration-300"
            >
              {/* Left: Profile Info */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <img
                  alt={`${firstName} ${lastName}`}
                  src={photoUrl}
                  className="w-24 h-24 rounded-full object-cover border-2 border-secondary"
                />
                <div className="text-left">
                  <h2 className="text-xl font-semibold">{firstName + " " + lastName}</h2>
                  {age && gender && (
                    <p className="text-sm text-gray-600">{age} yrs, {gender}</p>
                  )}
                  {about && (
                    <p className="text-sm text-gray-700 mt-1 line-clamp-2">{about}</p>
                  )}
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex gap-3 mt-4 md:mt-0">
                <button className="btn btn-outline btn-error px-6" onClick={() => reviewRequest("rejected",request._id)}>Reject</button>
                <button className="btn btn-secondary px-6" onClick={()=> reviewRequest("accepted",request._id)}>Accept</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
