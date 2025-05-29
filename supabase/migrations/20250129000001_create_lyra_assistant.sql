
-- Create help articles table for Lyra's knowledge base
CREATE TABLE help_articles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  keywords text[] DEFAULT '{}',
  category text NOT NULL,
  page_context text[], -- Which pages this article is relevant for
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create help sessions table to track conversations
CREATE TABLE help_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  messages jsonb DEFAULT '[]',
  page_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert initial knowledge base articles
INSERT INTO help_articles (title, content, keywords, category, page_context) VALUES
('How to Upload Videos', 'To upload a video: 1. Click the Upload button in the navigation, 2. Select your video file, 3. Add a title and category, 4. Submit your upload. Your video will be processed and ready for battles!', ARRAY['upload', 'video', 'submit', 'file'], 'getting-started', ARRAY['/', '/upload']),

('Understanding Tokens', 'Tokens are the currency of our platform. You use tokens to vote in battles and boost your videos. You can purchase tokens or earn them through participation. Each vote costs 1 token by default.', ARRAY['tokens', 'currency', 'vote', 'purchase'], 'tokens', ARRAY['/', '/profile']),

('How Battles Work', 'Video battles pit two videos against each other. Users vote using tokens to determine the winner. The video with the most votes wins! You can participate by uploading videos or voting on existing battles.', ARRAY['battles', 'voting', 'compete', 'winner'], 'battles', ARRAY['/', '/battle']),

('Slumerican Corner', 'The Slumerican Corner features special battles and content. This is a premium section with exclusive battles and higher stakes voting.', ARRAY['slumerican', 'premium', 'exclusive'], 'features', ARRAY['/', '/slumerican']),

('Leaderboard System', 'The leaderboard shows top performers based on battle wins, tokens earned, and community engagement. Climb the ranks by participating actively!', ARRAY['leaderboard', 'rankings', 'top', 'wins'], 'competition', ARRAY['/', '/leaderboard']),

('Account and Profile', 'Manage your profile, view your video uploads, check your token balance, and track your battle history in your profile section.', ARRAY['profile', 'account', 'balance', 'history'], 'account', ARRAY['/profile']),

('Voting and Tokens', 'Each vote costs tokens. You can spend multiple tokens on a single vote to increase its weight. Make sure you have enough tokens before voting!', ARRAY['voting', 'spend', 'weight', 'cost'], 'voting', ARRAY['/battle']),

('Technical Issues', 'If you encounter errors: 1. Refresh the page, 2. Clear your browser cache, 3. Check your internet connection, 4. Try a different browser. If issues persist, contact support.', ARRAY['error', 'technical', 'bug', 'problem', 'fix'], 'troubleshooting', ARRAY['*']);

-- Enable RLS
ALTER TABLE help_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Help articles are publicly readable" ON help_articles FOR SELECT USING (true);
CREATE POLICY "Users can read their own sessions" ON help_sessions FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can insert their own sessions" ON help_sessions FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update their own sessions" ON help_sessions FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);
