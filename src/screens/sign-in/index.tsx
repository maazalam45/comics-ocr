"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { login } from "@/services/auth";
import { toast } from "react-toastify";
import { setAuthenticationHeader } from "@/services";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      router.push("/dashboard");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!email || !password) {
      setLoading(false);
      setError("Please fill in all fields.");
      return;
    }
    try {
      const response = await login({
        email: email,
        password: password,
      });
      if (response.token) {
        setAuthenticationHeader(response.token);
        toast.success("Login Successful", { position: "top-right" });
        router.push("/dashboard");
      }
    } catch (error: any) {
      setError(error);
    } finally {
      () => setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 10,
          p: 4,
          background: "#1e1e1e",
          color: "white",
          borderRadius: 2,
          boxShadow: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          Comic Balloon Text Replacer
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            variant="outlined"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ 
              mt: 2, background: "#282828", color: "#fff", 
              input: { color: "#dfdfdf" }, 
              '.MuiFormLabel-root': {
                color: '#797979',
              },
              '.Mui-focused' : {
                color: '#1976d2',
              } 
            }}
          />

          <TextField
            fullWidth
            variant="outlined"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ 
              mt: 2, background: "#282828", color: "#fff", 
              input: { color: "#dfdfdf" }, 
              '& .MuiFormLabel-root': {
                color: '#797979',
              },
              '.Mui-focused' : {
                color: '#1976d2',
              } 
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              bgcolor: "#0078FF",
              "&:hover": { bgcolor: "#005ecb" },
            }}
          >
            {loading ? <CircularProgress size={20} color="primary" /> : "Login"}
          </Button>
        </form>
      </Box>
    </Container>
  );
}
