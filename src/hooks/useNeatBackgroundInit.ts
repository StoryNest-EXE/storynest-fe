import { useQueryClient } from "@tanstack/react-query";

export function useNeatBackgroundInit() {
  const queryClient = useQueryClient();

  const isInitialized =
    queryClient.getQueryData<boolean>(["neat-bg-init"]) ?? false;

  const setInitialized = () => {
    queryClient.setQueryData(["neat-bg-init"], true);
  };

  return { isInitialized, setInitialized };
}
