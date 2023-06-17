import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { BookmarkForm } from "./BookmarkForm";
import { Card, CardContent } from "./components/ui/card";
import { trpc } from "./trpc";

export const App: React.FC = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [httpBatchLink({ url: "http://localhost:50957" })],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div className="w-full h-full flex justify-center items-center">
          <Card className="w-96 rounded-none border-none shadow-none">
            <CardContent className="px-5 pb-5 pt-4">
              <BookmarkForm />
            </CardContent>
          </Card>
        </div>
      </QueryClientProvider>
    </trpc.Provider>
  );
};
