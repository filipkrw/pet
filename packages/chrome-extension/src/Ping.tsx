import { useState } from "react";
import { trpc } from "./trpc";

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
      <button onClick={handleClick}>Create bookmark</button>
      {error && <p>{error}</p>}
    </>
  );
};
