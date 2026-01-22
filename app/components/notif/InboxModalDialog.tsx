import clsx from "clsx";
import { InboxResponse } from "./inbox-interface";
import GeneralDialog from "../GeneralDialog";

interface Props {
  role?: string;
  inbox?: InboxResponse | null;
  onAccept: () => void;
  onReject: () => void;
  onClose?: () => void;
}

const InboxModalDialog: React.FC<Props> = ({
  inbox,
  role,
  onAccept,
  onClose,
  onReject,
}) => {
  return (
    <GeneralDialog isOpen onClose={onClose ?? (() => {})} className="p-1">
      <DialogContent>
        {/* header */}
        <DialogHeader>
          <h2 className="text-lg font-semibold text-black">{inbox?.title}</h2>
        </DialogHeader>

        {/* content */}
        {<div className="space-y-2 text-black">{inbox?.content}</div>}

        {/* footer */}
        <DialogFooter>
          <Button variant="rejected" onClick={onReject}>
            Batal
          </Button>
          <Button onClick={onAccept}>
            {/* {role === "investor" ? "Lihat Dokumen" : "Update"} */}
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </GeneralDialog>
  );
};

const DialogContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="p-6">{children}</div>;
};

const DialogHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="mb-4 border-b pb-2">{children}</div>;
};

const DialogFooter: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="mt-4 flex justify-end space-x-2">{children}</div>;
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "accepted" | "rejected";
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "accepted",
  ...props
}) => {
  const baseStyle =
    "px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none";

  const variants = {
    accepted: "bg-green-600 text-white hover:bg-green-700",
    rejected: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      className={clsx(baseStyle, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default InboxModalDialog;
