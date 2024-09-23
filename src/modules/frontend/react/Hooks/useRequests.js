import React from "react";

function useRequests() {
  //{ isPending, error, data, isFetching }
  const getDrivers = useQuery({
    queryKey: ["repoData"],
    queryFn: async () => {
      const res = await api.get("driver/list");
      return res;
    },
  });

  const fetchUsers = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    return res.json();
  };

  const queryUsers = useQuery(["users"], fetchUsers);

  const getCustomRequestHookFromTable = (table) => {};
  return {};
}

export default useRequests;
