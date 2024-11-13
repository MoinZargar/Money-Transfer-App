import { useEffect, useState } from "react";
import getAccountService from "../services/accountService";
const useGetAccountBalance = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await getAccountService.getAccountBalance();
        setBalance(response.data?.balance);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBalance();
  }, []);
  return { balance, loading, error };
};

export default useGetAccountBalance;
