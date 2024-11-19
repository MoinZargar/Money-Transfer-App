import { useEffect, useState } from "react";
import { Button, InputBox, User } from "../index.js";
import useGetUsers from "../hooks/useGetUsers.jsx";
import useDebounce from "../hooks/useDebounce.jsx";

const Users = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { users, loading, error } = useGetUsers(debouncedSearch);

  return (
    <>
      <div className="my-3">
        <InputBox
          placeholder="Search Users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          label="Users"
          type="text"
          className="w-full px-2 py-1 border rounded border-slate-200"
        />
      </div>
      {error ? (
        <div className="my-4 py-4 text-red-500">{error.response?.data?.message}</div>
      ) : !loading ? (
        <div className="my-4 py-4">
          {users.map((user) => (
            <User key={user._id} user={user} />
          ))}
        </div>
      ) : (
        search ? (
          <div>Searching...</div>
        ) : null
      )}
    </>
  );
};

export default Users;
