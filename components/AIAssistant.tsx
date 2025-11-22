import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2, Paperclip, Mic, Globe, MapPin, StopCircle } from 'lucide-react';
import { chatWithPro, transcribeAudio, searchWeb, searchMaps, analyzeImage } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AIAssistantProps {
  contextData: string;
}

type Mode = 'chat' | 'search' | 'maps';

export const AIAssistant: React.FC<AIAssistantProps> = ({ contextData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Hello! I am OmniNexus Pro. I can chat, search the web, find places on maps, and analyze files.',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<Mode>('chat');
  const [isRecording, setIsRecording] = useState(false);
  const [groundingData, setGroundingData] = useState<any>(null); // To store current citations/map data

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, groundingData]);

  // --- Audio Handling ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' }); // Defaulting to wav container logic or raw
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = (reader.result as string).split(',')[1];
          setIsLoading(true);
          const transcription = await transcribeAudio(base64String);
          setInput(prev => prev + (prev ? ' ' : '') + transcription);
          setIsLoading(false);
        };
        reader.readAsDataURL(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic access denied:", err);
      alert("Microphone access is required for voice input.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // --- Sending Messages ---
  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setGroundingData(null); // Reset previous grounding

    let responseText = '';
    let sources: any[] | undefined = undefined;
    let mapChunks: any[] | undefined = undefined;

    try {
        if (mode === 'search') {
            const result = await searchWeb(userText);
            responseText = result.text;
            sources = result.sources;
        } else if (mode === 'maps') {
            // Try to get location
            let loc: {lat: number, lng: number} | undefined = undefined;
            try {
                 await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => { loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }; resolve(true); },
                        (err) => { resolve(false); } // Ignore error, proceed without location
                    );
                 });
            } catch (e) {}
            
            const result = await searchMaps(userText, loc);
            responseText = result.text;
            mapChunks = result.mapChunks;
        } else {
            // Chat Mode (Gemini 3 Pro)
            // Convert history for API
            const history = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));
            responseText = await chatWithPro(history, userText, contextData);
        }
    } catch (e) {
        responseText = "Sorry, something went wrong processing your request.";
    }

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    // Append custom properties for rendering if needed, or just store in a separate state for the *latest* message
    // For simplicity in this UI, we just append the text. Grounding data is shown below the latest message if it exists.
    setMessages(prev => [...prev, aiMsg]);
    if (sources || mapChunks) {
        setGroundingData({ sources, mapChunks, msgId: aiMsg.id });
    }
    
    setIsLoading(false);
    // Reset mode after one-off search/map query? Optional. Let's keep it sticky for now or reset.
    // setMode('chat'); 
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: `[Uploaded Image: ${file.name}] Analyze this image.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMsg]);
      setIsLoading(true);

      const responseText = await analyzeImage(base64Data, "Analyze this image relevant to the current SaaS context.");
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-brand-600 hover:bg-brand-500 text-white p-4 rounded-full shadow-lg hover:shadow-brand-500/50 transition-all z-50 group"
        >
          <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[650px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-400" />
              <div>
                <h3 className="font-semibold text-white text-sm">OmniNexus Assistant</h3>
                <p className="text-[10px] text-slate-400">Powered by Gemini 3.0 Pro</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/95 scrollbar-thin scrollbar-thumb-slate-700">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-2">
                  <div
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-brand-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                      }`}
                    >
                      <div className="prose prose-invert prose-sm max-w-none">
                          <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      </div>
                      <span className="text-[10px] opacity-50 block mt-2 text-right">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  
                  {/* Grounding Data Rendering (Only for latest relevant message) */}
                  {msg.role === 'model' && groundingData && groundingData.msgId === msg.id && (
                     <div className="ml-2 pl-4 border-l-2 border-brand-500/30 space-y-2 max-w-[85%]">
                        {/* Search Sources */}
                        {groundingData.sources && groundingData.sources.map((chunk: any, i: number) => chunk.web && (
                            <div key={i} className="bg-slate-800/50 p-2 rounded text-xs border border-slate-700 flex flex-col gap-1">
                                <span className="text-slate-400 font-semibold">Source: {chunk.web.title}</span>
                                <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline truncate">
                                    {chunk.web.uri}
                                </a>
                            </div>
                        ))}
                        {/* Maps Data */}
                        {groundingData.mapChunks && groundingData.mapChunks.map((chunk: any, i: number) => chunk.maps && (
                             <div key={i} className="bg-slate-800/50 p-2 rounded text-xs border border-slate-700 flex flex-col gap-1">
                                <span className="text-slate-400 font-semibold flex items-center gap-1"><MapPin size={10} /> {chunk.maps.title}</span>
                                <a href={chunk.maps.uri} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline truncate">
                                    View on Maps
                                </a>
                            </div>
                        ))}
                     </div>
                  )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-slate-700 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                  <span className="text-slate-400 text-xs">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Mode Selector */}
          <div className="px-4 py-2 bg-slate-800 border-t border-slate-700 flex gap-2">
              <button 
                onClick={() => setMode('chat')}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${mode === 'chat' ? 'bg-brand-600 text-white' : 'hover:bg-slate-700 text-slate-400'}`}
              >
                  <MessageSquare size={14} /> Chat
              </button>
              <button 
                onClick={() => setMode('search')}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${mode === 'search' ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-400'}`}
              >
                  <Globe size={14} /> Search
              </button>
              <button 
                onClick={() => setMode('maps')}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${mode === 'maps' ? 'bg-green-600 text-white' : 'hover:bg-slate-700 text-slate-400'}`}
              >
                  <MapPin size={14} /> Maps
              </button>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-800 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-400 hover:text-brand-400 transition-colors"
                title="Upload image"
              >
                <Paperclip size={20} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileUpload}
              />
              
              <div className="relative flex-1">
                 <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={mode === 'chat' ? "Ask anything..." : mode === 'search' ? "Search Google..." : "Find places..."}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-3 pr-10 py-2 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
                  />
                  {/* Mic Button inside input */}
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-all ${isRecording ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-slate-400 hover:text-white'}`}
                  >
                    {isRecording ? <StopCircle size={14} /> : <Mic size={14} />}
                  </button>
              </div>

              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`p-2 rounded-lg text-white transition-colors shadow-lg ${isLoading || !input.trim() ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-500'}`}
              >
                <Send size={18} />
              </button>
            </div>
            {isRecording && <p className="text-[10px] text-red-400 mt-1 text-center font-medium animate-pulse">Recording... Click stop to transcribe.</p>}
          </div>
        </div>
      )}
    </>
  );
};