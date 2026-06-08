interface Props {
  title: string;
  message: string;
}

const InboxEmpty = ({ title, message }: Props) => {
  return (
    <div className="h-[560px] flex flex-col justify-center items-center text-center text-gray-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-16 h-16 mb-4 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 14.25v3.375a2.625 2.625 0 01-2.625 2.625H6.375A2.625 2.625 0 013.75 17.625V14.25M12 12l-9-4.5V6.375a2.625 2.625 0 012.625-2.625h12.75A2.625 2.625 0 0121.25 6.375v1.125L12 12z"
        />
      </svg>
      <p className="text-lg font-semibold">{title}</p>
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
};

export default InboxEmpty;
