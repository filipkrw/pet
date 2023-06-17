import { useState } from "react";
import { trpc } from "./trpc";
import { Button } from "./components/ui/button";

export const Ping: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { mutate: createBookmark } = trpc.createBookmark.useMutation();

  async function handleClick() {
    const tabs = await chrome.tabs.query({
      active: true,
      windowId: chrome.windows.WINDOW_ID_CURRENT,
    });
    const activeTab = tabs[0];
    if (!activeTab) {
      setError("No active tab");
      return;
    }
    if (!activeTab.url) {
      setError("Active tab has no URL");
      return;
    }
    createBookmark({
      url: activeTab.url,
      vaultRelativePath: "bookmarks",
      note: "Test note about bookmark",
      tags: ["test", "another-bookmark"],
    });
  }

  return (
    <>
      <Button onClick={handleClick}>Create bookmark</Button>
      {error && <p>{error}</p>}
    </>
  );
};
