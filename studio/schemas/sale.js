export default {
  name: "sale",
  type: "document",
  title: "Sale",
  fields: [
    {
      name: "client",
      type: "string",
      title: "Client Name",
    },
    {
      name: "seller",
      type: "reference",
      title: "Seller",
      to: [{ type: "user" }],
    },

    {
      name: "product",
      type: "string",
      title: "Product Name",
    },
    {
      name: "price",
      type: "number",
      title: "Price (R$)",
    },
    {
      name: "date",
      type: "date",
      title: "Date",
    },

    {
      name: "commission",
      type: "number",
      title: "Commission (R$)",
    },
    {
      name: "status",
      type: "string",
      title: "Status",
    },
  ],
};
