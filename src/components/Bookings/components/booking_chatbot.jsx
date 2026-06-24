import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faComments,
  faHotel,
  faPaperPlane,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { API_BASE_URL } from "../../../config/api";

const hotels = [
  {
    name: "Royal Grand Hotel",
    route: "/bookings/royal-grand-hotel",
    price: "$10",
    tags: ["city", "couples", "short stay"],
    note: "A comfortable city option for quick stays and couples.",
  },
  {
    name: "Corona Hotel",
    route: "/bookings/corona-hotel",
    price: "$10",
    tags: ["balanced", "business", "mid-range"],
    note: "A balanced mid-range stay for business or leisure guests.",
  },
  {
    name: "Boluvard Palace",
    route: "/bookings/boluvard-palace",
    price: "$25",
    tags: ["premium", "long stay", "comfort"],
    note: "Best when you want a more premium room for a longer stay.",
  },
  {
    name: "Fammington Hotel",
    route: "/bookings/fammington-hotel",
    price: "$25",
    tags: ["family", "business", "airport"],
    note: "A strong choice for family trips and business travel.",
  },
  {
    name: "Sinkor Palace Hotel",
    route: "/bookings/sinkor-palace-hotel",
    price: "$5",
    tags: ["budget", "simple", "quick stay"],
    note: "A budget-friendly option for simple, practical stays.",
  },
  {
    name: "Bella Casa Hotel",
    route: "/bookings/bella-casa-hotel",
    price: "$5",
    tags: ["budget", "quiet", "simple"],
    note: "A low-cost stay with a quieter, easygoing feel.",
  },
];

const quickPrompts = [
  "Help me choose a hotel",
  "How do I book a room?",
  "What payment do you accept?",
  "Which hotel is budget friendly?",
];

const normalizeText = (value = "") => String(value).trim().toLowerCase();

const getHotelFromPath = () => {
  if (typeof window === "undefined") return null;
  const path = window.location.pathname;
  return hotels.find((hotel) => path.includes(hotel.route.replace("/bookings/", ""))) || null;
};

const findHotel = (text, preferredHotelName = "") => {
  const normalized = normalizeText(`${preferredHotelName} ${text}`);
  return hotels.find((hotel) => normalized.includes(normalizeText(hotel.name).replace(" hotel", ""))) || null;
};

const chooseHotels = (text) => {
  const normalized = normalizeText(text);

  if (normalized.includes("budget") || normalized.includes("cheap") || normalized.includes("low")) {
    return hotels.filter((hotel) => hotel.price === "$5");
  }

  if (normalized.includes("family") || normalized.includes("business") || normalized.includes("premium")) {
    return hotels.filter((hotel) => hotel.tags.some((tag) => normalized.includes(tag)) || hotel.price === "$25");
  }

  if (normalized.includes("city") || normalized.includes("couple") || normalized.includes("balanced")) {
    return hotels.filter((hotel) => hotel.price === "$10");
  }

  return [hotels[0], hotels[1], hotels[4]];
};

const buildLocalReply = (message, preferredHotelName = "") => {
  const text = normalizeText(message);
  const hotel = findHotel(text, preferredHotelName) || getHotelFromPath();

  if (text.includes("payment") || text.includes("orange") || text.includes("money") || text.includes("phone")) {
    return "We accept Orange Money for bookings. Enter your Orange Money phone number in the booking form, then submit your reservation for confirmation.";
  }

  if (text.includes("book") || text.includes("reserve") || text.includes("room") || text.includes("date")) {
    return hotel
      ? `To book ${hotel.name}, choose your check-in and check-out dates, select guests, suite type, and rooms, then add your Orange Money number and press Book Now.`
      : "To book, choose a hotel, pick check-in and check-out dates, select guests, suite type, and rooms, then add your Orange Money number and press Book Now.";
  }

  if (text.includes("price") || text.includes("cost") || text.includes("rate")) {
    return hotel
      ? `${hotel.name} starts at ${hotel.price}. You can continue directly from its booking page.`
      : "Current booking prices start from $5, $10, and $25 depending on the hotel. Ask about a hotel name or tell me your budget.";
  }

  if (text.includes("choose") || text.includes("recommend") || text.includes("best") || text.includes("which")) {
    const suggestions = chooseHotels(text)
      .slice(0, 3)
      .map((item) => `${item.name} (${item.price})`)
      .join(", ");
    return `I would start with ${suggestions}. Tell me your budget, guest count, and travel purpose and I can narrow it down.`;
  }

  if (hotel) {
    return `${hotel.name} starts at ${hotel.price}. ${hotel.note} I can also walk you through the booking form.`;
  }

  return "I can help you choose a hotel, compare prices, explain Orange Money payment, and guide you through the booking form.";
};

