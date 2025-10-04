import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, type } = await req.json();
    console.log('AI Chat request:', { type, messageCount: messages?.length });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = "You are Synq AI, a helpful assistant for students. You help with academic questions, college admissions, essay writing, study planning, and general student life advice.";

    // Customize prompt based on type
    if (type === 'essay') {
      systemPrompt = "You are Synq AI, specialized in essay review and feedback. Analyze essays for structure, clarity, grammar, and impact. Provide specific, actionable feedback.";
    } else if (type === 'chance') {
      systemPrompt = "You are Synq AI, specialized in college admissions analysis. Analyze student profiles (GPA, test scores, extracurriculars) and provide realistic admissions chances with advice.";
    } else if (type === 'matcher') {
      systemPrompt = "You are Synq AI, specialized in college matching. Based on student preferences (location, major, size, budget), recommend suitable colleges with reasoning.";
    } else if (type === 'timetable') {
      systemPrompt = "You are Synq AI, specialized in creating student timetables. Generate balanced schedules considering study time, breaks, priorities, and well-being.";
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    return new Response(
      JSON.stringify({ 
        content: data.choices[0].message.content 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});