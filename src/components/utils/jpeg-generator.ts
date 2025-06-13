import domtoimage from 'dom-to-image'
import type { BookNode } from "@/book/bookNode"

// Calculate the full content dimensions needed to fit all nodes
function calculateFullContentDimensions(books: BookNode[]): { width: number; height: number } {
  if (books.length === 0) return { width: 1200, height: 800 }

  // Build level structure
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

  const levelGroups: { [level: number]: BookNode[] } = {}
  books.forEach((book) => {
    const level = bookLevels.get(book.id) || 1
    if (!levelGroups[level]) levelGroups[level] = []
    levelGroups[level].push(book)
  })

  const totalLevels = Object.keys(levelGroups).length
  const maxBooksInLevel = Math.max(1, ...Object.values(levelGroups).map((levelBooks) => levelBooks.length))

  // Calculate dimensions with generous spacing for full visibility
  const nodeWidth = 320 // Fixed larger width for clear visibility
  const nodeHeight = 140 // Fixed height
  const horizontalGap = 80 // Generous horizontal spacing
  const verticalGap = 100 // Generous vertical spacing
  const headerHeight = 120 // Space for header
  const padding = 100 // Padding around entire content

  // Calculate total dimensions
  const contentWidth = maxBooksInLevel * nodeWidth + (maxBooksInLevel - 1) * horizontalGap
  const contentHeight = totalLevels * nodeHeight + (totalLevels - 1) * verticalGap + headerHeight

  const totalWidth = contentWidth + (padding * 2)
  const totalHeight = contentHeight + (padding * 2)

  console.log("📐 Calculated full content dimensions:", {
    totalLevels,
    maxBooksInLevel,
    contentWidth,
    contentHeight,
    totalWidth,
    totalHeight
  })

  return {
    width: Math.max(1400, totalWidth),
    height: Math.max(900, totalHeight)
  }
}

// Function to temporarily modify element for full capture
function prepareElementForCapture(element: HTMLElement, fullDimensions: { width: number; height: number }) {
  const originalStyles = {
    width: element.style.width,
    height: element.style.height,
    maxWidth: element.style.maxWidth,
    maxHeight: element.style.maxHeight,
    overflow: element.style.overflow,
    transform: element.style.transform,
    position: element.style.position
  }

  // Apply full dimensions
  element.style.width = `${fullDimensions.width}px`
  element.style.height = `${fullDimensions.height}px`
  element.style.maxWidth = 'none'
  element.style.maxHeight = 'none'
  element.style.overflow = 'visible'
  element.style.transform = 'none'
  element.style.position = 'relative'

  // Adjust content area
  const contentArea = element.querySelector('#roadmap-tree-content-area') as HTMLElement
  if (contentArea) {
    const contentOriginalStyles = {
      width: contentArea.style.width,
      height: contentArea.style.height,
      minHeight: contentArea.style.minHeight,
      paddingBottom: contentArea.style.paddingBottom,
      overflow: contentArea.style.overflow
    }

    contentArea.style.width = '100%'
    contentArea.style.height = `${fullDimensions.height - 120}px`
    contentArea.style.minHeight = `${fullDimensions.height - 120}px`
    contentArea.style.paddingBottom = '100px'
    contentArea.style.overflow = 'visible'

    return { originalStyles, contentOriginalStyles, contentArea }
  }

  return { originalStyles, contentOriginalStyles: null, contentArea: null }
}

// Function to restore original styles
function restoreElementStyles(
  element: HTMLElement, 
  styleData: { 
    originalStyles: any; 
    contentOriginalStyles: any; 
    contentArea: HTMLElement | null 
  }
) {
  const { originalStyles, contentOriginalStyles, contentArea } = styleData

  // Restore main element styles
  Object.keys(originalStyles).forEach(key => {
    element.style[key as any] = originalStyles[key] || ''
  })

  // Restore content area styles
  if (contentArea && contentOriginalStyles) {
    Object.keys(contentOriginalStyles).forEach(key => {
      contentArea.style[key as any] = contentOriginalStyles[key] || ''
    })
  }
}

