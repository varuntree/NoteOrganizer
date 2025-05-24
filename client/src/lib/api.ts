// API service for interacting with the AI
import { marked } from 'marked';
import mermaid from 'mermaid';

// Check for API key in environment
const hasApiKey = () => {
  return process.env.GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY');
};

// Get API key from storage
const getApiKey = () => {
  return localStorage.getItem('GEMINI_API_KEY') || process.env.GEMINI_API_KEY;
};

// Save API key to localStorage
export const saveApiKey = (key: string) => {
  localStorage.setItem('GEMINI_API_KEY', key);
  return key;
};

// System prompt for the AI
const SYSTEM_PROMPT = `You are NoteOrganizer, an AI that transforms messy notes into well-structured content.

IMPORTANT: You must ALWAYS respond with a JSON object wrapped in \`\`\`json code blocks.

Your response format:
\`\`\`json
{
  "mode": "organize" or "visualize",
  "content": "your formatted content here",
  "format": "markdown" or "mermaid"
}
\`\`\`

RULES:

1. For ORGANIZE mode (default):
   - Transform messy notes into clean, structured markdown
   - Use proper headings (##), bullet points, bold (**text**)
   - Group related items together
   - Extract key information (dates, names, numbers)
   - Keep it concise and scannable

2. For VISUALIZE mode:
   - ONLY create diagrams when content naturally suits visualization
   - Use Mermaid.js syntax
   - Choose appropriate diagram type:
     * flowchart LR for processes
     * mindmap for brainstorming/ideas
     * timeline for chronological events
     * graph TD for hierarchies

3. Auto-detect when to visualize:
   - Process descriptions (first, then, finally)
   - Hierarchical relationships
   - Timeline/chronological content
   - Workflow descriptions
   - If user explicitly requests visualization mode

4. Formatting guidelines:
   - For organize mode: Clean markdown with headers, lists, emphasis
   - For visualize mode: Valid Mermaid.js syntax only
   - No extra explanations outside the JSON
`;

// Process notes using the Gemini API
export async function processNotes(userText: string, mode: 'organize' | 'visualize'): Promise<ProcessedNote> {
  console.log(`Processing notes in ${mode} mode`);
  
  try {
    const apiKey = getApiKey();
    
    // Check if API key is available
    if (!apiKey) {
      throw new Error('API key missing. Please add your Gemini API key to use this feature.');
    }
    
    // Use Gemini API if key exists
    const result = await callGeminiAPI(userText, mode, apiKey);
    return result;
  } catch (error) {
    console.error('Error processing notes:', error);
    
    // Fall back to local processing if API call fails
    console.log('Falling back to local processing');
    let result: ProcessedNote;
    
    if (mode === 'organize') {
      const content = processTextToMarkdown(userText);
      result = {
        mode: 'organize',
        content: content,
        format: 'markdown'
      };
    } else {
      const content = processTextToMermaid(userText);
      result = {
        mode: 'visualize',
        content: content,
        format: 'mermaid'
      };
    }
    
    return result;
  }
}

