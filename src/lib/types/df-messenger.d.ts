declare namespace JSX {
  interface IntrinsicElements {
    'df-messenger': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      'project-id': string;
      'agent-id': string;
      'language-code': string;
      'max-query-length': string;
      'allow-feedback': string;
    };
    'df-messenger-chat': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      'chat-title': string;
    };
  }
} 