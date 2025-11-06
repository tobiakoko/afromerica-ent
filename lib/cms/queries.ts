// GROQ queries for Sanity CMS

// Artist queries
export const ARTIST_FIELDS = `
  _id,
  _type,
  _createdAt,
  _updatedAt,
  name,
  "slug": slug.current,
  image,
  bio,
  genre,
  location,
  city,
  state,
  country,
  email,
  phone,
  website,
  socialMedia,
  specialties,
  awards,
  rating,
  totalBookings,
  joinedDate,
  status,
  featured
`;

export const ARTISTS_QUERY = `*[_type == "artist" && status == "active"] | order(_createdAt desc) {
  ${ARTIST_FIELDS}
}`;

export const FEATURED_ARTISTS_QUERY = `*[_type == "artist" && status == "active" && featured == true] | order(_createdAt desc) [0...6] {
  ${ARTIST_FIELDS}
}`;

export const ARTIST_BY_SLUG_QUERY = `*[_type == "artist" && slug.current == $slug][0] {
  ${ARTIST_FIELDS},
  "upcomingEvents": *[_type == "event" && references(^._id) && status == "upcoming"] | order(date asc) [0...4] {
    _id,
    title,
    "slug": slug.current,
    date,
    startTime,
    venue,
    city,
    state
  }
}`;

export const ARTISTS_BY_GENRE_QUERY = `*[_type == "artist" && status == "active" && $genre in genre] | order(_createdAt desc) {
  ${ARTIST_FIELDS}
}`;

// Event queries
export const EVENT_FIELDS = `
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  description,
  shortDescription,
  image,
  category,
  date,
  startTime,
  endTime,
  venue,
  address,
  city,
  state,
  country,
  zipCode,
  latitude,
  longitude,
  pricing,
  capacity,
  attendees,
  highlights,
  ageRequirement,
  dressCode,
  refundPolicy,
  accessibility,
  status,
  featured,
  ticketUrl
`;

export const EVENTS_QUERY = `*[_type == "event" && status == "upcoming"] | order(date asc) {
  ${EVENT_FIELDS},
  "artists": artists[]->{
    _id,
    name,
    "slug": slug.current,
    image,
    genre
  },
  lineup[] {
    "artist": artist->{
      _id,
      name,
      "slug": slug.current,
      image,
      genre
    },
    role,
    setTime
  }
}`;

export const FEATURED_EVENTS_QUERY = `*[_type == "event" && status == "upcoming" && featured == true] | order(date asc) [0...6] {
  ${EVENT_FIELDS},
  "artists": artists[]->{
    _id,
    name,
    "slug": slug.current,
    image,
    genre
  }
}`;

export const EVENT_BY_SLUG_QUERY = `*[_type == "event" && slug.current == $slug][0] {
  ${EVENT_FIELDS},
  "artists": artists[]->{
    _id,
    name,
    "slug": slug.current,
    image,
    genre,
    bio
  },
  lineup[] {
    "artist": artist->{
      _id,
      name,
      "slug": slug.current,
      image,
      genre
    },
    role,
    setTime
  }
}`;

export const EVENTS_BY_CATEGORY_QUERY = `*[_type == "event" && status == "upcoming" && category == $category] | order(date asc) {
  ${EVENT_FIELDS},
  "artists": artists[]->{
    _id,
    name,
    "slug": slug.current,
    image,
    genre
  }
}`;

export const UPCOMING_EVENTS_QUERY = `*[_type == "event" && status == "upcoming" && date >= $today] | order(date asc) [0...$limit] {
  ${EVENT_FIELDS},
  "artists": artists[]->{
    _id,
    name,
    "slug": slug.current,
    image,
    genre
  }
}`;

// Page queries
export const PAGE_QUERY = `*[_type == "page" && slug.current == $slug][0] {
  _id,
  _type,
  title,
  "slug": slug.current,
  seo,
  sections[] {
    _type,
    _key,
    ...,
    members[] {
      ...,
      image
    },
    features[] {
      ...
    }
  }
}`;

// Site settings
export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  _id,
  title,
  description,
  logo,
  favicon,
  socialMedia,
  contact,
  navigation,
  footer
}`;

// Testimonials
export const TESTIMONIALS_QUERY = `*[_type == "testimonial"] | order(_createdAt desc) {
  _id,
  name,
  role,
  company,
  image,
  quote,
  rating,
  featured
}`;

export const FEATURED_TESTIMONIALS_QUERY = `*[_type == "testimonial" && featured == true] | order(_createdAt desc) [0...6] {
  _id,
  name,
  role,
  company,
  image,
  quote,
  rating
}`;
