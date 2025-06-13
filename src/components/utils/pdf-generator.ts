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

// Function to capture React component as image with proper sizing for full roadmap visibility
async function captureRoadmapAsImage(
  elementId: string,
): Promise<{ dataUrl: string; width: number; height: number } | null> {
  try {
    console.log(`🔍 Looking for element with ID: ${elementId}`)
    const element = document.getElementById(elementId)
    if (!element) {
      console.error(`❌ Element with ID '${elementId}' not found`)
      return null
    }

    console.log("✅ Element found, checking dimensions...")
    const rect = element.getBoundingClientRect()
    console.log("📐 Element bounds:", rect)
    
    if (rect.width === 0 || rect.height === 0) {
      console.error("❌ Element has zero dimensions")
      return null
    }

    console.log("⏳ Waiting for images to load...")
    await waitForImagesToLoad(element)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const scrollWidth = Math.max(element.scrollWidth, element.clientWidth, rect.width)
    const scrollHeight = Math.max(element.scrollHeight, element.clientHeight, rect.height)
    
    console.log("📏 Final capture dimensions:", { 
      scrollWidth, 
      scrollHeight,
      clientWidth: element.clientWidth,
      clientHeight: element.clientHeight
    })

    if (scrollWidth === 0 || scrollHeight === 0) {
      console.error("❌ Calculated dimensions are zero")
      return null
    }

    console.log("📸 Starting html2canvas capture...")
    
    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 1, // Reduced scale to avoid memory issues
      useCORS: true,
      allowTaint: false,
      logging: true,
      width: scrollWidth,
      height: scrollHeight,
      windowWidth: scrollWidth,
      windowHeight: scrollHeight,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      foreignObjectRendering: true,
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        console.log("🔄 Cloning element for capture...")
        const clonedElement = clonedDoc.getElementById(elementId)
        if (clonedElement) {
          clonedElement.style.height = `${scrollHeight}px`
          clonedElement.style.width = `${scrollWidth}px`
          clonedElement.style.overflow = 'visible'
          clonedElement.style.position = 'static'
          clonedElement.style.transform = 'none'
          
          // Make sure all content is visible
          const allElements = clonedElement.querySelectorAll('*')
          allElements.forEach((el: Element) => {
            if (el instanceof HTMLElement) {
              el.style.visibility = 'visible'
              el.style.opacity = '1'
            }
          })
          console.log("✅ Cloned element prepared")
        }
      },
    })

    console.log("🎨 Canvas created:", { 
      width: canvas.width, 
      height: canvas.height 
    })

    if (canvas.width === 0 || canvas.height === 0) {
      console.error("❌ Canvas has zero dimensions")
      return null
    }

    const dataUrl = canvas.toDataURL("image/png", 0.8)
    console.log("🖼️ Image generated, data URL length:", dataUrl.length)
    
    // Quick validation of the data URL
    if (!dataUrl.startsWith('data:image/png;base64,')) {
      console.error("❌ Invalid data URL format")
      return null
    }

    return {
      dataUrl,
      width: canvas.width,
      height: canvas.height,
    }
  } catch (error) {
    console.error("❌ Failed to capture roadmap as image:", error)
    return null
  }
}