// Function to capture roadmap using dom-to-image
async function captureRoadmapWithDomToImage(
  elementId: string,
  books: BookNode[]
): Promise<{ dataUrl: string; width: number; height: number } | null> {
  try {
    console.log("🔍 Looking for roadmap element...")
    const element = document.getElementById(elementId)
    if (!element) {
      console.error(`❌ Element with ID '${elementId}' not found`)
      return null
    }

    console.log("✅ Element found, calculating full dimensions...")
    const fullDimensions = calculateFullContentDimensions(books)
    console.log("📏 Full dimensions calculated:", fullDimensions)

    console.log("🔧 Preparing element for capture...")
    const styleData = prepareElementForCapture(element, fullDimensions)

    // Wait a moment for layout to settle
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log("📸 Starting dom-to-image capture...")
    
    const dataUrl = await domtoimage.toJpeg(element, {
      quality: 0.9,
      width: fullDimensions.width,
      height: fullDimensions.height,
      bgcolor: '#ffffff',
      style: {
        width: `${fullDimensions.width}px`,
        height: `${fullDimensions.height}px`,
        overflow: 'visible'
      },
      filter: (node) => {
        // Include all nodes, but exclude any problematic elements if needed
        return true
      }
    })

    console.log("✅ Restoring original styles...")
    restoreElementStyles(element, styleData)

    console.log("🖼️ JPEG generated successfully")
    console.log("📊 Image dimensions:", fullDimensions)

    if (!dataUrl || !dataUrl.startsWith('data:image/jpeg;base64,')) {
      console.error("❌ Invalid JPEG data URL format")
      return null
    }

    return {
      dataUrl,
      width: fullDimensions.width,
      height: fullDimensions.height,
    }
  } catch (error) {
    console.error("❌ Failed to capture roadmap with dom-to-image:", error)
    return null
  }
}

// Alternative: Canvas-based approach for better reliability
async function captureRoadmapWithCanvas(
  elementId: string,
  books: BookNode[]
): Promise<{ dataUrl: string; width: number; height: number } | null> {
  try {
    console.log("🎨 Trying canvas-based approach...")
    const element = document.getElementById(elementId)
    if (!element) return null

    const fullDimensions = calculateFullContentDimensions(books)
    const styleData = prepareElementForCapture(element, fullDimensions)

    await new Promise(resolve => setTimeout(resolve, 1000))

    // Create a canvas
    const canvas = document.createElement('canvas')
    canvas.width = fullDimensions.width * 2 // Higher resolution
    canvas.height = fullDimensions.height * 2
    const ctx = canvas.getContext('2d')!

    // Set white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.scale(2, 2) // For higher resolution

    // Try to render element to canvas using dom-to-image as PNG first
    const pngDataUrl = await domtoimage.toPng(element, {
      width: fullDimensions.width,
      height: fullDimensions.height,
      bgcolor: '#ffffff'
    })

    // Create image and draw to canvas
    const img = new Image()
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = pngDataUrl
    })

    ctx.drawImage(img, 0, 0, fullDimensions.width, fullDimensions.height)

    // Convert to JPEG
    const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.9)

    restoreElementStyles(element, styleData)

    return {
      dataUrl: jpegDataUrl,
      width: fullDimensions.width,
      height: fullDimensions.height,
    }
  } catch (error) {
    console.error("❌ Canvas approach failed:", error)
    return null
  }
}

// Main function to generate and download roadmap as JPEG
export async function generateRoadmapJPEG(
  books: BookNode[],
  title = "Roadmap",
  componentElementId = "roadmap-tree-full" // Changed to capture the full container
): Promise<void> {
  console.log("=== 🚀 STARTING ROADMAP JPEG GENERATION (DOM-TO-IMAGE) ===")
  console.log(`📋 Books count: ${books.length}`)
  console.log(`🎯 Target element ID: ${componentElementId}`)

  if (books.length === 0) {
    console.error("❌ No books provided for roadmap generation")
    return
  }

  try {
    // Try dom-to-image first
    let roadmapImage = await captureRoadmapWithDomToImage(componentElementId, books)
    
    // If dom-to-image fails, try canvas approach
    if (!roadmapImage) {
      console.log("🔄 Trying alternative canvas approach...")
      roadmapImage = await captureRoadmapWithCanvas(componentElementId, books)
    }
    
    if (roadmapImage && roadmapImage.dataUrl) {
      console.log("=== ✅ JPEG CAPTURE SUCCESSFUL ===")
      console.log(`📊 Image dimensions: ${roadmapImage.width} x ${roadmapImage.height}`)
      
      // Create download link
      const link = document.createElement('a')
      link.href = roadmapImage.dataUrl
      link.download = `${title.replace(/\s+/g, "_")}_roadmap.jpg`
      link.style.display = 'none'
      
      // Add to DOM, click, and remove
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log(`🎉 JPEG downloaded as: ${link.download}`)
      console.log("=== ✅ ROADMAP JPEG GENERATION COMPLETED ===")
      
    } else {
      console.error("=== ❌ ALL CAPTURE METHODS FAILED ===")
      alert("Failed to capture roadmap image. The roadmap might be too complex or large.")
    }
    
  } catch (error) {
    console.error("=== ❌ ROADMAP JPEG GENERATION ERROR ===", error)
    alert("Error generating roadmap image. Please try again.")
  }
}