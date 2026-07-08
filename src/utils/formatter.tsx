import React from 'react';
export function renderFormattedContent(text: string): React.ReactNode {
  if (!text) return null;
  let html = text;
  if (html.includes('**') || html.includes('*') || html.includes('<u>') || html.includes('_')) {
    html = html
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>');
  }
  if (!html.includes('<br') && !html.includes('<p') && !html.includes('<div') && !html.includes('<span')) {
    html = html.replace(/\n/g, '<br />');
  }
  return (
    <span 
      className="inline-block w-full"
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
}
export function stripFormatting(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/<\/?[a-zA-Z0-9]+[^>]*>/g, ' ') // replace any html tags with a space
    .replace(/\s+/g, ' ') // compress whitespace
    .trim();
}

