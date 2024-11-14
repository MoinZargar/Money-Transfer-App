import React, {useState, useEffect} from "react";
import getAuthService from "../services/authService";

const useGetUsers = (filter) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
   
    useEffect(() => {
        setError(null);
        const fetchUsers = async () => {
            try {
                const response = await getAuthService.findUsers(filter);
                setUsers(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        if(filter){
            fetchUsers();
        }
        else{
            setUsers([]);
            setLoading(false);
        }
    }, [filter]);

    return { users, loading, error };
}

export default useGetUsers;
