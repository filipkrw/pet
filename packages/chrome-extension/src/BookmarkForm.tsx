import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "./components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { trpc } from "./trpc";

const formSchema = z.object({
  note: z.string().optional(),
  tags: z.string().optional(),
});

export function BookmarkForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const {
    mutate: createBookmark,
    isLoading,
    isSuccess,
  } = trpc.createBookmark.useMutation({
    onSuccess: () => {
      form.reset();
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const tabs = await chrome.tabs.query({
      active: true,
      windowId: chrome.windows.WINDOW_ID_CURRENT,
    });
    const activeTab = tabs[0];
    if (!activeTab || !activeTab.url) {
      throw new Error("No active tab");
    }
    createBookmark({
      url: activeTab.url,
      vaultRelativePath: "bookmarks",
      note: values.note,
      tags: values.tags ? values.tags.split(",").map((tag) => tag.trim()) : [],
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea autoFocus placeholder="Note..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="tag,another tag" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || isSuccess}
        >
          {isSuccess ? "Saved" : "Save page"}
        </Button>
      </form>
    </Form>
  );
}
