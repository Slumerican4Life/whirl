
import { HelpArticle } from './types';

export const findRelevantArticles = (
  query: string, 
  currentPath: string, 
  helpArticles: HelpArticle[]
): HelpArticle[] => {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(' ').filter(word => word.length > 2);

  return helpArticles
    .filter(article => {
      // Check if article is relevant to current page
      const isPageRelevant = article.page_context.includes('*') || 
                            article.page_context.includes(currentPath) ||
                            article.page_context.includes('/');

      // Check if query matches keywords or content
      const matchesKeywords = article.keywords.some(keyword => 
        queryWords.some(word => keyword.toLowerCase().includes(word))
      );
      
      const matchesContent = queryWords.some(word => 
        article.title.toLowerCase().includes(word) ||
        article.content.toLowerCase().includes(word)
      );

      return isPageRelevant && (matchesKeywords || matchesContent);
    })
    .sort((a, b) => {
      // Prioritize exact keyword matches
      const aExactMatch = a.keywords.some(keyword => 
        queryWords.some(word => keyword.toLowerCase() === word)
      );
      const bExactMatch = b.keywords.some(keyword => 
        queryWords.some(word => keyword.toLowerCase() === word)
      );
      
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;
      return 0;
    });
};

export const generateResponse = (query: string, helpArticles: HelpArticle[]): string => {
  const currentPath = window.location.pathname;
  const relevantArticles = findRelevantArticles(query, currentPath, helpArticles);

  // Check for contact-related queries
  if (query.toLowerCase().includes('contact') || query.toLowerCase().includes('support') || query.toLowerCase().includes('help')) {
    return "For additional support or complex issues, you can contact our support team directly at **whirlwin.supp@gmail.com**. We typically respond within 24 hours during business hours.\n\nYou can also visit our Contact page for more information about support options and business hours.";
  }

  if (relevantArticles.length === 0) {
    return "I couldn't find specific information about that. Here are some things I can help you with:\n\n• How to upload videos\n• Understanding tokens and voting\n• Battle mechanics\n• Leaderboard system\n• Account management\n• Technical troubleshooting\n\nFor complex issues or additional support, contact us at **whirlwin.supp@gmail.com**";
  }

  if (relevantArticles.length === 1) {
    return relevantArticles[0].content + "\n\nIf you need further assistance, feel free to contact our support team at **whirlwin.supp@gmail.com**";
  }

  // Multiple relevant articles
  let response = "Here's what I found:\n\n";
  relevantArticles.slice(0, 3).forEach((article, index) => {
    response += `**${article.title}**\n${article.content}\n\n`;
  });

  if (relevantArticles.length > 3) {
    response += "I found more related information. Feel free to ask more specific questions or contact support at **whirlwin.supp@gmail.com** for additional help!";
  }

  return response;
};