// Function to create PDF page sized to fit the roadmap image
function createPDFWithRoadmapImage(roadmapImage: { dataUrl: string; width: number; height: number }): jsPDF {
  console.log("📄 Creating PDF with roadmap image...")
  
  const imageAspectRatio = roadmapImage.width / roadmapImage.height
  console.log("📊 Image aspect ratio:", imageAspectRatio)
  
  // Calculate PDF page dimensions - use more conservative sizing
  let pdfWidth: number
  let pdfHeight: number
  
  if (imageAspectRatio > 1.5) {
    // Very wide image - use landscape A3
    pdfWidth = 420 // A3 landscape width
    pdfHeight = 297 // A3 landscape height
  } else if (imageAspectRatio > 1) {
    // Landscape image - use A4 landscape
    pdfWidth = 297 // A4 landscape width  
    pdfHeight = 210 // A4 landscape height
  } else {
    // Portrait or square image - use A4 portrait
    pdfWidth = 210 // A4 portrait width
    pdfHeight = 297 // A4 portrait height
  }
  
  console.log("📏 PDF dimensions:", { width: pdfWidth, height: pdfHeight })
  
  const doc = new jsPDF({
    orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
    unit: "mm",
    format: [pdfWidth, pdfHeight],
  })
  
  // Calculate image placement to fit the page
  const margin = 10 // Reasonable margin
  const availableWidth = pdfWidth - (margin * 2)
  const availableHeight = pdfHeight - (margin * 2)
  
  // Scale image to fit available space while maintaining aspect ratio
  let finalWidth = availableWidth
  let finalHeight = finalWidth / imageAspectRatio
  
  if (finalHeight > availableHeight) {
    finalHeight = availableHeight
    finalWidth = finalHeight * imageAspectRatio
  }
  
  // Center the image
  const x = (pdfWidth - finalWidth) / 2
  const y = (pdfHeight - finalHeight) / 2
  
  console.log("🎯 Image placement:", { 
    x, y, 
    width: finalWidth, 
    height: finalHeight,
    margin 
  })
  
  try {
    doc.addImage(
      roadmapImage.dataUrl,
      "PNG",
      x,
      y,
      finalWidth,
      finalHeight,
      undefined,
      "MEDIUM"
    )
    console.log("✅ Successfully added image to PDF")
  } catch (error) {
    console.error("❌ Failed to add image to PDF:", error)
    // Add a placeholder text instead
    doc.setFontSize(20)
    doc.text("Roadmap Image Failed to Load", pdfWidth / 2, pdfHeight / 2, { align: "center" })
  }
  
  return doc
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
    console.log("=== 🚀 STARTING PDF GENERATION ===")
    console.log(`📋 Books count: ${books.length}`)
    console.log(`🎯 Target element ID: ${componentElementId}`)
    
    // Step 1: Convert roadmap to image
    const roadmapImage = await captureRoadmapAsImage(componentElementId)
    
    if (roadmapImage && roadmapImage.dataUrl) {
      console.log("=== ✅ IMAGE CAPTURE SUCCESSFUL ===")
      console.log(`📊 Image dimensions: ${roadmapImage.width} x ${roadmapImage.height}`)
      
      // Optional: Create a test link to view the captured image
      if (typeof window !== 'undefined') {
        const testLink = document.createElement('a')
        testLink.href = roadmapImage.dataUrl
        testLink.download = 'roadmap-test.png'
        testLink.style.display = 'none'
        document.body.appendChild(testLink)
        console.log("🔗 Test image link created (check browser dev tools)")
        // Uncomment next line to auto-download test image:
        // testLink.click()
        document.body.removeChild(testLink)
      }
      
      // Step 2: Create PDF with the image
      try {
        doc = createPDFWithRoadmapImage(roadmapImage)
        console.log("=== ✅ PDF CREATION SUCCESSFUL ===")
      } catch (error) {
        console.error("=== ❌ PDF CREATION FAILED ===", error)
        // Fallback to text-based roadmap
        doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
        doc.setFont("helvetica")
        doc.setFontSize(16)
        doc.text("Roadmap Image Failed to Load", 148.5, 105, { align: "center" })
        doc.setFontSize(12)
        doc.text("Please check browser console for details", 148.5, 120, { align: "center" })
        addFallbackRoadmapVisualization(doc, books)
      }
    } else {
      console.error("=== ❌ IMAGE CAPTURE FAILED ===")
      // Fallback to text-based roadmap
      doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
      doc.setFont("helvetica")
      doc.setFontSize(16)
      doc.text("Unable to Capture Roadmap Image", 148.5, 105, { align: "center" })
      doc.setFontSize(12)
      doc.text("Using text-based fallback instead", 148.5, 120, { align: "center" })
      addFallbackRoadmapVisualization(doc, books)
    }
  } else {
    console.log("=== ℹ️ NO COMPONENT ID PROVIDED ===")
    // No component ID provided, use fallback
    doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
    doc.setFont("helvetica")
    addFallbackRoadmapVisualization(doc, books)
  }

  console.log("=== 📚 ADDING BOOK DETAIL PAGES ===")
  
  // Step 3: Add book details on subsequent pages
  for (let index = 0; index < books.length; index++) {
    const book = books[index]
    console.log(`📖 Adding page for: ${book.title}`)
    
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
    const lineHeight = 7

    doc.setFontSize(10)
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
    detailsY += 2

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

  console.log("=== 💾 SAVING PDF ===")
  const filename = `${title.replace(/\s+/g, "_")}.pdf`
  doc.save(filename)
  console.log(`🎉 PDF saved as: ${filename}`)
  console.log("=== ✅ PDF GENERATION COMPLETED ===")
}