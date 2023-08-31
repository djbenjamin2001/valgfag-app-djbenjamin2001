import { useEffect, useState } from "react";

import React from "react";
const Home = () => {
  const [Weather, setWeather] = useState();
  const [Forecast, setForecast] = useState();
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((success) => {
      console.log(success);
      let { latitude, longitude } = success.coords;

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.REACT_APP_API_KEY}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.REACT_APP_API_KEY}`;

      Promise.all([fetch(weatherUrl), fetch(forecastUrl)])
        .then(([weatherResponse, forecastResponse]) =>
          Promise.all([weatherResponse.json(), forecastResponse.json()])
        )
        .then(([weatherData, forecastData]) => {
          console.log(weatherData);
          console.log(forecastData);
          setWeather(weatherData);
          setForecast(forecastData);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    });
  }, []);
  const getDayOfWeek = (timestamp) => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const date = new Date(timestamp * 1000);
    return daysOfWeek[date.getDay()];
  };
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="  p-8 md:p-2 flex flex-col items-center  ">
      {!loading && (
        <>
          <h1 className="text-center text-3xl md:text-3xl mb-4 text-white">
            {Weather.name}
          </h1>
          <div className="bg-gray-500 bg-opacity-30 p-4 rounded-md text-white text-center md:flex md:flex-col md:items-center md:space-y-4">
            <img
              src={`http://openweathermap.org/img/wn/${Weather.weather[0].icon}@2x.png`}
              alt="weather-icon"
              className="mx-auto"
            />
            <p className="text-xl md:text-2xl">
              Temp: {Weather.main.temp.toFixed(0)}&#176;
            </p>
            <p>{Weather.weather[0].description}</p>
          </div>

          <section className="bg-gray-500 bg-opacity-30 p-4 rounded-md text-white mt-4 md:flex md:flex-wrap md:justify-center">
            <div className="overflow-x-auto whitespace-nowrap">
              <div className="">
                {Forecast.list.map(
                  (forecasts, index) =>
                    index < 6 && (
                      <div
                        key={forecasts.dt}
                        className="w-1/2 md:w-1/3 lg:w-1/6 p-2 text-center inline-block items-center"
                      >
                        <p className="text-sm text-white">
                          {getDayOfWeek(forecasts.dt)}
                        </p>
                        <p className="text-sm text-white">
                          {new Date(forecasts.dt * 1000).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </p>
                        <img
                          className="mx-auto"
                          src={`http://openweathermap.org/img/wn/${Weather.weather[0].icon}@2x.png`}
                          alt=""
                        />
                        <p className="text-lg">
                       {forecasts.main.temp.toFixed(0)}&#176;
                        </p>
                      </div>
                    )
                )}
              </div>
            </div>
          </section>
          <section className="grid grid-cols-2 pt-5 gap-5">
           
            <div className="bg-gray-500 bg-opacity-30 p-4 rounded-md text-white text-center md:flex md:flex-col md:items-center md:space-y-4">
          
            <p className="text-xl md:text-2xl">
              {Weather.wind.speed}  km/h
            </p>
            <p>Wind</p>
          </div>
            <div className="bg-gray-500 bg-opacity-30 p-4 rounded-md text-white text-center md:flex md:flex-col md:items-center md:space-y-4">
           
            <p className="text-xl md:text-2xl">
              {Weather.main.humidity}%
            </p>
            <p>Humidity</p>
          </div>
            <div className="bg-gray-500 bg-opacity-30 p-4 rounded-md text-white text-center md:flex md:flex-col md:items-center md:space-y-4">
           
            <p className="text-xl md:text-2xl">
            {formatTime(Weather.sys.sunrise)}
            </p>
            <p>sunrise</p>
          </div>
            <div className="bg-gray-500 bg-opacity-30 p-4 rounded-md text-white text-center md:flex md:flex-col md:items-center md:space-y-4">
            <p className="text-xl md:text-2xl">
              {formatTime(Weather.sys.sunset)}
            </p>
            <p>sunset</p>
          </div>
           
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
