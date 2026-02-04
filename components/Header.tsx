
import React, { useState, useRef, useCallback } from 'react';
import { Search, ShoppingCart, Sun, Moon, Mic, MicOff, Loader2 } from 'lucide-react';
import { Logo } from './Logo';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery?: string;
  cartItemCount: number;
  onCartClick: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

// Audio Utils
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export const Header: React.FC<HeaderProps> = ({ 
  onSearch, 
  searchQuery = '', 
  cartItemCount, 
  onCartClick, 
  theme, 
  onToggleTheme 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopVoiceSearch = useCallback(() => {
    setIsListening(false);
    setIsVoiceLoading(false);
    
    if (sessionRef.current) {
      // sessionRef.current.close(); // Not always available in mock/sdk types, but recommended
      sessionRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startVoiceSearch = async () => {
    if (isListening) {
      stopVoiceSearch();
      return;
    }

    setIsVoiceLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = inputAudioContext;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsVoiceLoading(false);
            setIsListening(true);
            
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              if (text) {
                onSearch(text);
              }
            }
            if (message.serverContent?.turnComplete) {
              // Automatically stop when the model detects user finished speaking
              setTimeout(() => stopVoiceSearch(), 500);
            }
          },
          onerror: (e: any) => {
            console.error('Voice search error:', e);
            stopVoiceSearch();
          },
          onclose: () => {
            setIsListening(false);
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          systemInstruction: 'Você é um assistente de busca para um supermercado. Transcreva apenas o que o usuário quer comprar. Não responda com voz, apenas transcreva.',
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Failed to start voice search:', err);
      setIsVoiceLoading(false);
      setIsListening(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-3 transition-colors">
      <div className="max-w-md mx-auto flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size="md" className="-ml-2" theme={theme} />
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={onToggleTheme}
              className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-700 dark:text-slate-300 transition-all hover:scale-110 active:rotate-45"
              aria-label="Trocar tema"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
            <button 
              onClick={onCartClick}
              className="relative p-2 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-950 shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="relative group flex items-center gap-2">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-emerald-600" />
            <input
              type="text"
              value={searchQuery}
              placeholder={isListening ? "Ouvindo..." : "O que você está procurando hoje?"}
              onChange={(e) => onSearch(e.target.value)}
              className={`w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl py-3 pl-10 pr-12 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none dark:text-slate-400 ${isListening ? 'ring-2 ring-emerald-500/30' : ''}`}
            />
            
            <button 
              onClick={startVoiceSearch}
              disabled={isVoiceLoading}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${isListening ? 'bg-emerald-600 text-white animate-pulse' : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-emerald-600 shadow-sm border border-slate-100 dark:border-slate-700'}`}
              title="Busca por voz"
            >
              {isVoiceLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isListening ? (
                <Mic className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        {isListening && (
          <div className="flex items-center gap-2 px-2 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Gravando sua voz...</span>
          </div>
        )}
      </div>
    </header>
  );
};
