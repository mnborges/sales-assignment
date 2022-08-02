import { useRouter } from "next/router";
/*
Page thats display complete information (especially commission related) about a sale
sid = sales id
*/
const Sale = () => {
  const router = useRouter();
  const { sid } = router.query;
  //check whether sale id matches a sale in the db
  const sidIsValid = true;
  if (!sidIsValid) {
    return <p>Sale not found. Verify if id is correct.</p>;
  }
  return <p>Sale: {sid}</p>;
};

export default Sale;
