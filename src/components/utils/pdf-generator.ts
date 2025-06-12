import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import type { BookNode } from "@/book/bookNode"

// Helper function to add text with word wrapping
function addWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number {
  const words = text.split(" ")
  let line = ""
  let currentY = y

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " "
    const testWidth = (doc.getStringUnitWidth(testLine) * doc.getFontSize()) / doc.internal.scaleFactor

    if (testWidth > maxWidth && i > 0) {
      doc.text(line, x, currentY)
      line = words[i] + " "
      currentY += lineHeight
    } else {
      line = testLine
    }
  }

  doc.text(line, x, currentY)
  return currentY + lineHeight
}

// Function to render stars for ratings
function renderStars(doc: jsPDF, x: number, y: number, rating: number): void {
  const fullStar = "★"
  const emptyStar = "☆"
  const stars = Array(5)
    .fill(emptyStar)
    .map((star, i) => (i < Math.floor(rating) ? fullStar : star))
    .join(" ")
  doc.text(stars, x, y)
}

// Function to load image with multiple fallback strategies (for book detail pages, not component capture)
async function loadImageAsBase64(url: string): Promise<string | null> {
  if (url.includes("placeholder.svg")) return null
  try {
    const response = await fetch(url, { mode: "cors" })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for ${url}`)
    const blob = await response.blob()
    if (blob.size === 0) throw new Error("Empty blob received for " + url)

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error("FileReader error for " + url))
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.log(`Failed to load image ${url} via fetch, trying Image() fallback:`, error)
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = "Anonymous" // Correct casing
      const timeout = 15000
      const timer = setTimeout(() => {
        console.warn(`Timeout loading image with Image(): ${url}`)
        resolve(null)
      }, timeout)
      img.onload = () => {
        clearTimeout(timer)
        try {
          const canvas = document.createElement("canvas")
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          const ctx = canvas.getContext("2d")
          if (!ctx) return resolve(null)
          ctx.drawImage(img, 0, 0)
          resolve(canvas.toDataURL("image/png"))
        } catch (e) {
          console.error("Canvas conversion failed for Image():", e)
          resolve(null)
        }
      }
      img.onerror = () => {
        clearTimeout(timer)
        console.error(`Error loading image with Image(): ${url}`)
        resolve(null)
      }
      img.src = url
    })
  }
}

// Enhanced function to wait for all images within an element to load
async function waitForImagesToLoad(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll("img"))
  const promises = images.map((img) => {
    if (img.complete && img.naturalWidth !== 0) {
      return Promise.resolve() // Already loaded
    }
    return new Promise<void>((resolve) => {
      const timeout = 20000 // 20 seconds timeout per image
      let timer: NodeJS.Timeout | null = null

      const cleanup = () => {
        if (timer) clearTimeout(timer)
        img.removeEventListener("load", onLoad)
        img.removeEventListener("error", onError)
      }

      const onLoad = () => {
        cleanup()
        resolve()
      }
      const onError = () => {
        cleanup()
        console.warn(`Image failed to load for PDF: ${img.src?.substring(0, 100)}`)
        resolve() // Resolve anyway to not block PDF generation
      }

      img.addEventListener("load", onLoad)
      img.addEventListener("error", onError)

      timer = setTimeout(() => {
        console.warn(`Timeout waiting for image: ${img.src?.substring(0, 100)}`)
        onError() // Trigger error handling path which resolves
      }, timeout)

      // Re-check src, sometimes helps trigger load for dynamic images
      if (img.src && !img.complete) {
        const currentSrc = img.src
        img.src = "" // Temporarily clear src
        img.src = currentSrc // Re-assign src
      } else if (!img.src) {
        console.warn("Image tag found with no src attribute.")
        resolve() // Resolve if no src
      }
    })
  })

  // Add a general timeout for all images to prevent indefinite waiting
  await Promise.race([
    Promise.all(promises),
    new Promise<void>((resolve) =>
      setTimeout(() => {
        console.warn("Global timeout reached for waiting for images.")
        resolve()
      }, 30000),
    ), // 30 seconds global timeout
  ])
}

// Function to capture React component as image with proper sizing
async function captureComponentAsImage(
  elementId: string,
): Promise<{ dataUrl: string; width: number; height: number } | null> {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      console.error("Element not found for capture:", elementId)
      return null
    }

    console.log("Waiting for images to load within the component for PDF capture...")
    await waitForImagesToLoad(element) // Use the enhanced wait function
    // Add a small extra delay, sometimes helps with complex rendering after image loads
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log("Image loading wait complete for PDF capture.")

    const scrollWidth = element.scrollWidth
    const scrollHeight = element.scrollHeight

    const EXCLUDE_BOTTOM_PX = 0 // Set to 0 if no bottom part needs exclusion, or adjust as needed
    const captureHeight = Math.max(0, scrollHeight - EXCLUDE_BOTTOM_PX)

    console.log("Element dimensions for html2canvas:", {
      targetElementId: elementId,
      scrollWidth,
      originalScrollHeight: scrollHeight,
      captureHeight,
    })

    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff", // Explicit background
      scale: Math.min(window.devicePixelRatio || 1, 1.5), // Cap scale to 1.5x for balance
      useCORS: true, // Important for external images
      allowTaint: false, // Keep false and rely on CORS
      logging: true,
      foreignObjectRendering: true, // Crucial for next/image sometimes
      imageTimeout: 30000, // 30s timeout for images html2canvas might re-fetch
      width: scrollWidth,
      height: captureHeight,
      windowWidth: scrollWidth,
      windowHeight: captureHeight,
      x: 0,
      y: 0,
      scrollX: -element.scrollLeft, // Account for internal scroll of the element
      scrollY: -element.scrollTop,
      removeContainer: true, // Clean up the cloned container html2canvas creates
      onclone: (clonedDoc) => {
        // Post-clone modifications if needed
        // Example: If next/image uses specific classes that hide things during clone
        // const images = Array.from(clonedDoc.querySelectorAll('img'));
        // images.forEach(img => {
        //   // Force styles if next/image is doing something tricky
        //   img.style.opacity = '1';
        //   img.style.visibility = 'visible';
        // });
      },
    })

    console.log("Canvas dimensions after html2canvas:", { width: canvas.width, height: canvas.height })

    if (canvas.width === 0 || canvas.height === 0) {
      console.error("html2canvas returned a zero-dimension canvas.")
      return null
    }

    return {
      dataUrl: canvas.toDataURL("image/png", 0.92), // PNG with slight compression
      width: canvas.width,
      height: canvas.height,
    }
  } catch (error) {
    console.error(`Failed to capture component '${elementId}' with html2canvas:`, error)
    return null
  }
}

// Function to calculate dimensions to fit image in page while maintaining aspect ratio
function calculateFitDimensions(
  imageWidth: number,
  imageHeight: number,
  pageWidth: number,
  pageHeight: number,
  margin = 10, // mm
): { width: number; height: number; x: number; y: number } {
  const availableWidth = pageWidth - margin * 2
  const availableHeight = pageHeight - margin * 2

  const imageAspectRatio = imageWidth / imageHeight
  const pageAspectRatio = availableWidth / availableHeight

  let finalWidth: number
  let finalHeight: number

  if (imageAspectRatio > pageAspectRatio) {
    finalWidth = availableWidth
    finalHeight = finalWidth / imageAspectRatio
  } else {
    finalHeight = availableHeight
    finalWidth = finalHeight * imageAspectRatio
  }

  const x = (pageWidth - finalWidth) / 2
  const y = margin // Align to top margin, instead of centering vertically

  return { width: finalWidth, height: finalHeight, x, y }
}

// Fallback function for text-based roadmap visualization
function addFallbackRoadmapVisualization(doc: jsPDF, books: BookNode[]): void {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20

  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text("Learning Roadmap (Fallback)", pageWidth / 2, margin + 10, { align: "center" })

  let yPos = margin + 30
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")

  books.forEach((book) => {
    if (yPos > pageHeight - margin - 10) {
      // Adjusted overflow check
      doc.addPage()
      yPos = margin
    }
    doc.text(`- ${book.title} (by ${book.author})`, margin, yPos)
    yPos += 7
  })
}

export async function generateRoadmapPDF(
  books: BookNode[],
  title = "Roadmap",
  componentElementId?: string,
): Promise<void> {
  let doc: jsPDF

  if (componentElementId) {
    console.log("Attempting to capture component for PDF:", componentElementId)
    const componentCapture = await captureComponentAsImage(componentElementId)
    if (componentCapture && componentCapture.dataUrl && componentCapture.width > 0 && componentCapture.height > 0) {
      try {
        const imageAspectRatio = componentCapture.width / componentCapture.height
        const MAX_PDF_PAGE_WIDTH_MM = 400
        const MAX_PDF_PAGE_HEIGHT_MM = 300

        let pdfPageWidth = Math.min(MAX_PDF_PAGE_WIDTH_MM, componentCapture.width / 4) // Adjusted heuristic
        let pdfPageHeight = pdfPageWidth / imageAspectRatio

        if (pdfPageHeight > MAX_PDF_PAGE_HEIGHT_MM) {
          pdfPageHeight = MAX_PDF_PAGE_HEIGHT_MM
          pdfPageWidth = pdfPageHeight * imageAspectRatio
        }
        if (pdfPageWidth > MAX_PDF_PAGE_WIDTH_MM) {
          pdfPageWidth = MAX_PDF_PAGE_WIDTH_MM
          pdfPageHeight = pdfPageWidth / imageAspectRatio
        }
        if (pdfPageWidth <= 0 || pdfPageHeight <= 0) {
          // Sanity check
          console.warn("Calculated PDF page dimensions are invalid, defaulting to A4.")
          pdfPageWidth = 297
          pdfPageHeight = 210 // A4 Landscape
        }

        console.log("Calculated PDF Page 1 dimensions (mm):", { width: pdfPageWidth, height: pdfPageHeight })

        doc = new jsPDF({
          orientation: pdfPageWidth > pdfPageHeight ? "landscape" : "portrait",
          unit: "mm",
          format: [pdfPageWidth, pdfPageHeight],
        })
        doc.setFont("helvetica")

        const fitMargin = 5
        const fitDimensions = calculateFitDimensions(
          componentCapture.width,
          componentCapture.height,
          pdfPageWidth,
          pdfPageHeight,
          fitMargin,
        )

        console.log("Roadmap image fit dimensions (mm) on PDF page:", fitDimensions)

        doc.addImage(
          componentCapture.dataUrl,
          "PNG",
          fitDimensions.x,
          fitDimensions.y,
          fitDimensions.width,
          fitDimensions.height,
          undefined, // alias
          "FAST", // compression FAST, MEDIUM, SLOW (might help with large images)
        )
        console.log("Successfully added roadmap image to PDF (Page 1)")
      } catch (error) {
        console.error("Failed to add component image to PDF:", error)
        doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
        doc.setFont("helvetica")
        addFallbackRoadmapVisualization(doc, books)
      }
    } else {
      console.warn("Component capture for PDF failed or yielded empty/invalid image, using fallback.")
      doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
      doc.setFont("helvetica")
      addFallbackRoadmapVisualization(doc, books)
    }
  } else {
    doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
    doc.setFont("helvetica")
    addFallbackRoadmapVisualization(doc, books)
  }

  // Pages 2+: Book Details
  for (let index = 0; index < books.length; index++) {
    const book = books[index]
    doc.addPage("a4", "landscape")
    doc.setFont("helvetica")

    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text(book.title, 20, 20)

    if (book.subtitle) {
      doc.setFontSize(14)
      doc.setFont("helvetica", "italic")
      doc.text(book.subtitle, 20, 30)
    }

    let detailsY = book.subtitle ? 40 : 30
    const fieldX = 20
    const valueX = 60
    const lineHeight = 7 // Further reduced line height for denser info

    doc.setFontSize(10) // Smaller font for details
    doc.setFont("helvetica", "normal")

    const addDetail = (label: string, value: string | number) => {
      const valStr = String(value)
      if (detailsY > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage("a4", "landscape")
        detailsY = 20
      }
      doc.setFont("helvetica", "bold")
      doc.text(label, fieldX, detailsY)
      doc.setFont("helvetica", "normal")
      detailsY = addWrappedText(
        doc,
        valStr,
        valueX,
        detailsY,
        doc.internal.pageSize.getWidth() - valueX - 20,
        lineHeight,
      )
    }

    addDetail("Author:", book.author)
    addDetail("Categories:", book.categories)
    addDetail("Published:", book.published_year)
    addDetail("Pages:", book.num_pages)

    doc.setFont("helvetica", "bold")
    doc.text("Rating:", fieldX, detailsY)
    doc.setFont("helvetica", "normal")
    renderStars(doc, valueX, detailsY, book.average_rating)
    doc.text(`(${book.average_rating.toFixed(1)})`, valueX + 35, detailsY)
    detailsY += lineHeight + 2

    addDetail("ISBN-13:", book.isbn13)
    addDetail("ISBN-10:", book.isbn10)
    detailsY += 2 // Extra space after ISBN

    if (book.prerequisites.length > 0) {
      doc.setFont("helvetica", "bold")
      doc.text("Prerequisites:", fieldX, detailsY)
      detailsY += lineHeight
      doc.setFont("helvetica", "normal")
      book.prerequisites.forEach((prereq) => {
        if (detailsY > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage("a4", "landscape")
          detailsY = 20
        }
        doc.text(`• ${prereq}`, fieldX + 5, detailsY)
        detailsY += lineHeight
      })
    }
    detailsY += 2

    doc.setFont("helvetica", "bold")
    doc.text("Description:", fieldX, detailsY)
    detailsY += lineHeight
    doc.setFont("helvetica", "normal")
    addWrappedText(
      // addWrappedText returns next Y, so no need to increment detailsY after this
      doc,
      book.description,
      fieldX,
      detailsY,
      doc.internal.pageSize.getWidth() - fieldX - 20,
      lineHeight,
    )

    doc.setFontSize(10)
    doc.text(`Page ${index + 2}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10, {
      align: "right",
    })
  }

  doc.save(`${title.replace(/\s+/g, "_")}.pdf`)
  console.log("PDF generation completed.")
}
