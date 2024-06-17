import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { useActiveAddress, useConnection } from "@arweave-wallet-kit/react";
import {
  createDataItemSigner,
  message,
  result,
  dryrun,
} from "@permaweb/aoconnect";

function NewProject() {
  const { connected } = useConnection();
  const processId = "oL2_pYsUlF9UYkEo_TRgFc4rS7eJuxS6rQOxHd0rCX4";
  const [isFetching, setIsFetching] = useState(false);
  const [authorList, setAuthorList] = useState([]);

  const activeAddress = useActiveAddress();

  const syncAllAuthors = async () => {
    if (!connected) {
      return;
    }

    try {
      const res = await dryrun({
        process: processId,
        data: "",
        tags: [{ name: "Action", value: "UserList" }],
        anchor: "1234",
      });
      console.log("Dry run Author result", res);
      const filteredResult = res.Messages.map((message) => {
        const parsedData = JSON.parse(message.Data);
        return parsedData;
      });
      console.log("Filtered Author result", filteredResult);
      setAuthorList(filteredResult[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const registerAuthor = async () => {
    const res = await message({
      process: processId,
      tags: [{ name: "Action", value: "Register" }],
      data: "",
      signer: createDataItemSigner(window.arweaveWallet),
    });

    console.log("Register Author result", result);

    const registerResult = await result({
      process: processId,
      message: res,
    });

    console.log("Registered successfully", registerResult);

    if (registerResult[0].Messages[0].Data === "Successfully Registered.") {
      syncAllAuthors();
    }
  };

  useEffect(() => {
    setIsFetching(true);
    syncAllAuthors();
    console.log("This is active address", activeAddress);
    console.log(
      "Includes author",
      authorList.some((author) => author.PID === activeAddress)
    );

    setIsFetching(false);
  }, [connected]);

  const [isPosting, setIsPosting] = useState(false);
  const [desc, setDesc] = useState("");
  const [title, setTitle] = useState("");
  const [projectUrl, setProjectUrl] = useState("");

  const handlePostProject = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!connected) {
      return;
    }

    setIsPosting(true);

    try {
      const res = await message({
        process: processId,
        tags: [
          { name: "Action", value: "Create-Project" },
          { name: "Content-Type", value: "text/html" },
          { name: "Title", value: title },
          { name: "ProjectUrl", value: projectUrl },
        ],
        data: desc,
        signer: createDataItemSigner(window.arweaveWallet),
      });

      console.log("Post result", res);

      const postResult = await result({
        process: processId,
        message: res,
      });

      console.log("Post Created successfully", postResult);

      setDraftContent("");
      setTitle("");
    } catch (error) {
      console.log(error);
    }

    setIsPosting(false);
  };
  return (
    <>
      <Header />
      {authorList.some((author) => author.PID === activeAddress) ? (
        <div>
          <h1 className="text-2xl text-white text-center mt-10">New Project</h1>
          <div className="flex justify-center items-center">
            <form className="">
              <div className="mb-5">
                <label
                  for="base-input"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="base-input"
                  className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="mb-5">
                <label
                  for="large-input"
                  className="block mb-2 text-sm font-medium text-white  "
                >
                  Description
                </label>
                <input
                  type="text"
                  id="large-input"
                  className="block w-full p-4  border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>
              <div>
                <label
                  for="small-input"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Github URL or Deployed Link
                </label>
                <input
                  type="text"
                  id="small-input"
                  className="block w-full p-2  border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => setProjectUrl(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="text-white p-2 bg-[#4678F4] rounded-lg mt-3"
                onClick={handlePostProject}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <h1 className="text-xl text-center text-white">
            You need to make sure if you are registered user before you submit a
            project
          </h1>
          <div>
            <button className="bg-[#4678F4] p-2" onClick={registerAuthor}>
              Register
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default NewProject;
