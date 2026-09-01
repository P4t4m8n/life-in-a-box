import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { getPostForEdit } from "@/lib/actions/post-actions";
import { getTags } from "@/lib/actions/tags-actions";

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  const [tags, initialPost] = await Promise.all([
    getTags(),
    id ? getPostForEdit(id) : Promise.resolve(undefined),
  ]);

  return (
    <SimpleEditor
      key={id ?? "new"}
      initialTags={tags.map((tag) => tag.name)}
      initialPost={initialPost ?? undefined}
    />
  );
}
