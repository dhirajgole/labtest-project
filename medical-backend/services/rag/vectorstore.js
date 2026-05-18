const { ChromaClient } = require("chromadb");

const client = new ChromaClient({
   host: "localhost",
   port: 8000
});

async function getCollection() {

   return await client.getOrCreateCollection({
      name: "medical_rag"
   });
}

module.exports = getCollection;