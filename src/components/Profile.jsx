import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";

const Profile = () => {
  // fetch the user data from the store
  const user = useSelector((store) => store.user);
  return ( user && <div>
    <EditProfile user = {user}/>
  </div>);
};

export default Profile;
