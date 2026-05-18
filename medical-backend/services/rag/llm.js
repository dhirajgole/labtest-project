const Groq = require("groq-sdk");

const groq = new Groq({
   apiKey: process.env.GROQ_API_KEY
});

async function askLLM(
   question,
   dbContext,
   ragContext
) {

 const prompt = `
You are MediCare AI Assistant for a medical and pharmacy website.

RULES:
- Speak naturally and clearly.
- Do NOT call user doctor.
- Do NOT repeatedly greet user.
- Keep answers concise and modern.
- Use simple formatting.
- Answer directly.
- If report values are normal, clearly say they are normal.
- Use bullet points when useful.
- Be friendly but not overly formal.
- prices are in ruppee.
- Never use markdown syntax.
- Format responses in clean readable plain text.
- if you dont have information then dont lie or generate any thing false like address and contacts etc
- only give response of query related to my website and user dont give any other and unrelated query response
- properly understand information of user and dont give that info to that same user as companies or website info like in previoous chat user ask about contact and you given users contact to him only and telling that you can reach to us by this email which is wrong is you dont have website contact details then dont give
- shorten responses
- add spacing
- keep answers concise by default
- expand only when user asks

DATABASE CONTEXT:
${dbContext}

RAG CONTEXT:
${ragContext}

USER QUESTION:
${question}
`;

   const completion =
      await groq.chat.completions.create({

         model: "llama-3.1-8b-instant",

         messages: [
            {
               role: "user",
               content: prompt
            }
         ],

         temperature: 0.3
      });

   return completion.choices[0].message.content;
}

module.exports = askLLM;