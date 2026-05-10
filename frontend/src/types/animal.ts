export interface GPSData {
  id: number;
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface Animal {
  id: number;
  name: string;
  species: string;
  description: string;
  gps_data: GPSData[];
}

export interface User {
  id: number;
  email: string;
  username: string;
  role: "user" | "researcher" | "admin";
}