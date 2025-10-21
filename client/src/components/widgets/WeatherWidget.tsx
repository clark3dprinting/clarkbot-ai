import { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind } from 'lucide-react';

interface WeatherWidgetProps {
  location?: string;
}

export default function WeatherWidget({ location = 'Grantsville, NY' }: WeatherWidgetProps) {
  const [weather, setWeather] = useState({
    temp: 72,
    condition: 'Partly Cloudy',
    humidity: 65,
    wind: 8,
  });

  const getWeatherIcon = () => {
    if (weather.condition.toLowerCase().includes('rain')) {
      return <CloudRain className="w-8 h-8 text-primary" />;
    } else if (weather.condition.toLowerCase().includes('cloud')) {
      return <Cloud className="w-8 h-8 text-primary" />;
    }
    return <Sun className="w-8 h-8 text-primary" />;
  };

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground" data-testid="weather-location">{location}</p>
          <p className="text-3xl font-display font-bold text-foreground" data-testid="weather-temp">{weather.temp}°F</p>
        </div>
        {getWeatherIcon()}
      </div>
      
      <p className="text-sm text-foreground" data-testid="weather-condition">{weather.condition}</p>
      
      <div className="flex gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Cloud className="w-3 h-3" />
          <span data-testid="weather-humidity">{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind className="w-3 h-3" />
          <span data-testid="weather-wind">{weather.wind} mph</span>
        </div>
      </div>
    </div>
  );
}
