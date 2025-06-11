"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { Save, MoreHorizontal } from "lucide-react"
import { NetworkBackground } from "@/components/NetworkBackground"
import cn from "@/lib/utils"
import toast, { Toaster } from "react-hot-toast"
import ConfirmDelete from "@/components/dialogs/ConfirmDelete"
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd"
import { useRouter } from "next/navigation"

interface SavedMap {
  id: string
  title: string
  isNew: boolean
}

export default function SavedMapsPage() {
  const [maps, setMaps] = useState<SavedMap[]>([
    { id: "1", title: "Roadmap #1", isNew: true },
    { id: "2", title: "Roadmap #2", isNew: false },
    { id: "3", title: "Roadmap #3", isNew: false },
    { id: "4", title: "Roadmap #4", isNew: false },
  ])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const router = useRouter()

  const handleRename = (id: string, newTitle: string) => {
    setMaps((prev) =>
      prev.map((m) => (m.id === id ? { ...m, title: newTitle } : m))
    )
    toast.success("Renamed successfully!")
  }

  const handleDelete = (id: string) => {
    setMaps((prev) => prev.filter((m) => m.id !== id))
    toast.success("Deleted roadmap!")
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const reordered = [...maps]
    const [removed] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, removed)
    setMaps(reordered)
  }

  return (
    <div className="relative min-h-screen overflow-visible bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Background */}
      <NetworkBackground className="absolute inset-0 z-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-orange-100/30 via-amber-100/30 to-yellow-100/30 pointer-events-none" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 pointer-events-none" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-gradient-to-r from-orange-300 to-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 pointer-events-none" />

      {/* Header */}
      <div className="relative z-20">
        <Header />
      </div>

      {/* Main List */}
      <main className="relative z-10 min-h-screen py-20 px-6 overflow-visible">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900">My Saved Maps</h1>
            <Button
              variant="ghost"
              className="border border-orange-300 text-orange-600 hover:bg-orange-100"
              onClick={() => router.push("/")}
            >
              ← Back to Home
            </Button>
          </div>

          {maps.length === 0 ? (
            <div className="text-center py-32 text-gray-600">
              <Save className="w-12 h-12 mx-auto mb-4 text-orange-400" />
              <p className="text-lg font-medium">No saved maps yet.</p>
              <p className="text-sm text-gray-500">Your roadmaps will appear here.</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="saved-maps">
                {(provided) => (
                  <div
                    className="space-y-16 overflow-visible"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {maps.map((map, index) => (
                      <Draggable key={map.id} draggableId={map.id} index={index}>
                        {(draggableProvided) => (
                          <div
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                            className={cn(
                              "relative overflow-visible bg-white/60 border border-orange-200 rounded-xl p-6 shadow-md backdrop-blur-sm transition-all duration-300",
                              "hover:scale-105 hover:shadow-lg"
                            )}
                          >
                            {editingId === map.id ? (
                              <input
                                className="w-full text-orange-600 font-semibold bg-transparent border border-orange-300 rounded-md px-3 py-1"
                                defaultValue={map.title}
                                autoFocus
                                onBlur={(e) => {
                                  handleRename(map.id, e.target.value)
                                  setEditingId(null)
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleRename(
                                      map.id,
                                      (e.target as HTMLInputElement).value
                                    )
                                    setEditingId(null)
                                  }
                                }}
                              />
                            ) : (
                              <div className="flex justify-between items-center">
                                <div className="text-orange-700 font-semibold">
                                  {map.title}
                                  {map.isNew && (
                                    <span className="ml-2 text-xs font-bold bg-orange-400 text-white px-2 py-0.5 rounded-full">
                                      NEW
                                    </span>
                                  )}
                                </div>
                                <div className="relative z-50">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() =>
                                      setDropdownOpen(
                                        dropdownOpen === map.id ? null : map.id
                                      )
                                    }
                                  >
                                    <MoreHorizontal className="w-5 h-5 text-orange-600" />
                                  </Button>

                                  {dropdownOpen === map.id && (
                                    <div className="absolute right-0 mt-2 w-32 bg-white border border-orange-100 rounded-md shadow-lg text-sm text-left overflow-visible z-50">
                                      <button
                                        onClick={() => {
                                          setEditingId(map.id)
                                          setDropdownOpen(null)
                                        }}
                                        className="w-full text-left px-4 py-2 text-black hover:bg-orange-50"
                                      >
                                        Rename
                                      </button>
                                      <button
                                        onClick={() => {
                                          setDeleteId(map.id)
                                          setDropdownOpen(null)
                                        }}
                                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </main>

      {/* Confirm delete dialog */}
      <ConfirmDelete
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) handleDelete(deleteId)
          setDeleteId(null)
        }}
      />

      {/* Footer */}
      <div className="relative z-20">
        <Footer />
      </div>

      <Toaster position="top-right" />
    </div>
  )
}

