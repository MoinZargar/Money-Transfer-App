import axios from 'axios';

const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;
class account{
  async getAccountBalance(){
    try {
      const response = await axios.get(`${BACKEND_API_BASE_URL}/account/balance`,{withCredentials:true});
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async transferMoney({to, amount}){
    try {
      const response = await axios.post(`${BACKEND_API_BASE_URL}/account/transfer`,{to, amount},{withCredentials:true});
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

const getAccountService= new account();
export default getAccountService;