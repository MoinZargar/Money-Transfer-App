import { useSelector } from "react-redux";
const Header = () => {
  const user = useSelector((state) => state.auth.user);
  return (
    <div className="shadow h-14 flex justify-between bg-black px-8">
      <div className="flex flex-col justify-center h-full text-white">PayTM App</div>
      {user && (
        <div className="flex ">
          <div className="flex flex-col justify-center h-full text-white mr-4 text-lg">Hello</div>
          <div className="flex flex-col justify-center h-full text-white text-xl">{user.data?.firstName}</div>
        </div>
      )}
    </div>
  );
};

export default Header;