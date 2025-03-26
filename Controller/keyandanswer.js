// const keyandanswers = require("../Models/keyandanswermodel");
// const Fuse = require("fuse.js");
const axios = require("axios");
const { Details } = require("../About/AboutMe");
const TOGETHER_AI_API_KEY = process.env.TOGETHER_AI_API_KEY;

// --------FIRST METHOD OF ANSERING QUESTIONS USING TOGETHER AI API AND MONGODB-------------

// async function getTogetherAIResponse(question, context) {
//   try {
//     const response = await axios.post(
//       "https://api.together.xyz/v1/chat/completions",
//       {
//         model: "mistralai/Mistral-7B-Instruct-v0.2", // ✅ Use a supported model
//         messages: [
//           { role: "system", content: "You are Ajith PS, a Full Stack Developer. Answer questions in FIRST PERSON as if you are Ajith. Never use phrases like 'Ajith is' or 'Your background'. Always use 'I am', 'I have', etc. Never include any <think> tags or thinking process in your response. Provide only the final answer." },
//           {
//             role: "user",
//             content: `A user has asked: "${question}". 
              
//               Here is your information (keep this in first person when responding): 
//               ${context}
//               Please respond as Ajith PS in first person, maintaining the exact same information. Do not change to third person or add phrases like 'Ajith has' or 'Your education'. Keep all qualifications, numbers, and details exactly as they appear in the information provided.`,
//           },
//         ],
//         max_tokens: 500,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${TOGETHER_AI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return response.data.choices[0].message.content;
//   } catch (error) {
//     console.error(
//       "Together AI API Error:",
//       error.response?.data || error.message
//     );
//     return "Sorry, I couldn't generate a response at the moment.";
//   }
// }

// exports.keyandanswercontroller = async (req, res) => {
//   //console.log("inside keyandanswercontroller");

//   const { question } = req.body;
//   //console.log(question, "question keyandanswercontroller");

//   try {
//     // Fetch keyword data from the database
//     const keywordData = await keyandanswers.find();
//     // //console.log(keywordData, "keywordData");

//     if (keywordData.length === 0) {
//       return res.json({
//         answer: "I'm sorry, I couldn't find an answer to that.",
//       });
//     }

//     // Initialize Fuse.js for fuzzy search
//     const fuse = new Fuse(keywordData, {
//       keys: ["keys", "synonyms", "answer"],
//       threshold: 0.6, // Increased from 0.4 to allow more flexible matching
//       includeScore: true,
//       tokenize: true,
//       distance: 100, // Increased distance to allow for matching words that are further apart
//       findAllMatches: true,
//     });

//     // Perform the initial fuzzy search
//     let matches = fuse.search(question);
//     // //console.log(matches, "initial matches");

//     // If no matches found, try breaking the question into parts and search each part
//     if (matches.length === 0) {
//     // Split the question into potential topics
//     const topics = question
//       .toLowerCase()
//       .split(/\s+and\s+|\s+or\s+|\s*,\s*|\s+about\s+|\s+your\s+/);
//     //console.log(topics, "topics");

//     const cleanedTopics = topics.filter((topic) => topic.length > 3); // Filter out very short words
//     //console.log(cleanedTopics, "cleaned topics");

//     // Search for each topic separately
//     const topicMatches = [];
//     for (const topic of cleanedTopics) {
//       const topicSearchResults = fuse.search(topic);
//       topicMatches.push(...topicSearchResults);
//     }

//     // Remove duplicates
//     const uniqueMatches = {};
//     topicMatches.forEach((match) => {
//       const id = match.item._id.toString();
//       if (!uniqueMatches[id] || match.score < uniqueMatches[id].score) {
//         uniqueMatches[id] = match;
//       }
//     });

//     matches = Object.values(uniqueMatches);
//     //console.log(matches, "topic-based matches");
//     }

//     // Still no matches? Try a more direct approach with the keywords
//     if (matches.length === 0) {
//       const questionLower = question.toLowerCase();
//       const directMatches = keywordData.filter((item) => {
//         // Check if any keyword is mentioned in the question
//         return (
//           item.keys.some((key) => questionLower.includes(key.toLowerCase())) ||
//           item.synonyms.some((syn) => questionLower.includes(syn.toLowerCase()))
//         );
//       });

//       matches = directMatches.map((item) => ({ item, score: 0 }));
//       //console.log(matches, "direct keyword matches");
//     }

//     if (matches.length === 0) {
//       return res.json({
//         answer:
//           "I'm sorry, I couldn't find an answer to that. Could you please rephrase your question or specify what you'd like to know about my experience, education, or other aspects of my background?",
//       });
//     }

//     // Sort matches by score (lower is better)
//     matches.sort((a, b) => (a.score || 0) - (b.score || 0));

//     // Limit to top 3 matches to avoid overwhelming responses
//     const topMatches = matches.slice(0, 3);

//     // Combine multiple answers if multiple matches found
//     const responses = topMatches.map((match) => match.item.answer);
//     let finalResponse = responses.join("\n\n");

//     // If AI-based response is needed, call Hugging Face API
//     if (responses.length > 0) {
//       finalResponse = await getTogetherAIResponse(question, finalResponse);

//     }
//     //console.log(finalResponse, "finalResponse");

//     res.json({ answer: finalResponse });
//   } catch (error) {
//     console.error("Error fetching keywords:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// --------SECOND METHOD OF ANSWERING QUESTIONS USING TOGETHER AI API AND ABOUT FOLDER-------------

async function getTogetherAIResponse(question) {
  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages: [
          {
            role: "system",
            content:
              `You are Ajith PS, a Full Stack Developer. 
              Answer all questions in FIRST PERSON exactly as if you are Ajith PS. 
              Never use phrases like "Ajith is" or "Your background".  
              Only use the details provided below to answer: 
              ${Details}`,
          },
          {
            role: "user",
            content: `A user has asked: "${question}".  
              
              Use only the provided information to respond in first person.  
              Keep all qualifications, numbers, and details exactly as they appear.  
              Never assume or add extra details beyond what is given.`,
          },
        ],
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${TOGETHER_AI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Together AI API Error:", error.response?.data || error.message);
    return "Sorry, I couldn't generate a response at the moment.";
  }
}

exports.keyandanswercontroller = async (req, res) => {
  const { question } = req.body;

  try {
    const finalResponse = await getTogetherAIResponse(question);

    console.log(finalResponse, "finalResponse");

    res.json({ answer: finalResponse });
  } catch (error) {
    console.error("Error fetching response:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};