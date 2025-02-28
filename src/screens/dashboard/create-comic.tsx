import React, { useState } from "react";
import {
  Typography,
  Button,
  Box,
  MenuItem,
  Select,
  LinearProgress,
  FormHelperText,
  CircularProgress,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDropzone } from "react-dropzone";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import { useSampleCsv } from "@/provider/Comic";
import { toast } from "react-toastify";

interface CreateComicProps {
  createNewComic: (comic: {
    font: string;
    language: string;
    file: File;
  }) => Promise<void>;
  isLoading: boolean;
  toggleCreateNew: () => void;
  isBackAvalaible: boolean;
}

const CreateComic: React.FC<CreateComicProps> = ({
  createNewComic,
  isLoading,
  toggleCreateNew,
  isBackAvalaible,
}) => {
  const downloadCsv = useSampleCsv({});
  const [selectedFont, setSelectedFont] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<{
    font?: string;
    language?: string;
    file?: string;
  }>({});

  const validateForm = () => {
    let newErrors: { font?: string; language?: string; file?: string } = {};
    if (!selectedFont) newErrors.font = "Please select a font";
    if (!selectedLanguage) newErrors.language = "Please select a language";
    if (!file) newErrors.file = "Please upload a CSV file";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "text/csv": [".csv"] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setErrors((prev) => ({ ...prev, file: undefined })); // Clear file error
        processCSV(acceptedFiles[0]);
      }
    },
  });

  const processCSV = async (file: File) => {
    setProcessing(true);
    setProgress(0);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        // console.log("CSV File Content:", event.target.result as string);
      }
    };
    reader.readAsText(file);

    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessing(false);
          return 100;
        }
        return prev + 25;
      });
    }, 500);
  };

  const removeFile = () => {
    setFile(null);
    setErrors((prev) => ({ ...prev, file: "Please upload a CSV file" }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await createNewComic({
        font: selectedFont,
        language: selectedLanguage,
        file: file!,
      });
      //   console.log("Comic created successfully");
    } catch (error) {
      console.error("Error creating comic:", error);
    }
  };

  const downloadSampleCSV = async () => {
    try {
      await downloadCsv.mutateAsync({}).then(async (response) => {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Sample.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        toast.success(`Sample downloaded successfully`);
      });
      //   console.log("Sample CSV downloaded:", response);
    } catch (error) {
      console.error("Error downloading sample CSV:", error);
    }
  };
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        {isBackAvalaible && (
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={toggleCreateNew}
            // sx={{ position: "absolute", top: 30, left: "16%" }}
          >
            Go back
          </Button>
        )}
        <Button
          variant="contained"
          endIcon={<SimCardDownloadIcon />}
          onClick={downloadSampleCSV}
          sx={{
            // position: "absolute",
            // top: 30,
            // right: "16%",
            textTransform: "none",
          }}
          disabled={downloadCsv.isPending}
        >
          Sample .csv
        </Button>
      </Box>
        <Typography
          variant="h5"
          sx={{ textAlign: "center", fontWeight: "bold" }}
        >
          Comic Dashboard
        </Typography>
        <Typography sx={{ textAlign: "center", color: "#b0b0b0" }}>
          Manage your comics and translations here.
        </Typography>
      <Box>
        {/* Font Selector */}
        <Typography sx={{ mb: 1 }}>Select Font:</Typography>
        <Select
          value={selectedFont}
          onChange={(e) => {
            setSelectedFont(e.target.value);
            setErrors((prev) => ({ ...prev, font: undefined }));
          }}
          sx={{ background: "#282828", color: "white", width: "100%", mb: 1 }}
        >
          <MenuItem value="1">Roboto.ttf</MenuItem>
          <MenuItem value="2">WildWords.ttf</MenuItem>
          <MenuItem value="3">ComicNeue.ttf</MenuItem>
          <MenuItem value="4">ComicSans.ttf</MenuItem>
          <MenuItem value="5">AnimeAce.ttf</MenuItem>
          <MenuItem value="6">OpenSans.ttf</MenuItem>
          <MenuItem value="7">MeanWhile.ttf</MenuItem>
        </Select>
        {errors.font && (
          <FormHelperText sx={{ color: "red" }}>{errors.font}</FormHelperText>
        )}

        {/* Language Selector */}
        <Typography sx={{ mt: 2, mb: 1 }}>Current Comic Language:</Typography>
        <Select
          value={selectedLanguage}
          onChange={(e) => {
            setSelectedLanguage(e.target.value);
            setErrors((prev) => ({ ...prev, language: undefined }));
          }}
          sx={{ background: "#282828", color: "white", width: "100%", mb: 1 }}
        >
          <MenuItem value="0">English</MenuItem>
          <MenuItem value="1">Italian</MenuItem>
        </Select>
        {errors.language && (
          <FormHelperText sx={{ color: "red" }}>
            {errors.language}
          </FormHelperText>
        )}

        {/* File Upload */}
        <Typography sx={{ mt: 2, mb: 1 }}>Upload Dictionary (.csv):</Typography>
        <Box>
          <Box
            {...getRootProps()}
            sx={{
              border: "2px dashed #888",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
              cursor: "pointer",
              background: "#282828",
              width: "100%",
            }}
          >
            <input {...getInputProps()} />
            <Typography>
              Drag & Drop a CSV file here, or click to select
            </Typography>
          </Box>

          {/* Display Uploaded File Name */}
          {file && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                width: "100%",
                textAlign: "center",
                border: "1px solid #888",
                borderRadius: 2,
                background: "#222",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: "14px", color: "#b0b0b0" }}>
                {file.name}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={removeFile}
                sx={{
                  ml: 2,
                  borderRadius: "6px",
                  color: "white",
                  borderColor: "red",
                  "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.2)" },
                }}
              >
                Remove
              </Button>
            </Box>
          )}
          {errors.file && (
            <FormHelperText sx={{ color: "red" }}>{errors.file}</FormHelperText>
          )}

          {/* Processing Progress Bar */}
          {processing && (
            <Box sx={{ width: "100%", mt: 2 }}>
              <Typography>Processing File...</Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ width: "100%", mt: 1 }}
              />
            </Box>
          )}
        </Box>

        {/* Create Comic Button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={!isLoading && <AddIcon />}
          sx={{
            backgroundColor: "#1976d2",
            color: "white",
            padding: "12px 24px",
            fontSize: "12px",
            fontWeight: "bold",
            mt: 2,
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#1565c0" },
          }}
          onClick={handleSubmit}
          disabled={!selectedFont || !selectedLanguage || !file || isLoading} // Disable button if fields are empty
        >
          {isLoading ? <CircularProgress size={25} /> : "Create New Comic"}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateComic;
