import { useState, useRef, useEffect } from 'react';

function App() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm ready to help you analyze markets, review code, or brainstorm ideas. What shall we focus on today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://text.pollinations.ai/' + encodeURIComponent(userMessage.content));
      const text = await response.text();
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'error', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatText = (text) => {
    const formatted = text.replace(/\\n/g, '\n');
    const segments = formatted.split(/(`[^`]+`|\*\*[^*]+\*\*|\n)/g);
    return segments.map((seg, i) => {
      if (seg === '\n') {
        return <br key={i} />;
      }
      if (seg.startsWith('`') && seg.endsWith('`')) {
        return <code key={i} className="bg-surface-container-lowest px-1 rounded text-primary-fixed-dim">{seg.slice(1, -1)}</code>;
      }
      if (seg.startsWith('**') && seg.endsWith('**')) {
        return <strong key={i}>{seg.slice(2, -2)}</strong>;
      }
      return <span key={i}>{seg}</span>;
    });
  };

  return (
    <>
      {/* SideNavBar */}
      <nav className="hidden md:flex flex-col h-full p-4 gap-2 fixed left-0 top-0 w-[260px] bg-surface-container-low/90 dark:bg-surface-container-low/90 backdrop-blur-2xl border-r border-outline-variant/10 z-40">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-10 h-10 rounded-full bg-primary-container flex-shrink-0 overflow-hidden border border-outline-variant/20">
            <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLeEXGyY4YBYuWIOELFyJQCClJTWJjYzl_5KkwprGURl-T1qvljQkdmAXmNE3rnQvGV9SnghNKHdU9TYtpsLPSpnLn-Um-d0Mx94cd5_rBJxzsRKRjxwsL9ntIiNWtYLfm13VuuhQlq5JTbFEuOD1jTm3TI3ZwEhDPeJYRAdTfzaFbwbvQticG_quXVcP4cg2Ozj0jPF6SQoAMLGFxHwc7alTJ07I4qlkh9azwDpV0zLg0eHcNdUQHJTM-BkTmILJTGO3iQjwchQ" />
          </div>
          <div>
            <h2 className="font-headline-md text-headline-md font-bold text-primary">Aura Workspace</h2>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Pro Plan</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1 overflow-y-auto">
          <button className="flex items-center gap-3 bg-primary-container text-on-primary-container rounded-lg px-4 py-2 border-l-4 border-primary font-label-md text-label-md transition-all duration-200 hover:bg-surface-container-highest">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>add_comment</span>
            New Chat
          </button>
          
          <div className="mt-4 mb-2 px-4 font-label-sm text-label-sm text-outline tracking-wider uppercase">Recent</div>
          
          <button className="flex items-center justify-start gap-3 text-on-surface-variant hover:bg-surface-variant/50 rounded-lg px-4 py-2 font-label-md text-label-md hover:bg-surface-container-highest transition-all duration-200">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>history</span>
            Market Analysis
          </button>
          <button className="flex items-center justify-start gap-3 text-on-surface-variant hover:bg-surface-variant/50 rounded-lg px-4 py-2 font-label-md text-label-md hover:bg-surface-container-highest transition-all duration-200">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>code</span>
            Code Review
          </button>
        </div>

        <div className="mt-auto flex flex-col gap-1 border-t border-outline-variant/10 pt-4">
          <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-inverse-primary to-primary-container text-on-primary-container rounded-lg py-2 mb-2 font-label-md text-label-md shadow-lg shadow-primary/10 hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            Upgrade to Plus
          </button>
          <button className="flex items-center justify-start gap-3 text-on-surface-variant hover:bg-surface-variant/50 rounded-lg px-4 py-2 font-label-md text-label-md transition-all duration-200">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>settings</span>
            Settings
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:ml-[260px] h-full relative">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-outline-variant/10 bg-surface/80 backdrop-blur-xl sticky top-0 z-30">
          <button className="text-on-surface-variant p-2 -ml-2 rounded-lg hover:bg-surface-variant/50">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">Aura AI</h1>
          <button className="text-on-surface-variant p-2 -mr-2 rounded-lg hover:bg-surface-variant/50">
            <span className="material-symbols-outlined">add</span>
          </button>
        </header>

        {/* Chat Canvas */}
        <div className="flex-1 overflow-y-auto w-full flex justify-center pb-[120px] pt-8 px-4 md:px-8">
          <div className="w-full max-w-chat-max flex flex-col gap-8">
            {messages.map((msg, index) => (
              <div key={index} className={`flex gap-4 items-start ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.role === 'user' ? (
                  <div className="w-8 h-8 rounded-full bg-surface-variant border border-outline-variant/20 flex-shrink-0 overflow-hidden">
                    <img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiUTDasISDUrfoAdgRwx55MrvR0Bq4ZbWXm9jdIqcavDDjYBs2kMmFmKHYk4lfK9MU5Mn0ewY60j8Vn7VdghRCAYriDo0nZVq6ardL_SIxSGmIsqlACWy7YXKp7PzWz8dMrKEVKFc0yIuPI_GAUX98j3z9l6LF0zOtepQbchqNMO22BJD6pHNYVLxWiuaHzHU6u7lMf5-xKpHt9NrQVVgtW8EH7Aa5p_43wKDptyo3jlcaa2tgfFY_VnU5rcQrwTF9juOUTIl8RA" />
                  </div>
                ) : msg.role === 'error' ? (
                  <div className="w-8 h-8 rounded-full bg-error flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-on-error text-[18px]">error</span>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-container to-inverse-primary flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary/20">
                    <span className="material-symbols-outlined text-on-primary-container text-[18px]">auto_awesome</span>
                  </div>
                )}
                
                <div className={`flex-1 flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}>
                  <p className="font-label-md text-label-md font-medium text-on-surface-variant">
                    {msg.role === 'user' ? 'You' : msg.role === 'error' ? 'Error' : 'Aura AI'}
                  </p>
                  <div className={`p-4 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-surface-variant text-on-surface rounded-tr-sm border border-outline-variant/5' 
                      : msg.role === 'error'
                        ? 'bg-error-container text-on-error-container rounded-tl-sm'
                        : 'bg-surface-container-highest/30 backdrop-blur-md border border-outline-variant/10 rounded-tl-sm text-on-surface'
                  }`}>
                    {formatText(msg.content)}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-container to-inverse-primary flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary/20">
                  <span className="material-symbols-outlined text-on-primary-container text-[18px]">auto_awesome</span>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="font-label-md text-label-md text-primary font-medium">Aura AI</p>
                  <div className="bg-surface-container-highest/30 backdrop-blur-md border border-outline-variant/10 rounded-2xl rounded-tl-sm p-4 text-on-surface leading-relaxed flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{animationDelay: "0s"}}></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{animationDelay: "0.2s"}}></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{animationDelay: "0.4s"}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-background via-background to-transparent pt-10 pb-6 px-4 md:px-8">
          <div className="max-w-chat-max mx-auto relative">
            <div className="bg-surface-container-high/80 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-2 flex flex-col shadow-lg shadow-black/20 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all duration-200">
              <textarea 
                className="w-full bg-transparent border-none text-on-surface font-body-md text-body-md focus:ring-0 resize-none py-3 px-3 min-h-[60px] max-h-[200px] outline-none placeholder:text-on-surface-variant/50" 
                placeholder="Message Aura AI..." 
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div className="flex justify-between items-center mt-2 px-2">
                <div className="flex items-center gap-1">
                  <button className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 rounded-lg transition-colors group relative" title="Attach file">
                    <span className="material-symbols-outlined text-[20px]">attach_file</span>
                  </button>
                  <button className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 rounded-lg transition-colors" title="Use Web Search">
                    <span className="material-symbols-outlined text-[20px]">language</span>
                  </button>
                </div>
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center hover:bg-primary-fixed transition-colors shadow-sm shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
                  <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                </button>
              </div>
            </div>
            <div className="text-center mt-2">
              <p className="font-label-sm text-label-sm text-on-surface-variant/60">Aura AI can make mistakes. Consider verifying important information.</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
