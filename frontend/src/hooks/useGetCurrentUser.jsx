import getAuthService from "../services/authService";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "../features/auth/authSlice";


const useGetCurrentUser = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const getCurrentUsers = async () => {
      try {
        const userData = await getAuthService.getCurrentUser();
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("Error fetching current user: ", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    getCurrentUsers();
  }, []);
  return { loading, error };
};

export default useGetCurrentUser;
