import React from "react";
import { InboxResponse } from "./inbox-interface";
import moment from "moment";
import "moment/locale/id";

interface Props {
  inbox: InboxResponse;
  onClick: () => void;
}

const InboxCard: React.FC<Props> = ({ inbox, onClick }) => {
  return (
    <div
      className="w-full p-4 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-semibold">{inbox.title}</p>
        {inbox.is_read === false && (
          <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-0.5 rounded-full">
            Baru
          </span>
        )}
      </div>
      <p className="text-sm text-gray-400 mt-2">
        {moment(inbox.created_at).locale("id").format("llll")}
      </p>
    </div>
  );
};

export default InboxCard;
