import React, { useRef, useState, useEffect } from "react";
import { Link as LinkIcon, X } from "lucide-react";
import Button from "./Button";

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const isInitialized = useRef(false);

  // Initialize editor content once
  useEffect(() => {
    if (editorRef.current && !isInitialized.current && value) {
      editorRef.current.innerHTML = value;
      isInitialized.current = true;
    }
  }, []);

  // Reset initialized flag when value is cleared externally
  useEffect(() => {
    if (!value && isInitialized.current) {
      isInitialized.current = false;
    }
  }, [value]);

  const insertLink = () => {
    if (!linkUrl.trim()) return;

    const editor = editorRef.current;
    const selection = window.getSelection();

    if (selection.toString().length === 0) {
      alert("Please select text to add a link");
      return;
    }

    // Get selected text
    const selectedText = selection.toString();

    // Create a range and delete it
    const range = selection.getRangeAt(0);
    range.deleteContents();

    // Create the link element
    const link = document.createElement("a");
    link.href = linkUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.style.color = "#0B4D26";
    link.style.textDecoration = "underline";
    link.style.cursor = "pointer";
    link.textContent = selectedText;

    // Insert the link
    range.insertNode(link);

    // Move cursor after the link
    range.setStartAfter(link);
    range.setEndAfter(link);
    selection.removeAllRanges();
    selection.addRange(range);

    // Update the value
    const htmlContent = editor.innerHTML;
    onChange(htmlContent);

    // Reset
    setLinkUrl("");
    setShowLinkInput(false);
  };

  const handlePaste = (e) => {
    // Allow paste but format as needed
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    const htmlContent = editorRef.current.innerHTML;
    onChange(htmlContent);
  };

  const handleInput = () => {
    const htmlContent = editorRef.current.innerHTML;
    onChange(htmlContent);
  };

  const handleKeyDown = (e) => {
    // Allow natural text formatting shortcuts
    if ((e.ctrlKey || e.metaKey) && e.key === "b") {
      e.preventDefault();
      document.execCommand("bold");
    } else if ((e.ctrlKey || e.metaKey) && e.key === "i") {
      e.preventDefault();
      document.execCommand("italic");
    } else if ((e.ctrlKey || e.metaKey) && e.key === "u") {
      e.preventDefault();
      document.execCommand("underline");
    }
  };

  return (
    <div className="space-y-2">
      <style>{`
        .rich-editor-placeholder:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
          pointer-events: none;
        }
      `}</style>

      {/* Toolbar */}
      <div className="flex gap-2 p-2 bg-gray-100 rounded-t-lg border border-gray-300 flex-wrap">
        <button
          type="button"
          onClick={() => document.execCommand("bold")}
          className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 font-bold"
          title="Bold (Ctrl+B)"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => document.execCommand("italic")}
          className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 italic"
          title="Italic (Ctrl+I)"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => document.execCommand("underline")}
          className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 underline"
          title="Underline (Ctrl+U)"
        >
          U
        </button>

        <div className="border-l border-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => document.execCommand("insertUnorderedList")}
          className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
          title="Bullet List"
        >
          • List
        </button>

        <div className="border-l border-gray-300 mx-1"></div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLinkInput(!showLinkInput)}
            className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1"
            title="Add Link"
          >
            <LinkIcon size={16} />
            Link
          </button>

          {showLinkInput && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-50 w-64">
              <div className="space-y-2">
                <input
                  type="url"
                  placeholder="Enter URL (e.g., https://example.com)"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4D26]"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      insertLink();
                    }
                  }}
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    onClick={insertLink}
                  >
                    Add Link
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setShowLinkInput(false);
                      setLinkUrl("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-l border-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => {
            editorRef.current.innerHTML = "";
            onChange("");
          }}
          className="px-3 py-1 bg-white border border-red-300 rounded hover:bg-red-50 text-red-600 flex items-center gap-1"
          title="Clear All"
        >
          <X size={16} />
          Clear
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        data-placeholder={
          placeholder || "Write a paragraph with formatting and links..."
        }
        className="rich-editor-placeholder w-full min-h-24 p-3 border border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-[#0B4D26] bg-white text-sm leading-relaxed overflow-y-auto max-h-64"
        style={{ wordBreak: "break-word" }}
      />

      <p className="text-xs text-gray-500">
        Use the toolbar to format text. Select text and click "Link" to add
        hyperlinks.
      </p>
    </div>
  );
};

export default RichTextEditor;
