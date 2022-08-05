import { createClient } from "next-sanity";

const latestVersion = new Date().toLocaleDateString("en-ca");

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: `${latestVersion}`,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  useCdn: false,
});
