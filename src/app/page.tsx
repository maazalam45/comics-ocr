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
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip"; // Import ZIP processing library

export default function Home() {
  const [files, setFiles] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);
  const [processedFiles, setProcessedFiles] = useState<any[]>([]);
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setFiles([]);
    setProcessedFiles([]);
  }, []);

  // File Upload Handler (with ZIP Support)
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "application/json": [],
      "application/zip": [], // Allow ZIP files
    },
    multiple: true,
    onDrop: async (acceptedFiles: any) => {
      let extractedFiles: any[] = [];

      for (let file of acceptedFiles) {
        if (file.type === "application/zip") {
          try {
            const zip = await JSZip.loadAsync(file);
            const zipFiles: any[] = [];
            
            for (let filename in zip.files) {
              if (filename.endsWith(".png") || filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
                const imageFile = await zip.files[filename].async("blob");
                zipFiles.push(new File([imageFile], filename, { type: "image/png" }));
              }
            }
            extractedFiles = [...extractedFiles, ...zipFiles];
          } catch (error) {
            console.error("Error extracting ZIP:", error);
          }
        } else {
          extractedFiles.push(file);
        }
      }

      setFiles((prev) => [...prev, ...extractedFiles]);
    },
  });

  // Simulate Processing Function
  const startProcessing = () => {
    if (files.length === 0) return;
    setProcessing(true);
    setProgress(0);

    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessing(false);
          setProcessedFiles(files);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10);
      });
    }, 500);
  };

  return (
    <Container maxWidth="md" sx={{ background: "#1e1e1e", color: "white", borderRadius: 2, p: 3, mt: 4 }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
        Comic Balloon Text Replacer
      </Typography>

      {/* Font Selector */}
      <Typography sx={{ mb: 1 }}>Select Font:</Typography>
      <Select
        value={selectedFont}
        onChange={(e) => setSelectedFont(e.target.value)}
        sx={{
          background: "#282828",
          color: "white",
          width: "100%",
          mb: 2,
        }}
      >
        <MenuItem value="Arial">Arial</MenuItem>
        <MenuItem value="Comic Sans MS">Comic Sans MS</MenuItem>
        <MenuItem value="Verdana">Verdana</MenuItem>
        <MenuItem value="Times New Roman">Times New Roman</MenuItem>
      </Select>

      {/* Drag & Drop Upload */}
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed #888",
          borderRadius: 2,
          p: 3,
          textAlign: "center",
          cursor: "pointer",
          background: "#282828",
        }}
      >
        <input {...getInputProps()} />
        <Typography>Drag & Drop files here (JPG, PNG, ZIP), or click to select</Typography>
      </Box>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography>Uploaded Files:</Typography>
          <Box sx={{ maxHeight: "150px", overflowY: "auto", border: "1px solid #888", p: 1, borderRadius: 2 }}>
            {files.map((file: any, index: number) => (
              <Typography key={index} sx={{ fontSize: "14px" }}>
                {file.name}
              </Typography>
            ))}
          </Box>
        </Box>
      )}

      {/* Processing Progress Bar */}
      {processing && (
        <Box sx={{ mt: 2 }}>
          <Typography>Processing Files...</Typography>
          <LinearProgress variant="determinate" value={progress} sx={{ width: "100%", mt: 1 }} />
        </Box>
      )}

      {/* Start Processing Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{ width: "100%", mt: 2 }}
        onClick={startProcessing}
        disabled={processing || files.length === 0}
      >
        {processing ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Start Processing"}
      </Button>

      {/* Processed Files */}
      {processedFiles.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Processed Files:</Typography>
          {processedFiles.map((file: any, index: number) => (
            <Box key={index} sx={{ p: 1, border: "1px solid #888", borderRadius: 1, mt: 1 }}>
              {file.name} - <Button size="small">Download</Button>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
}
