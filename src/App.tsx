"use client";
import { useState } from "react";
import axios from "axios";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState<any>(null);

  const API_KEY = "please insert your API key here";

  const getWeather = async () => {
    if (!city.trim()) {
      setError(" Please enter a city name");
      setWeather(null);
      return;
    }
    
    try {
      const res = await axios.get(`http://api.weatherapi.com/v1/forecast.json`, {
        params: {
          q: city,
          days: 5,
          key: API_KEY,
        },
      });
      setWeather(res.data);
      setSelectedDay(null);
      setError("");
      console.log("Weather data:", res.data);
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setError("City not found");
      } else {
        setError("City not found");
      }
      setWeather(null);
    }
  };
 
  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/image1.png')" }}
    >
      <div className="bg-gray-200 p-3 rounded-2xl shadow-xl max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">🌤️ Weather Forecast</h1>

        {/* Input */}
        <div className="flex gap-2 justify-center">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-2 border rounded-lg flex-1"
          />

          <button
            onClick={getWeather}
            disabled={!city.trim()}
            className={`px-4 py-2 rounded-lg text-white ${
              city.trim()
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Search
          </button>
        </div>

        {error && <p className="text-red-500 mt-3">{error}</p>}

        {weather && (
          <div className="p-1">
            {/* Main Weather (changes when a day is selected) */}
            {selectedDay ? (
              <>
                <h2 className="font-semibold">
                  {weather.location.name}, {weather.location.country}
                </h2>
                <p className="text-md">{selectedDay.date}</p>
                <div className="flex items-center justify-center">
                  <img
                    src={selectedDay.day.condition.icon}
                    alt={selectedDay.day.condition.text}
                  />
                  <p className="text-2xl font-medium">
                   {selectedDay.day.avgtemp_c}°C
                  </p>
                </div>
                <div className="grid grid-cols-2 my-2">
                  <p>Max: {selectedDay.day.maxtemp_c}°C</p>
                  <p>Min: {selectedDay.day.mintemp_c}°C</p>
                </div>
                <div className="grid grid-cols-2">
                  <p>Sunrise: {selectedDay.astro.sunrise}</p>
                  <p>Sunset: {selectedDay.astro.sunset}</p>
                </div>
              </>
            ) : (
              <>
                <h2 className="font-semibold">
                  {weather.location.name}, {weather.location.country}
                </h2>
                <p className="text-md">{weather.location.localtime}</p>
                <div className="flex items-center justify-center">
                  <img
                    src={weather.current.condition.icon}
                    alt={weather.current.condition.text}
                  />
                  <p className="text-2xl font-medium">
                    {weather.current.temp_c}°C
                  </p>
                </div>
                <div className="grid grid-cols-2 my-2">
                  <p>💧 {weather.current.humidity} %</p>
                  <p>💨 {weather.current.wind_kph} km/h</p>
                </div>
              </>
            )}
            

            {/* Forecast Cards */}
            <p className="mt-2 font-bold text-sm">3-Day Forecast:</p>
            <div className="grid grid-cols-5 gap-3 mt-3">
              {weather.forecast.forecastday.map((day: any, index: number) => (
                <div
                  key={index}
                  onClick={() => setSelectedDay(day)}
                  className={` rounded-xl shadow-md text-center cursor-pointer transition transform hover:scale-105 ${
                    selectedDay?.date === day.date ? "bg-blue-200" : "bg-white"
                  }`}
                >
                  <p className="font-semibold text-sm">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </p>
                  <img
                    src={day.day.condition.icon}
                    alt={day.day.condition.text}
                    className="mx-auto"
                  />
                  <p className="text-sm">{day.day.condition.text}</p>
                  <p className="font-bold">{day.day.maxtemp_c}°C</p>
                  <p className="text-xs text-gray-500">
                    Min {day.day.mintemp_c}°C
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
