import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html"; 

export const useDocs = () => {
  const [docTitle, setDocTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const [recentFiles, setRecentFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false); 

  // Generic file download helper
  const downloadFile = (blob, extension) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${docTitle || "Untitled"}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Save as DOCX (Word)
  const saveAsDocx = async (htmlContent) => {
    try {
      const { Document, Paragraph, Packer } = await import("docx");
  
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;
  
      const paragraphs = [];
  
      tempDiv.querySelectorAll("p, div").forEach(node => {
        const text = node.textContent.trim();
        if (text) {
          paragraphs.push(new Paragraph(text));
        }
      });
  
      const doc = new Document({ sections: [{ children: paragraphs }] });
      const blob = await Packer.toBlob(doc);
      downloadFile(blob, "docx");
    } catch (error) {
      alert("Failed to generate DOCX: " + error.message);
    }
  };
  
  // Save as PDF
  const saveAsPdf = async (htmlContent) => {
    try {
      const { jsPDF } = await import("jspdf");
      const html2canvas = await import("html2canvas");
      
      const element = document.createElement("div");
      element.innerHTML = htmlContent;
      document.body.appendChild(element);
      
      const canvas = await html2canvas.default(element);
      const pdf = new jsPDF();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0);
      pdf.save(`${docTitle}.pdf`);
      
      document.body.removeChild(element);
    } catch (error) {
      alert("Failed to generate PDF: " + error.message);
    }
  };

  const handleSave = async (format, currentContent) => {
    if (!docTitle || !currentContent?.ops || currentContent.ops.length === 0) {
      alert("Please enter both a title and content.");
      return;
    }
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/api/docs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: docTitle, content: currentContent }),
      });
  
      if (!response.ok) throw new Error("Database save failed");
  
      // Save locally if needed
      const converter = new QuillDeltaToHtmlConverter(currentContent.ops || []);
      const htmlContent = converter.convert();
  
      switch (format) {
        case "docx":
          await saveAsDocx(htmlContent); break;
        case "pdf":
          await saveAsPdf(htmlContent); break;
        default: break;
      }
  
      alert("Document saved successfully!");
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  

  const deleteDocument = async (docId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/docs/${docId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        // Remove the deleted doc from recentFiles state
        setRecentFiles(recentFiles.filter(file => file._id !== docId));
        alert("Document deleted successfully");
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete document");
      }
    } catch (error) {
    }
  };
    // Fetch recent files from API
    const fetchRecentFiles = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:5000/api/docs/recent", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const files = await response.json();
          setRecentFiles(files);
        } else {
          throw new Error("Failed to fetch files");
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    // Add this to your useDocs hook
      const loadDocument = async (docId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/docs/${docId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const doc = await response.json();
      setDocTitle(doc.title);
      setContent(doc.content);
      closeModal(); // Close the recent files modal
    } else {
      throw new Error("Failed to load document");
    }
  } catch (error) {
    alert(`Error loading document: ${error.message}`);
  }
};

  
    const openRecentFilesModal = async () => {
      setIsModalOpen(true);
      await fetchRecentFiles();
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };


  return {
    docTitle,
    setDocTitle,
    content,
    setContent,
    handleSave,
    goBackToDashboard: () => navigate('/dashboard'),
    recentFiles,
    isModalOpen,
    openRecentFilesModal,
    deleteDocument,
    closeModal,
    loadDocument,
    isSaving, 
  };
};