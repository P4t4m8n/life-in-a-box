"use client"

import { useCallback, useRef, useState } from "react"
import { EditorContent, EditorContext, useEditor, type Content } from "@tiptap/react"

// --- Actions ---
import { savePost } from "@/lib/actions/post-actions"
import { createTag } from "@/lib/actions/tags-actions"

// --- Types ---
import type { IPostEditDTO } from "@/types/app-types"

// --- Tiptap Core Extensions ---
import { FindAndReplace } from "@tiptap/extension-find-and-replace"
import { Selection } from "@tiptap/extensions"
import { contentExtensions } from "@/lib/tiptap-content-extensions"

// --- UI Primitives ---
import { Button } from "@/components/TipTap/tiptap-ui-primitive/button"
import { Spacer } from "@/components/TipTap/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/TipTap/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/TipTap/tiptap-node/image-upload-node/image-upload-node-extension"
import "@/components/TipTap/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/TipTap/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/TipTap/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/TipTap/tiptap-node/list-node/list-node.scss"
import "@/components/TipTap/tiptap-node/image-node/image-node.scss"
import "@/components/TipTap/tiptap-node/heading-node/heading-node.scss"
import "@/components/TipTap/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/TipTap/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/TipTap/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/TipTap/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/TipTap/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/TipTap/tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/TipTap/tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/TipTap/tiptap-ui/link-popover"
import { MarkButton } from "@/components/TipTap/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/TipTap/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/TipTap/tiptap-ui/undo-redo-button"
import {
  SearchAndReplace,
  SearchAndReplaceButton,
} from "@/components/TipTap/tiptap-ui/search-and-replace"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/TipTap/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/TipTap/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/TipTap/tiptap-icons/link-icon"

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"
import { useElementRect } from "@/hooks/use-element-rect"

// --- Components ---
import { ThemeToggle } from "@/components/TipTap/tiptap-templates/simple/theme-toggle"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"
import { uploadImageToCloudinary } from "@/lib/actions/upload-actions"

// --- Styles ---
import "@/components/TipTap/tiptap-templates/simple/simple-editor.scss"


const SEARCH_AND_REPLACE_SCROLL_OPTIONS: ScrollIntoViewOptions = {
  block: "center",
}

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  onSearchAndReplaceClick,
  isSearchAndReplaceOpen,
  searchAndReplaceButtonRef,
  isMobile,
  onSaveClick,
  isSaving,
  isEditing,
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  onSearchAndReplaceClick: () => void
  isSearchAndReplaceOpen: boolean
  searchAndReplaceButtonRef: React.RefObject<HTMLButtonElement | null>
  isMobile: boolean
  onSaveClick: () => void
  isSaving: boolean
  isEditing: boolean
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu modal={false} levels={[1, 2, 3, 4]} />
        <ListDropdownMenu
          modal={false}
          types={["bulletList", "orderedList", "taskList"]}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <SearchAndReplaceButton
          ref={searchAndReplaceButtonRef}
          aria-expanded={isSearchAndReplaceOpen}
          data-active-state={isSearchAndReplaceOpen ? "on" : "off"}
          onClick={onSearchAndReplaceClick}
        />
        <ThemeToggle />
        <Button onClick={onSaveClick} disabled={isSaving} variant="primary">
          {isSaving ? "Saving…" : isEditing ? "Update" : "Save"}
        </Button>
      </ToolbarGroup>
    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

