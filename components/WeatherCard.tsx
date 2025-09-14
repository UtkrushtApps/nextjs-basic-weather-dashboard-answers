import React from 'react';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
}

interface Props {
  weather: WeatherData;
}

const WeatherCard: React.FC<Props> = ({ weather }) => {
  return (
    <div className="bg-blue-50 rounded shadow-md px-6 py-6 flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-2">{weather.name}</h2>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
        className="w-20 h-20"
      />
      <div className="text-3xl font-bold mb-2">{Math.round(weather.main.temp)}°C</div>
      <div className="capitalize text-gray-700 mb-2">{weather.weather[0].description}</div>
      <div className="flex space-x-4 text-sm text-gray-600 mt-3">
        <div>
          <span className="font-medium">Humidity:</span> {weather.main.humidity}%
        </div>
        <div>
          <span className="font-medium">Pressure:</span> {weather.main.pressure} hPa
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
