import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./index.js";
import useGetCurrentUser from "./hooks/useGetCurrentUser";

function App() {
  const {loading , error} = useGetCurrentUser();
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
