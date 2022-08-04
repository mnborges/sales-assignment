import { async } from "@firebase/util";
import { sanityClient } from "./sanityConfig";

export async function getSales() {
  return await sanityClient.fetch(
    `*[_type == "sale"]{..., seller->} | order(date desc)`
  );
}
export async function getUsers() {
  return await sanityClient.fetch(`*[_type == "user"]`);
}
export async function updateSanity(doc) {
  sanityClient
    .create({ _type: "sale", ...doc })
    .then((res) => console.log(res._id))
    .catch((err) => console.error(err));
}
