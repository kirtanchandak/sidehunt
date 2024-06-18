import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";
import Markdown from "react-markdown";
import { FaGithub } from "react-icons/fa";

function Project() {
  const { connected } = useConnection();
  const processId = "AASDWjVA3cL_jqHmsdj7IVLvbdo0vMme-u6HB87abcE";
  const [isFetching, setIsFetching] = useState(false);
  const [postContent, setPostContent] = useState();
  const { id } = useParams();

  const syncAllPosts = async () => {
    if (!connected) {
      return;
    }

    try {
      const result = await dryrun({
        process: processId,
        data: "",
        tags: [
          { name: "Action", value: "Get-Project" },
          { name: "Project-Id", value: id },
        ],
        anchor: "1234",
      });
      console.log("Dry run result", result);
      const filteredResult = JSON.parse(result.Messages[0].Data);
      console.log("Filtered result", filteredResult);
      setPostContent(filteredResult[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsFetching(true);
    syncAllPosts();
    setIsFetching(false);
  }, [connected, id]); // Include `id` in dependencies to refetch when `id` changes

  return (
    <div className="container mx-auto px-4 py-8">
      {isFetching ? (
        <div className="flex items-center justify-center h-screen">
          <p className="text-xl font-semibold text-white">Loading...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center md:flex-row">
          <div>
            <div className="items-center">
              {!connected && (
                <p className="text-red-500 font-semibold">
                  Connect your wallet to view content.
                </p>
              )}
              {connected && (
                <>
                  <div>
                    <div>
                      <h2 className="lg:text-5xl font-bold text-white mr-4 mb-4">
                        {postContent?.Title}
                      </h2>
                      <a
                        href={postContent.ProjectUrl}
                        className="text-white bg-[#4678F4] p-2 rounded-md"
                      >
                        View on Github
                      </a>
                    </div>

                    <div className="pt-3">
                      <h1 className="text-xl font-semibold text-white mt-4">
                        Description:
                      </h1>
                    </div>
                    <div className="mt-3 font-medium text-white">
                      <Markdown>{postContent?.Body}</Markdown>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Project;
