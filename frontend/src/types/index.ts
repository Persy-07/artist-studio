export interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  genre: string;
  date: string;
  cover: string;
  description: string;
  playCount: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}
