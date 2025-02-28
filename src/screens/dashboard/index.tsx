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
  IconButton,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip"; // Import ZIP processing library
import { useRouter } from "next/navigation";
import { useComicDetails, useCreateComic, useDeleteComic } from "@/provider/Comic";
import CreateComic from "./create-comic";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from '@mui/icons-material/Logout';
import { toast } from "react-toastify";
import { ComicCardButtonText, statusColors } from "@/others/constants";
import ComicChip from "@/components/chip";
import { logout } from "@/services/auth";
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteDialog from "@/components/delete-modal";

export default function Dashboard() {
  const getComic = useComicDetails({});
  const createComic = useCreateComic({});
  const deleteComic = useDeleteComic({});
  const [createNew, setCreateNew] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");
    const [openDelete, setOpenDelete] = useState(false);
    const [comicDeleteId, setComicDeleteId] = useState(undefined);

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
      const response: any = await createComic.mutateAsync({
        data: {
          dictionary: comic.file,
          language_from: comic.language,
          font: comic.font,
        },
      });
      toast.success("Comic created successfully", { position: "top-right" });
      toggleCreateNew();
      if (response?.id) {
        router.push(`/upload-comic/${response.id}`);
      }
    } catch (error) {
      console.error("Error creating comic:", error);
    }
  };

  // Logout function
  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await logout();      
      if (response) {
        localStorage.removeItem("auth");
        localStorage.removeItem("token");
        toast.success("Logout Successful", { position: "top-right" });
        router.push("/sign-in");
      }
    } catch (error: any) {
      setError(error);
    }
  };

  // Delete Modal Toggle 
  const toggleDeleteModal = (id?: any)=>{
    id ? setComicDeleteId(id):setComicDeleteId(undefined)
    setOpenDelete(!openDelete)
  }

  // Delete Comic
  const handleDelete = async () => {
    setError("");
    try {
      const response = await deleteComic.mutateAsync({data: {id:comicDeleteId}});      
      if (response) {
        toast.success("Logout Successful", { position: "top-right" });
        toggleDeleteModal()
      }
    } catch (error: any) {
      setError(error);
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
      {/* logout button */}
      <IconButton 
        color="primary" 
        aria-label="delete" 
        sx={{ 
          position: {sm: "relative", md: "fixed"},
          top: {xs: 0, md: 30}, 
          right: {xs: 0, md: 30}, 
          backgroundColor: "#ef5350", 
          color: "white", 
          padding: "12px 12px", 
          fontSize: "12px", 
          fontWeight: "bold", 
          borderRadius: "50px", 
          float: "right",
          marginBottom: {xs: "10px", md: "0px"},
          "&:hover": { 
            backgroundColor: "#f44336" 
          },
        }}
        onClick={handleLogout}
      >
        <LogoutIcon />
      </IconButton>
      {getComic.isLoading || getComic.isFetching ? (
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
              width: "100%",
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ComicChip comic_status={comic?.comic_status} />
                    {/* Delete Comic */}
                    <IconButton 
                      color="primary" 
                      aria-label="delete-comic" 
                      sx={{
                        backgroundColor: "#ef5350", 
                        color: "white",
                        fontWeight: "bold", 
                        borderRadius: "50px", 
                        "&:hover": { 
                          backgroundColor: "#f44336" 
                        },
                      }}
                      onClick={()=> toggleDeleteModal(comic.id)}
                    >
                      <DeleteIcon fontSize="small"/>
                    </IconButton>
                  </Box>
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
                  {ComicCardButtonText(comic.comic_status)}
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
      <DeleteDialog openDelete={openDelete} handleDelete={handleDelete} toggleDeleteModal={toggleDeleteModal}/>
    </Container>
  );
}
