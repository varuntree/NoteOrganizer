// API service for interacting with the AI
import { marked } from 'marked';
import mermaid from 'mermaid';

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

// Mock API response for development (until we add the real API)
export async function processNotes(userText: string, mode: 'organize' | 'visualize'): Promise<ProcessedNote> {
  // Show the processing is happening
  console.log(`Processing notes in ${mode} mode`);
  
  // For now, use local processing functions
  try {
    // This is where the real API call would go
    // For now, we'll use the local implementation
    let result: ProcessedNote;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
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
  } catch (error) {
    console.error('Error processing notes:', error);
    throw error;
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