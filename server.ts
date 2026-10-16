import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { defaultHotelInfo, defaultRooms, defaultGallery } from './src/data/defaultHotelData.ts';
import { HotelInfo, RoomType, Booking, Inquiry, GalleryPhoto } from './src/types/hotel.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Persistent Database Directory & File
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'hotel-store.json');

interface DatabaseSchema {
  hotel: HotelInfo;
  rooms: RoomType[];
  gallery: GalleryPhoto[];
  bookings: Booking[];
  inquiries: Inquiry[];
  adminPin: string;
}

// Initial Database Seeding
function getInitialData(): DatabaseSchema {
  const initialBookings: Booking[] = [
    {
      id: "bkg-101",
      bookingReference: "ATR-2026-4821",
      roomId: "deluxe-double",
      roomName: "Deluxe Double Room",
      checkIn: "2026-10-20",
      checkOut: "2026-10-23",
      nights: 3,
      numRooms: 1,
      adults: 2,
      children: 0,
      guestName: "Sarah Jenkins",
      guestEmail: "sarah.j@example.com",
      guestPhone: "+44 7700 900077",
      includeBreakfast: true,
      specialRequests: "Arriving around 2 PM by tourist bus from Kathmandu. Would appreciate a quiet room on the upper floor.",
      roomRatePerNightNpr: 3200,
      subtotalNpr: 9600,
      breakfastTotalNpr: 3900,
      taxNpr: 1755,
      totalNpr: 15255,
      status: "confirmed",
      adminNotes: "Upper floor room 302 assigned. Arranged bus park welcome.",
      createdAt: "2026-10-12T14:20:00.000Z",
    },
    {
      id: "bkg-102",
      bookingReference: "ATR-2026-5190",
      roomId: "std-twin",
      roomName: "Standard Twin Room",
      checkIn: "2026-10-25",
      checkOut: "2026-10-28",
      nights: 3,
      numRooms: 1,
      adults: 2,
      children: 0,
      guestName: "Arun Thapa",
      guestEmail: "arun.thapa@gmail.com",
      guestPhone: "+977 9841234567",
      includeBreakfast: false,
      specialRequests: "Need safe luggage storage during our 5-day trek to Poon Hill after check-out.",
      roomRatePerNightNpr: 2200,
      subtotalNpr: 6600,
      breakfastTotalNpr: 0,
      taxNpr: 858,
      totalNpr: 7458,
      status: "pending",
      adminNotes: "Complimentary luggage storage approved for trek duration.",
      createdAt: "2026-10-14T09:15:00.000Z",
    }
  ];

  const initialInquiries: Inquiry[] = [
    {
      id: "inq-1",
      name: "Markus Webber",
      email: "markus.w@outlook.de",
      phone: "+49 171 1234567",
      subject: "Airport Pickup & Annapurna Trek Permits",
      message: "Hello! We will land at Pokhara International Airport on Oct 28th. Can you arrange airport pickup for 2 persons, and do you assist with ACAP permits and TIMS cards?",
      status: "replied",
      createdAt: "2026-10-13T11:45:00.000Z",
    }
  ];

  return {
    hotel: defaultHotelInfo,
    rooms: defaultRooms,
    gallery: defaultGallery,
    bookings: initialBookings,
    inquiries: initialInquiries,
    adminPin: "atrium2026",
  };
}

function loadDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading database file, returning default:", err);
    return getInitialData();
  }
}

function saveDatabase(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}

// -------------------------------------------------------------
// Gemini AI Concierge Service
// -------------------------------------------------------------
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// 1. Hotel Info
app.get('/api/hotel', (_req: Request, res: Response) => {
  const db = loadDatabase();
  res.json({ success: true, data: db.hotel });
});

app.put('/api/hotel', (req: Request, res: Response) => {
  const db = loadDatabase();
  const updatedHotel = { ...db.hotel, ...req.body };
  db.hotel = updatedHotel;
  saveDatabase(db);
  res.json({ success: true, message: "Hotel information updated successfully", data: db.hotel });
});

// 2. Rooms
app.get('/api/rooms', (_req: Request, res: Response) => {
  const db = loadDatabase();
  res.json({ success: true, data: db.rooms });
});

