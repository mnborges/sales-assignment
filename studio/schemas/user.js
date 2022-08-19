export default {
  name: "user",
  type: "document",
  title: "User",
  fields: [
    {
      name: "authUserId",
      type: "string",
      title: "Firebase User Id",
    },
    {
      name: "role",
      type: "string",
      title: "Role",
    },
    {
      name: "email",
      type: "string",
      title: "E-mail",
    },
  ],
};
