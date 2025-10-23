import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate} from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  const handleLogout = async() => {
    try{
      await axios.post(BASE_URL + "/logout", {}, {withCredentials: true});
      // remove data from redux store
      dispatch(removeUser());
      // redirect the page to 
      return navigate("/login");
    } catch(err){
      console.log("Error: ", err);
    }
  }
  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">DevTinder</Link>
      </div>

      <div className="flex gap-4 items-center">
        {/* Show name only if user exists */}
        {user && <p className="px-2">Welcome, {user.firstName}</p>}

        {/* Show dropdown only if user exists */}
        {user && (
          <div className="dropdown dropdown-end flex">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img alt="User photo" src={user.photoUrl} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li><a>Settings</a></li>
              <li><a onClick={handleLogout}>Logout</a></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
