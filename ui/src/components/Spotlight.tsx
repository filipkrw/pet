import { Button, Group } from "@mantine/core";
import {
  SpotlightProvider,
  openSpotlight,
  toggleSpotlight,
  closeSpotlight,
} from "@mantine/spotlight";
import type { SpotlightAction } from "@mantine/spotlight";
import { Home, Dashboard, FileText, Search } from "tabler-icons-react";
import { ipcRenderer } from "electron";
import { useEffect } from "react";

function SpotlightControl() {
  return (
    <Group position="center">
      <Button onClick={openSpotlight}>Open spotlight</Button>
    </Group>
  );
}

const actions: SpotlightAction[] = [
  {
    title: "Home",
    description: "Get to home page",
    onTrigger: () => console.log("Home"),
    icon: <Home size={18} />,
  },
  {
    title: "Dashboard",
    description: "Get full information about current system status",
    onTrigger: () => console.log("Dashboard"),
    icon: <Dashboard size={18} />,
  },
  {
    title: "Documentation",
    description: "Visit documentation to lean more about all features",
    onTrigger: () => console.log("Documentation"),
    icon: <FileText size={18} />,
  },
  {
    title: "Home",
    description: "Get to home page",
    onTrigger: () => console.log("Home"),
    icon: <Home size={18} />,
  },
  {
    title: "Dashboard",
    description: "Get full information about current system status",
    onTrigger: () => console.log("Dashboard"),
    icon: <Dashboard size={18} />,
  },
  {
    title: "Documentation",
    description: "Visit documentation to lean more about all features",
    onTrigger: () => console.log("Documentation"),
    icon: <FileText size={18} />,
  },
];

export function Spotlight() {
  useEffect(() => {
    ipcRenderer.on("asynchronous-message", function (evt, message) {
      if (message?.action === "show") {
        openSpotlight();
      }
      if (message?.action === "hide") {
        closeSpotlight();
      }
    });
  });

  return (
    <SpotlightProvider
      actions={actions}
      searchIcon={<Search size={18} />}
      searchPlaceholder="Search..."
      nothingFoundMessage="Nothing found..."
      overlayBlur={0}
      overlayOpacity={0}
      transitionDuration={0}
      topOffset={0}
      onSpotlightClose={() => ipcRenderer.send("hide")}
      cleanQueryOnClose
    >
      {/* <SpotlightControl /> */}
    </SpotlightProvider>
  );
}
