import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faStar } from "@fortawesome/free-solid-svg-icons";
import img1 from "../../assets/images/Z (6).jpeg";

class Discover extends React.Component {
  state = {
    sort: 'price_asc', // price_asc | price_desc
    hotels: [],
    loading: false,
    error: null,
  };

  componentDidMount() {
    this.loadHotels();
  }

  async loadHotels() {
    const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || null;
    // project already has src/config/api.js with API_BASE_URL; to avoid circular deps,
    // we’ll just call same-origin relative endpoint.
    // If you prefer, we can import it later.

    this.setState({ loading: true, error: null });

    try {
      const url = `/api/hotels?sort=${encodeURIComponent(this.state.sort)}`;
      const resp = await fetch(url, { credentials: 'include' });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to load hotels');
      }

      this.setState({ hotels: data.hotels || [], loading: false });
    } catch (e) {
      this.setState({ error: e.message || String(e), loading: false });
    }
  }

  onSortChange = async (e) => {
    const v = String(e.target.value || 'Prices');
    const nextSort = v === 'High' ? 'price_desc' : v === 'Lowest' ? 'price_asc' : 'price_asc';
    this.setState({ sort: nextSort }, () => this.loadHotels());
  };

  renderStars() {
    // Keep UI consistent with existing cards; if you store rating in DB later,
    // we can replace this with dynamic stars.
    return (
      <div className="flex flex-wrap justify-start gap-0 bg-white">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div className="w-auto" key={idx}>
            <FontAwesomeIcon icon={faStar} className="text-lg mx-0 text-amber-500" />
          </div>
        ))}
      </div>
    );
  }

  renderHotelCard = (hotel, idx) => {
    const hotelName = hotel.hotelName || hotel.hotel_name || hotel.name || hotel.Hotel || `hotel-${idx}`;
    const priceNumber = hotel.priceNumber ?? hotel.price ?? null;
    const priceText = priceNumber != null && priceNumber !== '' ? `$${priceNumber} per night` : '';


    const imageUrl = hotel.imageUrl || hotel.image_url || null;

    // NOTE: routes in your app are fixed; if DB hotel names don’t match route slugs,
    // we can add a column like `route_path` in hotelsdetail.
    const pathMap = {
      'royal grand hotel': '/royal-grand-hotel',
      'corona hotel': '/corona-hotel',
      'boluvard palace': '/boluvard-palace',
      'bella casa hotel': '/bella-casa-hotel',
      'bella casa': '/bella-casa-hotel',
      'sinkor palace hotel': '/sinkor-palace-hotel',
      'fammington hotel': '/fammington-hotel',
      'boluvard hotel': '/boluvard-palace',
    };

    const normalized = String(hotelName).trim().toLowerCase();
    const to = pathMap[normalized] || '/';

    return (
      <div className="bg-white w-full h-auto" key={hotel.id || hotelName || idx}>
        <div className="w-auto h-auto">
          {imageUrl ? (
            <img src={imageUrl} alt={hotelName} className="object-cover w-full h-52 sm:h-56 md:h-60" />
          ) : (
            <img src={img1} alt={hotelName} className="object-cover w-full h-52 sm:h-56 md:h-60" />
          )}
        </div>

        <p className="text-lg py-5 font-sans text-left capitalize mx-0 font-medium">
          <Link to={to}>{hotelName}</Link>
          <br />
          <ul className="display inline-flex flex-nowrap justify-evenly gap-5">
            <li className="font-sans text-sm font-normal"> </li>
            <li className="font-sans text-sm font-normal">{priceText}</li>
          </ul>
        </p>

        {this.renderStars()}
      </div>
    );
  };

  render() {
    const { hotels, loading, error } = this.state;

    return (
      <>
        <div
          className="bg-white h-auto md:mb-20 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
          id="discover"
        >
          <div className="bg-white flex flex-wrap items-center justify-between gap-2">
            <div className="w-auto bg-white"> </div>
            <div className="w-auto bg-white">
              <h1 className="text-xl font-semibold mx-0 py-6 sm:py-8 text-left md:mr-0 font-sans capitalize">
                <FontAwesomeIcon icon={faFilter} className="text-lg mx-0" />

                <span className="text-sm font-normal">
                  <select
                    name="option"
                    id="option"
                    className="border-none"
                    onChange={this.onSortChange}
                    value={this.state.sort === 'price_desc' ? 'High' : 'Lowest'}
                  >
                    <option value="Prices">Sort prices</option>
                    <option value="High">High</option>
                    <option value="Lowest">Lowest</option>
                  </select>
                </span>
              </h1>
            </div>
          </div>

          {loading && <div className="py-10 text-center">Loading hotels...</div>}
          {error && <div className="py-10 text-center text-red-500">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-6 sm:mt-8">
            {hotels.map(this.renderHotelCard)}
          </div>
        </div>
      </>
    );
  }
}

export default Discover;

