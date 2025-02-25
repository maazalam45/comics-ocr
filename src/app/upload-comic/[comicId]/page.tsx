import UploadComic from "@/screens/upload-comic";

export default function Home({ params }: any) {
  return <UploadComic comicId={params.comicId} />;
}
