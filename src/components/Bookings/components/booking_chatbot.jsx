import React from "react";

const API_BASE_URL = "https://luxx-hotel-api.gabrielwkun.workers.dev";

const quickPrompts = [
  "How do I book a room?",
  "What payment do you accept?",
  "Can you help me choose a hotel?",
];

class BookingChatbot extends React.Component {
  state = {
    open: false,
    input: "",
    messages: [
      {
        role: "assistant",
        text: "Hi, I can help you pick a hotel, explain booking steps, and answer payment questions.",
      },
    ],
    isSending: false,
    error: null,
  };

  scrollRef = React.createRef();

  componentDidUpdate(prevProps, prevState) {
    if (this.state.messages.length !== prevState.messages.length) {
      this.scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }

  toggleOpen = () => {
    this.setState((state) => ({ open: !state.open, error: null }));
  };

  setPrompt = (text) => {
    this.setState({ input: text });
  };

  handleChange = (event) => {
    this.setState({ input: event.target.value });
  };

  buildContext = () => {
    const hotelName = this.props.hotelName || "our hotels";
    return `You are a helpful hotel booking assistant for Luxx Hotel Management System. The current hotel context is ${hotelName}. Help guests choose a hotel, explain booking steps, and answer payment or room questions. Keep replies concise, practical, and friendly. If the guest asks for something outside booking, guide them back to reservations.`;
  };

  sendMessage = async (event) => {
    event.preventDefault();
    const text = this.state.input.trim();
    if (!text || this.state.isSending) return;

    const nextMessages = [...this.state.messages, { role: "user", text }];
    this.setState({
      messages: nextMessages,
      input: "",
      isSending: true,
      error: null,
    });

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages,
          hotelName: this.props.hotelName || "",
          context: this.buildContext(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.details || "Assistant is unavailable right now.");
      }

      this.setState((state) => ({
        messages: [...state.messages, { role: "assistant", text: data.reply }],
        isSending: false,
      }));
    } catch (error) {
      this.setState((state) => ({
        messages: [
          ...state.messages,
          {
            role: "assistant",
            text: error.message || "I could not reach the booking assistant.",
          },
        ],
        isSending: false,
        error: error.message,
      }));
    }
  };

  render() {
    const { open, messages, input, isSending, error } = this.state;

    return (
      <div className="fixed bottom-4 right-4 z-50 w-[22rem] max-w-[calc(100vw-2rem)]">
        {open ? (
          <div className="border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
              <div>
                <p className="text-sm font-semibold text-gray-900">Booking Assistant</p>
                <p className="text-xs text-gray-500">Ask about rooms, dates, and payment</p>
              </div>
              <button type="button" onClick={this.toggleOpen} className="text-sm text-gray-500 hover:text-gray-900">
                Close
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto px-3 py-3 space-y-3 bg-gray-50">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[85%] rounded-none px-3 py-2 text-sm leading-5 ${
                    message.role === "user"
                      ? "ml-auto bg-blue-700 text-white"
                      : "mr-auto bg-white text-gray-900 border border-gray-200"
                  }`}
                >
                  {message.text}
                </div>
              ))}
              <div ref={this.scrollRef} />
            </div>

            <div className="flex flex-wrap gap-2 border-t border-gray-200 bg-white px-3 py-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => this.setPrompt(prompt)}
                  className="border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:border-blue-700 hover:text-blue-700"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form onSubmit={this.sendMessage} className="border-t border-gray-200 bg-white p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={this.handleChange}
                  placeholder="Ask a booking question"
                  className="min-w-0 flex-1 border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
                />
                <button
                  type="submit"
                  disabled={isSending}
                  className="bg-blue-700 px-3 py-2 text-sm text-white disabled:opacity-60"
                >
                  {isSending ? "..." : "Send"}
                </button>
              </div>
              {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
            </form>
          </div>
        ) : (
          <button
            type="button"
            onClick={this.toggleOpen}
            className="ml-auto block bg-blue-700 px-4 py-3 text-sm font-medium text-white shadow-lg"
          >
            Chat with booking assistant
          </button>
        )}
      </div>
    );
  }
}

export default BookingChatbot;
