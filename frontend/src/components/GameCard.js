import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Tooltip,
  IconButton,
  Rating,
} from "@mui/material";
import {
  Category as CategoryIcon,
  AttachMoney as AttachMoneyIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  categoryColors,
  cardStyles,
  cardMediaStyles,
  gameCardContentStyles,
  gameTitleStyles,
  gameDescriptionStyles,
} from "../utils/theme";

const GameCard = ({
  game,
  onEdit,
  onDelete,
  showActions = false,
  showRating = true,
  onClick,
}) => {
  const CardWrapper = onClick
    ? Card
    : ({ children, ...props }) => <Card {...props}>{children}</Card>;

  // Ensure we have a valid game ID
  const gameId = game.id || game._id;

  return (
    <CardWrapper sx={cardStyles} onClick={onClick}>
      <Box sx={{ width: "100%" }}>
        <CardMedia
          component="img"
          image={game.image}
          alt={game.title}
          sx={cardMediaStyles}
        />
      </Box>
      <CardContent sx={gameCardContentStyles}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row" },
            alignItems: { xs: "flex-start", sm: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 0.25,
            mb: 0.5,
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              ...gameTitleStyles,
              flexGrow: 1,
              mb: { xs: 0.25, sm: 0.25, md: 0 },
            }}
          >
            {game.title}
          </Typography>
          <Tooltip title={game.category} placement="top">
            <Chip
              icon={
                <CategoryIcon
                  sx={{
                    fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                  }}
                />
              }
              label={game.category}
              color={categoryColors[game.category] || "default"}
              size="small"
              sx={{
                fontWeight: "bold",
                height: { xs: 16, sm: 18, md: 20 },
                fontSize: { xs: "0.5rem", sm: "0.55rem", md: "0.6rem" },
              }}
            />
          </Tooltip>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={gameDescriptionStyles}
        >
          {game.description}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: "auto",
            flexWrap: { xs: "wrap", sm: "nowrap" },
            gap: { xs: 0.25, sm: 0 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
            <AttachMoneyIcon
              sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" } }}
              color="success"
            />
            <Typography
              variant="subtitle2"
              color="success.main"
              fontWeight="bold"
              sx={{ fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" } }}
            >
              {game.price}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "flex-end", sm: "flex-end" },
              width: { xs: "100%", sm: "auto" },
              mt: { xs: 0.25, sm: 0 },
            }}
          >
            {showRating && (
              <Rating
                value={game.rating}
                precision={0.1}
                readOnly
                size="small"
                sx={{
                  fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                  "& .MuiRating-icon": {
                    margin: { xs: "0 -2px", sm: "0 -1px" },
                  },
                }}
              />
            )}
            {showActions && (
              <Box
                sx={{ display: "flex", gap: 0.25, ml: showRating ? 0.25 : 0 }}
              >
                <Tooltip title="Edit">
                  <IconButton
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(game);
                    }}
                    size="small"
                    sx={{ padding: { xs: 0.25, sm: 0.5 } }}
                  >
                    <EditIcon
                      sx={{
                        fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" },
                      }}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(gameId);
                    }}
                    size="small"
                    sx={{ padding: { xs: 0.25, sm: 0.5 } }}
                  >
                    <DeleteIcon
                      sx={{
                        fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" },
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </CardWrapper>
  );
};

export default GameCard;
