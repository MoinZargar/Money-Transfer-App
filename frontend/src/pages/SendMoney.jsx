import MoneyTransferForm from "../forms/MoneyTransferForm";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import getAuthService from "../services/authService";

const SendMoney = () => {
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const response = await getAuthService.findUserById(id);
        setUser(response.data.firstName);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserById();
  }, [id]);
  return (
    <div className="flex justify-center h-screen bg-gray-100">
      <div className="h-full flex flex-col justify-center">
        <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
          <div className="flex flex-col space-y-1.5 p-6">
            <h2 className="text-3xl font-bold text-center">Send Money</h2>
          </div>
          {!loading && user ? (
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-2xl text-white">A</span>
                </div>
                <h3 className="text-2xl font-semibold">{user.charAt(0).toUpperCase() + user.slice(1)}</h3>
              </div>
              <div className="space-y-4">
                <MoneyTransferForm userId={id} user={user}/>
              </div>
            </div>
          ) : (
            <div>loading...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SendMoney;
