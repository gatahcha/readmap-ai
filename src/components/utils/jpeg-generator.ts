import type { BookNode } from "@/book/bookNode"

// Check if browser supports screenshot API
function supportsScreenCapture(): boolean {
  return 'getDisplayMedia' in navigator.mediaDevices
}

// Method 1: Use native browser screenshot API (Chrome/Edge) - FIXED
export async function captureScreenshot(title: string = "Roadmap"): Promise<void> {
  try {
    console.log("📸 Starting native screenshot capture...")
    
    if (!supportsScreenCapture()) {
      throw new Error("Browser doesn't support screen capture API")
    }

    // Request screen capture with proper typing
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      } as MediaTrackConstraints,
      audio: false
    })

    const video = document.createElement('video')
    video.srcObject = stream
    video.play()

    // Wait for video to load
    await new Promise((resolve) => {
      video.onloadedmetadata = resolve
    })

    // Create canvas and capture frame
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(video, 0, 0)

    // Stop the stream
    stream.getTracks().forEach(track => track.stop())

    // Download the image
    const dataUrl = canvas.toDataURL('image/png', 0.9)
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `${title.replace(/\s+/g, "_")}_screenshot.png`
    link.click()

    console.log("✅ Screenshot captured successfully!")

  } catch (error) {
    console.error("❌ Native screenshot failed:", error)
    throw error
  }
}

// Method 2: Guide user to take manual screenshot
export function guidedScreenshot(title: string = "Roadmap"): void {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const isWindows = navigator.platform.toUpperCase().indexOf('WIN') >= 0
  
  let instructions = "Take a screenshot:\n\n"
  
  if (isMac) {
    instructions += "• Press Cmd + Shift + 4 to select area\n"
    instructions += "• Or press Cmd + Shift + 3 for full screen\n"
    instructions += "• Or press Cmd + Shift + 5 for more options"
  } else if (isWindows) {
    instructions += "• Press Windows + Shift + S to select area\n"
    instructions += "• Or press PrtSc for full screen\n"
    instructions += "• Or use Snipping Tool"
  } else {
    instructions += "• Use your system's screenshot tool\n"
    instructions += "• Or press PrtSc (Print Screen) key"
  }
  
  instructions += "\n\nThe screenshot will be saved to your default location."
  
  alert(instructions)
}

// Method 3: Open in new window optimized for screenshots - FIXED VERSION
export function openScreenshotWindow(
  books: BookNode[],
  title: string = "Roadmap"
): void {
  try {
    console.log("🔗 Opening enhanced screenshot window...")
    
    // Calculate optimal window size
    const screenWidth = window.screen.availWidth
    const screenHeight = window.screen.availHeight
    
    const windowWidth = Math.min(1600, screenWidth * 0.9)
    const windowHeight = Math.min(1200, screenHeight * 0.9)
    
    const left = (screenWidth - windowWidth) / 2
    const top = (screenHeight - windowHeight) / 2
    
    const features = `
      width=${windowWidth},
      height=${windowHeight},
      left=${left},
      top=${top},
      scrollbars=yes,
      resizable=yes,
      toolbar=no,
      menubar=no,
      status=no
    `.replace(/\s/g, '')
    
    const newWindow = window.open('', '_blank', features)
    
    if (!newWindow) {
      alert("Please allow popups and try again")
      return
    }
    
    // Create a complete roadmap recreation instead of copying HTML
    const roadmapHTML = createCompleteRoadmapHTML(books, title, windowWidth, windowHeight)
    
    newWindow.document.write(roadmapHTML)
    newWindow.document.close()
    newWindow.focus()
    
    console.log("✅ Enhanced screenshot window opened!")
    
  } catch (error) {
    console.error("❌ Failed to open screenshot window:", error)
    alert("Failed to open screenshot window. Please try again.")
  }
}