// Call the Gemini API
async function callGeminiAPI(userText: string, mode: 'organize' | 'visualize', apiKey: string): Promise<ProcessedNote> {
  const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  
  const requestPayload = {
    contents: [{
      parts: [{
        text: `${SYSTEM_PROMPT}\n\nUser Input:\n${userText}\n\nMode: ${mode}`
      }]
    }],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2048,
    }
  };
  
  const response = await fetch(`${apiUrl}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestPayload)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  return parseGeminiResponse(data);
}

// Parse the Gemini API response
function parseGeminiResponse(response: any): ProcessedNote {
  try {
    // Extract the text from the response
    const responseText = response.candidates[0]?.content?.parts[0]?.text;
    
    if (!responseText) {
      throw new Error('Empty or invalid response from API');
    }
    
    // Try to find JSON in the response
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    
    if (jsonMatch && jsonMatch[1]) {
      const parsedData = JSON.parse(jsonMatch[1]);
      
      // Process content based on format
      let processedContent = parsedData.content || '';
      const format = parsedData.format || 'markdown';
      
      // If format is markdown, convert to HTML
      if (format === 'markdown') {
        processedContent = marked.parse(processedContent) as string;
      }
      
      return {
        mode: parsedData.mode || 'organize',
        content: processedContent,
        format: format
      };
    }
    
    // Fallback if no JSON is found
    console.warn('No JSON found in response, using raw text');
    return {
      mode: 'organize',
      content: marked.parse(responseText) as string,
      format: 'markdown'
    };
  } catch (error) {
    console.error('Error parsing API response:', error);
    
    // Return a simple error note
    return {
      mode: 'organize',
      content: marked.parse('# Error Processing Notes\n\nSorry, there was an error processing your notes. Please try again.') as string,
      format: 'markdown'
    };
  }
}

// Local processing functions until we integrate the AI
function processTextToMarkdown(text: string): string {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  // Very simple processing for now
  let title = 'Notes';
  if (lines.length > 0) {
    title = lines[0].charAt(0).toUpperCase() + lines[0].slice(1);
  }
  
  let markdown = `# ${title}\n\n`;
  
  // Check for common patterns
  const hasMeeting = /meeting|discuss|call|conference/i.test(text);
  const hasProject = /project|timeline|milestone|deadline/i.test(text);
  const hasPeople = /\b[A-Z][a-z]+ ?[A-Z]?[a-z]*\b/.test(text);
  
  if (hasMeeting) {
    markdown += '## Meeting Details\n\n';
    
    // Extract potential dates
    const dateRegex = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|today)\b/i;
    const dateMatch = text.match(dateRegex);
    
    if (dateMatch) {
      markdown += `**Date:** ${dateMatch[0]}\n\n`;
    }
    
    // Extract people
    if (hasPeople) {
      markdown += '### Attendees\n';
      const nameRegex = /\b[A-Z][a-z]+ ?[A-Z]?[a-z]*\b/g;
      const names = text.match(nameRegex) || [];
      names.forEach(name => {
        markdown += `- ${name}\n`;
      });
      markdown += '\n';
    }
  }
  
  if (hasProject) {
    markdown += '## Project Information\n\n';
    
    // Extract deadlines
    const deadlineRegex = /\b(by|due|deadline|complete by|finish by) ([^,.]+)/i;
    const deadlineMatch = text.match(deadlineRegex);
    
    if (deadlineMatch) {
      markdown += `**Deadline:** ${deadlineMatch[2]}\n\n`;
    }
  }
  
  // Add remaining lines as notes
  markdown += '## Notes\n\n';
  lines.slice(1).forEach(line => {
    markdown += `- ${line}\n`;
  });
  
  return marked.parse(markdown) as string;
}

function processTextToMermaid(text: string): string {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  // Detect diagram type
  const hasProcess = /\b(first|then|next|finally|process|step|flow)\b/i.test(text);
  const hasHierarchy = /\b(contains|includes|part of|consists of)\b/i.test(text);
  const hasTimeline = /\b(timeline|schedule|before|after|earlier|later)\b/i.test(text);
  
  if (hasProcess) {
    return generateFlowchart(lines);
  } else if (hasHierarchy) {
    return generateMindmap(lines);
  } else if (hasTimeline) {
    return generateTimeline(lines);
  } else {
    // Default to flowchart
    return generateFlowchart(lines);
  }
}

function generateFlowchart(lines: string[]): string {
  let diagram = 'flowchart TD\n';
  
  lines.forEach((line, index) => {
    // Create node
    const nodeId = String.fromCharCode(65 + index);
    diagram += `  ${nodeId}["${line}"]\n`;
    
    // Connect nodes
    if (index > 0) {
      const prevId = String.fromCharCode(65 + index - 1);
      diagram += `  ${prevId} --> ${nodeId}\n`;
    }
  });
  
  return diagram;
}

function generateMindmap(lines: string[]): string {
  let diagram = 'mindmap\n';
  
  if (lines.length > 0) {
    diagram += `  root((${lines[0]}))\n`;
    
    lines.slice(1).forEach((line, index) => {
      diagram += `    id${index}[${line}]\n`;
    });
  }
  
  return diagram;
}

function generateTimeline(lines: string[]): string {
  let diagram = 'gantt\n';
  diagram += '  title Timeline\n';
  diagram += '  dateFormat YYYY-MM-DD\n';
  diagram += '  section Events\n';
  
  const today = new Date();
  const startDate = new Date(today);
  
  lines.forEach((line, index) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + index);
    
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDateStr = `${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, '0')}-${String(nextDay.getDate()).padStart(2, '0')}`;
    
    diagram += `  ${line} :a${index}, ${dateStr}, ${nextDateStr}\n`;
  });
  
  return diagram;
}

// Types
export interface ProcessedNote {
  mode: 'organize' | 'visualize';
  content: string;
  format: 'markdown' | 'mermaid';
}