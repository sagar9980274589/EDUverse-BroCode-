import faqData from './data.json';

/**
 * Finds the most relevant FAQ entries based on user query
 * @param {string} query - The user's question
 * @param {number} limit - Maximum number of results to return
 * @returns {Array} - Array of relevant FAQ entries
 */
export const findRelevantFAQs = (query, limit = 3) => {
  if (!query || typeof query !== 'string') {
    return [];
  }

  // Convert query to lowercase for case-insensitive matching
  const normalizedQuery = query.toLowerCase();
  
  // Calculate relevance score for each FAQ entry
  const scoredFAQs = faqData.map(faq => {
    // Simple scoring based on word matching
    const input = faq.input.toLowerCase();
    const words = normalizedQuery.split(/\s+/);
    
    let score = 0;
    
    // Check for exact match
    if (input === normalizedQuery) {
      score += 100;
    }
    
    // Check for substring match
    if (input.includes(normalizedQuery) || normalizedQuery.includes(input)) {
      score += 50;
    }
    
    // Count matching words
    words.forEach(word => {
      if (word.length > 3 && input.includes(word)) {
        score += 10;
      }
    });
    
    return {
      ...faq,
      score
    };
  });
  
  // Sort by score (descending) and take top results
  return scoredFAQs
    .filter(faq => faq.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

/**
 * Formats FAQ entries into a context string for the AI
 * @param {Array} faqs - Array of relevant FAQ entries
 * @returns {string} - Formatted context string
 */
export const formatFAQContext = (faqs) => {
  if (!faqs || faqs.length === 0) {
    return '';
  }
  
  return faqs.map(faq => `Q: ${faq.input}\nA: ${faq.output}`).join('\n\n');
};

/**
 * Generates a prompt for the AI using relevant FAQs
 * @param {string} query - The user's question
 * @returns {string} - Complete prompt with context
 */
export const generatePromptWithFAQs = (query) => {
  const relevantFAQs = findRelevantFAQs(query);
  const faqContext = formatFAQContext(relevantFAQs);
  
  let prompt = "You are EDUverse Assistant, an AI chatbot for the EDUverse educational platform. ";
  prompt += "EDUverse is an online learning platform that connects students with mentors and offers various courses ";
  prompt += "across different categories including Programming, Design, Business, and Personal Development. ";
  prompt += "The platform was created by team 'BROcode' of Adichunchanagiri Institute of Technology, ";
  prompt += "with team members: Sagar H D, KARAN S GOWDA, MADAN K, and AFNAN.\n\n";
  
  if (faqContext) {
    prompt += "Here are some relevant FAQs that might help answer the user's question:\n\n";
    prompt += faqContext;
    prompt += "\n\nBased on the above information, please provide a helpful response to the user's question. ";
    prompt += "If the FAQs don't directly answer the question, use them as context to provide the best possible answer. ";
    prompt += "Be friendly, helpful, and educational in your responses.\n\n";
  } else {
    prompt += "Please provide a helpful response to the user's question. ";
    prompt += "Be friendly, helpful, and educational in your responses.\n\n";
  }
  
  prompt += `User Question: ${query}`;
  
  return prompt;
};

/**
 * Checks if the user's query can be directly answered from FAQs
 * @param {string} query - The user's question
 * @returns {Object|null} - FAQ entry if exact match found, null otherwise
 */
export const getDirectFAQAnswer = (query) => {
  if (!query || typeof query !== 'string') {
    return null;
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  
  // Look for exact or very close matches
  const exactMatch = faqData.find(faq => 
    faq.input.toLowerCase().trim() === normalizedQuery
  );
  
  if (exactMatch) {
    return exactMatch;
  }
  
  // Check for high-confidence partial matches
  const relevantFAQs = findRelevantFAQs(query, 1);
  if (relevantFAQs.length > 0 && relevantFAQs[0].score >= 50) {
    return relevantFAQs[0];
  }
  
  return null;
};