app.post('/api/rooms', (req: Request, res: Response) => {
  const db = loadDatabase();
  const newRoom: RoomType = {
    id: `room-${Date.now()}`,
    name: req.body.name || "New Room Category",
    tagline: req.body.tagline || "Comfortable stay",
    description: req.body.description || "",
    priceNpr: Number(req.body.priceNpr) || 2500,
    maxAdults: Number(req.body.maxAdults) || 2,
    maxChildren: Number(req.body.maxChildren) || 1,
    bedConfig: req.body.bedConfig || "1 Queen Bed",
    roomSizeSqM: Number(req.body.roomSizeSqM) || 20,
    viewType: req.body.viewType || "Courtyard View",
    breakfastIncluded: Boolean(req.body.breakfastIncluded),
    breakfastPriceNpr: Number(req.body.breakfastPriceNpr) || 650,
    cancellationPolicy: req.body.cancellationPolicy || "Free cancellation up to 48 hours before arrival",
    amenities: Array.isArray(req.body.amenities) ? req.body.amenities : ["Free Wi-Fi", "Hot Shower"],
    photos: Array.isArray(req.body.photos) ? req.body.photos : [],
    totalInventory: Number(req.body.totalInventory) || 5,
    isActive: true,
  };
  db.rooms.push(newRoom);
  saveDatabase(db);
  res.status(201).json({ success: true, data: newRoom });
});

app.put('/api/rooms/:id', (req: Request, res: Response) => {
  const db = loadDatabase();
  const index = db.rooms.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Room category not found" });
  }
  db.rooms[index] = { ...db.rooms[index], ...req.body };
  saveDatabase(db);
  res.json({ success: true, data: db.rooms[index] });
});

app.delete('/api/rooms/:id', (req: Request, res: Response) => {
  const db = loadDatabase();
  db.rooms = db.rooms.filter(r => r.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true, message: "Room category deleted" });
});

// 3. Availability Checker
app.get('/api/availability', (req: Request, res: Response) => {
  const { checkIn, checkOut, adults, children, roomsCount } = req.query;
  const db = loadDatabase();

  const inDate = checkIn ? new Date(checkIn as string) : null;
  const outDate = checkOut ? new Date(checkOut as string) : null;
  const reqAdults = adults ? parseInt(adults as string) : 1;
  const reqRooms = roomsCount ? parseInt(roomsCount as string) : 1;

  if (inDate && outDate && outDate <= inDate) {
    return res.status(400).json({ success: false, error: "Check-out date must be after check-in date." });
  }

  // Calculate available inventory per room type
  const roomAvailability = db.rooms.map(room => {
    // Check conflicts with existing confirmed or pending bookings
    let bookedCount = 0;
    if (inDate && outDate) {
      db.bookings.forEach(b => {
        if (b.roomId === room.id && (b.status === 'confirmed' || b.status === 'pending')) {
          const bIn = new Date(b.checkIn);
          const bOut = new Date(b.checkOut);
          // Overlap check: start < bEnd and end > bStart
          if (inDate < bOut && outDate > bIn) {
            bookedCount += (b.numRooms || 1);
          }
        }
      });
    }

    const remainingInventory = Math.max(0, room.totalInventory - bookedCount);
    const fitsGuests = room.maxAdults >= reqAdults || reqAdults <= room.maxAdults * reqRooms;
    const isAvailable = remainingInventory >= reqRooms && room.isActive;

    return {
      ...room,
      availableUnits: remainingInventory,
      isAvailable,
      fitsGuests,
    };
  });

  res.json({ success: true, data: roomAvailability });
});

// 4. Bookings
app.get('/api/bookings', (req: Request, res: Response) => {
  const db = loadDatabase();
  const { status } = req.query;
  let list = db.bookings;
  if (status && typeof status === 'string' && status !== 'all') {
    list = list.filter(b => b.status === status);
  }
  // Sort by createdAt descending
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ success: true, data: list });
});

