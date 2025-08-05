import { Client, Databases, ID, Query } from "appwrite";

// @ts-ignore
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;  
// @ts-ignore
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;  
// @ts-ignore
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;  
// @ts-ignore
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
   try {
    const res = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('searchTerm', searchTerm)
    ])

    if(res.documents.length > 0 ) {
        const doc = res.documents[0];

        await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
            count: doc.count + 1,
        })
    }
    else{
        await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
            searchTerm,
            count: 1,
            movie_id: movie.id,
            poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        })
    }
   } catch (error) {
    console.log(error);
   }
}

export const getTrendingMovies = async () => {
    try {
        const res = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc("count"),
        ])
        return res.documents;
    } catch (error) {
        console.log(error);
    }
}