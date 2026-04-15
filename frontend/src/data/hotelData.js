// /data/hotelData.js
export const hotels = [
  {
    id: 1,
    name: "Luxury Palace Hotel",
    location: "Phnom Penh",
    price: "$120/night",
    rating: 4.8,
    image: "/images/room1.jpg",
    description: "Experience world-class service and elegant rooms in the heart of the city.",
    amenities: ["Free Wifi", "Breakfast", "AC", "Parking"],
    coordinates: { lat: 11.5564, lng: 104.9282 },
    manager: {
      name: "John Luxury",
      avatar: "/users/user-01.jpg",
      contact: "john@luxury-palace.com"
    }
  },
  {
    id: 2,
    name: "Coastal Breeze Resort",
    location: "Sihanoukville",
    price: "$85/night",
    rating: 4.5,
    image: "/images/room2.jpg",
    description: "Relax by the ocean with stunning views and private beach access.",
    amenities: ["Free Wifi", "Pool", "AC", "Beach"],
    coordinates: { lat: 10.6093, lng: 103.5296 },
    manager: {
      name: "Sarah Coast",
      avatar: "/users/user-02.jpg",
      contact: "sarah@coastal-breeze.com"
    }
  },
  {
    id: 3,
    name: "Heritage Boutique Inn",
    location: "Siem Reap",
    price: "$65/night",
    rating: 4.7,
    image: "/images/room3.jpg",
    description: "A charming stay with traditional architecture near Angkor Wat.",
    amenities: ["Free Wifi", "Breakfast", "AC", "Bicycle"],
    coordinates: { lat: 13.3671, lng: 103.8448 },
    manager: {
      name: "Darren Siem",
      avatar: "/users/user-03.jpg",
      contact: "darren@heritage-inn.com"
    }
  },
  {
    id: 4,
    name: "Skyline View Hotel",
    location: "Phnom Penh",
    price: "$110/night",
    rating: 4.6,
    image: "/images/room4.jpg",
    description: "Modern rooms with panoramic city views and a rooftop bar.",
    amenities: ["Free Wifi", "Gym", "AC", "Bar"],
    coordinates: { lat: 11.5449, lng: 104.9150 },
    manager: {
      name: "Emily Sky",
      avatar: "/users/user-04.jpg",
      contact: "emily@skyline-view.com"
    }
  },
  {
    id: 5,
    name: "Riverside Garden Hotel",
    location: "Phnom Penh",
    price: "$95/night",
    rating: 4.4,
    image: "/images/room1.jpg",
    description: "A peaceful retreat along the river with lush gardens and quiet atmosphere.",
    amenities: ["Free Wifi", "AC", "Garden", "Quiet"],
    coordinates: { lat: 11.5621, lng: 104.9312 },
    manager: {
      name: "Sophea River",
      avatar: "/users/user-01.jpg",
      contact: "sophea@riverside-garden.com"
    }
  },
  {
    id: 6,
    name: "Mountain Top Resort",
    location: "Kampot",
    price: "$150/night",
    rating: 4.9,
    image: "/images/room2.jpg",
    description: "Breathtaking views of the mountains and clouds from your private balcony.",
    amenities: ["Free Wifi", "Pool", "AC", "View"],
    coordinates: { lat: 10.5942, lng: 104.1815 },
    manager: {
      name: "Arun Mountain",
      avatar: "/users/user-02.jpg",
      contact: "arun@mountain-top.com"
    }
  }
];
