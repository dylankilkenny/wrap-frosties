import { BiChevronDown } from "react-icons/bi";
import { IconContext } from "react-icons";
import makeBlockie from "ethereum-blockies-base64";
import { shortenAddress, useEthers } from "@usedapp/core";

interface WalletButtonProps {
  togglePopover: () => void;
}

export default function WalletButton({ togglePopover }: WalletButtonProps): JSX.Element {
  const { active, account } = useEthers();
  if (active && account) {
    return (
      <div
        onClick={togglePopover}
        className="flex w-48 py-2 px-4 pr-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200"
      >
        <img className="h-6 w-6" src={makeBlockie(account)} />
        <div className="float-right ml-2">{shortenAddress(account)}</div>
        <IconContext.Provider value={{ className: "text-2xl ml-2" }}>
          <BiChevronDown />
        </IconContext.Provider>
      </div>
    );
  }
  return (
    <div
      className="w-48 py-2 px-4 border border-gray-300 rounded-md cursor-pointer text-center hover:bg-gray-200"
      onClick={togglePopover}
    >
      Connect Wallet
    </div>
  );
}
