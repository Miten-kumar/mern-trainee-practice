import DataLoader from "dataloader";
import { prisma } from "../config/database.js";

export const createLoaders = () => {
  const postsByUserLoader = new DataLoader<
    number,
    Awaited<ReturnType<typeof prisma.post.findMany>>
  >(async (userIds) => {
    console.log(
      "DataLoader user IDs:",
      userIds
    );

    const posts = await prisma.post.findMany({
      where: {
        userId: {
          in: [...userIds],
        },
      },
    });

    return userIds.map((userId) =>
      posts.filter(
        (post) => post.userId === userId
      )
    );
  });

  return {
    postsByUserLoader,
  };
};