// Create complete roadmap HTML with proper styling
function createCompleteRoadmapHTML(books: BookNode[], title: string, windowWidth: number, windowHeight: number): string {
  // Calculate layout similar to your React component
  const layout = calculateRoadmapLayout(books, windowWidth - 100, windowHeight - 200)
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title} - Screenshot</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: linear-gradient(to bottom, #fff7ed, #fef3c7);
          overflow: auto;
          min-height: 100vh;
        }
        
        .container {
          width: 100%;
          max-width: ${windowWidth - 40}px;
          margin: 20px auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          overflow: visible;
          position: relative;
        }
        
        .header {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid #e2e8f0;
          padding: 16px;
          border-radius: 12px 12px 0 0;
          position: sticky;
          top: 0;
          z-index: 30;
        }
        
        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .title {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
          text-align: center;
          flex: 1;
        }
        
        .content-area {
          position: relative;
          width: 100%;
          height: ${layout.height}px;
          padding-bottom: 100px;
          background: white;
          border-radius: 0 0 12px 12px;
        }
        
        .book-node {
          position: absolute;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
          cursor: pointer;
          overflow: hidden;
          background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
          border: 2px solid #ea580c;
          padding: 16px;
          font-family: inherit;
        }
        
        .book-node:hover {
          transform: scale(1.02);
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }
        
        .node-content {
          display: flex;
          gap: 12px;
          height: 100%;
        }
        
        .book-cover {
          width: 60px;
          height: 80px;
          background: linear-gradient(45deg, #dc2626 0%, #1e40af 100%);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 10px;
          text-align: center;
          flex-shrink: 0;
          line-height: 1.2;
        }
        
        .book-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
        }
        
        .book-title {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          line-height: 1.2;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        
        .book-author {
          font-size: 12px;
          color: #4b5563;
          margin-bottom: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .book-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          color: #6b7280;
        }
        
        .rating {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        
        .star {
          color: #f59e0b;
        }
        
        .connection-line {
          stroke: #94a3b8;
          stroke-width: 2;
          fill: none;
          marker-end: url(#arrowhead);
        }
        
        .instructions {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #1f2937;
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 12px;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          max-width: 200px;
        }
        
        .close-btn {
          position: fixed;
          top: 20px;
          left: 20px;
          background: #ef4444;
          color: white;
          border: none;
          padding: 10px 14px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          z-index: 1000;
          font-weight: 500;
        }
        
        .close-btn:hover {
          background: #dc2626;
        }
      </style>
    </head>
    <body>
      <button class="close-btn" onclick="window.close()">× Close</button>
      <div class="instructions">
        ${navigator.platform.toUpperCase().indexOf('MAC') >= 0 
          ? '📸 Press Cmd+Shift+4<br>to select area<br>for screenshot' 
          : '📸 Press Win+Shift+S<br>to select area<br>for screenshot'}
      </div>
      
      <div class="container">
        <div class="header">
          <div class="header-content">
            <div style="width: 100px;"></div>
            <h1 class="title">${title}</h1>
            <div style="width: 100px;"></div>
          </div>
        </div>
        
        <div class="content-area">
          <svg style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
              </marker>
            </defs>
            ${generateConnections(books, layout.nodes)}
          </svg>
          
          ${generateBookNodes(layout.nodes)}
        </div>
      </div>
    </body>
    </html>
  `
}

// Calculate proper layout for books
function calculateRoadmapLayout(books: BookNode[], availableWidth: number, availableHeight: number) {
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
  const maxBooksInLevel = Math.max(...Object.values(levelGroups).map(books => books.length))

  const nodeWidth = 280
  const nodeHeight = 120
  const horizontalGap = 60
  const verticalGap = 80
  const padding = 80

  const nodes: any[] = []

  Object.entries(levelGroups).forEach(([levelStr, levelBooks]) => {
    const level = parseInt(levelStr)
    const y = padding + (level - 1) * (nodeHeight + verticalGap)
    
    const levelWidth = levelBooks.length * nodeWidth + (levelBooks.length - 1) * horizontalGap
    const startX = padding + (availableWidth - levelWidth) / 2

    levelBooks.forEach((book, index) => {
      const x = startX + index * (nodeWidth + horizontalGap)
      nodes.push({
        book,
        x,
        y,
        width: nodeWidth,
        height: nodeHeight,
        level
      })
    })
  })

  const totalHeight = totalLevels * nodeHeight + (totalLevels - 1) * verticalGap + padding * 2

  return {
    nodes,
    width: availableWidth,
    height: Math.max(availableHeight, totalHeight)
  }
}

// Generate book node HTML
function generateBookNodes(nodes: any[]): string {
  return nodes.map(({ book, x, y, width, height }) => `
    <div class="book-node" style="
      left: ${x}px;
      top: ${y}px;
      width: ${width}px;
      height: ${height}px;
    ">
      <div class="node-content">
        <div class="book-cover">
          BOOK
        </div>
        <div class="book-details">
          <div>
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author}</div>
          </div>
          <div class="book-meta">
            <div class="rating">
              <span class="star">★</span>
              <span>${book.average_rating}</span>
            </div>
            <div>${book.num_pages} pg</div>
          </div>
        </div>
      </div>
    </div>
  `).join('')
}

// Generate connection lines
function generateConnections(books: BookNode[], nodes: any[]): string {
  const connections: string[] = []
  
  books.forEach(book => {
    book.prerequisites.forEach(prereqISBN13 => {
      const prereqBook = books.find(b => b.isbn13 === prereqISBN13)
      if (prereqBook) {
        const sourceNode = nodes.find(n => n.book.id === prereqBook.id)
        const targetNode = nodes.find(n => n.book.id === book.id)
        
        if (sourceNode && targetNode) {
          const sourceX = sourceNode.x + sourceNode.width / 2
          const sourceY = sourceNode.y + sourceNode.height
          const targetX = targetNode.x + targetNode.width / 2
          const targetY = targetNode.y
          
          connections.push(`
            <line class="connection-line" 
                  x1="${sourceX}" y1="${sourceY}" 
                  x2="${targetX}" y2="${targetY}" />
          `)
        }
      }
    })
  })
  
  return connections.join('')
}

// Method 4: Copy roadmap to clipboard (if supported)
export async function copyToClipboard(): Promise<void> {
  try {
    console.log("📋 Attempting to copy roadmap to clipboard...")
    
    if (!navigator.clipboard) {
      throw new Error("Clipboard API not supported")
    }
    
    const roadmapElement = document.getElementById('roadmap-tree-full')
    if (!roadmapElement) {
      throw new Error("Roadmap element not found")
    }
    
    // Try to copy as image using canvas
    const html2canvas = await import('html2canvas')
    const canvas = await html2canvas.default(roadmapElement, {
      backgroundColor: '#ffffff',
      scale: 1,
      useCORS: true
    })
    
    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/png', 0.9)
    })
    
    // Copy to clipboard
    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob
      })
    ])
    
    alert("Roadmap copied to clipboard! You can paste it into any image editor.")
    console.log("✅ Copied to clipboard successfully!")
    
  } catch (error) {
    console.error("❌ Copy to clipboard failed:", error)
    alert("Copy to clipboard failed. Please use the manual screenshot option.")
  }
}

// Main function - Multiple options for user
export async function downloadRoadmapScreenshot(
  books: BookNode[],
  title: string = "Roadmap #1"
): Promise<void> {
  console.log("🎯 Starting user screenshot options...")
  
  // Show user options
  const options = [
    "1. Open optimized window for screenshots (Recommended)",
    "2. Show screenshot instructions",
    "3. Try native browser capture (Chrome/Edge)",
    "4. Copy to clipboard (if supported)"
  ].join('\n')
  
  const choice = prompt(`Choose screenshot method:\n\n${options}\n\nEnter 1, 2, 3, or 4:`)
  
  switch (choice) {
    case '1':
      openScreenshotWindow(books, title)
      break
      
    case '2':
      guidedScreenshot(title)
      break
      
    case '3':
      try {
        await captureScreenshot(title)
      } catch (error) {
        console.error("Native capture failed:", error)
        guidedScreenshot(title)
      }
      break
      
    case '4':
      await copyToClipboard()
      break
      
    default:
      // Default to option 1
      openScreenshotWindow(books, title)
  }
}