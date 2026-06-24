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
    amenities: ["desk", "coffee machine", "smart TV"],
    experiences: ["city food walk", "live music night", "downtown market visit"],
    trust: "Best for private stays, couples, and guests who prefer a quieter shared environment.",
  },
  {
    name: "Corona Hotel",
    route: "/bookings/corona-hotel",
    price: "$10",
    tags: ["balanced", "business", "mid-range"],
    note: "A balanced mid-range stay for business or leisure guests.",
    amenities: ["desk", "smart TV", "late checkout"],
    experiences: ["local dining guide", "business district tour", "weekend culture stops"],
    trust: "Best for business travelers and guests who want verified, low-noise stays.",
  },
  {
    name: "Boluvard Palace",
    route: "/bookings/boluvard-palace",
    price: "$25",
    tags: ["premium", "long stay", "comfort"],
    note: "Best when you want a more premium room for a longer stay.",
    amenities: ["coffee machine", "desk", "smart TV", "premium bedding"],
    experiences: ["private cultural guide", "fine dining booking", "art and heritage route"],
    trust: "Best for premium shared accommodations where guest verification and stay purpose matter.",
  },
  {
    name: "Fammington Hotel",
    route: "/bookings/fammington-hotel",
    price: "$25",
    tags: ["family", "business", "airport"],
    note: "A strong choice for family trips and business travel.",
    amenities: ["family desk", "smart TV", "airport pickup"],
    experiences: ["family cultural outing", "airport area food stops", "local craft market"],
    trust: "Best for families, business travelers, and guests who want compatibility checks before shared stays.",
  },
  {
    name: "Sinkor Palace Hotel",
    route: "/bookings/sinkor-palace-hotel",
    price: "$5",
    tags: ["budget", "simple", "quick stay"],
    note: "A budget-friendly option for simple, practical stays.",
    amenities: ["desk", "fan", "basic TV"],
    experiences: ["street food suggestions", "neighborhood market", "local transport tips"],
    trust: "Best for budget guests who want simple verification and clear house expectations.",
  },
  {
    name: "Bella Casa Hotel",
    route: "/bookings/bella-casa-hotel",
    price: "$5",
    tags: ["budget", "quiet", "simple"],
    note: "A low-cost stay with a quieter, easygoing feel.",
    amenities: ["desk", "coffee tray", "basic TV"],
    experiences: ["quiet cafe list", "local food stops", "community walking route"],
    trust: "Best for quiet budget stays with guest compatibility notes before sharing space.",
  },
];

const quickPrompts = [
  "Help me choose a hotel",
  "Negotiate my room price",
  "Customize my room",
  "Add local experiences",
  "Show social trust options",
  "How do I book a room?",
];

