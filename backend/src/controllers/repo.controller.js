import prisma from "../prisma/client.js";
import axios from "axios";
export const getRepos = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.githubToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const response = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `token ${user.githubToken}`,
      },
    });

    res.status(200).json({
      message: "Successfully fetched repos",
      repos: response.data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch repos" });
  }
};
