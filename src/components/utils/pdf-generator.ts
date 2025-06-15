import jsPDF from "jspdf"
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

// Helper function to add centered wrapped text
function addCenteredWrappedText(doc: jsPDF, text: string, y: number, maxWidth: number, lineHeight: number): number {
  const pageWidth = doc.internal.pageSize.getWidth()
  const words = text.split(" ")
  let line = ""
  let currentY = y
  const lines: string[] = []

  // First, calculate all lines
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " "
    const testWidth = (doc.getStringUnitWidth(testLine) * doc.getFontSize()) / doc.internal.scaleFactor

    if (testWidth > maxWidth && i > 0) {
      lines.push(line.trim())
      line = words[i] + " "
    } else {
      line = testLine
    }
  }
  lines.push(line.trim())

  // Then render each line centered
  lines.forEach(line => {
    doc.text(line, pageWidth / 2, currentY, { align: "center" })
    currentY += lineHeight
  })

  return currentY
}

// Function to calculate optimal font size for title
function calculateOptimalFontSize(doc: jsPDF, text: string, maxWidth: number, maxFontSize: number, minFontSize: number): number {
  let fontSize = maxFontSize
  
  while (fontSize >= minFontSize) {
    doc.setFontSize(fontSize)
    const textWidth = (doc.getStringUnitWidth(text) * fontSize) / doc.internal.scaleFactor
    
    if (textWidth <= maxWidth) {
      return fontSize
    }
    
    fontSize -= 2
  }
  
  return minFontSize
}

// Function to render rating as simple number
function renderRating(doc: jsPDF, x: number, y: number, rating: number): void {
  doc.setTextColor(75, 85, 99)
  doc.text(`${rating.toFixed(1)}/5.0`, x, y)
}

// Create cover page for the roadmap
function createCoverPage(doc: jsPDF, title: string, books: BookNode[]): void {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  
  // Background gradient effect (simulated with rectangles)
  doc.setFillColor(255, 247, 237) // Orange 50
  doc.rect(0, 0, pageWidth, pageHeight, 'F')
  
  // Title section with proper handling for long titles
  const maxTitleWidth = pageWidth - 40 // 20mm margin on each side
  const maxFontSize = 32
  const minFontSize = 18
  
  // Calculate optimal font size based on title length
  doc.setFont("helvetica", "bold")
  const optimalFontSize = calculateOptimalFontSize(doc, title, maxTitleWidth, maxFontSize, minFontSize)
  
  doc.setFontSize(optimalFontSize)
  doc.setTextColor(31, 41, 55) // Gray 800
  
  // Use wrapped text if title is still too long even at minimum font size
  if (optimalFontSize === minFontSize) {
    const titleLineHeight = optimalFontSize * 1.2
    const titleEndY = addCenteredWrappedText(doc, title, 60, maxTitleWidth, titleLineHeight)
    
    // Adjust subtitle position based on where title ended
    doc.setFontSize(16)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(107, 114, 128) // Gray 500
    doc.text("Your Learning Journey", pageWidth / 2, titleEndY + 10, { align: "center" })
  } else {
    // Title fits on one line
    doc.text(title, pageWidth / 2, 60, { align: "center" })
    
    // Subtitle
    doc.setFontSize(16)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(107, 114, 128) // Gray 500
    doc.text("Your Learning Journey", pageWidth / 2, 80, { align: "center" })
  }
  
  // Summary box
  const boxWidth = 160
  const boxHeight = 80
  const boxX = (pageWidth - boxWidth) / 2
  const boxY = 110
  
  // Box background
  doc.setFillColor(255, 255, 255)
  doc.setDrawColor(234, 88, 12) // Orange 600
  doc.setLineWidth(2)
  doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 8, 8, 'FD')
  
  // Summary content
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(31, 41, 55)
  doc.text("Roadmap Summary", pageWidth / 2, boxY + 20, { align: "center" })
  
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text(`Total Books: ${books.length}`, pageWidth / 2, boxY + 35, { align: "center" })
  
  const totalPages = books.reduce((sum, book) => sum + book.num_pages, 0)
  doc.text(`Total Pages: ${totalPages.toLocaleString()}`, pageWidth / 2, boxY + 50, { align: "center" })
  
  const avgRating = books.reduce((sum, book) => sum + book.average_rating, 0) / books.length
  doc.text(`Average Rating: ${avgRating.toFixed(1)}/5.0`, pageWidth / 2, boxY + 65, { align: "center" })
  
  // Categories section
  const categories = [...new Set(books.flatMap(book => book.categories.split(", ")))]
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Categories Covered:", pageWidth / 2, 220, { align: "center" })
  
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  const categoriesText = categories.slice(0, 10).join(" • ")
  addWrappedText(doc, categoriesText, 20, 235, pageWidth - 40, 12)
  
  // Footer
  doc.setFontSize(10)
  doc.setTextColor(107, 114, 128)
  const currentDate = new Date().toLocaleDateString()
  doc.text(`Generated on ${currentDate}`, pageWidth / 2, pageHeight - 20, { align: "center" })
}

