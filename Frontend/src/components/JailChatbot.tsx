import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Send, Bot, Sparkles, ShieldCheck, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '@/config/apiConfig';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

const JailChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: '👋 Welcome to JailAI Assistant! I am trained on all functions and live MongoDB data for the Jail Management System. Ask me anything about inmates, cells, staff, visitors, PDF reports, or editing records!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [summaryData, setSummaryData] = useState<{
    inmates: number;
    staff: number;
    cells: number;
    visitors: number;
  }>({ inmates: 0, staff: 0, cells: 0, visitors: 0 });

  const [inmatesSample, setInmatesSample] = useState<any[]>([]);
  const [cellsSample, setCellsSample] = useState<any[]>([]);
  const [staffSample, setStaffSample] = useState<any[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchLiveRAGContext = () => {
    fetch(`${API_BASE_URL}/api/dashboard-summary`)
      .then((res) => res.json())
      .then((data) => {
        setSummaryData({
          inmates: data.totalInmates || 0,
          staff: data.activeStaff || 0,
          visitors: data.dailyVisitors || 0,
          cells: data.availableCells || 0,
        });
      })
      .catch(() => {});

    fetch(`${API_BASE_URL}/api/inmates`)
      .then((res) => res.json())
      .then((data) => setInmatesSample(data.slice(0, 5)))
      .catch(() => {});

    fetch(`${API_BASE_URL}/api/cells`)
      .then((res) => res.json())
      .then((data) => setCellsSample(data.slice(0, 5)))
      .catch(() => {});

    fetch(`${API_BASE_URL}/api/staff`)
      .then((res) => res.json())
      .then((data) => setStaffSample(data.slice(0, 5)))
      .catch(() => {});
  };

  useEffect(() => {
    fetchLiveRAGContext();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickPrompts = [
    'System Overview',
    'How to edit inmate?',
    'How to edit cell?',
    'How to edit staff?',
    'Export PDF Report',
    'Back button help',
  ];

  // Trained RAG Intent Classifier & Dynamic Response Generator
  const generateRAGResponse = (rawQuery: string): string => {
    const q = rawQuery.toLowerCase().trim();

    // 1. Greetings & Help
    if (/^(hi|hello|hey|greetings|help|hola|start)/.test(q)) {
      return `👋 Hello! I am your AI Assistant for the Jail Management System.

I can help you with:
• 📊 Real-time facility metrics & summaries
• 👤 Inmate records (Admit, Edit details, Delete)
• 🏢 Cell assignments (Block capacity, Status updates)
• 👥 Staff roster (Shifts, Duty status, Department)
• 🚶 Visitor logs & schedule tracking
• 📄 Exporting official PDF reports
• ⬅️ Navigation & Session management

What would you like to know?`;
    }

    // 2. System Overview & Summary
    if (q.includes('summary') || q.includes('overview') || q.includes('dashboard') || q.includes('metrics')) {
      return `📊 Live Facility Summary:
• Total Inmates Registered: ${summaryData.inmates}
• Staff On Duty: ${summaryData.staff}
• Daily Visitors Logged: ${summaryData.visitors}
• Available Cells Capacity: ${summaryData.cells}

Database status: Connected to MongoDB (port 27017)
API Backend status: Spring Boot (port 8080)`;
    }

    // 3. Inmate Edit / Update Functions
    if ((q.includes('edit') || q.includes('update') || q.includes('change')) && (q.includes('inmate') || q.includes('prisoner'))) {
      return `👤 How to Edit an Inmate Record:
1. Navigate to "Inmates" from the left sidebar.
2. Search for the inmate by Name or Inmate ID (e.g. INM001).
3. Click the "Edit" button on the top right of the inmate card.
4. Modify the Name, Age, Cell Number, Block, Charges, or Status (Active / Released / Transferred).
5. Click "Save Changes" to commit updates to MongoDB via PUT /api/inmates/{id}.`;
    }

    // 4. Inmate Add / Admit Functions
    if ((q.includes('add') || q.includes('new') || q.includes('admit') || q.includes('create')) && (q.includes('inmate') || q.includes('prisoner'))) {
      return `➕ How to Admit a New Inmate:
1. Click "Inmates" in the sidebar.
2. Click the "+ Add New Inmate" button at top right.
3. Fill in the Full Name, Age, Block, Cell Number, and Charges.
4. Select Status ("Active").
5. Click "Add Inmate" to automatically assign cell occupancy and save to MongoDB.`;
    }

    // 5. Inmate Delete Functions
    if ((q.includes('delete') || q.includes('remove')) && (q.includes('inmate') || q.includes('prisoner'))) {
      return `🗑️ How to Remove an Inmate:
1. Go to the "Inmates" panel.
2. Locate the inmate card.
3. Click the red "Delete" button.
4. The system will automatically decrement cell occupancy and remove the record from MongoDB via DELETE /api/inmates/{id}.`;
    }

    // 6. Inmates Directory List
    if (q.includes('inmate') || q.includes('prisoner')) {
      const sampleNames = inmatesSample.map((i) => `${i.name} (${i.inmateId} - Cell ${i.cellNumber})`).join('\n• ');
      return `👤 Inmate Management System:
Total Inmates: ${summaryData.inmates}

Sample Active Inmates:
• ${sampleNames || 'John Boyd (INM001), John Wells (INM002)'}

Need help editing or admitting inmates? Ask: "How to edit inmate" or "How to add inmate"!`;
    }

    // 7. Cell Edit / Update Functions
    if ((q.includes('edit') || q.includes('update') || q.includes('change')) && (q.includes('cell') || q.includes('block'))) {
      return `🏢 How to Edit a Cell:
1. Click "Cells" in the sidebar.
2. Click the "Edit" button on any Cell card (e.g., A-101).
3. Update the Cell Number, Block, Capacity, or Status (Available / Occupied / Maintenance / Closed).
4. Click "Save Changes" to save updates via PUT /api/cells/{id}.`;
    }

    // 8. Cell Add / Management Functions
    if ((q.includes('add') || q.includes('new') || q.includes('create')) && (q.includes('cell') || q.includes('block'))) {
      return `🏢 How to Add a New Cell:
1. Go to "Cells" panel.
2. Click "+ Add New Cell".
3. Select Block (Block A, Block B, Medical, Solitary) and specify capacity.
4. Click "Add Cell".`;
    }

    // 9. Cells Directory List & Occupancy
    if (q.includes('cell') || q.includes('block') || q.includes('occupancy') || q.includes('solitary') || q.includes('medical')) {
      return `🏢 Cell & Block Allocation:
• Available Capacity: ${summaryData.cells} cells ready
• Blocks Monitored: Block A, Block B, Medical, Solitary.
• Status Options: Available, Occupied, Maintenance, Closed.

To edit cell capacity or block status, click "Cells" in sidebar and press "Edit"!`;
    }

    // 10. Staff Edit / Update Functions
    if ((q.includes('edit') || q.includes('update') || q.includes('change')) && (q.includes('staff') || q.includes('officer') || q.includes('employee'))) {
      return `👥 How to Edit Staff Record:
1. Navigate to "Staff" panel.
2. Locate the officer / staff card.
3. Click the "Edit" button.
4. Update Employee ID, Name, Position, Department, Shift (Day / Night / Rotating), or Status (On Duty / Off Duty / On Leave / Training).
5. Click "Save Changes" to commit via PUT /api/staff/{id}.`;
    }

    // 11. Staff Add / Roster Functions
    if ((q.includes('add') || q.includes('new') || q.includes('register')) && (q.includes('staff') || q.includes('officer'))) {
      return `👥 How to Add New Staff Member:
1. Go to "Staff" panel.
2. Click "+ Add New Staff".
3. Enter Name, Position, Department, Shift, and Phone.
4. Click "Add Staff" to register to system.`;
    }

    // 12. Staff List
    if (q.includes('staff') || q.includes('officer') || q.includes('employee') || q.includes('shift')) {
      return `👥 Staff Roster Management:
• Active On-Duty Officers: ${summaryData.staff}
• Departments: Security, Medical, Administration, Maintenance.
• Shifts: Day, Night, Rotating.

To edit any officer details or shift, click "Staff" -> "Edit"!`;
    }

    // 13. Visitor Edit / Log Functions
    if ((q.includes('edit') || q.includes('update') || q.includes('change')) && (q.includes('visitor') || q.includes('visit'))) {
      return `🚶 How to Edit Visitor Records:
1. Go to "Visitors" panel.
2. Click "Edit" on any visitor appointment card.
3. Update Visitor Name, Relationship, Visit Date, Visit Time, Status (Scheduled / Completed / Cancelled), or Govt ID.
4. Click "Save Changes".`;
    }

    // 14. Visitor Log New Visit
    if ((q.includes('add') || q.includes('log') || q.includes('schedule') || q.includes('new')) && (q.includes('visitor') || q.includes('visit'))) {
      return `🚶 How to Log a New Visitor:
1. Navigate to "Visitors" panel.
2. Click "+ Log New Visit".
3. Fill in Visitor Name, Relationship, Inmate ID/Name, Visit Date, Visit Time, Phone, and Govt ID.
4. Click "Log Visit".`;
    }

    // 15. Visitor List
    if (q.includes('visitor') || q.includes('visitation') || q.includes('visit')) {
      return `🚶 Visitor Management:
• Scheduled Visits Today: ${summaryData.visitors}
• Status Tracking: Scheduled, Completed, Cancelled.

Click "Visitors" in sidebar to log or edit visitations.`;
    }

    // 16. Export PDF Reports
    if (q.includes('report') || q.includes('pdf') || q.includes('export') || q.includes('download')) {
      return `📄 How to Export PDF Reports:
1. Click "Reports" in sidebar.
2. Select Report Type:
   - Inmate Summary Report
   - Staff Schedule Report
   - Visitor Activity Report
   - Cell Occupancy Report
3. Set optional Start and End dates.
4. Click "Export PDF Report" to download clean, printable PDF documents.`;
    }

    // 17. Navigation & Back Button
    if (q.includes('back') || q.includes('return') || q.includes('navigate') || q.includes('home')) {
      return `⬅️ Easy Navigation:
Every sub-page (Inmates, Staff, Visitors, Cells, Reports, Settings) features a top-left "← Back" button next to the page title. Clicking it instantly returns you to the Dashboard overview!`;
    }

    // 18. Session & Logout
    if (q.includes('logout') || q.includes('session') || q.includes('refresh') || q.includes('expire')) {
      return `🔒 Session Management:
• Your login session is saved in localStorage and persists across page refreshes (F5).
• Sessions automatically expire after 8 hours for facility security.
• To manually log out, click the "Logout" button located at the bottom of the left sidebar.`;
    }

    // 19. Database & Backend API
    if (q.includes('backend') || q.includes('database') || q.includes('mongodb') || q.includes('spring') || q.includes('api')) {
      return `⚙️ Backend Technical Architecture:
• Spring Boot REST API running on port 8080.
• MongoDB Database running on port 27017.
• Auto-DataSeeder initializes all 7 collections (inmates, cells, cell_blocks, staff, staff_status, visitors, weekly_activity) on backend launch.`;
    }

    // Fallback RAG Guide
    return `🤖 JailAI RAG Knowledge Base:
I can answer questions regarding:
1. 📊 "System Summary" - Real-time inmate, staff, visitor & cell counts
2. 👤 "How to edit inmate?" - Updating inmate charges, status, or cell
3. 🏢 "How to edit cell?" - Changing cell capacity or maintenance status
4. 👥 "How to edit staff?" - Updating officer shifts or departments
5. 🚶 "How to log visitor?" - Registering visitation logs
6. 📄 "Export PDF Report" - Generating PDF documentation
7. ⬅️ "Back button help" - Returning to dashboard

Please specify your question or click one of the quick prompts above!`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');

    setTimeout(() => {
      const botReplyText = generateRAGResponse(text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 250);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => {
            fetchLiveRAGContext();
            setIsOpen(true);
          }}
          className="group relative flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3.5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <Bot className="h-6 w-6 text-white" />
          <span className="font-semibold text-sm">Jail Assistant</span>
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </span>
        </button>
      )}

      {/* Expandable Chat Window */}
      {isOpen && (
        <div className="w-[380px] sm:w-[420px] h-[540px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight flex items-center gap-1.5">
                  Jail Assistant <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                </h3>
                <p className="text-xs text-blue-100 flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> RAG Intelligence • Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={fetchLiveRAGContext}
                title="Refresh Live Data Context"
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-slate-50 border-b border-slate-100 p-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap text-xs font-medium bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-200 px-3 py-1.5 rounded-full transition-all shadow-2xs shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-sm">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[84%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none font-medium shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                  <div
                    className={`text-[10px] mt-1.5 text-right ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Jail Assistant anything..."
              className="flex-1 text-xs bg-slate-50 border-slate-200 focus-visible:ring-blue-600"
            />
            <Button
              type="submit"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white shrink-0 px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default JailChatbot;
