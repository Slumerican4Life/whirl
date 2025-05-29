
export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface HelpArticle {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  category: string;
  page_context: string[];
}
