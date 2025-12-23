'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Smile, 
  Check, 
  CheckCheck,
  Clock,
  Phone,
  Video,
  Info,
  Archive,
  Trash2,
  User,
  Mail,
  Calendar,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import OwnerSidebar from '@/components/OwnerSidebar';
import OwnerHeader from '@/components/OwnerHeader';

// Mock data for messages
const initialConversations = [
  {
    id: 1,
    name: 'John Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    lastMessage: 'Is the room still available?',
    timestamp: '10:30 AM',
    unread: 3,
    status: 'online',
    property: 'Ocean View Suite #302',
    isOwner: false
  },
  {
    id: 2,
    name: 'Emma Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    lastMessage: 'Thank you for the tour! I\'ll get back to you soon.',
    timestamp: 'Yesterday',
    unread: 0,
    status: 'offline',
    property: 'Downtown Studio #105',
    isOwner: false
  },
  {
    id: 3,
    name: 'Michael Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    lastMessage: 'Can we schedule a viewing for tomorrow?',
    timestamp: '2 days ago',
    unread: 1,
    status: 'online',
    property: 'Luxury Penthouse #801',
    isOwner: false
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    lastMessage: 'I\'ve sent the deposit as discussed.',
    timestamp: '3 days ago',
    unread: 0,
    status: 'offline',
    property: 'Garden Apartment #204',
    isOwner: false
  },
  {
    id: 5,
    name: 'David Brown',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    lastMessage: 'When is the maintenance scheduled?',
    timestamp: '1 week ago',
    unread: 0,
    status: 'online',
    property: 'Mountain View Villa #12',
    isOwner: true
  },
];

