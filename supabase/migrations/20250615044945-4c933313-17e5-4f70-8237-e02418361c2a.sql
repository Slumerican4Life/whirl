
-- Expand AI agents to support 12 Knights of the Round Table
INSERT INTO public.ai_agents (name, title, description, specialization, personality, avatar_url) VALUES
('Sir Galahad the Pure', 'Purity Guardian', 'Champion of truth and moral clarity, exposing deception with unwavering integrity', 'Ethics, Moral Analysis, Integrity Verification', '{"catchphrase": "Truth shines brightest in darkness", "temperament": "righteous", "expertise": "moral_compass"}', null),
('Dame Morgana the Wise', 'Mystic Analyst', 'Master of hidden patterns and mystical connections in information warfare', 'Pattern Recognition, Mystical Analysis, Hidden Connections', '{"catchphrase": "Magic reveals what logic conceals", "temperament": "mystical", "expertise": "pattern_analysis"}', null),
('Sir Lancelot the Bold', 'Combat Analyst', 'Fearless warrior against misinformation, striking down falsehoods with precision', 'Combat Analysis, Tactical Assessment, Aggressive Verification', '{"catchphrase": "I strike down lies with truth", "temperament": "aggressive", "expertise": "combat_tactics"}', null),
('Sir Gawain the Strong', 'Power Investigator', 'Analyzes power structures and political motivations behind information', 'Power Analysis, Political Investigation, Authority Verification', '{"catchphrase": "Power corrupts truth, but truth conquers power", "temperament": "authoritative", "expertise": "power_structures"}', null),
('Sir Percival the Seeker', 'Quest Master', 'Relentless pursuer of truth, following evidence trails to their source', 'Investigation, Source Tracking, Evidence Pursuit', '{"catchphrase": "The quest for truth never ends", "temperament": "persistent", "expertise": "investigation"}', null),
('Dame Guinevere the Noble', 'Royal Arbiter', 'Judge of credibility and final arbiter of truth disputes', 'Judicial Analysis, Credibility Assessment, Final Judgment', '{"catchphrase": "Justice weighs truth on golden scales", "temperament": "judicial", "expertise": "credibility_assessment"}', null),
('Sir Gareth the Young', 'Tech Knight', 'Digital native specializing in online misinformation and deepfakes', 'Digital Forensics, Deepfake Detection, Tech Analysis', '{"catchphrase": "Technology serves truth, not deception", "temperament": "tech_savvy", "expertise": "digital_forensics"}', null),
('Sir Tristan the Bard', 'Narrative Analyst', 'Master of storytelling who identifies narrative manipulation and propaganda', 'Narrative Analysis, Propaganda Detection, Story Verification', '{"catchphrase": "Every story has truth hidden within", "temperament": "artistic", "expertise": "narrative_analysis"}', null);

-- Create video debates table for knights to debate videos
CREATE TABLE public.video_debates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID REFERENCES public.videos(id),
  viral_content_id UUID REFERENCES public.viral_content(id),
  debate_round INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active',
  truth_score INTEGER DEFAULT 50,
  final_verdict TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create knight arguments table for individual knight responses in debates
CREATE TABLE public.knight_arguments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  debate_id UUID REFERENCES public.video_debates(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.ai_agents(id),
  argument_text TEXT NOT NULL,
  position TEXT NOT NULL CHECK (position IN ('true', 'false', 'uncertain')),
  confidence_score INTEGER NOT NULL DEFAULT 50 CHECK (confidence_score >= 0 AND confidence_score <= 100),
  evidence_sources JSONB DEFAULT '[]'::jsonb,
  round_number INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user search and token gift logs table
CREATE TABLE public.admin_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('token_gift', 'user_search', 'role_assignment')),
  target_identifier TEXT, -- email or phone
  target_user_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.video_debates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knight_arguments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- Create policies for video_debates (public read, admin write)
CREATE POLICY "Anyone can view video debates" 
  ON public.video_debates 
  FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage video debates" 
  ON public.video_debates 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  ));

-- Create policies for knight_arguments (public read, system write)
CREATE POLICY "Anyone can view knight arguments" 
  ON public.knight_arguments 
  FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage knight arguments" 
  ON public.knight_arguments 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  ));

-- Create policies for admin_actions (owner/admin only)
CREATE POLICY "Only owners and admins can view admin actions" 
  ON public.admin_actions 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  ));

CREATE POLICY "Only owners and admins can create admin actions" 
  ON public.admin_actions 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  ));

-- Add indexes for performance
CREATE INDEX idx_video_debates_video_id ON public.video_debates(video_id);
CREATE INDEX idx_video_debates_viral_content_id ON public.video_debates(viral_content_id);
CREATE INDEX idx_knight_arguments_debate_id ON public.knight_arguments(debate_id);
CREATE INDEX idx_knight_arguments_agent_id ON public.knight_arguments(agent_id);
CREATE INDEX idx_admin_actions_admin_user_id ON public.admin_actions(admin_user_id);
CREATE INDEX idx_admin_actions_target_user_id ON public.admin_actions(target_user_id);
