import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { login, logout } from "./features/auth/authSlice.js";
import authService from "./services/authService";
import { Header } from "./index.js";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return !loading ? (
    <>
      <Header />
      <div className="px-8 py-2 min-h-screen flex flex-wrap content-between">
        <div className="w-full block">
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  ) : null;
}

export default App;
