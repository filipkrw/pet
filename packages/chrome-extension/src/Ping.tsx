import { trpc } from "./trpc";

export const Ping: React.FC = () => {
  const { data } = trpc.ping.useQuery();
  const createBookmark = trpc.createBookmark.useMutation();

  return (
    <>
      <pre>{JSON.stringify(data)}</pre>
      <button
        onClick={() => createBookmark.mutate({ url: "https://google.com" })}
      >
        Create bookmark
      </button>
    </>
  );
};
