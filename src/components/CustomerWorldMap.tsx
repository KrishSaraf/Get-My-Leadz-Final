import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Card } from './ui/Card';

// Fix for default marker icons in Leaflet with Vite
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Customer {
  id?: string;
  company_name?: string;
  name?: string;
  location: string | null;
  subscription: string | null;
  created_at: string | null;
  customer_type?: 'Company' | 'Individual';
}

interface CustomerWorldMapProps {
  customers: Customer[];
}

// Custom marker icons for better visibility
const createMarkerIcon = (size: number) => new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [size, size],
  iconAnchor: [size / 2, size],
  popupAnchor: [0, -size]
});

// Updated coordinates for customer locations with accurate lat/long values
const getCoordinatesForLocation = (location: string): [number, number] => {
  const coordinates: { [key: string]: [number, number] } = {
    'United States': [37.0902, -95.7129],
    'United Kingdom': [55.3781, -3.4360],
    'Ireland': [53.1424, -7.6921],
    'France': [46.2276, 2.2137],
    'Germany': [51.1657, 10.4515],
    'Italy': [41.8719, 12.5674],
    'Spain': [40.4637, -3.7492],
    'Portugal': [39.3999, -8.2245],
    'Netherlands': [52.1326, 5.2913],
    'Belgium': [50.8503, 4.3517],
    'Switzerland': [46.8182, 8.2275],
    'Austria': [47.5162, 14.5501],
    'Sweden': [60.1282, 18.6435],
    'Norway': [60.4720, 8.4689],
    'Denmark': [56.2639, 9.5018],
    'Finland': [61.9241, 25.7482],
    'Poland': [51.9194, 19.1451],
    'Czech Republic': [49.8175, 15.4730],
    'Hungary': [47.1625, 19.5033],
    'Romania': [45.9432, 24.9668],
    'Bulgaria': [42.7339, 25.4858],
    'Greece': [39.0742, 21.8243],
    'Turkey': [38.9637, 35.2433],
    'Russia': [61.5240, 105.3188],
    'Ukraine': [48.3794, 31.1656],
    'Belarus': [53.7098, 27.9534],
    'Kazakhstan': [48.0196, 66.9237],
    'China': [35.8617, 104.1954],
    'Japan': [36.2048, 138.2529],
    'South Korea': [35.9078, 127.7669],
    'India': [20.5937, 78.9629],
    'Pakistan': [30.3753, 69.3451],
    'Bangladesh': [23.6850, 90.3563],
    'Thailand': [15.8700, 100.9925],
    'Vietnam': [14.0583, 108.2772],
    'Indonesia': [-0.7893, 113.9213],
    'Malaysia': [4.2105, 101.9758],
    'Philippines': [12.8797, 121.7740],
    'Australia': [-25.2744, 133.7751],
    'New Zealand': [-40.9006, 174.8860],
    'Canada': [56.1304, -106.3468],
    'Mexico': [23.6345, -102.5528],
    'Brazil': [-14.2350, -51.9253],
    'Argentina': [-38.4161, -63.6167],
    'Chile': [-35.6751, -71.5430],
    'Peru': [-9.1900, -75.0152],
    'Colombia': [4.5709, -74.2973],
    'Venezuela': [6.4238, -66.5897],
    'South Africa': [-30.5595, 22.9375],
    'Nigeria': [9.0820, 8.6753],
    'Egypt': [26.8206, 30.8025],
    'Kenya': [-0.0236, 37.9062],
    'Singapore': [1.3521, 103.8198]
  };
  
  // If location not found in mapping, try to find a partial match
  if (!coordinates[location]) {
    const key = Object.keys(coordinates).find(k => 
      location.toLowerCase().includes(k.toLowerCase()) ||
      k.toLowerCase().includes(location.toLowerCase())
    );
    if (key) return coordinates[key];
  }
  
  return coordinates[location] || [0, 0];
};

const formatSubscription = (subscription: string | number | null): string => {
  if (!subscription) return '$0';
  
  const num = typeof subscription === 'string' ? parseFloat(subscription.replace(/[^0-9.-]+/g, '')) : subscription;
  if (isNaN(num)) return '$0';
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
  return `$${num.toLocaleString()}`;
};

export function CustomerWorldMap({ customers }: CustomerWorldMapProps) {
  const customersByRegion = customers.reduce((acc: any, customer) => {
    if (!customer.location) return acc;
    
    const location = customer.location;
    if (!acc[location]) {
      acc[location] = {
        customers: [],
        totalSubscription: 0,
        coordinates: getCoordinatesForLocation(location)
      };
    }

    const subscription = parseFloat(customer.subscription?.replace(/[^0-9.-]+/g, '') || '0');
    acc[location].customers.push(customer);
    acc[location].totalSubscription += subscription;

    return acc;
  }, {});

  return (
    <Card className="h-[calc(100vh-16.25rem)] w-full">
      <div className="h-full w-full">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          minZoom={2}
          maxZoom={8}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
          className="rounded-lg overflow-hidden"
        >
          <TileLayer
            url="https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=2ffa824c4b1345dc9059a03b2ef5edfb"
            attribution='&copy; <a href="https://www.thunderforest.com/">Thunderforest</a> contributors'
          />

          {Object.entries(customersByRegion).map(([location, data]: [string, any]) => (
            <Marker
              key={location}
              position={data.coordinates}
              icon={createMarkerIcon(20 + Math.min(40, data.totalSubscription / 1e3))}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="font-bold text-lg mb-2">{location}</h3>
                  <p className="font-medium mb-2">
                    Total Subscription: {formatSubscription(data.totalSubscription)}
                  </p>
                  <h4 className="font-medium mb-1">Customers:</h4>
                  <div className="max-h-[150px] overflow-y-auto">
                    {data.customers.map((customer: Customer, i: number) => (
                      <div key={i} className="py-1 border-b border-gray-100 last:border-b-0">
                        <div className="font-medium">
                          {customer.customer_type === 'Company' ? customer.company_name : customer.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatSubscription(customer.subscription)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </Card>
  );
}