import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDocs } from "../hooks/useDocs";
import './styles/CreateDocs.css';
import mammoth from "mammoth";
import Quill from "quill";
import React, { useState, useRef } from "react";


const modules = {
  toolbar: [
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ font: [] }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const formats = [
  "size", "font",
  "bold", "italic", "underline", "strike", "blockquote", "code-block",
  "list", "bullet", "indent",
  "link", "image", "video",
  "color", "background",
  "align"
];

const CreateDocs = () => {
  const {
    docTitle,
    setDocTitle,
    handleSave,
    goBackToDashboard,
    recentFiles,
    isModalOpen,
    openRecentFilesModal,
    deleteDocument,
    content,
    loadDocument,
    setContent,
    closeModal,
  } = useDocs();

  const [saveFormat, setSaveFormat] = useState("database");
  const quillRef = useRef(null);

  const handleDocxUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !file.name.endsWith(".docx")) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;

      try {
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const html = result.value;

        const quill = quillRef.current?.getEditor();
        if (!quill) return;

        const container = document.createElement('div');
        const tempQuill = new Quill(container);
        tempQuill.clipboard.dangerouslyPasteHTML(html);
        
        const delta = tempQuill.getContents();
        quill.setContents(delta);
        setContent(quill.getContents());

      } catch (error) {
        console.error("Error importing DOCX:", error);
        alert("Failed to import DOCX file: " + error.message);
      }
    };

    reader.readAsArrayBuffer(file);
  };  

  return (
    <div className="create-docs-container">
      <button 
        className="create-docs-back-button"
        onClick={goBackToDashboard}
      >
        Back to Dashboard
      </button>

      <button
        onClick={openRecentFilesModal}
        className="show-recent-files-button"
      >
        Show Recent files
      </button>

      <label className="upload-docx-label">
        Open File
        <input
          type="file"
          accept=".docx"
          onChange={handleDocxUpload}
          className="upload-docx-input"
          style={{ display: 'none' }}
        />
      </label>

      <input
        type="text"
        value={docTitle}
        onChange={(e) => setDocTitle(e.target.value)}
        placeholder="Document Title"
        className="create-docs-title-input"
      />

      <div className="create-docs-editor-container">
      <ReactQuill
          ref={quillRef}
          value={content}
          onChange={(value, delta, source, editor) => {
            setContent(editor.getContents());
          }}
          theme="snow"
          modules={modules}
          formats={formats}
        />

      </div>

      <select 
        value={saveFormat}
        onChange={(e) => setSaveFormat(e.target.value)}
        className="format-dropdown"
      >
        <option>Save to?</option>
        <option value="docx">Save as Word (DOCX)</option>
        <option value="pdf">Save as PDF</option>
      </select>

      <button
      onClick={() => handleSave(saveFormat, content)}  
      className="create-docs-save-button"
    >
      Save Document
    </button>

      {/* Modal for Recent Files */}
      {isModalOpen && (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="modal-header">
        <h2>Recent Files</h2>
        <button onClick={closeModal} className="modal-close-button">
          &times;
        </button>
      </div>
      <div className="modal-body">
        {recentFiles.length > 0 ? (
          <ul className="recent-files-list">
            {recentFiles.map((file) => (
// Modify the recent file item in your modal
            <li key={file._id} className="recent-file-item">
              <div 
                className="file-info clickable" 
                onClick={() => loadDocument(file._id)}
              >
                <h3>{file.title}</h3>
                <p>{new Date(file.createdAt).toLocaleDateString()}</p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteDocument(file._id);
                }}
                className="delete-file-button"
              >
                Delete
              </button>
            </li>
            ))}
          </ul>
        ) : (
          <p>No recent files found.</p>
        )}
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default CreateDocs;