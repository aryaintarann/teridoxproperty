export interface UnitAmenity {
  icon: string; // Material Symbols Outlined icon name
  label: string;
}

export interface UnitAgent {
  name: string;
  title: string;
  rating: number;
  photo: string;
}

export interface Unit {
  id: number;
  name: string;
  property: string;
  location: string;
  address: string;
  price: string;
  priceNumeric: number;
  type: string;
  status: "Tersedia" | "Terisi" | "Maintenance";
  rating: number;
  amenities: UnitAmenity[];
  sqft: string;
  bedType: string;
  floorLevel: string;
  description: string;
  images: string[];
  agent?: UnitAgent;
}
