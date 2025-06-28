
'use client'

import { useCopilotChat } from '@copilotkit/react-core'
import { FormEvent } from 'react'
import { Mic, SendHorizontal, X } from 'lucide-react'

export function CopilotChat() {
  const copilotChat = useCopilotChat();

  // If the essential functions aren't available, don't render the component.
  // This can happen during server-side rendering or before the context is ready.
  if (!copilotChat || !copilotChat.append || !copilotChat.setInput) {
    return null;
  }

  const { 
    messages,
    append, 
    input, 
    setInput, 
    isLoading 
  } = copilotChat;

  const suggestions = [
    'Suggest a new business rule for employee bonuses',
    'How many active rules do I have?',
    'Find all rules related to marketing',
  ]

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input || !input.trim() || isLoading) return
    append({ role: 'user', content: input })
    setInput('')
  }
  
  return (
    <div className="bg-white dark:bg-card border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg flex flex-col h-full max-h-[calc(100vh-12rem)]">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center shrink-0">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">CopilotKit</h2>
        <button className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && !isLoading && (
            <div className="text-gray-800 dark:text-gray-200 text-sm">
                Welcome to RuleWise! How can I help?
            </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] px-4 py-2 rounded-lg text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm">
                    Thinking...
                </div>
            </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-wrap gap-2 mb-4">
              {suggestions.map(s => (
                  <button 
                      key={s}
                      onClick={() => setInput(s)}
                      className="px-3 py-1.5 text-xs bg-white dark:bg-card border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                      {s}
                  </button>
              ))}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              value={input || ''}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="w-full pl-4 pr-20 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <button type="button" className="p-2 text-gray-500 hover:text-blue-500">
                <Mic size={18} />
              </button>
              <button type="submit" className="p-2 text-gray-500 hover:text-blue-500 disabled:text-gray-300 dark:disabled:text-gray-600" disabled={!input || !input.trim() || isLoading}>
                <SendHorizontal size={18} />
              </button>
            </div>
          </div>
          <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-2">Powered by CopilotKit</p>
        </form>
      </div>
    </div>
  )
}
