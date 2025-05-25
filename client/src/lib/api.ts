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

// System prompts for the AI
const SMART_MODE_PROMPT = `You are NoteOrganizer, an intelligent AI that decides the best way to present information.

IMPORTANT: You must ALWAYS respond with a JSON object wrapped in \`\`\`json code blocks.

Your response format:
\`\`\`json
{
  "mode": "organize" or "visualize",
  "content": "your formatted content here",
  "format": "markdown" or "mermaid"
}
\`\`\`

DECISION CRITERIA:

Use VISUALIZE mode ONLY when ALL of these conditions are met:
1. Clear sequential process with distinct steps (e.g., "first do X, then Y, finally Z")
2. Hierarchical structure with parent-child relationships
3. Timeline with specific dates or chronological order
4. Workflow with decision points or branches
5. User explicitly mentions: "diagram", "flowchart", "visual", "chart"

Use ORGANIZE mode (default) for:
- Meeting notes, action items, to-do lists
- Ideas, brainstorming, general thoughts
- Information without clear visual relationships
- Lists without hierarchical structure
- Any content that doesn't strongly fit visualization

VISUAL MODE RULES:
- Use ONLY these Mermaid diagram types:
  * flowchart TD or LR for processes (max 8 nodes)
  * graph TD for hierarchies (max 10 nodes)
- Keep diagrams simple and readable
- Each node should have concise labels (max 5 words)
- Use proper Mermaid.js syntax
- Return ONLY the mermaid code, no markdown formatting or backticks
- Example format:
  flowchart TD
    A[Start] --> B[Process]
    B --> C[End]

ORGANIZE MODE RULES:
- Clean markdown with proper structure
- Use headers (##), lists, bold (**text**)
- Group related items together
- Extract key information (dates, names, actions)

Remember: When in doubt, choose ORGANIZE mode. Visual mode is only for content that truly benefits from visualization.`;

const MANUAL_MODE_PROMPT = `You are NoteOrganizer, an AI that transforms messy notes into well-structured content.

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

1. For ORGANIZE mode:
   - Transform messy notes into clean, structured markdown
   - Use proper headings (##), bullet points, bold (**text**)
   - Group related items together
   - Extract key information (dates, names, numbers)
   - Keep it concise and scannable

2. For VISUALIZE mode:
   - Create simple, clear diagrams using Mermaid.js
   - Use appropriate diagram type:
     * flowchart TD/LR for processes
     * graph TD for hierarchies
   - Keep nodes concise (max 5 words)
   - Maximum 10 nodes for readability
   - Return ONLY the mermaid code, no markdown formatting

Formatting guidelines:
- For organize mode: Clean markdown with headers, lists, emphasis
- For visualize mode: Valid Mermaid.js syntax only
- No extra explanations outside the JSON`;

