import axios from "axios";

// const BASE_API = "https://nft-hervest-4e3c1ea606d9.herokuapp.com/api";
const BASE_API = import.meta.env.VITE_BASE_API_URL;
export async function createUser(address) {
  await axios.post(`${BASE_API}/users`, { address });
}

export async function getUserData(address) {
  const { data } = await axios.get(`${BASE_API}/user-data/${address}`);

  return data;
}

export async function authenticate(address) {
  const { data } = await axios.get(`${BASE_API}/authenticate/${address}`);

  return data;
}
