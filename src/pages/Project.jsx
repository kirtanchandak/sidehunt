import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";
import Markdown from "react-markdown";
import { FaGithub } from "react-icons/fa6";

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
  }, [connected]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center md:flex-row">
        <div>
          <div className="flex">
            <h2 className="lg:text-5xl font-[700] text-white mr-4">
              {postContent?.Title}
            </h2>
            <a
              href={postContent?.ProjectUrl}
              target="_blank"
              className="text-white px-3 flex items-center bg-[#4678F4] rounded-md hover:bg-[#365bb3] cursor-pointer"
            >
              <FaGithub className="w-5 h-5 mr-2" />
              View on GitHub
            </a>
          </div>

          <div className="pt-3">
            <h1 className="text-xl font-semibold text-white mt-4">
              Description:
            </h1>{" "}
            {/* Added margin-top for spacing */}
            <div className="mt-3 font-medium text-white">
              <Markdown>{postContent?.Body}</Markdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Project;