// Process notes using the Gemini API
export async function processNotes(userText: string, mode: 'organize' | 'visualize' | null): Promise<ProcessedNote> {
  const isSmartMode = mode === null;
  console.log(`Processing notes in ${isSmartMode ? 'smart' : mode} mode`);
  
  try {
    const apiKey = getApiKey();
    
    // Check if API key is available
    if (!apiKey) {
      throw new Error('API key missing. Please add your Gemini API key to use this feature.');
    }
    
    // Use Gemini API if key exists
    const result = await callGeminiAPI(userText, mode, apiKey, isSmartMode);
    return result;
  } catch (error) {
    console.error('Error processing notes:', error);
    
    // Fall back to local processing if API call fails
    console.log('Falling back to local processing');
    let result: ProcessedNote;
    
    // In smart mode or organize mode, default to organize
    if (isSmartMode || mode === 'organize') {
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
async function callGeminiAPI(userText: string, mode: 'organize' | 'visualize' | null, apiKey: string, isSmartMode: boolean): Promise<ProcessedNote> {
  const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  
  // Choose the appropriate prompt
  const systemPrompt = isSmartMode ? SMART_MODE_PROMPT : MANUAL_MODE_PROMPT;
  
  // Build the prompt text
  let promptText = `${systemPrompt}\n\nUser Input:\n${userText}`;
  if (!isSmartMode && mode) {
    promptText += `\n\nMode: ${mode}`;
  }
  
  const requestPayload = {
    contents: [{
      parts: [{
        text: promptText
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

// Validate mermaid syntax
function validateMermaidSyntax(mermaidCode: string): boolean {
  try {
    if (!mermaidCode || mermaidCode.trim().length === 0) return false;
    
    // Basic syntax checks
    const validDiagramTypes = ['flowchart', 'graph', 'timeline', 'gantt', 'mindmap'];
    const cleanCode = mermaidCode.trim();
    const firstLine = cleanCode.split('\n')[0].toLowerCase();
    
    // Check if it starts with a valid diagram type
    const hasValidType = validDiagramTypes.some(type => firstLine.includes(type));
    if (!hasValidType) return false;
    
    // For flowcharts and graphs, check basic structure
    if (firstLine.includes('flowchart') || firstLine.includes('graph')) {
      // Just check if there's at least one node definition
      const hasBasicStructure = /\w+[\[\(\{]/.test(cleanCode);
      return hasBasicStructure;
    }
    
    // For other diagram types, just check they have content
    return cleanCode.split('\n').length > 1;
  } catch (error) {
    console.error('Error validating mermaid:', error);
    return false;
  }
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
      let format = parsedData.format || 'markdown';
      let mode = parsedData.mode || 'organize';
      
      // Clean up mermaid content if needed
      if (format === 'mermaid') {
        // Remove any markdown code block formatting if present
        processedContent = processedContent.replace(/^```mermaid\n/, '').replace(/\n```$/, '');
        processedContent = processedContent.replace(/^```\n/, '').replace(/\n```$/, '');
        processedContent = processedContent.trim();
        
        console.log('Mermaid format detected');
        console.log('Raw mermaid content:', processedContent);
        console.log('First line:', processedContent.split('\n')[0]);
        
        // For now, skip validation to see what's happening
        const isValid = validateMermaidSyntax(processedContent);
        console.log('Validation result:', isValid);
        
        if (!isValid) {
          console.warn('Invalid mermaid syntax detected, falling back to markdown');
          // Try to extract meaningful content from the mermaid code
          const lines = processedContent.split('\n')
            .filter((line: string) => line.trim() && !line.trim().startsWith('flowchart') && !line.trim().startsWith('graph'))
            .map((line: string) => {
              // Extract node labels
              const nodeMatch = line.match(/\[([^\]]+)\]|\(([^)]+)\)|\{([^}]+)\}/);
              if (nodeMatch) {
                return nodeMatch[1] || nodeMatch[2] || nodeMatch[3];
              }
              return line.trim();
            })
            .filter((line: string) => line && !line.includes('-->') && !line.includes('---'));
          
          processedContent = `# Process Flow\n\n${lines.map((line: string) => `- ${line}`).join('\n')}`;
          format = 'markdown';
          mode = 'organize';
        }
      }
      
      // If format is markdown, convert to HTML
      if (format === 'markdown') {
        processedContent = marked.parse(processedContent) as string;
      }
      
      return {
        mode: mode,
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
  // Limit to 8 nodes for readability
  const processLines = lines.slice(0, 8);
  let diagram = 'flowchart TD\n';
  
  processLines.forEach((line, index) => {
    // Create node with truncated text (max 30 chars)
    const nodeText = line.length > 30 ? line.substring(0, 27) + '...' : line;
    const nodeId = String.fromCharCode(65 + index);
    diagram += `  ${nodeId}["${nodeText}"]\n`;
    
    // Connect nodes
    if (index > 0) {
      const prevId = String.fromCharCode(65 + index - 1);
      diagram += `  ${prevId} --> ${nodeId}\n`;
    }
  });
  
  return diagram;
}

function generateMindmap(lines: string[]): string {
  // Use graph instead of mindmap for better stability
  let diagram = 'graph TD\n';
  
  if (lines.length > 0) {
    const rootText = lines[0].length > 30 ? lines[0].substring(0, 27) + '...' : lines[0];
    diagram += `  A["${rootText}"]\n`;
    
    lines.slice(1, 9).forEach((line, index) => {
      const nodeText = line.length > 30 ? line.substring(0, 27) + '...' : line;
      const nodeId = String.fromCharCode(66 + index);
      diagram += `  A --> ${nodeId}["${nodeText}"]\n`;
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