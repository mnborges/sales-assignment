import { salesQuery } from "./queries";
import { getClient } from "./sanity.server";

export async function getSales(preview) {
  return await getClient(preview).fetch(salesQuery);
}

export async function getSalesIds(preview) {
  return await getClient(preview).fetch(
    `*[_type == "sale"]{_id} | order(date desc)`
  );
}

export async function getSaleById(sid, preview) {
  const query =
    "*[_type == 'sale' && _id== $saleId]{..., seller->{_id, authUserId}}";
  const params = { saleId: sid };
  return (await getClient(preview).fetch(query, params))[0];
}

export async function getMonthSales(preview) {
  let date = new Date();
  date.setDate(1);
  const query = `*[_type == "sale" && date >= $day] | order(date desc)`;
  const params = { day: date.toLocaleDateString("en-ca") };
  return await getClient(preview).fetch(query, params);
}

export async function getAuthenticatedUser(uid, preview) {
  const query = "*[_type == 'user' && authUserId == $firebaseId]";
  const params = { firebaseId: uid };
  return (await getClient(preview).fetch(query, params))[0];
}

export async function createSale(doc, preview) {
  return await getClient(preview).create({ _type: "sale", ...doc });
}

export async function createSanityUser(uid, email, admin, preview) {
  const doc = {
    authUserId: uid,
    email: email,
    role: admin ? "manager" : "salesman",
  };
  return await getClient(preview).create({ _type: "user", ...doc });
}

export async function updateSale(sid, doc, preview) {
  return await getClient(preview).patch(sid).set(doc).commit();
}

export async function deleteSale(sid, preview) {
  return await getClient(preview).delete(sid);
}
