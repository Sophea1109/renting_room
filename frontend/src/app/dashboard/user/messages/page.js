'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Paperclip, Smile, ArrowLeft } from 'lucide-react'

const defaultConversations = [
  {
    id: 1,
    user: { name: 'John Doe', avatar: '/users/user-02.jpg', online: true },
    messages: [
      { from: 'John Doe', text: 'Hey! Are you still looking for a roommate?', time: '10:12 AM' },
      { from: 'You', text: 'Yes, I am.', time: '10:15 AM' },
      { from: 'John Doe', text: 'Cool! I have a room available.', time: '10:17 AM' },
    ],
    unread: 2,
  },
  {
    id: 2,
    user: { name: 'Jane Smith', avatar: '/users/user-01.jpg', online: false },
    messages: [
      { from: 'Jane Smith', text: 'Hello! Interested in sharing a room?', time: '11:00 AM' },
      { from: 'You', text: 'Sure! Let’s talk.', time: '11:05 AM' },
    ],
    unread: 1,
  },
]

export default function TelegramChat() {
  const [conversations, setConversations] = useState(defaultConversations)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showChat, setShowChat] = useState(false)
  const messagesEndRef = useRef(null)

  // Load conversations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('conversations')
    if (saved) setConversations(JSON.parse(saved))
  }, [])

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
    if (!newMessage.trim()) return

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
      unread: 0,
    }

    setSelectedConversation(updatedConversation)
    setConversations((prev) =>
      prev.map((conv) => (conv.id === updatedConversation.id ? updatedConversation : conv))
    )
    setNewMessage('')
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedConversation?.messages])

  // Auto-select first conversation if none selected
  useEffect(() => {
    if (!selectedConversation && conversations.length > 0) {
      setSelectedConversation(conversations[0])
    }
  }, [conversations])

  // Mark conversation as read when opened
  useEffect(() => {
    if (selectedConversation) {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation.id ? { ...conv, unread: 0 } : conv
        )
      )
    }
  }, [selectedConversation])

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-colors rounded-lg mx-2 my-1 ${
                selectedConversation?.id === conv.id ? 'bg-blue-50' : 'hover:bg-gray-100'
              }`}
            >
              <div className="relative">
                <img src={conv.user.avatar} alt={conv.user.name} className="w-12 h-12 rounded-full" />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    conv.user.online ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                />
                {conv.unread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {conv.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{conv.user.name}</p>
                <p className="text-sm text-gray-500 truncate">
                  {conv.messages[conv.messages.length - 1].text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation && (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-white">
            <button
              className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
              onClick={() => setShowChat(false)}
            >
              <ArrowLeft size={24} />
              <span className="hidden sm:inline">Back</span>
            </button>

            <img
              src={selectedConversation.user.avatar}
              alt={selectedConversation.user.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{selectedConversation.user.name}</h2>
              <p className="text-sm text-gray-500">
                {selectedConversation.user.online ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {selectedConversation.messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.from === 'You' ? 'justify-end' : 'justify-start'}`}>
                {msg.from !== 'You' && (
                  <img
                    src={selectedConversation.user.avatar}
                    alt={selectedConversation.user.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                )}
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[70%] break-words ${
                    msg.from === 'You'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <span className={`block mt-1 text-xs ${msg.from === 'You' ? 'text-blue-200' : 'text-gray-500'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="flex items-center p-4 gap-3 border-t border-gray-200 bg-white"
          >
            <button type="button" className="text-gray-500 hover:text-gray-700">
              <Smile size={24} />
            </button>
            <button type="button" className="text-gray-500 hover:text-gray-700">
              <Paperclip size={24} />
            </button>
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
