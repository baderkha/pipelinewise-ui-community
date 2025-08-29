import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SettingsIcon from "@mui/icons-material/Settings";
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#00897b", // teal
          color: "white",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Top Section */}
        <List>
          <ListItemButton
            sx={{
              "&:hover": { backgroundColor: "#0277bd" }, // blue hover
              "&.Mui-selected": { backgroundColor: "#01579b" }, // blue selected
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>
              <WorkIcon />
            </ListItemIcon>
            <ListItemText primary="Jobs" />
          </ListItemButton>

          <ListItemButton
            sx={{
              "&:hover": { backgroundColor: "#0277bd" },
              "&.Mui-selected": { backgroundColor: "#01579b" },
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>
              <WaterDropIcon />
            </ListItemIcon>
            <ListItemText primary="Taps" />
          </ListItemButton>

          <ListItemButton
            sx={{
              "&:hover": { backgroundColor: "#0277bd" },
              "&.Mui-selected": { backgroundColor: "#01579b" },
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>
              <ModeStandbyIcon />
            </ListItemIcon>
            <ListItemText primary="Targets" />
          </ListItemButton>
        </List>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mt: 1 }} />

        {/* Spacer pushes bottom items down */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Bottom Section */}
        <List>
          <ListItemButton
            sx={{
              "&:hover": { backgroundColor: "#0277bd" },
              "&.Mui-selected": { backgroundColor: "#01579b" },
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>

          <ListItemButton
            sx={{
              "&:hover": { backgroundColor: "#0277bd" },
              "&.Mui-selected": { backgroundColor: "#01579b" },
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}
