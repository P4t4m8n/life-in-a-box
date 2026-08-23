import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { getTags } from "@/lib/actions/tags-actions";

export default async function EditorPage() {
  const tags = await getTags();

  return <SimpleEditor initialTags={tags.map((tag) => tag.name)} />;
}
