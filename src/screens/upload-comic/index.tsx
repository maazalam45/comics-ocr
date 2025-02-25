"use client";
import React, { useState, useEffect } from "react";
import {
  useComicDetails,
  useProcessComic,
  useUploadComic,
} from "@/provider/Comic";
import {
  Container,
  Typography,
  Button,
  Box,
  LinearProgress,
  Card,
  CardContent,
  IconButton,
  FormHelperText,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import LockResetIcon from "@mui/icons-material/LockReset";
import ComicChip from "@/components/chip";

const MAX_IMAGES = 30; // Max image limit

const UploadComic: React.FC<{ comicId: number }> = ({ comicId }) => {
  const getComic = useComicDetails({ id: comicId });
  const startProcessComic = useProcessComic({});
  const uploadComic = useUploadComic({});
  const router = useRouter();

  const [files, setFiles] = useState<File[]>([]);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [processAllowed, setProcessAllowed] = useState<boolean>(true);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<
    { id: number; url: string }[]
  >([]); // Store existing images
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<string | null>(null);

  // Fetch existing images
  useEffect(() => {
    if (
      getComic.data?.comic_status === "Processing" ||
      getComic.data?.comic_status === "Processed"
    ) {
      setProcessAllowed(false);
    }
    if (getComic.data?.comic_media) {
      const existing = getComic.data.comic_media.map((media: any) => ({
        id: media.id,
        url: media.original_media.url,
      }));
      setExistingImages(existing);
    }
  }, [getComic.data]);

  // Handle file selection
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      const totalImages =
        existingImages.length + files.length + acceptedFiles.length;

      if (totalImages > MAX_IMAGES) {
        setErrors(`You can only upload up to ${MAX_IMAGES} images.`);
        return;
      }

      const newPreviews = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );

      setFiles((prev) => [...prev, ...acceptedFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
      setErrors(null);
    },
  });

  // Remove newly uploaded file
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Start processing files
  const startUpload = async () => {
    if (files.length === 0) {
      setErrors("Please upload at least one image.");
      return;
    }

    setProcessing(true);
    setProgress(0);
    let uploadedCount = 0;
    try {
      for (const file of files) {
        uploadedCount++;

        setProgress((prev) => {
          const newProgress = Math.floor((uploadedCount / files.length) * 100);
          return newProgress >= 100 ? 100 : newProgress;
        });

        await uploadComic.mutateAsync({
          data: {
            id: comicId,
            file: file,
          },
        });
      }
      getComic.refetch();
      setFiles([]);
      setPreviews([]);

      console.log("All comics uploaded successfully.");
      toast.success("Images uploaded successfully", { position: "top-right" });
    } catch (error) {
      console.error("Error uploading comic:", error);
      setErrors("Upload failed. Please try again.");
    } finally {
      setProcessing(false);
      setProgress(100);
    }
  };
  const startComicProcessing = async () => {
    try {
      await startProcessComic.mutateAsync({
        data: {
          id: comicId,
        },
      });
      getComic.refetch();
      console.log("Comic processing started successfully.");
      toast.success("Comic processing started successfully", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Error starting comic processing:", error);
      setErrors("Processing failed. Please try again.");
    }
  };
  const downloadZip = async () => {
    try {
      setIsDownloading(true);
      const fileUrl = getComic.data?.zip_url;
      const fileName = "comic.zip";
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch the file.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element and trigger a download
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the ZIP file:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        p: 3,
        background: "#1e1e1e",
        color: "white",
        borderRadius: 2,
        my: 2,
      }}
    >
      {getComic.isLoading ? (
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => {
              router.back();
            }}
            sx={{ position: "absolute", top: 30, left: "17%" }}
          >
            Go back
          </Button>
          <Typography
            variant="h5"
            sx={{ textAlign: "center", fontWeight: "bold", mb: 2 }}
          >
            Upload Comic
          </Typography>
          {/* Comic Details */}
          {getComic.data && (
            <Box sx={{ mb: 3, p: 2, borderRadius: 2, background: "#282828" }}>
              <Typography variant="subtitle1">
                Comic ID: {getComic.data?.id}
              </Typography>
              {getComic.data.est_mins ? (
                <Typography variant="subtitle1">
                  Estimated processing time: {getComic.data.est_mins} minutes
                </Typography>
              ) : null}
              <Typography variant="subtitle1">
                Status: <ComicChip comic_status={getComic.data.comic_status} />
                {/* {getComic.data.comic_status} */}
              </Typography>
            </Box>
          )}
          {/* Drag & Drop Upload */}
          {processAllowed && (
            <Box
              {...getRootProps()}
              sx={{
                border: "2px dashed #888",
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                background: "#282828",
                borderRadius: 2,
              }}
            >
              <input
                {...getInputProps()}
                disabled={
                  processing ||
                  existingImages.length + files.length >= MAX_IMAGES
                }
              />
              <Typography>
                Drag & Drop images (JPG, PNG) or click to select (Max{" "}
                {MAX_IMAGES - existingImages.length})
              </Typography>
            </Box>
          )}
          {/* Error Message */}
          {errors && (
            <FormHelperText sx={{ color: "red", mt: 1 }}>
              {errors}
            </FormHelperText>
          )}
          {/* Existing Images */}
          {existingImages.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">
                Previously Uploaded Images ({existingImages.length}/{MAX_IMAGES}
                ):
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                {existingImages.map((image, index) => (
                  <Card
                    key={image.id}
                    sx={{
                      width: 100,
                      background: "#333",
                      borderRadius: 2,
                    }}
                  >
                    <CardContent sx={{ p: 1, pb: "5px !important" }}>
                      <Avatar
                        variant="square"
                        src={image.url}
                        sx={{ width: "100%", height: "80px", pb: 0 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "12px", mt: 1 }}
                      >
                        Image {index + 1}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          )}
          {/* New Uploads */}
          {files.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">
                Selected Images ({existingImages.length + files.length}/
                {MAX_IMAGES}
                ):
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                {files.map((file, index) => (
                  <Card
                    key={index}
                    sx={{ width: 100, background: "#333", borderRadius: 2 }}
                  >
                    <CardContent sx={{ p: 1, pb: "5px !important" }}>
                      <Avatar
                        variant="square"
                        src={previews[index]}
                        sx={{ width: "100%", height: "80px" }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "12px",
                          mt: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {file.name}
                      </Typography>
                      <IconButton
                        onClick={() => removeFile(index)}
                        sx={{ color: "red", mx: "25%" }}
                        disabled={processing}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          )}
          {/* Processing Progress Bar */}
          {processing && (
            <Box sx={{ width: "100%", mt: 2 }}>
              <Typography>Uploading Files...</Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ width: "100%", mt: 1 }}
              />
            </Box>
          )}
          {/* Upload Button */}
          {getComic.data?.comic_status === "Processed" ? (
            <Button
              variant="contained"
              startIcon={!isDownloading && <CloudUploadIcon />}
              fullWidth
              sx={{ mt: 3 }}
              onClick={downloadZip}
              disabled={isDownloading}
            >
              {isDownloading ? "Downloading in progress..." : "Download comic"}
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{ mt: 3 }}
              onClick={startUpload}
              disabled={processing || files.length === 0}
            >
              {processing ? "Uploading..." : "Upload Comics"}
            </Button>
          )}
          {processAllowed && (
            <Button
              variant="contained"
              startIcon={<LockResetIcon />}
              fullWidth
              sx={{ mt: 3 }}
              onClick={startComicProcessing}
              disabled={
                processing ||
                existingImages.length == 0 ||
                startProcessComic.isPending
              }
            >
              {startProcessComic.isPending
                ? "Processing..."
                : "Start Processing"}
            </Button>
          )}
        </Box>
      )}
    </Container>
  );
};

export default UploadComic;
