export const Clipboard = ({ content }:any) => {
  return (
    <svg
      onClick={() => navigator.clipboard.writeText(content)}
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 ml-3 text-gray-200 active:text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      {" "}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />{" "}
    </svg>
  );
};

export const sendToClipboard = (txt:any) => {
  navigator.clipboard.writeText(txt);
};