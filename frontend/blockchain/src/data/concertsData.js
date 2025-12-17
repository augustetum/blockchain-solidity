export const CONCERTS_DATA = [
  {
    id: 1,
    name: 'Jessica Shy | Vingio Parkas',
    artist: 'Jessica Shy',
    date: '2025-08-29',
    time: '19:00',
    venue: 'Vingio Parkas',
    city: 'Vilnius',
    image: 'https://www.lrt.lt/img/2025/10/06/2204045-160221-1287x836.jpg',
    availableTickets: 45,
    priceRange: '85€ - 250€'
  },
  {
    id: 2,
    name: 'Vaidas Baumila | Žalgirio arena',
    artist: 'Vaidas Baumila',
    date: '2025-12-28',
    time: '20:00',
    venue: 'Žalgirio Arena',
    city: 'Kaunas',
    image: 'https://store.bilietai.lt/public/image/type/concertsListItem/id/480639/filename/1763373571_baumilakza2025.jpg',
    availableTickets: 128,
    priceRange: '39€-66.89€'
  },
  {
    id: 3,
    name: 'JUODAS VILNIUS 2026',
    artist: 'Solo Ansamblis, BA.',
    date: '2026-06-13',
    time: '17:30',
    venue: 'Kalnų parkas',
    city: 'Vilnius',
    image: 'https://www.bilietai.lt/imageGenerator/eventDetails/3fb01c21e8984af24585a92a8df6a2f2.webp',
    availableTickets: 245,
    priceRange: '50€'
  },
  {
    id: 4,
    name: 'Kings of Leon | The only show in the region',
    artist: 'Kings of Leon',
    date: '2026-06-14',
    time: '21:00',
    venue: 'Unibet Arena Kvartal',
    city: 'Tallinn',
    image: 'https://www.bilietai.lt/imageGenerator/eventDetails/3e98816a651b563bfe992ae4e174aa17.webp',
    availableTickets: 112,
    priceRange: '87.10€'
  },
  {
    id: 5,
    name: 'Andrius Mamontovas: TIK HITAI',
    artist: 'Andrius Mamontovas',
    date: '2026-03-20',
    time: '20:00',
    venue: 'Kalnapilio Arena',
    city: 'Panevėžys',
    image: 'https://www.bilietai.lt/imageGenerator/eventDetails/b77de0ca6bea71344abc3b53d1a635e8.webp',
    availableTickets: 112,
    priceRange: '29€'
  },
  {
    id: 6,
    name: 'punktò ~ KAUNAS',
    artist: 'punktò',
    date: '2025-12-12',
    time: '19:00',
    venue: 'Erdvė',
    city: 'Kaunas',
    image: 'https://www.bilietai.lt/imageGenerator/eventDetails/5c32df58e78d20fd893ac5562df3dab1.webp',
    availableTickets: 94,
    priceRange: '20€'
  }
];

export function searchConcerts(query, concerts = CONCERTS_DATA) {
  if (!query || query.trim() === '') {
    return concerts;
  }

  const searchTerm = query.toLowerCase().trim();

  return concerts.filter(concert => {
    return (
      concert.name.toLowerCase().includes(searchTerm) ||
      concert.artist.toLowerCase().includes(searchTerm) ||
      concert.venue.toLowerCase().includes(searchTerm) ||
      concert.city.toLowerCase().includes(searchTerm)
    );
  });
}

export function filterByCity(concerts, city) {
  if (city === 'all' || !city) {
    return concerts;
  }
  return concerts.filter(concert => concert.city === city);
}

export function getUniqueCities(concerts = CONCERTS_DATA) {
  return ['all', ...new Set(concerts.map(c => c.city))];
}