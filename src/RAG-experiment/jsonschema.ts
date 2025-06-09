
export interface bookNode {
    isbn13 : number,
    isbn10 : number,
    title : string,
    subtitle : string,
    author : string,
    categories : string,
    thumbnail : string, // link to the picture
    description : string,
    published_year : number,
    average_rating : number,
    num_page : number,
    prevNode? : bookNode[]
} //isbn13,isbn10,title,subtitle,authors,categories,thumbnail,description,published_year,average_rating,num_pages,ratings_count


