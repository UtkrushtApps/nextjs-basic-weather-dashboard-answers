import React, { useState } from 'react';
import Head from 'next/head';
import WeatherCard from '../components/WeatherCard';

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

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

const IndexPage: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError(null);
    setWeather(null);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityName
        )}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('City not found');
        }
        throw new Error('Failed to fetch weather');
      }
      const data = await res.json();
      setWeather(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  // Asynchronous logging (fire and forget)
  const logSearchAttempt = async (cityName: string) => {
    try {
      await fetch('/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city: cityName, time: new Date().toISOString() }),
      });
    } catch (_e) {
      // Fail silently
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) {
      setError('Please enter a city name');
      setWeather(null);
      return;
    }
    // Log in background
    logSearchAttempt(city.trim());
    await fetchWeather(city.trim());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <Head>
        <title>Weather Dashboard</title>
        <meta name="description" content="Simple Next.js Weather Dashboard" />
      </Head>
      <div className="w-full max-w-md bg-white rounded shadow px-6 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Weather Dashboard</h1>
        <form onSubmit={handleSubmit} className="flex mb-4">
          <input
            type="text"
            value={city}
            onChange={handleInputChange}
            className="flex-grow border border-gray-300 rounded-l px-3 py-2 focus:outline-none"
            placeholder="Enter city..."
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-r hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
        {error && (
          <div className="bg-red-100 text-red-700 rounded px-3 py-2 mb-4 text-center">
            {error}
          </div>
        )}
        {weather && <WeatherCard weather={weather} />}
      </div>
      <footer className="mt-6 text-xs text-gray-500">Powered by OpenWeatherMap</footer>
    </div>
  );
};

export default IndexPage;