// Create table of contents
function createTableOfContents(doc: jsPDF, books: BookNode[]): void {
  doc.addPage("a4", "portrait")
  
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  
  // Title
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(31, 41, 55)
  doc.text("Table of Contents", margin, 30)
  
  // Organize books by level (based on prerequisites)
  const bookLevels = new Map<string, number>()
  const findBookByISBN13 = (isbn13: number) => books.find((book) => book.isbn13 === isbn13)

  const calculateBookLevel = (book: BookNode): number => {
    if (bookLevels.has(book.id)) return bookLevels.get(book.id)!
    if (book.prerequisites.length === 0) {
      bookLevels.set(book.id, 1)
      return 1
    }
    let maxPrereqLevel = 0
    for (const prereqISBN13 of book.prerequisites) {
      const prereqBook = findBookByISBN13(prereqISBN13)
      if (prereqBook) {
        maxPrereqLevel = Math.max(maxPrereqLevel, calculateBookLevel(prereqBook))
      }
    }
    const level = maxPrereqLevel + 1
    bookLevels.set(book.id, level)
    return level
  }

  books.forEach(calculateBookLevel)

  // Group books by level
  const levelGroups: { [level: number]: BookNode[] } = {}
  books.forEach((book) => {
    const level = bookLevels.get(book.id) || 1
    if (!levelGroups[level]) levelGroups[level] = []
    levelGroups[level].push(book)
  })

  let currentY = 50
  const lineHeight = 12
  let pageNumber = 3 // Starting page number for book details

  Object.entries(levelGroups)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .forEach(([levelStr, levelBooks]) => {
      const level = parseInt(levelStr)
      
      // Check if we need a new page
      if (currentY > 250) {
        doc.addPage("a4", "portrait")
        currentY = 30
      }
      
      // Level header
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(234, 88, 12) // Orange 600
      doc.text(`Level ${level} - ${getLevelName(level)}`, margin, currentY)
      currentY += lineHeight + 5
      
      // Books in this level
      levelBooks.forEach((book, _index) => {
        if (currentY > 260) {
          doc.addPage("a4", "portrait")
          currentY = 30
        }
        
        doc.setFontSize(11)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(31, 41, 55)
        
        const title = book.title.length > 50 ? book.title.substring(0, 50) + "..." : book.title
        
        doc.text(`${title}`, margin + 10, currentY)
        doc.text(`${pageNumber}`, pageWidth - margin - 10, currentY, { align: "right" })
        
        currentY += lineHeight
        pageNumber++
      })
      
      currentY += 5 // Extra space between levels
    })
}

// Get level name based on number
function getLevelName(level: number): string {
  const levelNames = {
    1: "Foundations",
    2: "Building Blocks", 
    3: "Intermediate",
    4: "Advanced",
    5: "Specialized",
    6: "Expert",
    7: "Mastery"
  }
  return levelNames[level as keyof typeof levelNames] || `Level ${level}`
}

// Simple page footer with just page number
function addSimpleFooter(doc: jsPDF, pageNumber: number): void {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  
  // Just add page number - no logo
  doc.setFontSize(10)
  doc.setTextColor(107, 114, 128)
  doc.text(`Page ${pageNumber}`, pageWidth - margin, pageHeight - 10, { align: "right" })
}

