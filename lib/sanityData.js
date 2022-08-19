import { sanityClient } from "./sanityConfig";

export async function getSales() {
  return await sanityClient.fetch(
    `*[_type == "sale"]{..., seller->} | order(date desc)`
  );
}

export async function getSalesIds() {
  return await sanityClient.fetch(`*[_type == "sale"]{_id} | order(date desc)`);
}

export async function getSaleById(sid) {
  const query =
    "*[_type == 'sale' && _id== $saleId]{..., seller->{_id, authUserId}}";
  const params = { saleId: sid };
  return (await sanityClient.fetch(query, params))[0];
}

export async function getMonthSales() {
  let date = new Date();
  date.setDate(1);
  const query = `*[_type == "sale" && date >= $day] | order(date desc)`;
  const params = { day: date.toLocaleDateString("en-ca") };
  return await sanityClient.fetch(query, params);
}

export async function getAuthenticatedUser(uid) {
  const query = "*[_type == 'user' && authUserId == $firebaseId]";
  const params = { firebaseId: uid };
  return (await sanityClient.fetch(query, params))[0];
}

export async function createSale(doc) {
  return await sanityClient.create({ _type: "sale", ...doc });
}

export async function createSanityUser(uid, email, admin) {
  const doc = {
    authUserId: uid,
    email: email,
    role: admin ? "manager" : "salesman",
  };
  return await sanityClient.create({ _type: "user", ...doc });
}

export async function updateSale(sid, doc) {
  return await sanityClient.patch(sid).set(doc).commit();
}

export async function deleteSale(sid) {
  return await sanityClient.delete(sid);
}
