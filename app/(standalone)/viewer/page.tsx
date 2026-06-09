"use client";
import FilePreview from "./components/FilePreview";

type SearchParams = { src?: string; h?: string };

export default function ViewerPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const rawSrc = searchParams.src ?? "";
  const decoded = decodeURIComponent(rawSrc);

  if (!decoded) {
    return <div className="p-6">Tambahkan query `?src=`</div>;
  }

  return (
    <div className="w-screen h-screen bg-white flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <FilePreview src={decoded} height="100%" />
      </div>
    </div>
  );
}
