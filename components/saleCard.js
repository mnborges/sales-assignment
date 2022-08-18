import {
  PencilSimpleLine,
  TrashSimple,
  ThumbsUp,
  ThumbsDown,
  Hourglass,
} from "phosphor-react";
import { useState } from "react";

const ButtonGroup = ({ admin, handler, sid, callback, status }) => {
  const statuses = ["pending", "approved", "rejected"];

  // if user is a manager, first button should approve sale (or set as pending if already approved), if not it should edit it
  const buttonOne = {
    title: admin
      ? status === statuses[1]
        ? // manager and already approved
          "Set as pending"
        : // manager and not approved
          "Approve sale"
      : // not manager
        "Edit sale",
    icon: admin ? (
      status === statuses[1] ? (
        <Hourglass size={18} />
      ) : (
        <ThumbsUp size={18} />
      )
    ) : (
      <PencilSimpleLine size={18} />
    ),
    handler: admin
      ? () =>
          handler
            .updateStatus(
              sid,
              status === statuses[1] ? statuses[0] : statuses[1]
            )
            .then((res) => {
              // run callback only if promise was resolved (user did not cancel)
              if (res)
                callback(status === statuses[1] ? statuses[0] : statuses[1]);
            })
      : () => handler.editSale(sid),
  };
  // second button should reject (or set as pending) or remove a sale, depending on user role
  const buttonTwo = {
    title: admin
      ? status === statuses[2]
        ? "Set as pending"
        : "Reject sale"
      : "Delete sale",
    icon: admin ? (
      status === statuses[2] ? (
        <Hourglass size={18} />
      ) : (
        <ThumbsDown size={18} />
      )
    ) : (
      <TrashSimple size={18} />
    ),
    handler: admin
      ? () =>
          handler
            .updateStatus(
              sid,
              status === statuses[2] ? statuses[0] : statuses[2]
            )
            .then((res) => {
              if (res)
                callback(status === statuses[2] ? statuses[0] : statuses[2]);
            })
      : () => handler.removeSale(sid),
  };
  return (
    <div className="top-3 right-1 invisible group-hover:visible absolute z-20 flex items-center justify-center">
      <div
        className="inline-flex shadow-md hover:shadow-lg focus:shadow-lg"
        role="group"
      >
        <button
          onClick={buttonOne.handler}
          type="button"
          data-bs-toggle="tooltip"
          title={buttonOne.title}
          className="rounded-l inline-block p-2 bg-slate-400 bg-opacity-50 hover:bg-slate-500 hover:opacity-100 text-white font-medium text-xs leading-tight uppercase  focus:bg-slate-500 focus:outline-none focus:ring-0 active:bg-slate-800 transition duration-150 ease-in-out"
        >
          {buttonOne.icon}
        </button>
        <button
          onClick={buttonTwo.handler}
          type="button"
          data-bs-toggle="tooltip"
          title={buttonTwo.title}
          className=" rounded-r inline-block p-2 bg-slate-400 bg-opacity-50 hover:bg-slate-500 hover:opacity-100 text-white font-medium text-xs leading-tight uppercase  focus:bg-slate-500 focus:outline-none focus:ring-0 active:bg-slate-800 transition duration-150 ease-in-out"
        >
          {buttonTwo.icon}
        </button>
      </div>
    </div>
  );
};
const SaleCard = ({ sale, admin = 0, handler }) => {
  // create state hook for each card to expand/shrink content
  const [extendedContent, setExtendedContent] = useState(false);
  const [status, setStatus] = useState(sale.status);
  const { client, seller, product, price, date, commission, _id } = sale;
  const toggleExpand = (e) => {
    // if user clicked a button just skip the toggle -- parentNode to work if user clicks an icon
    if (e.target.type === "button" || e.target.parentNode.type === "button")
      return;
    setExtendedContent(!extendedContent);
  };
  const bgColor =
    status === "pending"
      ? "bg-slate-400"
      : status === "approved"
      ? "bg-blue-400"
      : "bg-red-400";

  const Commission = () => (
    <div className="text-center text-sm text-blue-900">
      <b>Commission (R$): </b>
      {commission.toFixed(2)}
    </div>
  );
  return (
    <div
      className="cursor-pointer relative group rounded-lg shadow-lg flex hover:ring-2 "
      data-bs-toggle="tooltip"
      title={`Click to view ${extendedContent ? "less" : "more"} information`}
      onClick={toggleExpand}
    >
      <ButtonGroup
        handler={handler}
        sid={_id}
        admin={admin}
        status={status}
        callback={(newStatus) => setStatus(newStatus)}
      />
      <div className="flex flex-col flex-grow rounded-lg p-2 max-w-full bg-slate-100 relative">
        <div className="text-slate-500 text-xs mr-auto absolute ">{date}</div>
        <h1 className="text-slate-900 text-lg leading-none font-medium mx-auto">
          {product}{" "}
          <span
            className={`${bgColor} text-white px-2 rounded-lg text-xs align-text-top`}
          >
            {status}
          </span>
        </h1>
        <p className="text-center text-slate-700 text-base">
          R$ {price.toFixed(2)}
        </p>
        <div
          className={(extendedContent ? "block " : "hidden ").concat(
            "text-slate-900 text-center"
          )}
        >
          Sold to <b>{client} </b>
          {admin ? (
            <>
              by <b>{seller.email}</b>
            </>
          ) : null}
          {status === "approved" && <Commission />}
        </div>
      </div>
    </div>
  );
};

export default SaleCard;
