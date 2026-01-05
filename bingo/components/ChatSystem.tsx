import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Globe, Users } from 'lucide-react';
import { ChatChannel } from '../types';

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  channel: ChatChannel;
  isSystem?: boolean;
}

interface ChatSystemProps {
  messages: ChatMessage[];
  currentRoomName: string;
}

const ChatSystem: React.FC<ChatSystemProps> = ({ messages, currentRoomName }) => {
  const [activeChannel, setActiveChannel] = useState<ChatChannel>('GLOBAL');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeChannel]);

  const filteredMessages = messages.filter(m => m.channel === activeChannel);

  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-xl overflow-hidden border border-slate-700/50">
      {/* Header Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveChannel('GLOBAL')}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
            activeChannel === 'GLOBAL' 
              ? 'bg-slate-800 text-white border-b-2 border-blue-500' 
              : 'text-slate-500 hover:bg-slate-800/50'
          }`}
        >
          <Globe size={14} /> Global
        </button>
        <button
          onClick={() => setActiveChannel('ROOM')}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
            activeChannel === 'ROOM' 
              ? 'bg-slate-800 text-white border-b-2 border-pink-500' 
              : 'text-slate-500 hover:bg-slate-800/50'
          }`}
        >
          <Users size={14} /> {currentRoomName || 'Room'}
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar"
      >
        {filteredMessages.length === 0 ? (
           <div className="text-center text-slate-600 text-xs mt-10">No messages yet. Say hi!</div>
        ) : (
            filteredMessages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.isSystem ? 'items-center' : 'items-start'}`}>
                {msg.isSystem ? (
                <span className="bg-slate-800/80 px-3 py-1 rounded-full text-[10px] text-slate-400 border border-slate-700">
                    {msg.text}
                </span>
                ) : (
                <div className="max-w-[90%]">
                    <span className={`text-xs font-bold mr-2 ${msg.user === 'MomAI' ? 'text-pink-400' : 'text-purple-400'}`}>
                    {msg.user}
                    </span>
                    <span className="text-slate-300 text-sm">{msg.text}</span>
                </div>
                )}
            </div>
            ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-slate-800/50 border-t border-slate-800">
        <div className="flex items-center gap-2 bg-slate-900 rounded-lg px-3 py-2 border border-slate-700 focus-within:border-blue-500 transition-colors">
            <input 
                type="text" 
                placeholder={`Message #${activeChannel === 'GLOBAL' ? 'global' : 'room'}...`}
                className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-slate-500"
                disabled
            />
            <button className="text-slate-500 hover:text-white transition-colors">
                <MessageSquare size={16} />
            </button>
        </div>
        <div className="text-[10px] text-center mt-2 text-slate-500">
            Sign in with Farcaster to chat
        </div>
      </div>
    </div>
  );
};

export default ChatSystem;