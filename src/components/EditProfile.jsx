import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [age, setAge] = useState(user.age ?? 18);
  const [gender, setGender] = useState(user.gender);
  const [about, setAbout] = useState(user.about || "");
  const [skills, setSkills] = useState(Array.isArray(user.skills) ? user.skills : []);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [skillInput, setSkillInput] = useState("");
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const dispatch = useDispatch();

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v) return;
    if (!skills.includes(v)) setSkills((prev) => [...prev, v]);
    setSkillInput("");
  };

  const onSkillKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSave = async () => {
    setError("");
    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last name are required.");
      return;
    }
    if (!age || Number(age) < 13 || Number(age) > 120) {
      setError("Please enter a valid age between 13 and 120.");
      return;
    }
    try {
      const payload = { firstName, lastName, age, gender, skills, about, photoUrl };
      const res = await axios.patch(BASE_URL + "/profile/edit", payload, { withCredentials: true });
      console.log("Profile updated successfully !! ", res);
      dispatch(addUser(res?.data));
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2500);
    } catch (err) {
      setError(err?.response?.data || "Something went wrong !!");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Form card: match height */}
        <div className="card bg-base-100 shadow-xl h-full min-h-[560px]">
          <div className="card-body">
            <h2 className="card-title justify-center">Edit Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">First Name</span></label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Last Name</span></label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Age</span></label>
                <input
                  type="number"
                  min={13}
                  max={120}
                  className="input input-bordered w-full"
                  placeholder="Enter age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Gender</span></label>
                <select
                  className="select select-bordered w-full"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option>male</option>
                  <option>female</option>
                  <option>others</option>
                </select>
              </div>

              <div className="form-control md:col-span-2">
                <label className="label"><span className="label-text">Profile Photo URL</span></label>
                <input
                  type="url"
                  className="input input-bordered w-full"
                  placeholder="https://..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />
              </div>

              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">About</span>
                  <span className="label-text-alt">{about.length}/300</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-28"
                  placeholder="Tell us about yourself"
                  value={about}
                  onChange={(e) => setAbout(e.target.value.slice(0, 300))}
                />
              </div>

              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">Skills</span>
                  <span className="label-text-alt">Press Enter or , to add</span>
                </label>
                <div className="join w-full">
                  <input
                    type="text"
                    className="input input-bordered join-item w-full"
                    placeholder="Type a skill and press Enter"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={onSkillKey}
                  />
                  <button type="button" className="btn btn-primary join-item" onClick={addSkill}>
                    Add
                  </button>
                </div>

                {!!skills.length && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((s) => (
                      <div key={s} className="badge badge-outline gap-1">
                        {s}
                        <button
                          type="button"
                          className="btn btn-xs btn-ghost px-1"
                          onClick={() => setSkills(skills.filter((k) => k !== s))}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {error && <p className="text-error mt-2">{error}</p>}

            <div className="card-actions justify-end mt-4">
              <button type="button" className="btn btn-ghost" onClick={() => window.location.reload()}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSave}>
                Save changes
              </button>
            </div>
          </div>
        </div>

        {/* Profile card: match height and width */}
        <div className="h-full min-h-[560px]">
          <UserCard
            className="h-full"
            user={{ firstName, lastName, photoUrl, age, gender, about, skills }}
          />
        </div>
      </div>

      {/* Success Toast */}
      {successOpen && (
        <div className="toast toast-top z-50" role="status" aria-live="polite">
          <div className="alert alert-success">
            <span>Profile updated successfully.</span>
            <button
              type="button"
              className="btn btn-xs btn-ghost"
              onClick={() => setSuccessOpen(false)}
              aria-label="Close"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
