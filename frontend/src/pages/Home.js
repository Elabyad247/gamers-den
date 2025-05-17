import { Container, Grid, Typography, Box, Alert } from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import GameCard from "../components/GameCard";
import LoadingBox from "../components/LoadingBox";
import useGames from "../hooks/useGames";
import { featuredSectionStyles } from "../utils/theme";

const Home = () => {
  const { games, loading, error } = useGames();

  if (loading) {
    return <LoadingBox />;
  }

  if (error) {
    return (
      <Container maxWidth={false} disableGutters sx={featuredSectionStyles}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} disableGutters sx={featuredSectionStyles}>
      <Box
        sx={{
          mb: { xs: 1.5, sm: 2.5 },
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 1,
        }}
      >
        <SportsEsportsIcon
          fontSize="large"
          color="primary"
          sx={{ mr: { xs: 0, sm: 1 }, fontSize: { xs: "1.75rem", sm: "2rem" } }}
        />
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontSize: { xs: "1.5rem", sm: "1.75rem" },
            fontWeight: "bold",
            m: 0,
          }}
        >
          Featured Games
        </Typography>
      </Box>
      {games.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No games available at the moment. Please check back later!
        </Alert>
      ) : (
        <Grid container spacing={{ xs: 1, sm: 2 }}>
          {games.map((game) => (
            <Grid item xs={4} key={game.id || game._id}>
              <GameCard game={game} showRating />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Home;
