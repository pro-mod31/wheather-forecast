"use client";
import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Wind, Droplets } from "lucide-react";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState<any>(null);

  const API_KEY = "api key here"; // Replace with your actual API key

  const getWeather = async () => {
    if (!city.trim()) {
      setError(" Please enter a city name");
      setWeather(null);
      return;
    }

    try {
      const res = await axios.get(`api call`, {
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
      setError("City not found");
      setWeather(null);
    }
  };

  return (
    <div
      className="h-screen w-screen bg-[url('/image1.png')] bg-cover bg-center flex items-center justify-center"
    >
      <div className="bg-white/20 p-2 rounded-2xl shadow-2xl max-w-md w-full text-center m-3">
        {/* Input */}
        <div className="flex gap-4 justify-center">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-2 border rounded-lg flex-1 bg-white/70"
          />

          <button
            onClick={getWeather}
            disabled={!city.trim()}
            className={`px-4 py-2 rounded-lg text-white font-semibold ${city.trim()
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            Search
          </button>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        {weather && (
          <div className="p-2">
            {/* Main Weather */}
            {selectedDay ? (
              <>
                <h2 className="font-semibold ">
                  {weather.location.name}, {weather.location.country}
                </h2>
                <p className="text-md font-bold">{selectedDay.date}</p>
                <div className="flex items-center justify-center">
                  <img
                    src={selectedDay.day.condition.icon}
                    alt={selectedDay.day.condition.text}
                  />
                  <p className="text-4xl font-bold">
                    {selectedDay.day.avgtemp_c}°C
                  </p>
                </div>
                <p className="text-xl mt-2">{selectedDay.day.condition.text}</p>

                {/* Weather Stats with Motion */}
                <div className="grid grid-cols-2 gap-3 my-4">
                  {/* Wind */}
                  <div className="flex items-center gap-2 justify-center">
                    <motion.div
                      animate={{ x: [0, 15, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: Math.max(
                          1,
                          10 / (selectedDay.day.maxwind_kph / 5)
                        ),
                        ease: "easeInOut",
                      }}
                    >
                      <Wind className="w-6 h-6 text-blue-500" />
                    </motion.div>
                    <div>
                      <p className="font-semibold">
                        {selectedDay.day.maxwind_kph} km/h
                      </p>
                      <p className="text-sm text-gray-600">Wind Speed</p>
                    </div>
                  </div>

                  {/* Humidity */}
                  <div className="flex items-center gap-2 justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Droplets className="w-6 h-6 text-blue-400" />
                    </motion.div>
                    <div>
                      <p className="font-semibold">
                        {selectedDay.day.avghumidity} %
                      </p>
                      <p className="text-sm text-gray-600">Humidity</p>
                    </div>
                  </div>
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
                  <div className="flex items-center gap-2 justify-center">
                    <Wind className="w-5 h-5 text-blue-500 animate-pulse" />
                    <p>{weather.current.wind_kph} km/h</p>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <Droplets className="w-5 h-5 text-blue-400 animate-pulse" />
                    <p>{weather.current.humidity} %</p>
                  </div>
                </div>
              </>
            )}

            {/* Forecast Cards */}
            <p className="mt-2 font-bold text-sm">5-Day Forecast:</p>
            <div className="grid md:grid-cols-5 grid-cols-2 gap-3 mt-3">
              {weather.forecast.forecastday.map((day: any, index: number) => (
                <div
                  key={index}
                  onClick={() => setSelectedDay(day)}
                  className={`p-2 rounded-xl shadow-md text-center cursor-pointer transition transform hover:scale-105 ${selectedDay?.date === day.date
                      ? "bg-blue-100"
                      : "bg-white/30"
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
                  <p className="text-xs text-gray-600">
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
