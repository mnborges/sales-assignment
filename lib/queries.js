export const salesQuery = `
*[_type == "sale"]{..., seller->{_id, role, email, authUserId}} | order(date desc)
`;
