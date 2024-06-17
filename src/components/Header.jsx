import { ConnectButton } from "@arweave-wallet-kit/react";

function Header() {
  return (
    <>
      <div className="flex justify-between p-4 bg-gray-900 font-poppins">
        <div>
          <a href="/" className="text-2xl font-bold mt-2 text-white">
            sidehunt 🚀
          </a>
        </div>
        <div>
          <ConnectButton
            profileModal={true}
            showBalance={false}
            showProfilePicture={true}
            accent="#4678F4"
          />
        </div>
      </div>
    </>
  );
}

export default Header;
