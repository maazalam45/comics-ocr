import UploadComic from "@/screens/upload-comic";

export default function Home({ params }: any) {
  const comicId = params?.comicId ? parseInt(params.comicId, 10) : null;

  if (!comicId) {
    return <div>Error: Invalid Comic ID</div>;
  }

  return <UploadComic comicId={comicId} />;
}
