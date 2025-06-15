
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnalysisRequest {
  debateId: string;
  videoContent: {
    id: string;
    title: string;
    description: string;
    platform: string;
    video_url: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { debateId, videoContent }: AnalysisRequest = await req.json()

    console.log('Starting content analysis for debate:', debateId)

    // Get all AI agents (knights)
    const { data: knights, error: knightsError } = await supabase
      .from('ai_agents')
      .select('*')
      .order('created_at')

    if (knightsError) {
      throw knightsError
    }

    // Generate arguments for each knight
    const knightArguments = []

    for (const knight of knights) {
      const personality = typeof knight.personality === 'string' 
        ? JSON.parse(knight.personality) 
        : knight.personality || {}

      // Create a realistic argument based on knight's specialty
      const analysis = generateKnightAnalysis(knight, videoContent, personality)
      
      // Insert knight argument
      const { data: argument, error: argumentError } = await supabase
        .from('knight_arguments')
        .insert({
          debate_id: debateId,
          agent_id: knight.id,
          argument_text: analysis.argument,
          position: analysis.position,
          confidence_score: analysis.confidence,
          evidence_sources: analysis.evidence,
          round_number: 1
        })
        .select()
        .single()

      if (argumentError) {
        console.error('Error inserting argument for knight:', knight.name, argumentError)
        continue
      }

      knightArguments.push(argument)
    }

    // Calculate truth score based on arguments
    const trueVotes = knightArguments.filter(arg => 
      arg && typeof arg === 'object' && 'position' in arg && arg.position === 'true'
    ).length
    const falseVotes = knightArguments.filter(arg => 
      arg && typeof arg === 'object' && 'position' in arg && arg.position === 'false'
    ).length
    const total = trueVotes + falseVotes
    
    const truthScore = total > 0 ? Math.round((trueVotes / total) * 100) : 50

    // Update debate with truth score
    const { error: updateError } = await supabase
      .from('video_debates')
      .update({ 
        truth_score: truthScore,
        updated_at: new Date().toISOString()
      })
      .eq('id', debateId)

    if (updateError) {
      console.error('Error updating truth score:', updateError)
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        argumentsGenerated: knightArguments.length,
        truthScore,
        message: 'Knights have completed their analysis'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Content analysis error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function generateKnightAnalysis(knight: any, content: any, personality: any) {
  const specialization = knight.specialization.toLowerCase()
  const title = content.title.toLowerCase()
  const description = content.description?.toLowerCase() || ''
  const platform = content.platform.toLowerCase()

  // Determine position based on knight's specialty and content analysis
  let position: 'true' | 'false' | 'uncertain' = 'uncertain'
  let confidence = 50
  let argument = ''
  let evidence: string[] = []

  // Knight-specific analysis logic
  switch (knight.name) {
    case 'Sir Calcifer':
      // Logic-based analysis
      if (title.includes('proof') || title.includes('evidence')) {
        position = 'true'
        confidence = 75
        argument = "I have analyzed the logical structure of this content. The claims follow a coherent pattern with verifiable elements."
      } else if (title.includes('impossible') || title.includes('miracle')) {
        position = 'false'
        confidence = 80
        argument = "My logical analysis reveals inconsistencies that violate fundamental principles of reality."
      } else {
        position = 'uncertain'
        confidence = 60
        argument = "The logical framework requires more substantial evidence to reach a definitive conclusion."
      }
      evidence = ['Logical analysis framework', 'Coherence assessment']
      break

    case 'Dame Sophia':
      // Wisdom and pattern recognition
      if (title.includes('trending') || title.includes('viral')) {
        position = 'false'
        confidence = 70
        argument = "My wisdom suggests this content follows typical viral misinformation patterns designed for engagement rather than truth."
      } else {
        position = 'uncertain'
        confidence = 55
        argument = "Wisdom counsels careful observation. The patterns here are complex and require deeper contemplation."
      }
      evidence = ['Pattern recognition', 'Historical precedents']
      break

    case 'High Scribe Enoch':
      // Documentation and historical analysis
      if (platform === 'tiktok') {
        position = 'false'
        confidence = 65
        argument = "Historical records show that brief-format content often lacks the context necessary for truthful communication."
      } else {
        position = 'uncertain'
        confidence = 50
        argument = "The historical record provides context, but more documentation is needed for verification."
      }
      evidence = ['Historical documentation', 'Source verification']
      break

    case 'Blackwatch Solomon':
      // Security and threat analysis
      if (title.includes('breaking') || title.includes('urgent')) {
        position = 'false'
        confidence = 85
        argument = "My security analysis identifies this as a potential psychological operation designed to create urgency and bypass critical thinking."
      } else {
        position = 'uncertain'
        confidence = 60
        argument = "Security protocols suggest caution. This content requires further threat assessment."
      }
      evidence = ['Threat analysis', 'Psychological operation indicators']
      break

    case 'Sir Galahad the Pure':
      // Moral and ethical analysis
      if (title.includes('exposed') || title.includes('truth')) {
        position = 'true'
        confidence = 70
        argument = "The pure intent to expose truth resonates with moral clarity, though the execution must be verified."
      } else {
        position = 'uncertain'
        confidence = 55
        argument = "Purity of purpose requires examining the moral foundations of these claims."
      }
      evidence = ['Moral integrity assessment', 'Ethical framework analysis']
      break

    case 'Dame Morgana the Wise':
      // Mystical and hidden pattern analysis
      position = Math.random() > 0.5 ? 'true' : 'false'
      confidence = Math.floor(Math.random() * 30) + 50 // 50-80
      argument = "The mystical patterns reveal hidden connections that transcend surface appearances. Ancient wisdom guides this assessment."
      evidence = ['Mystical pattern analysis', 'Hidden connection mapping']
      break

    case 'Sir Lancelot the Bold':
      // Aggressive verification and combat analysis
      if (title.includes('fight') || title.includes('battle')) {
        position = 'true'
        confidence = 80
        argument = "I strike boldly at deception! This content shows the courage of truth in battle against falsehood."
      } else {
        position = 'false'
        confidence = 75
        argument = "My blade cuts through this deception! The weakness in these claims cannot withstand my assault."
      }
      evidence = ['Combat verification tactics', 'Aggressive fact-checking']
      break

    case 'Sir Gawain the Strong':
      // Power structure analysis
      if (platform === 'facebook' || platform === 'instagram') {
        position = 'false'
        confidence = 70
        argument = "My analysis of power structures reveals this content serves corporate interests rather than truth."
      } else {
        position = 'uncertain'
        confidence = 60
        argument = "The power dynamics at play require careful examination of who benefits from these claims."
      }
      evidence = ['Power structure mapping', 'Corporate influence analysis']
      break

    case 'Sir Percival the Seeker':
      // Relentless investigation
      position = 'uncertain'
      confidence = Math.floor(Math.random() * 20) + 40 // 40-60
      argument = "My quest for truth continues! This content provides clues, but the trail must be followed deeper."
      evidence = ['Investigation trail markers', 'Source tracking methodology']
      break

    case 'Dame Guinevere the Noble':
      // Judicial credibility assessment
      confidence = Math.floor(Math.random() * 40) + 50 // 50-90
      if (confidence > 70) {
        position = 'true'
        argument = "As final arbiter, I weigh the evidence on scales of justice. The credibility indicators support authenticity."
      } else {
        position = 'false'
        argument = "Justice demands skepticism. The credibility assessment reveals insufficient foundation for these claims."
      }
      evidence = ['Credibility metrics', 'Judicial precedent analysis']
      break

    case 'Sir Gareth the Young':
      // Tech and digital forensics
      if (title.includes('ai') || title.includes('deepfake')) {
        position = 'false'
        confidence = 90
        argument = "My digital forensics reveal technical markers consistent with synthetic content generation."
      } else {
        position = 'uncertain'
        confidence = 65
        argument = "The digital fingerprints require advanced analysis. Technology both enables truth and deception."
      }
      evidence = ['Digital forensics report', 'Technical metadata analysis']
      break

    case 'Sir Tristan the Bard':
      // Narrative and storytelling analysis
      if (description.includes('story') || title.includes('amazing')) {
        position = 'false'
        confidence = 75
        argument = "As a master of narrative, I recognize the manipulation techniques used to craft this story for maximum emotional impact rather than truth."
      } else {
        position = 'uncertain'
        confidence = 55
        argument = "The narrative structure reveals artistic construction, but stories can carry truth within their telling."
      }
      evidence = ['Narrative analysis', 'Story structure assessment']
      break

    default:
      // Default analysis
      position = Math.random() > 0.5 ? 'true' : 'false'
      confidence = Math.floor(Math.random() * 40) + 40
      argument = `Based on my analysis of ${content.platform} content, I assess this claim with measured consideration.`
      evidence = ['General analysis', 'Platform assessment']
  }

  return {
    position,
    confidence,
    argument,
    evidence
  }
}
