import React from "react";
import Header from "../components/Header";
import { ConnectButton } from "@arweave-wallet-kit/react";

function Home() {
  return (
    <div>
      <Header />
      <section className="bg-gray-900 text-white font-poppins h-screen">
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
              A Platform to Showcase
              <span className="sm:block"> Your Side Projects </span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
              Showcase.Discover.Collobrate
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                className="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
                href="/projects"
              >
                View Projects
              </a>

              <ConnectButton
                profileModal={true}
                showBalance={false}
                showProfilePicture={true}
                accent="#4678F4"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
