
import React from 'react';

export const formatMessageContent = (content: string) => {
  return content.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line.startsWith('**') && line.endsWith('**') ? (
        <strong className="text-purple-300">{line.slice(2, -2)}</strong>
      ) : line.startsWith('• ') ? (
        <span className="text-cyan-300">{line}</span>
      ) : (
        line
      )}
      {index < content.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));
};
