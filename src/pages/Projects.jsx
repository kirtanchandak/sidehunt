import React, { useState, useEffect } from "react";
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";
import axios from "axios";
import Header from "../components/Header";

function Projects() {
  const { connected } = useConnection();
  const processId = "oL2_pYsUlF9UYkEo_TRgFc4rS7eJuxS6rQOxHd0rCX4";
  const [isFetching, setIsFetching] = useState(false);
  const [projects, setProjects] = useState(null);
  const [img, setImg] = useState("");

  // const getImages = async () => {
  //   try {
  //     const res = await axios.get(
  //       "https://api.api-ninjas.com/v1/randomimage?category=nature",
  //       {
  //         headers: { "X-Api-Key": "n/c+AhwtrOTlrPIRmwDp5g==BXEw9Oj8r3xgNm9l" },
  //       }
  //     );
  //     console.log(res);
  //     setImg(res.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

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

  useEffect(() => {
    // getImages();
    if (connected) {
      syncAllPosts();
    }
  }, [connected]);

  console.log(projects);
  return (
    <>
      <Header />
      <div className="pt-12 bg-gray-900 h-screen md:px-12 px-6">
        <div class="max-w-xs bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <a href="#">
            <img
              class="rounded-t-lg"
              src="https://cdn.britannica.com/70/234870-050-D4D024BB/Orange-colored-cat-yawns-displaying-teeth.jpg"
              alt=""
            />
          </a>
          <div class="p-5">
            <a href="#">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Noteworthy technology acquisitions 2021
              </h5>
            </a>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Here are the biggest enterprise technology acquisitions of 2021 so
              far, in reverse chronological order.
            </p>
            <a
              href="#"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Read more
              <svg
                class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Projects;
