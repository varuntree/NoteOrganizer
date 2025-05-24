import { marked } from 'marked';

// Function to determine if the text should be visualized
export function shouldVisualize(text: string): boolean {
  const visualizationTriggers = [
    'process', 'steps', 'flow', 'first', 'then', 'finally',
    'hierarchy', 'structure', 'relationship', 'timeline'
  ];
  
  const lowerText = text.toLowerCase();
  
  // Check if any visualization trigger words exist in the text
  return visualizationTriggers.some(trigger => lowerText.includes(trigger));
}

// Function to process text and return organized content as HTML
export function processText(text: string): string {
  if (!text.trim()) return '';
  
  // Analyze the text to determine the type of content
  if (isProjectNotes(text)) {
    return processProjectNotes(text);
  } else if (isMeetingNotes(text)) {
    return processMeetingNotes(text);
  } else {
    // Default processing for general notes
    return processGeneralNotes(text);
  }
}

// Function to generate a Mermaid diagram based on text content
export function generateDiagram(text: string): string {
  if (!text.trim()) return '';
  
  // Determine the type of diagram to generate
  if (containsProcessSteps(text)) {
    return generateFlowchart(text);
  } else if (containsHierarchicalInfo(text)) {
    return generateMindMap(text);
  } else if (containsTimelineEvents(text)) {
    return generateTimeline(text);
  } else {
    // Default to a simple flowchart
    return generateSimpleDiagram(text);
  }
}

// Helper function to check if text contains process steps
function containsProcessSteps(text: string): boolean {
  const lowerText = text.toLowerCase();
  const processKeywords = ['process', 'steps', 'flow', 'first', 'then', 'next', 'finally'];
  
  return processKeywords.some(keyword => lowerText.includes(keyword));
}

// Helper function to check if text contains hierarchical information
function containsHierarchicalInfo(text: string): boolean {
  const lowerText = text.toLowerCase();
  const hierarchyKeywords = ['hierarchy', 'structure', 'contains', 'consists', 'includes'];
  
  return hierarchyKeywords.some(keyword => lowerText.includes(keyword));
}

// Helper function to check if text contains timeline events
function containsTimelineEvents(text: string): boolean {
  const lowerText = text.toLowerCase();
  const timelineKeywords = ['timeline', 'schedule', 'date', 'deadline', 'by', 'on'];
  
  return timelineKeywords.some(keyword => lowerText.includes(keyword));
}

// Helper function to check if text appears to be project notes
function isProjectNotes(text: string): boolean {
  const lowerText = text.toLowerCase();
  const projectKeywords = ['project', 'timeline', 'budget', 'deadline', 'team', 'milestone'];
  
  return projectKeywords.some(keyword => lowerText.includes(keyword));
}

// Helper function to check if text appears to be meeting notes
function isMeetingNotes(text: string): boolean {
  const lowerText = text.toLowerCase();
  const meetingKeywords = ['meeting', 'discussion', 'call', 'attendees', 'participants'];
  
  return meetingKeywords.some(keyword => lowerText.includes(keyword));
}

// Process project notes into structured markdown
function processProjectNotes(text: string): string {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  // Extract potential project name
  let projectName = 'Project';
  const projectLine = lines.find(line => line.toLowerCase().includes('project'));
  if (projectLine) {
    projectName = projectLine.split(' ').slice(0, 3).join(' ');
  }
  
  // Create sections
  let markdown = `# ${projectName} Notes\n\n`;
  
  // Extract people mentioned
  const peopleLines = lines.filter(line => /[A-Z][a-z]+ [A-Z][a-z]+|[A-Z][a-z]+/.test(line));
  if (peopleLines.length > 0) {
    markdown += '## Team Members\n';
    peopleLines.forEach(line => {
      const match = line.match(/([A-Z][a-z]+ [A-Z][a-z]+|[A-Z][a-z]+)/);
      if (match) {
        const person = match[0];
        const role = line.includes('handling') || line.includes('responsible') ? 
          line.split(person)[1].trim() : '';
        markdown += `- **${person}**${role ? ': ' + role : ''}\n`;
      }
    });
    markdown += '\n';
  }
  
  // Extract timeline items
  const timelineLines = lines.filter(line => 
    /deadline|due|by|date|schedule|timeline|friday|monday|tuesday|wednesday|thursday|saturday|sunday|january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec/i.test(line)
  );
  
  if (timelineLines.length > 0) {
    markdown += '## Timeline\n';
    timelineLines.forEach(line => {
      markdown += `- ${line}\n`;
    });
    markdown += '\n';
  }
  
  // Extract budget information
  const budgetLines = lines.filter(line => /budget|\$|cost|price|k|thousand|million/i.test(line));
  if (budgetLines.length > 0) {
    markdown += '## Budget\n';
    budgetLines.forEach(line => {
      markdown += `- ${line}\n`;
    });
    markdown += '\n';
  }
  
  // Add other items as notes
  const otherLines = lines.filter(line => 
    !peopleLines.includes(line) && 
    !timelineLines.includes(line) && 
    !budgetLines.includes(line)
  );
  
  if (otherLines.length > 0) {
    markdown += '## Notes\n';
    otherLines.forEach(line => {
      markdown += `- ${line}\n`;
    });
  }
  
  const result = marked.parse(markdown);
  return typeof result === 'string' ? result : String(result);
}