const amenityCatalog = [
  { name: "coffee machine", price: "$2" },
  { name: "desk", price: "$1" },
  { name: "smart TV", price: "$3" },
  { name: "late checkout", price: "$2" },
  { name: "airport pickup", price: "$5" },
  { name: "premium bedding", price: "$4" },
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

const parseBudget = (text) => {
  const match = normalizeText(text).match(/(?:\$|usd\s*)?(\d+(?:\.\d{1,2})?)/);
  return match ? Number(match[1]) : null;
};

const getPriceNumber = (price) => Number(String(price).replace(/[^0-9.]/g, ""));

const findAmenities = (text) =>
  amenityCatalog.filter((item) => normalizeText(text).includes(normalizeText(item.name)));

const buildNegotiationReply = (text, hotel) => {
  const targetHotel = hotel || hotels[0];
  const basePrice = getPriceNumber(targetHotel.price);
  const budget = parseBudget(text);

  if (!budget) {
    return `AI price negotiation workflow for ${targetHotel.name}: tell me your target budget, dates, room count, and any amenities you want. I will compare that against the ${targetHotel.price} base price and prepare a hotel approval offer.`;
  }

  if (budget >= basePrice) {
    return `Your $${budget} offer meets the ${targetHotel.name} base price of ${targetHotel.price}. I would submit it as an instant-accept booking request, then keep extras like smart TV, desk, or coffee machine separate so the hotel can approve them cleanly.`;
  }

  const minimumLikely = Math.max(Math.ceil(basePrice * 0.85), 1);
  if (budget >= minimumLikely) {
    return `Your $${budget} offer is close for ${targetHotel.name}. AI negotiation would send it as a conditional offer: ${targetHotel.price} base, requested guest price $${budget}, hotel approval required, payment by Orange Money after acceptance.`;
  }

  return `${targetHotel.name} starts at ${targetHotel.price}, so $${budget} is below the normal negotiation range. A stronger counteroffer is about $${minimumLikely}, or I can suggest a $5 budget hotel instead.`;
};

const buildCustomizationReply = (text, hotel) => {
  const targetHotel = hotel || hotels[0];
  const requestedAmenities = findAmenities(text);
  const availableAmenities = targetHotel.amenities.join(", ");

  if (requestedAmenities.length === 0) {
    return `Room customization workflow for ${targetHotel.name}: available add-ons include ${availableAmenities}. You can ask me to add or remove a coffee machine, desk, smart TV, late checkout, airport pickup, or premium bedding before booking.`;
  }

  const selected = requestedAmenities.map((item) => `${item.name} (${item.price})`).join(", ");
  return `Customization draft for ${targetHotel.name}: add ${selected}. I will keep this as a pre-booking scope item so the hotel can approve the final room setup before payment.`;
};

const buildExperienceReply = (text, hotel) => {
  const targetHotel = hotel || hotels[0];
  const experiences = targetHotel.experiences.join(", ");

  if (text.includes("food") || text.includes("culture") || text.includes("local") || text.includes("tour") || text.includes("experience")) {
    return `Local experience workflow for ${targetHotel.name}: I can attach ${experiences} to the booking scope. Tell me your interest, food, music, markets, family activities, or heritage, and I will match the stay plan.`;
  }

  return `For local culture, ${targetHotel.name} works well with ${experiences}. I can include one of these in the booking notes before you reserve.`;
};

const buildTrustReply = (hotel) => {
  const targetHotel = hotel || hotels[0];
  return `Social trust workflow for shared accommodation at ${targetHotel.name}: ${targetHotel.trust} The assistant should collect verified guest profile, stay purpose, quiet-hours preference, cleanliness expectations, and host or roommate compatibility notes. Reviews should cover both hotel quality and shared-stay guest trust signals.`;
};

const buildLocalReply = (message, preferredHotelName = "") => {
  const text = normalizeText(message);
  const hotel = findHotel(text, preferredHotelName) || getHotelFromPath();

  if (text.includes("haggle") || text.includes("negotiate") || text.includes("deal") || text.includes("discount") || text.includes("offer")) {
    return buildNegotiationReply(text, hotel);
  }

  if (text.includes("custom") || text.includes("amenity") || text.includes("amenities") || text.includes("coffee") || text.includes("desk") || text.includes("smart tv") || text.includes("tv")) {
    return buildCustomizationReply(text, hotel);
  }

  if (text.includes("culture") || text.includes("local") || text.includes("experience") || text.includes("food") || text.includes("music") || text.includes("market") || text.includes("tour")) {
    return buildExperienceReply(text, hotel);
  }

  if (text.includes("trust") || text.includes("shared") || text.includes("roommate") || text.includes("guest review") || text.includes("social")) {
    return buildTrustReply(hotel);
  }

  if (text.includes("payment") || text.includes("orange") || text.includes("money") || text.includes("phone")) {
    return "We accept Orange Money for bookings. Enter your Orange Money phone number in the booking form, then submit your reservation for confirmation.";
  }

  if (text.includes("book") || text.includes("reserve") || text.includes("room") || text.includes("date")) {
    return hotel
      ? `To book ${hotel.name}, choose your check-in and check-out dates, select guests, suite type, and rooms, then add your Orange Money number and press Book Now. I can also prepare negotiation, room customization, local experience, and social trust notes before you submit.`
      : "To book, choose a hotel, pick check-in and check-out dates, select guests, suite type, and rooms, then add your Orange Money number and press Book Now. I can also prepare negotiation, room customization, local experience, and social trust notes before you submit.";
  }

  if (text.includes("price") || text.includes("cost") || text.includes("rate")) {
    return hotel
      ? `${hotel.name} starts at ${hotel.price}. You can ask me to negotiate a target offer or attach room add-ons before booking.`
      : "Current booking prices start from $5, $10, and $25 depending on the hotel. Ask about a hotel name or tell me your budget and I can prepare a negotiation offer.";
  }

  if (text.includes("choose") || text.includes("recommend") || text.includes("best") || text.includes("which")) {
    const suggestions = chooseHotels(text)
      .slice(0, 3)
      .map((item) => `${item.name} (${item.price})`)
      .join(", ");
    return `I would start with ${suggestions}. Tell me your budget, guest count, travel purpose, amenity needs, and local experience interests and I can narrow it down.`;
  }

  if (hotel) {
    return `${hotel.name} starts at ${hotel.price}. ${hotel.note} I can also prepare price negotiation, room customization, local culture, and social trust notes before you book.`;
  }

  return "I can help you choose a hotel, negotiate a room price, customize amenities, add local cultural experiences, review social trust preferences for shared stays, explain Orange Money payment, and guide you through the booking form.";
};

class BookingChatbot extends React.Component {
  state = {
    open: false,
    input: "",
    messages: [
      {
        role: "assistant",
        text: "Hi, I am your Luxx booking assistant. I can help you choose a hotel, negotiate prices, customize rooms, add local experiences, and prepare a reservation.",
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
    return `You are a helpful hotel booking assistant for Luxx Hotel Management System. The current hotel context is ${hotelName}. Help guests choose a hotel, explain booking steps, compare prices, and answer Orange Money payment questions. Also support this scope workflow: 1) AI-assisted price negotiation where guests can propose a budget and the assistant prepares a hotel approval offer, without guaranteeing final approval; 2) real-time room customization before booking, including coffee machine, desk, smart TV, late checkout, airport pickup, or premium bedding; 3) local cultural experiences integrated into booking notes, including food, music, markets, heritage, family outings, and local guides; 4) social trust for shared accommodations, collecting verified guest profile, stay purpose, quiet-hours preference, cleanliness expectations, and roommate or host compatibility notes. Keep replies concise, practical, and clear about what requires hotel approval. Available hotels: ${hotels
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