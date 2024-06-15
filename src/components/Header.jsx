import { ConnectButton } from "@arweave-wallet-kit/react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <>
      <div className="flex justify-between p-4 border-b-[1px]">
        <div>
          <p className="text-2xl font-bold mt-2">sidehunt 🚀</p>
        </div>
        <div>
          <ConnectButton
            profileModal={true}
            showBalance={false}
            showProfilePicture={true}
          />
        </div>
      </div>
    </>
  );
}

export default Header;
