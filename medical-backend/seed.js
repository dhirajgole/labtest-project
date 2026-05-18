require("dotenv").config();

const extractPDFText = require("./services/rag/pdfprocessor");
const createEmbedding = require("./services/rag/embeddings");
const getCollection = require("./services/rag/vectorstore");

async function main(){

   const text = await extractPDFText(
      "./uploads/report.pdf"
   );

   const chunks = text.match(/.{1,500}/g);

   const collection = await getCollection();

   for(let i=0;i<chunks.length;i++){

      const embedding = await createEmbedding(chunks[i]);

      await collection.add({
         ids: [`chunk_${i}`],
         documents: [chunks[i]],
         embeddings: [embedding]
      });

      console.log(`Inserted chunk ${i}`);
   }

   console.log("DONE");
}

main();