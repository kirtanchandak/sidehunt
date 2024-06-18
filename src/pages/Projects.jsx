import React, { useState, useEffect } from "react";
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";
import axios from "axios";
import Header from "../components/Header";
import { ConnectButton } from "@arweave-wallet-kit/react";

function Projects() {
  const { connected } = useConnection();
  const processId = "oL2_pYsUlF9UYkEo_TRgFc4rS7eJuxS6rQOxHd0rCX4";
  const [isFetching, setIsFetching] = useState(false);
  const [projects, setProjects] = useState(null);
  const [img, setImg] = useState("");

  const getImages = async () => {
    try {
      const res = await axios.get(
        "https://api.api-ninjas.com/v1/randomimage?category=nature",
        {
          headers: { "X-Api-Key": "n/c+AhwtrOTlrPIRmwDp5g==BXEw9Oj8r3xgNm9l" },
        }
      );
      console.log(res);
      setImg(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const syncAllPosts = async () => {
    setIsFetching(true);
    if (!connected) {
      setIsFetching(false);
      return;
    }

    try {
      const result = await dryrun({
        process: processId,
        data: "",
        tags: [{ name: "Action", value: "Get-Projects" }],
      });
      const filteredResult = result.Messages.map((message) => {
        const parsedData = JSON.parse(message.Data);
        return parsedData;
      });
      setProjects(filteredResult[0]);
    } catch (error) {
      console.log(error);
    }

    setIsFetching(false);
  };
  console.log(projects);

  useEffect(() => {
    getImages();
    if (connected) {
      syncAllPosts();
    }
  }, [connected]);

  return (
    <>
      <div className="pt-5 md:h-screen w-full md:px-12 px-6">
        {!connected ? (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <p className="text-white mb-4 text-xl">
                Please connect your wallet to see the projects.
              </p>
              <div className="  font-medium">
                <ConnectButton
                  profileModal={true}
                  showBalance={false}
                  showProfilePicture={true}
                  accent="#4678F4"
                />
              </div>
            </div>
          </div>
        ) : isFetching ? (
          <div className="flex items-center justify-center h-screen">
            <div
              className=" h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-white flex justify-center"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        ) : (
          <>
            <a
              href="/new-project"
              className="bg-[#4678F4] py-3 px-3 rounded-2xl text-white font-medium"
            >
              Post a Project
            </a>
            <div className="grid grid-cols-1 md:grid-cols-4">
              {projects?.map((project) => (
                <div
                  key={project?.Title}
                  className="max-w-xs bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-5"
                >
                  <a href="#">
                    <img
                      className="rounded-t-lg"
                      src={`data:image/png;base64, ${img}`}
                      alt=""
                    />
                  </a>
                  <div className="p-5">
                    <a href="#">
                      <h5 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {project?.Title}
                      </h5>
                      <p>Builder - {project?.Name}</p>
                    </a>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                      {project?.Body}
                    </p>
                    <a
                      href="#"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Read more
                      <svg
                        className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Projects;
