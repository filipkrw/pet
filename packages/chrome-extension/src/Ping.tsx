import { trpc } from "./trpc";

export const Ping: React.FC = () => {
  const { data } = trpc.ping.useQuery();

  return <pre>{JSON.stringify(data)}</pre>;
};
