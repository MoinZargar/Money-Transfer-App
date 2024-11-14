import { Button } from "../index.js";
import { useNavigate } from "react-router-dom";


function User({user}) {
    const navigate = useNavigate();
    const handleSendMoney = () => {
        navigate("/send-money/"+user._id);
    }

    return <div className="flex justify-between py-1">
        <div className="flex">
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {user.firstName.charAt(0).toUpperCase()}
                </div>
            </div>
            <div className="flex flex-col justify-center h-ful">
                <div>
                    {user.firstName} {user.lastName}
                </div>
            </div>
        </div>

        <div className="flex flex-col justify-center h-ful">
            <Button label={"Send Money"} type={"button"} onclick={handleSendMoney} />
        </div>
    </div>
}

export default User;