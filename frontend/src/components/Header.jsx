import { useSelector } from "react-redux";
import { Button } from "../index.js";
import getAuthService from "../services/authService.js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice.js";

const Header = () => {
  const user = useSelector((state) => state.auth.user);
  const firstName = user?.data?.user?.firstName;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const signout = async () => {
    try {
      await getAuthService.signout();
      dispatch(logout());
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="shadow h-14 flex justify-between bg-black px-8">
      <div className="flex flex-col justify-center h-full text-white">PayTM App</div>
      {user && (
        <div className="flex items-center">
          <div className="flex flex-col justify-center h-full text-white mr-4 text-lg">Welcome</div>
          <div className="flex flex-col justify-center h-full text-white text-xl">{firstName.charAt(0).toUpperCase() + firstName.slice(1)}</div>
          <Button onclick={signout} label="Sign Out" type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4" />
        </div>
      )}
    </div>
  );
};

export default Header;