class BookingChatbot extends React.Component {
  state = {
    open: false,
    input: "",
    messages: [
      {
        role: "assistant",
        text: "Hi, I am your Luxx booking assistant. I can help you choose a hotel, compare prices, and complete a reservation.",
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
    this.setState({ input: text, open: true });
  };

  handleChange = (event) => {
    this.setState({ input: event.target.value });
  };

  buildContext = () => {
    const hotelName = this.props.hotelName || getHotelFromPath()?.name || "Luxx hotels";
    return `You are a helpful hotel booking assistant for Luxx Hotel Management System. The current hotel context is ${hotelName}. Help guests choose a hotel, explain booking steps, compare prices, and answer Orange Money payment questions. Keep replies concise and practical. Available hotels: ${hotels
      .map((hotel) => `${hotel.name} ${hotel.price}`)
      .join(", ")}.`;
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

    const localReply = buildLocalReply(text, this.props.hotelName);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages,
          hotelName: this.props.hotelName || getHotelFromPath()?.name || "",
          context: this.buildContext(),
        }),
      });

      const data = await response.json();
      const reply = response.ok && data.reply ? data.reply : localReply;

      this.setState((state) => ({
        messages: [...state.messages, { role: "assistant", text: reply }],
        isSending: false,
      }));
    } catch (error) {
      this.setState((state) => ({
        messages: [...state.messages, { role: "assistant", text: localReply }],
        isSending: false,
        error: "Using quick booking help while live chat is unavailable.",
      }));
    }
  };

  renderHotelLinks() {
    return (
      <div className="grid grid-cols-1 gap-2 border-t border-gray-200 bg-white p-3 sm:grid-cols-2">
        {hotels.slice(0, 4).map((hotel) => (
          <Link
            key={hotel.name}
            to={hotel.route}
            onClick={() => this.setState({ open: false })}
            className="group flex items-center justify-between border border-gray-200 px-3 py-2 text-left text-xs hover:border-blue-700"
          >
            <span>
              <span className="block font-semibold text-gray-900">{hotel.name}</span>
              <span className="text-gray-500">From {hotel.price}</span>
            </span>
            <FontAwesomeIcon icon={faArrowRight} className="text-blue-700 opacity-70 group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    );
  }

  render() {
    const { open, messages, input, isSending, error } = this.state;

    return (
      <div className="fixed bottom-4 right-4 z-50 w-[23rem] max-w-[calc(100vw-2rem)] font-sans">
        {open ? (
          <div className="overflow-hidden border border-gray-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-blue-700 px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center bg-white/15">
                  <FontAwesomeIcon icon={faHotel} />
                </span>
                <div>
                  <p className="text-sm font-semibold">Luxx Booking Assistant</p>
                  <p className="text-xs text-blue-100">Hotel choice, rooms, dates, payment</p>
                </div>
              </div>
              <button
                type="button"
                onClick={this.toggleOpen}
                aria-label="Close booking assistant"
                className="flex h-8 w-8 items-center justify-center text-white hover:bg-white/15"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto bg-gray-50 px-3 py-3">
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`max-w-[86%] px-3 py-2 text-sm leading-5 ${
                      message.role === "user"
                        ? "ml-auto bg-blue-700 text-white"
                        : "mr-auto border border-gray-200 bg-white text-gray-900"
                    }`}
                  >
                    {message.text}
                  </div>
                ))}
                {isSending && <div className="mr-auto border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500">Typing...</div>}
                <div ref={this.scrollRef} />
              </div>
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

            {this.renderHotelLinks()}

            <form onSubmit={this.sendMessage} className="border-t border-gray-200 bg-white p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={this.handleChange}
                  placeholder="Ask about booking a room"
                  className="min-w-0 flex-1 border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
                />
                <button
                  type="submit"
                  disabled={isSending}
                  aria-label="Send message"
                  className="flex h-10 w-10 items-center justify-center bg-amber-500 text-gray-950 disabled:opacity-60"
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
              {error && <p className="mt-2 text-xs text-amber-700">{error}</p>}
            </form>
          </div>
        ) : (
          <button
            type="button"
            onClick={this.toggleOpen}
            className="ml-auto flex items-center gap-2 bg-blue-700 px-4 py-3 text-sm font-medium text-white shadow-lg hover:bg-blue-800"
          >
            <FontAwesomeIcon icon={faComments} />
            Booking help
          </button>
        )}
      </div>
    );
  }
}

export default BookingChatbot;
