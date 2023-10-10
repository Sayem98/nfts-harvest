import Web3 from "web3";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contracts/contract";
import { useEffect } from "react";
function Main() {
  useEffect(() => {
    const getValue = async () => {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      const value = await contract.methods.retrieve().call();
      console.log(value);
    };
    if (window.ethereum) {
      getValue();
    }
  }, []);
  const setValue = async () => {
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    const value = await contract.methods.store(5).send({
      from: accounts[0],
    });
    console.log(value);
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "100px",
      }}
    >
      <button className="btn btn-primary" onClick={setValue}>
        Approve
      </button>
    </div>
  );
}

export default Main;