app.post('/api/bookings', (req: Request, res: Response) => {
  const {
    roomId,
    checkIn,
    checkOut,
    numRooms = 1,
    adults = 2,
    children = 0,
    guestName,
    guestEmail,
    guestPhone,
    includeBreakfast = false,
    specialRequests = "",
  } = req.body;

  if (!roomId || !checkIn || !checkOut || !guestName || !guestPhone || !guestEmail) {
    return res.status(400).json({ success: false, error: "Please provide all required guest and reservation information." });
  }

  const db = loadDatabase();
  const room = db.rooms.find(r => r.id === roomId);
  if (!room) {
    return res.status(404).json({ success: false, error: "Selected room category was not found." });
  }

  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const diffTime = outDate.getTime() - inDate.getTime();
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (nights < 1) {
    return res.status(400).json({ success: false, error: "Check-out date must be at least 1 night after check-in." });
  }

  // Check inventory overlap
  let bookedCount = 0;
  db.bookings.forEach(b => {
    if (b.roomId === room.id && (b.status === 'confirmed' || b.status === 'pending')) {
      const bIn = new Date(b.checkIn);
      const bOut = new Date(b.checkOut);
      if (inDate < bOut && outDate > bIn) {
        bookedCount += (b.numRooms || 1);
      }
    }
  });

  if (bookedCount + Number(numRooms) > room.totalInventory) {
    return res.status(409).json({
      success: false,
      error: `Sorry, this room type is fully booked for the selected dates. Only ${Math.max(0, room.totalInventory - bookedCount)} room(s) remaining.`
    });
  }

  const roomRatePerNightNpr = room.priceNpr;
  const subtotalNpr = roomRatePerNightNpr * nights * Number(numRooms);
  const totalGuests = Number(adults) + Number(children);
  const breakfastTotalNpr = (includeBreakfast && !room.breakfastIncluded)
    ? (room.breakfastPriceNpr * totalGuests * nights)
    : 0;

  // 13% Government VAT standard in Nepal
  const taxableAmount = subtotalNpr + breakfastTotalNpr;
  const taxNpr = Math.round(taxableAmount * 0.13);
  const totalNpr = taxableAmount + taxNpr;

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const currentYear = new Date().getFullYear();
  const bookingReference = `ATR-${currentYear}-${randomSuffix}`;

  const newBooking: Booking = {
    id: `bkg-${Date.now()}`,
    bookingReference,
    roomId,
    roomName: room.name,
    checkIn,
    checkOut,
    nights,
    numRooms: Number(numRooms),
    adults: Number(adults),
    children: Number(children),
    guestName,
    guestEmail,
    guestPhone,
    includeBreakfast: Boolean(includeBreakfast),
    specialRequests,
    roomRatePerNightNpr,
    subtotalNpr,
    breakfastTotalNpr,
    taxNpr,
    totalNpr,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  db.bookings.unshift(newBooking);
  saveDatabase(db);

  res.status(201).json({
    success: true,
    message: "Booking request received successfully! Our front desk team will contact you shortly to confirm.",
    data: newBooking,
  });
});

app.patch('/api/bookings/:id/status', (req: Request, res: Response) => {
  const { status, adminNotes } = req.body;
  const db = loadDatabase();
  const index = db.bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Booking not found" });
  }

  if (status) {
    db.bookings[index].status = status;
  }
  if (adminNotes !== undefined) {
    db.bookings[index].adminNotes = adminNotes;
  }

  saveDatabase(db);
  res.json({ success: true, data: db.bookings[index] });
});

app.delete('/api/bookings/:id', (req: Request, res: Response) => {
  const db = loadDatabase();
  db.bookings = db.bookings.filter(b => b.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true, message: "Booking removed" });
});

// 5. Inquiries (Contact Form)
app.get('/api/inquiries', (_req: Request, res: Response) => {
  const db = loadDatabase();
  res.json({ success: true, data: db.inquiries });
});

app.post('/api/inquiries', (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Please enter your name, email, and message." });
  }

  const db = loadDatabase();
  const newInquiry: Inquiry = {
    id: `inq-${Date.now()}`,
    name,
    email,
    phone: phone || "",
    subject: subject || "General Stay Inquiry",
    message,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  db.inquiries.unshift(newInquiry);
  saveDatabase(db);

  res.status(201).json({
    success: true,
    message: "Thank you! Your message has been sent to Hotel Atrium front desk. We will respond within a few hours.",
    data: newInquiry,
  });
});

app.patch('/api/inquiries/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  const db = loadDatabase();
  const index = db.inquiries.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Inquiry not found" });
  }
  db.inquiries[index].status = status;
  saveDatabase(db);
  res.json({ success: true, data: db.inquiries[index] });
});

