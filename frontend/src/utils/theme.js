export const categoryColors = {
  RPG: "secondary",
  Action: "primary",
  Strategy: "success",
  Racing: "warning",
  Survival: "error",
};

export const cardStyles = {
  height: { xs: "340px", sm: "380px", md: "400px" },
  width: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: 3,
  boxShadow: 6,
  background: "linear-gradient(135deg, #23272f 60%, #232b3b 100%)",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: 12,
  },
  overflow: "hidden",
  margin: "0 auto",
};

export const cardMediaStyles = {
  height: { xs: "120px", sm: "140px", md: "160px" },
  objectFit: "cover",
  objectPosition: "center",
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  aspectRatio: "16/9",
  width: "100%",
};

export const loadingBoxStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "60vh",
};

export const featuredSectionStyles = {
  py: { xs: 2, sm: 3 },
  px: { xs: 0.5, sm: 1, md: 2 },
  maxWidth: "1400px",
  mx: "auto",
};

export const gameCardContentStyles = {
  display: "flex",
  flexDirection: "column",
  height: {
    xs: "calc(100% - 120px)",
    sm: "calc(100% - 140px)",
    md: "calc(100% - 160px)",
  },
  p: { xs: 1, sm: 1.25 },
};

export const gameTitleStyles = {
  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
  fontWeight: "bold",
  lineHeight: 1.2,
  mb: 0.5,
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 1,
  WebkitBoxOrient: "vertical",
};

export const gameDescriptionStyles = {
  fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
  mb: 0.5,
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: { xs: 2, sm: 2, md: 2 },
  WebkitBoxOrient: "vertical",
  flexGrow: 1,
};
