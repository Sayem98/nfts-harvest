import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { authenticate } from "../services/userService";

export function useCurrentuser() {
  const { address } = useAccount();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        setIsLoading(true);
        const data = await authenticate(address);
        setIsAdmin(data?.isAuthenticated);
        setIsLoading(false);
      } catch (err) {
        setIsAdmin(false);
        setIsLoading(false);
      }
    };

    fetchAdmin();
  }, [address]);

  return { isAdmin, isLoading };
}
