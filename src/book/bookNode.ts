export interface BookNode {
  id: string
  isbn13: number
  isbn10: string
  title: string
  subtitle: string
  author: string
  categories: string
  thumbnail: string
  description: string
  published_year: number
  average_rating: number
  num_pages: number
  prerequisites: number[] //isbn as the prerequisites
}