// Add book details pages - SIMPLIFIED
function addBookDetailsPages(doc: jsPDF, books: BookNode[]): void {
  books.forEach((book, index) => {
    doc.addPage("a4", "portrait")
    doc.setFont("helvetica")

    const margin = 20
    const pageWidth = doc.internal.pageSize.getWidth()
    const contentWidth = pageWidth - (margin * 2)
    let currentY = margin + 10

    // Book header with background
    const headerHeight = book.subtitle ? 30 : 20
    doc.setFillColor(254, 215, 170) // Orange 200
    doc.rect(margin, currentY, contentWidth, headerHeight, 'F')
    
    // Book title with proper wrapping
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(31, 41, 55)
    
    // Check if title fits in one line
    const titleWidth = (doc.getStringUnitWidth(book.title) * 18) / doc.internal.scaleFactor
    
    if (titleWidth > contentWidth - 10) {
      // Title is too long, use wrapped text
      const titleY = addWrappedText(doc, book.title, margin + 5, currentY + 12, contentWidth - 10, 12)
      
      // Adjust header height if needed
      const actualHeaderHeight = titleY - currentY + 5
      
      // Redraw background if needed
      if (actualHeaderHeight > headerHeight) {
        doc.setFillColor(254, 215, 170)
        doc.rect(margin, currentY, contentWidth, actualHeaderHeight, 'F')
        
        // Redraw title
        doc.setFontSize(18)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(31, 41, 55)
        addWrappedText(doc, book.title, margin + 5, currentY + 12, contentWidth - 10, 12)
      }
      
      currentY += actualHeaderHeight + 10
    } else {
      // Title fits on one line
      doc.text(book.title, margin + 5, currentY + 12)
      
      // Subtitle
      if (book.subtitle) {
        doc.setFontSize(12)
        doc.setFont("helvetica", "italic")
        doc.setTextColor(75, 85, 99)
        doc.text(book.subtitle, margin + 5, currentY + 24)
      }
      
      currentY += headerHeight + 10
    }

    // Two column layout for details
    const leftColumnX = margin
    const rightColumnX = pageWidth / 2 + 10
    const columnWidth = (contentWidth / 2) - 10
    
    let leftY = currentY
    let rightY = currentY
    const lineHeight = 7

    // Left column
    doc.setFontSize(10)
    
    // Author
    doc.setFont("helvetica", "bold")
    doc.setTextColor(31, 41, 55)
    doc.text("Author:", leftColumnX, leftY)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(75, 85, 99)
    leftY = addWrappedText(doc, book.author, leftColumnX, leftY + lineHeight, columnWidth, lineHeight)
    leftY += 5

    // Categories
    doc.setFont("helvetica", "bold")
    doc.setTextColor(31, 41, 55)
    doc.text("Categories:", leftColumnX, leftY)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(75, 85, 99)
    leftY = addWrappedText(doc, book.categories, leftColumnX, leftY + lineHeight, columnWidth, lineHeight)
    leftY += 5

    // Published Year
    doc.setFont("helvetica", "bold")
    doc.setTextColor(31, 41, 55)
    doc.text("Published:", leftColumnX, leftY)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(75, 85, 99)
    doc.text(book.published_year.toString(), leftColumnX + 35, leftY)
    leftY += lineHeight + 5

    // Right column
    // Pages
    doc.setFont("helvetica", "bold")
    doc.setTextColor(31, 41, 55)
    doc.text("Pages:", rightColumnX, rightY)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(75, 85, 99)
    doc.text(book.num_pages.toString(), rightColumnX + 25, rightY)
    rightY += lineHeight + 2

    // Rating - SIMPLIFIED to numbers only
    doc.setFont("helvetica", "bold")
    doc.setTextColor(31, 41, 55)
    doc.text("Rating:", rightColumnX, rightY)
    doc.setFont("helvetica", "normal")
    renderRating(doc, rightColumnX + 25, rightY, book.average_rating)
    rightY += lineHeight + 5

    // ISBN
    doc.setFont("helvetica", "bold")
    doc.setTextColor(31, 41, 55)
    doc.text("ISBN-13:", rightColumnX, rightY)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(75, 85, 99)
    doc.text(book.isbn13.toString(), rightColumnX, rightY + lineHeight)
    rightY += lineHeight * 2

    doc.setFont("helvetica", "bold")
    doc.setTextColor(31, 41, 55)
    doc.text("ISBN-10:", rightColumnX, rightY)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(75, 85, 99)
    doc.text(book.isbn10.toString(), rightColumnX, rightY + lineHeight)

    // Prerequisites section
    currentY = Math.max(leftY, rightY) + 10
    if (book.prerequisites.length > 0) {
      doc.setFont("helvetica", "bold")
      doc.setTextColor(31, 41, 55)
      doc.text("Prerequisites:", margin, currentY)
      currentY += lineHeight

      book.prerequisites.forEach((prereqISBN13) => {
        const prereqBook = books.find(b => b.isbn13 === prereqISBN13)
        const prereqTitle = prereqBook ? prereqBook.title : `Book with ISBN: ${prereqISBN13}`
        
        doc.setFont("helvetica", "normal")
        doc.setTextColor(75, 85, 99)
        doc.text(`• ${prereqTitle}`, margin + 5, currentY)
        currentY += lineHeight
      })
      currentY += 5
    }

    // Description section
    doc.setFont("helvetica", "bold")
    doc.setTextColor(31, 41, 55)
    doc.text("Description:", margin, currentY)
    currentY += lineHeight + 2

    doc.setFont("helvetica", "normal")
    doc.setTextColor(75, 85, 99)
    addWrappedText(doc, book.description, margin, currentY, contentWidth, lineHeight)

    // Add simple footer with just page number
    addSimpleFooter(doc, index + 3)
  })
}

// Main function to generate the complete roadmap PDF
export async function generateRoadmapPDF(
  books: BookNode[],
  title = "Learning Roadmap"
): Promise<void> {
  console.log("=== 🚀 STARTING COMPREHENSIVE PDF GENERATION ===")
  console.log(`📋 Books count: ${books.length}`)
  console.log(`📄 Title: ${title}`)

  try {
    // Create PDF document
    const doc = new jsPDF({ 
      orientation: "portrait", 
      unit: "mm", 
      format: "a4" 
    })
    doc.setFont("helvetica")

    // 1. Create cover page
    createCoverPage(doc, title, books)

    // 2. Create table of contents
    createTableOfContents(doc, books)

    // 3. Add book detail pages
    addBookDetailsPages(doc, books)

    // 4. Save the PDF
    const filename = `${title.replace(/\s+/g, "_")}_complete.pdf`
    doc.save(filename)

  } catch (error) {
    console.error("=== ❌ PDF GENERATION FAILED ===", error)
    throw new Error(`Failed to generate PDF: ${error}`)
  }
}