import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { Link as RouterLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (user) {
      console.log(user);
      console.log("Current User Details:", {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        mobile: user.mobile,
        gender: user.gender,
        role: user.role,
      });
    } else {
      console.log("No user is currently logged in");
    }
  }, [user]);

  const navItems = [
    { text: "Home", path: "/" },
    ...(user
      ? [
          ...(user.role === "admin" ? [{ text: "Admin", path: "/admin" }] : []),
          { text: "Logout", onClick: logout },
        ]
      : [
          { text: "Login", path: "/login" },
          { text: "Register", path: "/register" },
        ]),
  ];

  const drawer = (
    <List>
      {navItems.map((item) => (
        <ListItem
          button
          key={item.text}
          component={item.path ? RouterLink : "button"}
          to={item.path}
          onClick={item.onClick || (() => setDrawerOpen(false))}
        >
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <AppBar
      position="static"
      sx={{
        boxShadow: 4,
        background: "linear-gradient(90deg, #23272f 60%, #232b3b 100%)",
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <SportsEsportsIcon
            sx={{ mr: 1, fontSize: 32, color: "primary.main" }}
          />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: "bold",
              letterSpacing: 1,
              fontSize: 24,
              transition: "color 0.2s",
              "&:hover": { color: "primary.light" },
            }}
          >
            Gamers Den
          </Typography>
        </Box>
        {!isMobile && (
          <Box sx={{ display: "flex", gap: 2 }}>
            {navItems.map((item) =>
              item.path ? (
                <Button
                  key={item.text}
                  color="inherit"
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    fontWeight: 600,
                    fontSize: 16,
                    borderRadius: 2,
                    transition: "background 0.2s, color 0.2s",
                    "&:hover": {
                      background: "rgba(114,137,218,0.1)",
                      color: "primary.main",
                    },
                  }}
                >
                  {item.text}
                </Button>
              ) : (
                <Button
                  key={item.text}
                  color="inherit"
                  onClick={item.onClick}
                  sx={{
                    fontWeight: 600,
                    fontSize: 16,
                    borderRadius: 2,
                    transition: "background 0.2s, color 0.2s",
                    "&:hover": {
                      background: "rgba(114,137,218,0.1)",
                      color: "primary.main",
                    },
                  }}
                >
                  {item.text}
                </Button>
              )
            )}
          </Box>
        )}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          {drawer}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
