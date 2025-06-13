export interface bookNode {
  isbn13: number
  isbn10: number
  title: string
  subtitle: string
  author: string
  categories: string
  thumbnail: string
  description: string
  published_year: number
  average_rating: number
  num_pages: number
  embedding: number[] // array of numbers with length 3072
  prerequisites: number[] //isbn as the prerequisites
}