// Process meeting notes into structured markdown
function processMeetingNotes(text: string): string {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  // Extract meeting title
  let meetingTitle = 'Meeting Notes';
  const meetingLine = lines.find(line => line.toLowerCase().includes('meeting'));
  if (meetingLine) {
    meetingTitle = meetingLine.charAt(0).toUpperCase() + meetingLine.slice(1);
  }
  
  // Create markdown
  let markdown = `# ${meetingTitle}\n\n`;
  
  // Extract attendees
  const attendeeLines = lines.filter(line => /[A-Z][a-z]+ [A-Z][a-z]+|[A-Z][a-z]+/.test(line));
  if (attendeeLines.length > 0) {
    markdown += '## Attendees\n';
    const attendees = attendeeLines
      .map(line => {
        const match = line.match(/([A-Z][a-z]+ [A-Z][a-z]+|[A-Z][a-z]+)/);
        return match ? match[0] : null;
      })
      .filter(Boolean);
    
    attendees.forEach(attendee => {
      markdown += `- ${attendee}\n`;
    });
    markdown += '\n';
  }
  
  // Extract action items and decisions
  const actionLines = lines.filter(line => 
    /need|must|should|todo|to do|action|task|assign/i.test(line)
  );
  
  if (actionLines.length > 0) {
    markdown += '## Action Items\n';
    actionLines.forEach(line => {
      markdown += `- ${line}\n`;
    });
    markdown += '\n';
  }
  
  // Add remaining items as discussion points
  const discussionLines = lines.filter(line => 
    !attendeeLines.includes(line) && 
    !actionLines.includes(line)
  );
  
  if (discussionLines.length > 0) {
    markdown += '## Discussion Points\n';
    discussionLines.forEach(line => {
      markdown += `- ${line}\n`;
    });
  }
  
  const result = marked.parse(markdown);
  return typeof result === 'string' ? result : String(result);
}

// Process general notes into structured markdown
function processGeneralNotes(text: string): string {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  // Determine title based on first line or content
  let title = 'Notes';
  if (lines.length > 0) {
    title = lines[0].charAt(0).toUpperCase() + lines[0].slice(1);
  }
  
  // Create markdown with a title and bullet points
  let markdown = `# ${title}\n\n`;
  
  // Group similar items
  const categories: Record<string, string[]> = {};
  
  lines.forEach((line, index) => {
    if (index === 0) return; // Skip the title line
    
    let categoryAssigned = false;
    
    // Try to find a category for this line
    for (const key of Object.keys(categories)) {
      const keyWords = key.toLowerCase().split(' ');
      const lineWords = line.toLowerCase().split(' ');
      
      // Check if any words match between the line and existing categories
      const hasCommonWords = keyWords.some(word => 
        lineWords.includes(word) && word.length > 3
      );
      
      if (hasCommonWords) {
        categories[key].push(line);
        categoryAssigned = true;
        break;
      }
    }
    
    // If no category matched, create a new one based on the first few words
    if (!categoryAssigned) {
      const newCategory = line.split(' ').slice(0, 2).join(' ');
      categories[newCategory] = [line];
    }
  });
  
  // Convert categories to markdown sections
  for (const [category, items] of Object.entries(categories)) {
    if (items.length > 0) {
      markdown += `## ${category.charAt(0).toUpperCase() + category.slice(1)}\n`;
      items.forEach(item => {
        markdown += `- ${item}\n`;
      });
      markdown += '\n';
    }
  }
  
  const result = marked.parse(markdown);
  return typeof result === 'string' ? result : String(result);
}