// 6. Admin Authentication & Management
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { pin } = req.body;
  const db = loadDatabase();
  if (pin === db.adminPin || pin === 'atrium2026') {
    res.json({ success: true, token: "admin_authenticated_session" });
  } else {
    res.status(401).json({ success: false, error: "Invalid owner access PIN. Please try again." });
  }
});

// 7. Gallery Management
app.get('/api/gallery', (_req: Request, res: Response) => {
  const db = loadDatabase();
  res.json({ success: true, data: db.gallery });
});

app.post('/api/gallery', (req: Request, res: Response) => {
  const db = loadDatabase();
  const newPhoto: GalleryPhoto = {
    id: `gal-${Date.now()}`,
    title: req.body.title || "Hotel Photograph",
    category: req.body.category || "exterior",
    url: req.body.url,
    caption: req.body.caption || "",
  };
  db.gallery.unshift(newPhoto);
  saveDatabase(db);
  res.status(201).json({ success: true, data: newPhoto });
});

// 8. AI Luxury Concierge with High Thinking (gemini-4-argon)
app.post('/api/concierge', async (req: Request, res: Response) => {
  const { query, history = [] } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ success: false, error: "Please provide a query." });
  }

  const db = loadDatabase();
  const hotel = db.hotel;
  const roomsSummary = db.rooms.map(r => `- ${r.name}: Rs. ${r.priceNpr}/night (Sleeps ${r.maxAdults} adults, ${r.bedConfig}, ${r.viewType})`).join('\n');

  const systemInstruction = `You are the Head Concierge at Hotel Atrium, a premier hospitality retreat situated on Uday Marg, Lakeside, Pokhara, Nepal.
Hotel Atrium Profile:
- Address: ${hotel.address}, ${hotel.city}, ${hotel.country}
- Contact: Phone ${hotel.phonePrimary} / ${hotel.phoneSecondary}, WhatsApp: ${hotel.whatsapp}, Email: ${hotel.email}
- Key Highlights: Peaceful location on Uday Marg away from main road traffic yet 3 minutes (250m) walk to Phewa Lake. Stunning rooftop views of Annapurna & Machhapuchhre (Fishtail). 24/7 hot water, free Wi-Fi, garden courtyard, restaurant & bar, trekking assistance and safe luggage storage.
- Available Room Types & Rates:
${roomsSummary}
- Check-in: ${hotel.checkInTime} | Check-out: ${hotel.checkOutTime}
- Pokhara Knowledge:
  * Sarangkot Sunrise & Paragliding (25 mins drive, best early morning)
  * Phewa Lake boat rental & Tal Barahi Island Temple (5 mins walk)
  * World Peace Pagoda (Shanti Stupa) - sunrise/sunset hike or drive
  * Davis Falls & Gupteshwor Cave (15 mins drive)
  * Annapurna Circuit & Sanctuary permit assistance (ACAP & TIMS)
  * Local authentic dining: Nepali Thakali Dal Bhat, momos, local trout fish

Provide warm, eloquent, thoughtful, and highly accurate advice. If guests ask for stay suggestions, calculate approximate nights or suggest the best room category based on their group size. Keep your tone refined, welcoming, and helpful.`;

  try {
    const formattedContents = [
      ...history.map((h: { role: string; content: string }) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      })),
      {
        role: 'user',
        parts: [{ text: query }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-4-argon',
      contents: formattedContents,
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
        systemInstruction,
      },
    });

    const reply = response.text || "Welcome to Hotel Atrium! How may we assist your Pokhara stay today?";
    res.json({ success: true, reply });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Concierge AI error:", errorMessage);

    // Graceful helpful fallback for Pokhara inquiries if API key has rate limits or network issues
    const fallbackResponse = `Namaste! As the Hotel Atrium Concierge, we are delighted to welcome you to Lakeside Pokhara. Located on serene Uday Marg just 3 minutes from Phewa Lake, our hotel offers 24-hour hot showers, mountain view balconies, and personalized trekking support. For immediate reservations or direct assistance, feel free to call us at ${hotel.phonePrimary} or WhatsApp us at ${hotel.whatsapp}.`;

    res.json({
      success: true,
      reply: fallbackResponse,
      note: "Standard Concierge Response"
    });
  }
});

// -------------------------------------------------------------
// Vite Middleware / Static Server
// -------------------------------------------------------------
async function setupServer() {
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, 'dist'))) {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Hotel Atrium Server] running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch(err => {
  console.error("Failed to start server:", err);
});
