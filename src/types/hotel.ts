export interface HotelInfo {
  name: string;
  tagline: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsapp: string;
  email: string;
  receptionHours: string;
  checkInTime: string;
  checkOutTime: string;
  googleRating: number;
  reviewCount: number;
  googleMapsUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  heroHeading: string;
  heroSubheading: string;
  aboutStory: string;
  policies: {
    cancellation: string;
    pets: string;
    smoking: string;
    children: string;
    paymentMethods: string[];
  };
  socials: {
    facebook?: string;
    instagram?: string;
    tripadvisor?: string;
  };
  ota?: {
    agodaPropertyId: string;
    agodaUrl: string;
    easeMyTripId: string;
    easeMyTripUrl: string;
    bluePillowUrl: string;
  };
}

export interface RoomType {
  id: string;
  name: string;
  tagline: string;
  description: string;
  priceNpr: number;
  maxAdults: number;
  maxChildren: number;
  bedConfig: string;
  roomSizeSqM: number;
  viewType: string;
  breakfastIncluded: boolean;
  breakfastPriceNpr: number;
  cancellationPolicy: string;
  amenities: string[];
  photos: string[];
  totalInventory: number;
  isActive: boolean;
}

export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled';

export interface Booking {
  id: string;
  bookingReference: string;
  roomId: string;
  roomName: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nights: number;
  numRooms: number;
  adults: number;
  children: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  includeBreakfast: boolean;
  specialRequests?: string;
  roomRatePerNightNpr: number;
  subtotalNpr: number;
  breakfastTotalNpr: number;
  taxNpr: number;
  totalNpr: number;
  status: BookingStatus;
  adminNotes?: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'rooms' | 'exterior' | 'dining' | 'surroundings' | 'terrace';
  url: string;
  caption: string;
}

export interface GuestReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  source: 'Google Maps' | 'Agoda' | 'Verified Guest';
  tripType: string;
  comment: string;
}

export interface NearbyAttraction {
  name: string;
  category: string;
  distance: string;
  travelTime: string;
  description: string;
  image: string;
}
