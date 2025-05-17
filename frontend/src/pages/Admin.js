import { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Box,
  Alert,
} from "@mui/material";
import {
  SportsEsports as SportsEsportsIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  Category as CategoryIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import LoadingBox from "../components/LoadingBox";
import GameCard from "../components/GameCard";
import useGames from "../hooks/useGames";
import {
  isValidUrl,
  meetsMinLength,
  isInRange,
  sanitizeText,
  sanitizePrice,
} from "../utils/validation";

const Admin = () => {
  const { user } = useAuth();
  const {
    games,
    loading,
    error: gamesError,
    addGame,
    updateGame,
    deleteGame,
  } = useGames();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    price: "",
    rating: "",
    description: "",
    category: "",
  });

  const handleOpen = (game = null) => {
    if (game) {
      setEditingGame(game);
      setFormData(game);
    } else {
      setEditingGame(null);
      setFormData({
        title: "",
        image: "",
        price: "",
        rating: "",
        description: "",
        category: "",
      });
    }
    setError("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingGame(null);
    setFormData({
      title: "",
      image: "",
      price: "",
      rating: "",
      description: "",
      category: "",
    });
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check all required fields are filled
    if (
      !formData.title ||
      !formData.image ||
      !formData.price ||
      !formData.description ||
      !formData.category
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (!meetsMinLength(formData.title, 3)) {
      setError("Game title must be at least 3 characters long");
      return;
    }

    if (!meetsMinLength(formData.description, 10)) {
      setError("Description must be at least 10 characters long");
      return;
    }

    if (!meetsMinLength(formData.category, 2)) {
      setError("Category must be at least 2 characters long");
      return;
    }

    const price = parseFloat(formData.price);
    if (!isInRange(price, 0, 1000000)) {
      setError("Price must be between $0 and $1,000,000");
      return;
    }

    // Rating validation
    let rating = null;
    if (formData.rating) {
      if (!isInRange(formData.rating, 0, 5)) {
        setError("Rating must be a number between 0 and 5");
        return;
      }
      rating = parseFloat(formData.rating);
    }

    // Image URL validation
    if (!isValidUrl(formData.image)) {
      setError("Please enter a valid HTTP or HTTPS image URL");
      return;
    }

    try {
      // Sanitize all inputs before sending to API
      const gameData = {
        title: sanitizeText(formData.title),
        description: sanitizeText(formData.description),
        category: sanitizeText(formData.category),
        image: formData.image.trim(),
        price: sanitizePrice(price),
      };

      // Only include rating if it has a value
      if (rating !== null) {
        gameData.rating = rating;
      }

      if (editingGame) {
        // Pass either id or _id based on what's available
        const gameId = editingGame.id || editingGame._id;
        await updateGame(gameId, gameData);
      } else {
        await addGame(gameData);
      }
      handleClose();
    } catch (err) {
      if (err.data && err.data.errors) {
        // Handle validation errors from backend
        const errorMessages = Object.values(err.data.errors).join(", ");
        setError(errorMessages || "Failed to save game. Please try again.");
      } else {
        setError(err.message || "Failed to save game. Please try again.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      try {
        // Make sure we have a valid ID
        if (!id) {
          throw new Error("Game ID is required for deletion");
        }
        await deleteGame(id);
      } catch (err) {
        setError(err.message || "Failed to delete game. Please try again.");
      }
    }
  };

  if (loading) {
    return <LoadingBox />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #23272f 60%, #232b3b 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SportsEsportsIcon color="primary" sx={{ fontSize: 36, mr: 1 }} />
            <Typography variant="h4" component="h1" fontWeight={700}>
              Admin Dashboard
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => handleOpen()}
            color="secondary"
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Add New Game
          </Button>
        </Box>
        {gamesError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {gamesError}
          </Alert>
        )}
        <Grid container spacing={4}>
          {games.map((game) => (
            <Grid item xs={12} sm={6} md={4} key={game.id || game._id}>
              <GameCard
                game={game}
                showActions
                onEdit={handleOpen}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 4, p: 2 } }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: 700,
            }}
          >
            <AddCircleOutlineIcon
              color="primary"
              sx={{ fontSize: 32, mr: 1 }}
            />
            {editingGame ? "Edit Game" : "Add New Game"}
          </DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mt: 2, mb: 1 }}>
                {error}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                margin="normal"
                required
                inputProps={{ minLength: 3 }}
                helperText="Minimum 3 characters"
              />
              <TextField
                fullWidth
                label="Image URL"
                name="image"
                value={formData.image}
                onChange={handleChange}
                margin="normal"
                required
                helperText="Enter a valid image URL (starting with http:// or https://)"
              />
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <AttachMoneyIcon color="success" sx={{ mr: 1 }} />
                  ),
                  inputProps: { min: 0, max: 1000000, step: "0.01" },
                }}
                helperText="Enter a positive price (max $1,000,000)"
              />
              <TextField
                fullWidth
                label="Rating"
                name="rating"
                type="number"
                value={formData.rating}
                onChange={handleChange}
                margin="normal"
                InputProps={{
                  inputProps: { min: 0, max: 5, step: 0.1 },
                }}
                helperText="Rating between 0-5 (optional)"
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={3}
                required
                inputProps={{ minLength: 10 }}
                helperText="Minimum 10 characters"
              />
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                margin="normal"
                required
                inputProps={{ minLength: 2 }}
                helperText="Enter game category (min 2 characters)"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ pb: 2, pr: 3 }}>
            <Button
              onClick={handleClose}
              color="inherit"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              sx={{ borderRadius: 2, fontWeight: 600 }}
            >
              {editingGame ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Admin;