export function SimpleEditor({
  initialTags = [],
  initialPost,
}: {
  initialTags?: string[]
  initialPost?: IPostEditDTO
}) {
  const isMobile = useIsBreakpoint()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main"
  )
  const [prevIsMobile, setPrevIsMobile] = useState(isMobile)
  const [isSearchAndReplaceOpen, setIsSearchAndReplaceOpen] = useState(false)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const searchAndReplaceButtonRef = useRef<HTMLButtonElement>(null)

  const [title, setTitle] = useState(initialPost?.title ?? "")
  const [description, setDescription] = useState(initialPost?.description ?? "")
  const [readingTime, setReadingTime] = useState(initialPost?.readingTime ?? "")
  const [imgSrc, setImgSrc] = useState(initialPost?.imgSrc ?? "")
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null)
  const coverImageInputRef = useRef<HTMLInputElement>(null)

  const handleCoverImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      e.target.value = ""
      if (!file) return

      if (file.size > MAX_FILE_SIZE) {
        setCoverUploadError(
          `File size exceeds maximum allowed (${MAX_FILE_SIZE / (1024 * 1024)}MB)`
        )
        return
      }

      setCoverUploadError(null)
      setIsUploadingCover(true)
      try {
        const formData = new FormData()
        formData.append("file", file)
        const { url } = await uploadImageToCloudinary(formData)
        setImgSrc(url)
      } catch (error) {
        setCoverUploadError(
          error instanceof Error ? error.message : "Upload failed"
        )
      } finally {
        setIsUploadingCover(false)
      }
    },
    []
  )

  const [availableTags, setAvailableTags] = useState<string[]>(initialTags)
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialPost?.tags ?? []
  )
  const [newTagName, setNewTagName] = useState("")

  const toggleTag = useCallback((name: string) => {
    setSelectedTags((prev) =>
      prev.includes(name) ? prev.filter((tag) => tag !== name) : [...prev, name]
    )
  }, [])

  const addNewTag = useCallback(async () => {
    const name = newTagName.trim()
    if (!name) return

    setNewTagName("")
    const tag = await createTag(name)
    setAvailableTags((prev) => (prev.includes(tag.name) ? prev : [...prev, tag.name]))
    setSelectedTags((prev) => (prev.includes(tag.name) ? prev : [...prev, tag.name]))
  }, [newTagName])

  const editor = useEditor({
    immediatelyRender: false,
    // Fire a no-op transaction once the view is mounted so the toolbar's
    // useEditorState subscribers re-render and pick up editor.isEditable.
    onCreate: ({ editor }) => {
      editor.view.dispatch(editor.state.tr)
    },
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      ...contentExtensions,
      Selection,
      FindAndReplace.configure({
        searchDebounceMs: 500,
        injectCSS: false,
      }),
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    content: (initialPost?.content as Content | undefined) ?? undefined,
    "autofocus": "end",
  })

  const toolbarRect = useElementRect({ element: toolbarRef })

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRect.height,
  })

  // Reset to the main toolbar view when switching from mobile to desktop.
  if (isMobile !== prevIsMobile) {
    setPrevIsMobile(isMobile)
    if (!isMobile) {
      setMobileView("main")
    }
  }

  const openSearchAndReplace = useCallback(() => {
    setMobileView("main")
    setIsSearchAndReplaceOpen(true)
  }, [])

  const closeSearchAndReplace = useCallback(() => {
    setIsSearchAndReplaceOpen(false)
    searchAndReplaceButtonRef.current?.focus()
  }, [])

  const toggleSearchAndReplace = useCallback(() => {
    if (isSearchAndReplaceOpen) {
      closeSearchAndReplace()
      return
    }

    openSearchAndReplace()
  }, [closeSearchAndReplace, isSearchAndReplaceOpen, openSearchAndReplace])

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = useCallback(async () => {
    if (!editor) return

    setIsSaving(true)
    try {
      // Round-trip through JSON so only plain, serializable data crosses the
      // server action boundary.
      const json = JSON.parse(JSON.stringify(editor.getJSON()))
      await savePost({
        id: initialPost?.id,
        title,
        description,
        readingTime,
        imgSrc,
        imgAlt: "",
        tags: selectedTags,
        content: json,
      })
    } finally {
      setIsSaving(false)
    }
  }, [editor, initialPost?.id, title, description, readingTime, imgSrc, selectedTags])

  return (
    <div className="simple-editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <Toolbar ref={toolbarRef}>
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              onSearchAndReplaceClick={toggleSearchAndReplace}
              isSearchAndReplaceOpen={isSearchAndReplaceOpen}
              searchAndReplaceButtonRef={searchAndReplaceButtonRef}
              isMobile={isMobile}
              onSaveClick={handleSave}
              isSaving={isSaving}
              isEditing={!!initialPost?.id}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <SearchAndReplace
          className="simple-editor-search-and-replace"
          open={isSearchAndReplaceOpen}
          onOpen={openSearchAndReplace}
          onClose={closeSearchAndReplace}
          scrollIntoViewOptions={SEARCH_AND_REPLACE_SCROLL_OPTIONS}
        />

        <div className="simple-editor-meta">
          <input
            className="simple-editor-meta-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            aria-label="Title"
          />
          <textarea
            className="simple-editor-meta-field"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            aria-label="Description"
            rows={2}
          />
          <input
            className="simple-editor-meta-field"
            value={readingTime}
            onChange={(e) => setReadingTime(e.target.value)}
            placeholder="Reading time (e.g. 5 min read)"
            aria-label="Reading time"
          />
          <div className="simple-editor-meta-tags">
            {availableTags.map((name) => (
              <button
                key={name}
                type="button"
                className="simple-editor-meta-tag"
                data-selected={selectedTags.includes(name)}
                onClick={() => toggleTag(name)}
              >
                {name}
              </button>
            ))}
            <input
              className="simple-editor-meta-tag-input"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addNewTag()
                }
              }}
              placeholder="Add tag"
              aria-label="Add tag"
            />
            <Button type="button" onClick={addNewTag}>
              Add
            </Button>
          </div>
          <input
            ref={coverImageInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            style={{ display: "none" }}
            aria-label="Cover image file"
          />
          <div className="simple-editor-meta-row">
            <Button
              type="button"
              onClick={() => coverImageInputRef.current?.click()}
              disabled={isUploadingCover}
            >
              {isUploadingCover
                ? "Uploading..."
                : imgSrc
                  ? "Replace cover image"
                  : "Upload cover image"}
            </Button>
            {imgSrc && (
              <Button
                type="button"
                onClick={() => setImgSrc("")}
                disabled={isUploadingCover}
              >
                Remove
              </Button>
            )}
          </div>
          {coverUploadError && (
            <p className="simple-editor-meta-error">{coverUploadError}</p>
          )}
          {imgSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="simple-editor-meta-preview"
              src={imgSrc}
              alt="Cover preview"
            />
          )}
        </div>

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </EditorContext.Provider>
    </div>
  )
}
