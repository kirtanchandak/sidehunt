import React from "react";

function Header() {
  return (
    <>
      <div className="flex justify-between p-4 border-b-[1px]">
        <div>
          <p className="text-xl font-bold">sidehunt 🚀</p>
        </div>
        <div>
          <button>Connect Wallet</button>
        </div>
      </div>
    </>
  );
}

export default Header;
