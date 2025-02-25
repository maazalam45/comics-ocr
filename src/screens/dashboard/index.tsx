"use client";
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Box,
  MenuItem,
  Select,
  LinearProgress,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip"; // Import ZIP processing library
import { useRouter } from "next/navigation";
import { useComicDetails, useCreateComic } from "@/provider/Comic";
import CreateComic from "./create-comic";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import { statusColors } from "@/others/constants";
import ComicChip from "@/components/chip";

export default function Dasboard() {
  const getComic = useComicDetails({});
  const createComic = useCreateComic({});
  const [createNew, setCreateNew] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("auth")) {
      router.push("/sign-in", { scroll: false });
    }
  }, []);

  const toggleCreateNew = () => {
    setCreateNew((prev) => !prev);
  };

  const createNewComic = async (comic: {
    font: string;
    language: string;
    file: File;
  }) => {
    try {
      const response = await createComic.mutateAsync({
        data: {
          dictionary: comic.file,
          language_from: comic.language,
          font: comic.font,
        },
      });
      toast.success("Comic created successfully", { position: "top-right" });
      toggleCreateNew();
    } catch (error) {
      console.error("Error creating comic:", error);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        background: "#1e1e1e",
        color: "white",
        borderRadius: 2,
        p: 3,
        mt: 2,
      }}
    >
      {getComic.isLoading ? (
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress />
        </Box>
      ) : !createNew && getComic.data?.length !== 0 ? (
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{ textAlign: "center", fontWeight: "bold", mb: 1, my: 1 }}
            >
              My comics
            </Typography>
            {/* Create Comic Button */}
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: "#1976d2",
                color: "white",
                padding: "12px 24px",
                fontSize: "12px",
                fontWeight: "bold",
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
              onClick={toggleCreateNew}
            >
              Create New Comic
            </Button>
          </Box>
          {getComic.data?.map((comic: any) => (
            <Card
              key={comic.id}
              sx={{
                backgroundColor: "#222",
                color: "white",
                borderRadius: "10px",
                marginTop: "10px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                transition: "0.3s",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="h6">{comic.font.name}</Typography>
                  <ComicChip comic_status={comic?.comic_status} />
                </Box>
                <Typography variant="body2" sx={{ color: "#bbb", mb: 1 }}>
                  Language: {comic.language_from === 0 ? "English" : "Italian"}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => router.push(`/upload-comic/${comic.id}`)}
                  sx={{
                    backgroundColor: "#1976d2",
                    fontWeight: "bold",
                    "&:hover": { backgroundColor: "#1565c0" },
                  }}
                >
                  Upload Comic
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <CreateComic
          isBackAvalaible={getComic.data?.length !== 0}
          createNewComic={createNewComic}
          isLoading={createComic.isPending}
          toggleCreateNew={toggleCreateNew}
        />
      )}
    </Container>
  );
}
