import React, { useState, useEffect } from "react";
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";

function Projects() {
  const { connected } = useConnection();
  const processId = "2fzuOwrd1Yp3bIjBw0EmBgNGuhUPKQSdVIMoJ9IdyRA";
  const [isFetching, setIsFetching] = useState(false);
  const [projects, setProjects] = useState(null);

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
    if (connected) {
      syncAllPosts();
    }
  }, [connected]);

  console.log(projects);
  return <>Projects</>;
}

export default Projects;
