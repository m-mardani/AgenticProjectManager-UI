import { Download, Sparkles, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ChatInput from './components/ChatInput'
import ChatMessage, { Message } from './components/ChatMessage'
import TypingIndicator from './components/TypingIndicator'

// Mock AI responses (since backend is not ready)
const MOCK_RESPONSES = [
  'من اینجا هستم تا به شما در مدیریت و تحلیل پروژه کمک کنم. چه چیزی می‌خواهید بدانید؟',
  'بر اساس داده‌های فعلی پروژه، می‌توانم به شما در تحلیل پیشرفت، شناسایی ریسک‌ها و ارائه بینش کمک کنم.',
  'من می‌توانم در زمان‌بندی پروژه، تخصیص منابع و معیارهای عملکرد به شما کمک کنم.',
  'اجازه دهید آن را برای شما تحلیل کنم. پروژه‌ها به طور کلی به خوبی پیش می‌روند.',
  'توصیه می‌کنم روی وظایف با اولویت بالا و وابستگی‌های حیاتی تمرکز کنید.',
  'آیا می‌خواهید من یک گزارش دقیق از عملکرد پروژه ایجاد کنم؟',
]

const SUGGESTED_PROMPTS = ['تحلیل پیشرفت پروژه', 'نمایش ریسک‌های حیاتی', 'تولید گزارش وضعیت', 'توصیه بهینه‌سازی‌ها']

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'سلام! من دستیار هوشمند مدیریت پروژه شما هستم. می‌توانم به شما در تحلیل پروژه‌ها، شناسایی ریسک‌ها، بهینه‌سازی زمان‌بندی و پاسخ به سؤالات درباره داده‌هایتان کمک کنم. امروز چطور می‌توانم به شما کمک کنم؟',
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])

    // Simulate AI typing
    setIsTyping(true)

    // Mock API call with delay
    setTimeout(
      () => {
        const randomResponse = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)]
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: randomResponse,
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, aiMessage])
        setIsTyping(false)
      },
      1500 + Math.random() * 1000
    ) // Random delay 1.5-2.5s
  }

  const handleSuggestedPrompt = (prompt: string) => {
    handleSendMessage(prompt)
  }

  const handleClearChat = () => {
    if (confirm('آیا مطمئن هستید که می‌خواهید تمام پیام‌ها را پاک کنید؟')) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: 'گفتگو پاک شد. چطور می‌توانم کمکتان کنم؟',
          timestamp: new Date(),
        },
      ])
    }
  }

  const handleExportChat = () => {
    const chatText = messages
      .map(msg => `[${msg.timestamp.toLocaleString()}] ${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n')
    const blob = new Blob([chatText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-chat-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">دستیار هوشمند</h1>
              <p className="text-sm text-gray-500">قدرت گرفته از فناوری پیشرفته هوش مصنوعی</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportChat}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="خروجی گرفتن از گفتگو"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handleClearChat}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="پاک کردن گفتگو"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
        style={{ maxHeight: 'calc(100vh - 250px)' }}
      >
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length === 1 && !isTyping && (
        <div className="flex-shrink-0 px-6 py-2">
          <p className="text-xs text-gray-500 mb-2 font-medium">پیشنهادهای سریع:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedPrompt(prompt)}
                className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-full hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isTyping} />
        <p className="text-xs text-gray-400 mt-2 text-center">⚠️ حالت آزمایشی: API بک‌اند هنوز متصل نشده است</p>
      </div>
    </div>
  )
}