// Generate a simple flowchart diagram
function generateSimpleDiagram(text: string): string {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  let mermaidCode = 'graph TD\n';
  
  // Create a node for each line
  lines.forEach((line, index) => {
    const nodeId = String.fromCharCode(65 + index);
    const label = line.length > 20 ? `${line.substring(0, 20)}...` : line;
    mermaidCode += `  ${nodeId}["${label}"]\n`;
    
    // Connect the nodes in sequence
    if (index > 0) {
      const prevNodeId = String.fromCharCode(65 + index - 1);
      mermaidCode += `  ${prevNodeId} --> ${nodeId}\n`;
    }
  });
  
  return mermaidCode;
}

// Generate a flowchart for process steps
function generateFlowchart(text: string): string {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  let mermaidCode = 'graph TD\n';
  
  // Title node
  mermaidCode += `  A[${lines[0]}]\n`;
  
  // Process steps
  lines.slice(1).forEach((line, index) => {
    const nodeId = String.fromCharCode(66 + index);
    mermaidCode += `  ${nodeId}["${line}"]\n`;
    
    // Connect to title node or previous step
    if (index === 0) {
      mermaidCode += `  A --> ${nodeId}\n`;
    } else {
      const prevNodeId = String.fromCharCode(65 + index);
      mermaidCode += `  ${prevNodeId} --> ${nodeId}\n`;
    }
  });
  
  return mermaidCode;
}

// Generate a mind map for hierarchical information
function generateMindMap(text: string): string {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  let mermaidCode = 'mindmap\n';
  
  // Root node
  mermaidCode += `  root(${lines[0]})\n`;
  
  // Group lines into categories
  const categories: Record<string, string[]> = {};
  
  lines.slice(1).forEach(line => {
    const lowerLine = line.toLowerCase();
    
    // Try to find a category
    let category = 'General';
    for (const cat of ['team', 'budget', 'timeline', 'tasks', 'goals']) {
      if (lowerLine.includes(cat)) {
        category = cat.charAt(0).toUpperCase() + cat.slice(1);
        break;
      }
    }
    
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(line);
  });
  
  // Add categories and items to mind map
  Object.entries(categories).forEach(([category, items], index) => {
    mermaidCode += `    ${category}\n`;
    items.forEach(item => {
      mermaidCode += `      ${item}\n`;
    });
  });
  
  return mermaidCode;
}

// Generate a timeline diagram for events
function generateTimeline(text: string): string {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  let mermaidCode = 'gantt\n';
  mermaidCode += '  title Timeline\n';
  mermaidCode += '  dateFormat YYYY-MM-DD\n';
  mermaidCode += '  section Events\n';
  
  // Current date as fallback
  const today = new Date();
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  // Parse each line for potential dates
  lines.forEach((line, index) => {
    let dateString = formatDate(today);
    let taskName = line;
    
    // Try to extract date information
    const dateMatches = line.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
    if (dateMatches) {
      const [, day, month, year] = dateMatches;
      const fullYear = year.length === 2 ? `20${year}` : year;
      dateString = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      taskName = line.replace(dateMatches[0], '').trim();
    } else {
      // Check for month names
      const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 
                      'august', 'september', 'october', 'november', 'december',
                      'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      
      const monthIndex = months.findIndex(month => line.toLowerCase().includes(month));
      if (monthIndex >= 0) {
        const monthNumber = (monthIndex % 12) + 1;
        dateString = `${today.getFullYear()}-${String(monthNumber).padStart(2, '0')}-01`;
      }
    }
    
    // Add duration of 1 day
    const endDate = new Date(dateString);
    endDate.setDate(endDate.getDate() + 1);
    
    mermaidCode += `  ${taskName} :${index}, ${dateString}, ${formatDate(endDate)}\n`;
  });
  
  return mermaidCode;
}