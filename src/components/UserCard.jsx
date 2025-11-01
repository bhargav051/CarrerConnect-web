import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user, className = "" }) => {
  const { firstName, lastName, photoUrl, age, gender, about, skills = [], _id } = user || {};
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try{
      const res = await axios.post(BASE_URL+ "/request/send/" + status + "/" + userId , {}, {
        withCredentials : true,
      });
      // remove the user after marking him interested or ignored
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.log("Error: ",err);
    }
  };

  return (
    <div
      className={`card bg-base-100 w-150 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col ${className}`}
    >
      {/* Image Section */}
      <figure className="relative h-120 bg-base-200 flex justify-center items-center overflow-hidden">
        <img
          src={photoUrl}
          alt={`${firstName ?? ""} ${lastName ?? ""}`.trim() || "User Photo"}
          className="h-full w-full object-contain"  // ✅ Full image (no crop)
        />
        <div className="badge badge-primary absolute top-4 right-4 gap-1 shadow-lg">
          Verified
        </div>
      </figure>

      {/* Content Section */}
      <div className="card-body flex flex-col">
        <h2 className="card-title text-2xl font-bold">
          {firstName || lastName ? `${firstName} ${lastName}`.trim() : "Full Name"}
        </h2>

        {(age || gender) && (
          <div className="flex gap-3 text-sm text-base-content/70">
            {age && <span>{age} years</span>}
            {gender && <span>• {gender}</span>}
          </div>
        )}

        <div className="divider my-2" />

        {about && (
          <p className="text-sm text-base-content/80 leading-relaxed">
            {about}
          </p>
        )}

        {!!skills.length && (
          <div className="mt-2">
            <div className="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-2">
              Skills
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((s, i) => (
                <div key={i} className="badge badge-outline badge-sm">
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="card-actions justify-center mt-auto gap-3">
          <button className="btn btn-outline flex-1" onClick={() => {handleSendRequest("ignore", _id)}}>Ignore</button>
          <button className="btn btn-secondary flex-1" onClick={() => {handleSendRequest("interested", _id)}}>Interested</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
