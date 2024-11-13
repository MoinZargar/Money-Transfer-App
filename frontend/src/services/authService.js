import axios from 'axios';

const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

class authentication{
  
   async signup({username, firstName, lastName, password}){
      try {
        const response = await axios.post(`${BACKEND_API_BASE_URL}/user/signup`, {username, firstName, lastName, password}, {withCredentials:true});
        return response.data;
      } catch (error) {
        throw error;
      }
   }
   async signin({username, password}){
        try {
            const response = await axios.post(`${BACKEND_API_BASE_URL}/user/signin`, {username, password},{withCredentials:true});
            return response.data;
        } catch (error) {
            throw error;
        }
   }
   async getCurrentUser(){
        try {
            const response = await axios.get(`${BACKEND_API_BASE_URL}/user/current`,{withCredentials:true});
            
            return response.data;
            
        } catch (error) {
            throw error;
        }
   }
   async signout(){
       try {
        const response = await axios.get(`${BACKEND_API_BASE_URL}/user/signout`,{withCredentials:true});
        return response.data;
       } catch (error) {
        throw  error;
       }
   }
    
};

const getAuthService= new authentication();
export default getAuthService;