const createEmbedding = require("./embeddings");
const getCollection = require("./vectorstore");

async function retrieveDocuments(query, userId){

   const embedding = await createEmbedding(query);

   const collection = await getCollection();

   const results = await collection.query({
      queryEmbeddings: [embedding],
      nResults: 5
   });

   return results.documents[0] || [];
}

module.exports = retrieveDocuments;