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
import { Checkbox } from "./components/ui/checkbox";
import { Label } from "./components/ui/label";

const formSchema = z.object({
  note: z.string().optional(),
  tags: z.string().optional(),
  scrape: z.boolean().optional(),
});

export function BookmarkForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tags: "",
      note: "",
      scrape: false,
    },
  });

  const {
    mutate: createBookmark,
    isLoading,
    isSuccess,
    error,
  } = trpc.createBookmark.useMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const tabs = await chrome.tabs.query({
      active: true,
      windowId: chrome.windows.WINDOW_ID_CURRENT,
    });
    const activeTab = tabs[0];
    if (!activeTab || !activeTab.url || !activeTab.title) {
      throw new Error("No active tab");
    }
    createBookmark({
      title: activeTab.title,
      url: activeTab.url,
      vaultRelativePath: "bookmarks",
      note: values.note,
      tags: values.tags?.length
        ? values.tags.split(",").map((tag) => tag.trim())
        : undefined,
      scrape: values.scrape,
    });
  }

  if (isSuccess) {
    return <div className="text-sm text-center">Bookmark added</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input autoFocus placeholder="tag,another tag" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea rows={2} className="min-h-0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="scrape"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    id="scrape"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <Label htmlFor="scrape">Scrape page content</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add bookmark"}
        </Button>
        {error?.message}
      </form>
    </Form>
  );
}
