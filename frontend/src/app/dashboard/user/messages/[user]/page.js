"use client"; 

import { useState, useEffect, useRef } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const initialConversations = [
  {
    id: 1,
    user: { name: 'John Doe', avatar: '/users/user-02.jpg' },
    messages: [
      { from: 'John Doe', text: 'Hey! Are you still looking for a roommate?', time: '10:12 AM' },
      { from: 'You', text: 'Yes, I am.', time: '10:15 AM' },
      { from: 'John Doe', text: 'Cool! I have a room available.', time: '10:17 AM' },
    ],
  },
  {
    id: 2,
    user: { name: 'Jane Smith', avatar: '/users/user-01.jpg' },
    messages: [
      { from: 'Jane Smith', text: 'Hello! Interested in sharing a room?', time: '11:00 AM' },
      { from: 'You', text: 'Sure! Let’s talk.', time: '11:05 AM' },
    ],
  },
]

export default function MessagesPage() {
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('conversations')
    return saved ? JSON.parse(saved) : initialConversations
  })

  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const messagesEndRef = useRef(null)
  const [isTyping, setIsTyping] = useState(false)

  // Save conversations to localStorage
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations))
  }, [conversations])

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.messages[conv.messages.length - 1].text.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage) return

    const updatedConversation = {
      ...selectedConversation,
      messages: [
        ...selectedConversation.messages,
        {
          from: 'You',
          text: newMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    }

    setSelectedConversation(updatedConversation)
    setConversations((prev) =>
      prev.map((conv) => (conv.id === updatedConversation.id ? updatedConversation : conv))
    )
    setNewMessage('')
    setIsTyping(true)
    setTimeout(() => setIsTyping(false), 1000)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedConversation.messages])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <Header />

      {/* Full-screen chat container */}
      <div className="flex flex-1 max-w-7xl mx-auto px-4 gap-4 h-[calc(100vh-8rem)]">
        {/* Left Panel - Chat List */}
        <div className="w-1/3 bg-white/30 backdrop-blur-md rounded-xl shadow-lg flex flex-col overflow-hidden border border-white/20">
          <div className="p-4 border-b border-white/30">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 rounded-full border border-white/50 bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`flex items-center gap-3 p-4 cursor-pointer transition-all duration-200 ${
                  selectedConversation.id === conv.id
                    ? 'bg-white/20 backdrop-blur-md'
                    : 'hover:bg-white/10'
                }`}
              >
                <img src={conv.user.avatar} alt={conv.user.name} className="w-12 h-12 rounded-full ring-2 ring-pink-400" />
                <div className="flex-1">
                  <p className="font-bold text-white">{conv.user.name}</p>
                  <p className="text-sm text-white/70 truncate max-w-xs">
                    {conv.messages[conv.messages.length - 1].text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Chat Window */}
        <div className="w-2/3 bg-white/20 backdrop-blur-md rounded-xl shadow-lg flex flex-col overflow-hidden border border-white/20">
          <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
            <h2 className="text-2xl font-bold text-white">{selectedConversation.user.name}</h2>

            {selectedConversation.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.from === 'You' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.from !== 'You' && (
                  <img
                    src={selectedConversation.user.avatar}
                    alt={selectedConversation.user.name}
                    className="w-10 h-10 rounded-full mr-2 ring-2 ring-pink-400"
                  />
                )}
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl relative break-words ${
                    msg.from === 'You'
                      ? 'bg-pink-500 text-white rounded-br-none shadow-lg'
                      : 'bg-white/30 text-white rounded-bl-none shadow-md'
                  }`}
                >
                  {msg.text}
                  <span className="absolute bottom-0 right-2 text-xs text-white/70">{msg.time}</span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-150"></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-300"></div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form className="flex p-4 gap-2" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 px-4 py-3 rounded-full border border-white/50 bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full transition"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}