const initialMessages = {
  1: [
    { id: 1, text: 'Hi, I saw your listing for the Ocean View Suite. Is it still available?', sender: 'guest', timestamp: '10:15 AM', read: true },
    { id: 2, text: 'Yes, it\'s still available! When would you like to schedule a viewing?', sender: 'owner', timestamp: '10:20 AM', read: true },
    { id: 3, text: 'How about tomorrow afternoon?', sender: 'guest', timestamp: '10:25 AM', read: true },
    { id: 4, text: 'Tomorrow at 3 PM works perfectly. I\'ll send you the address.', sender: 'owner', timestamp: '10:28 AM', read: true },
    { id: 5, text: 'Great! What\'s the exact address?', sender: 'guest', timestamp: '10:30 AM', read: false },
  ],
  2: [
    { id: 1, text: 'Thank you for showing me the studio yesterday.', sender: 'guest', timestamp: 'Yesterday 4:45 PM', read: true },
    { id: 2, text: 'You\'re welcome! Let me know if you have any questions.', sender: 'owner', timestamp: 'Yesterday 4:50 PM', read: true },
  ],
  3: [
    { id: 1, text: 'Hi, I\'m interested in the penthouse. Can we schedule a viewing?', sender: 'guest', timestamp: '2 days ago 11:00 AM', read: true },
    { id: 2, text: 'Absolutely! What day works for you?', sender: 'owner', timestamp: '2 days ago 11:05 AM', read: false },
  ],
};

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState('messages');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [conversations, setConversations] = useState(initialConversations);
  const [activeConversation, setActiveConversation] = useState(1);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter conversations based on search and filter
  const filteredConversations = conversations.filter(convo => {
    const matchesSearch = convo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         convo.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         convo.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === 'all' ? true :
                         filter === 'unread' ? convo.unread > 0 :
                         filter === 'owners' ? convo.isOwner : true;
    
    return matchesSearch && matchesFilter;
  });

  // Get active conversation details
  const activeConvoDetails = conversations.find(c => c.id === activeConversation);

  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg = {
      id: messages[activeConversation]?.length + 1 || 1,
      text: newMessage,
      sender: 'owner',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    setMessages(prev => ({
      ...prev,
      [activeConversation]: [...(prev[activeConversation] || []), newMsg]
    }));

    // Update conversation last message
    setConversations(prev => prev.map(convo => 
      convo.id === activeConversation 
        ? { ...convo, lastMessage: newMessage, timestamp: 'Just now', unread: 0 }
        : convo
    ));

    setNewMessage('');
  };

  // Handle conversation selection
  const handleSelectConversation = (id) => {
    setActiveConversation(id);
    // Mark messages as read
    setConversations(prev => prev.map(convo => 
      convo.id === id ? { ...convo, unread: 0 } : convo
    ));
  };

  // Handle archiving a conversation
  const handleArchive = (id) => {
    setConversations(prev => prev.filter(convo => convo.id !== id));
    if (activeConversation === id) {
      setActiveConversation(filteredConversations[0]?.id || null);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <OwnerSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <OwnerHeader />

        {/* Page content */}
        <main className="flex-1 overflow-hidden">
          <div className="flex h-full">
            {/* Conversations sidebar - hidden on mobile when chat is open */}
            {(!isMobile || !activeConversation) && (
              <div className={`w-full md:w-96 border-r border-gray-200 bg-white flex flex-col ${isMobile && activeConversation ? 'hidden' : 'block'}`}>
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                      {conversations.filter(c => c.unread > 0).length} unread
                    </span>
                  </div>
                  
                  {/* Search bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Filter tabs */}
                  <div className="flex gap-2 mt-4">
                    {['all', 'unread', 'owners'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          filter === tab
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tab === 'all' && 'All'}
                        {tab === 'unread' && 'Unread'}
                        {tab === 'owners' && 'Owners'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conversations list */}
                <div className="flex-1 overflow-y-auto">
                  {filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                      <MessageSquare className="text-gray-300 mb-4" size={48} />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations found</h3>
                      <p className="text-gray-500">Try adjusting your search or filter</p>
                    </div>
                  ) : (
                    filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => handleSelectConversation(conversation.id)}
                        className={`flex items-center gap-3 p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                          activeConversation === conversation.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        {/* Avatar with status */}
                        <div className="relative">
                          <img
                            src={conversation.avatar}
                            alt={conversation.name}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                            conversation.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                        </div>

                        {/* Conversation details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {conversation.name}
                              {conversation.isOwner && (
                                <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">
                                  Owner
                                </span>
                              )}
                            </h3>
                            <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                          </div>
                          
                          <p className="text-sm text-gray-600 truncate mb-1">
                            {conversation.lastMessage}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{conversation.property}</span>
                            {conversation.unread > 0 && (
                              <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                                {conversation.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Chat area */}
            {activeConversation && (
              <div className={`flex-1 flex flex-col ${isMobile && 'w-full'}`}>
                {/* Chat header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-white">
                  <div className="flex items-center gap-3">
                    {isMobile && (
                      <button
                        onClick={() => setActiveConversation(null)}
                        className="mr-2 text-gray-500 hover:text-gray-700"
                      >
                        <ChevronRight className="rotate-180" size={24} />
                      </button>
                    )}
                    <div className="relative">
                      <img
                        src={activeConvoDetails?.avatar}
                        alt={activeConvoDetails?.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                        activeConvoDetails?.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">{activeConvoDetails?.name}</h2>
                      <p className="text-sm text-gray-500">{activeConvoDetails?.property}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                      <Phone size={20} />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                      <Video size={20} />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                      <Info size={20} />
                    </button>
                    <div className="relative">
                      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                        <MoreVertical size={20} />
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block z-10">
                        <button
                          onClick={() => handleArchive(activeConversation)}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Archive size={16} />
                          Archive Chat
                        </button>
                        <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                          <Trash2 size={16} />
                          Delete Chat
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages container */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
                  <div className="max-w-3xl mx-auto space-y-4">
                    {/* Welcome message */}
                    <div className="text-center mb-8">
                      <div className="inline-block px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-600">
                          Conversation started with {activeConvoDetails?.name}
                        </p>
                      </div>
                    </div>

                    {/* Messages */}
                    {messages[activeConversation]?.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'owner' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-lg rounded-2xl px-4 py-2 ${
                            message.sender === 'owner'
                              ? 'bg-blue-600 text-white rounded-br-none'
                              : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm md:text-base">{message.text}</p>
                          <div className={`flex items-center gap-1 mt-1 text-xs ${
                            message.sender === 'owner' ? 'text-blue-200' : 'text-gray-500'
                          }`}>
                            <span>{message.timestamp}</span>
                            {message.sender === 'owner' && (
                              <>
                                {message.read ? (
                                  <CheckCheck size={12} className="ml-1" />
                                ) : (
                                  <Check size={12} className="ml-1" />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                  <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        <Paperclip size={20} />
                      </button>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message here..."
                          className="text-gray-700 w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          <Smile size={20} />
                        </button>
                      </div>
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send size={20} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Press Enter to send • Shift + Enter for new line
                    </p>
                  </div>
                </form>
              </div>
            )}

            {/* Empty state when no conversation selected on desktop */}
            {!activeConversation && !isMobile && (
              <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <MessageSquare className="text-blue-600" size={48} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Select a conversation</h2>
                <p className="text-gray-600 text-center max-w-md mb-8">
                  Choose a conversation from the list to start messaging. You can also search for specific conversations or filter by status.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Offline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded">Owner</span>
                    <span>Property Owner</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}