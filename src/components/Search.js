import { useState, useEffect } from "react";
import axios from "axios";

const Searchside = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");
  const [Weather, setWeather] = useState();
  const [Forecast, setForecast] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((success) => {
      const { latitude, longitude } = success.coords;

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.REACT_APP_API_KEY}&lang=da`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.REACT_APP_API_KEY}&lang=da`;

      Promise.all([axios.get(weatherUrl), axios.get(forecastUrl)])
        .then(([weatherResponse, forecastResponse]) =>
          Promise.all([weatherResponse.data, forecastResponse.data])
        )
        .then(([weatherData, forecastData]) => {
          setWeather(weatherData);
          setForecast(forecastData.list.slice(0, 6)); // Only the first 6 forecast items
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    });
  }, []);
  Forecast && console.log(Forecast);
  const searchLocation = (event) => {
    event.preventDefault();

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${process.env.REACT_APP_API_KEY}&lang=da`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${process.env.REACT_APP_API_KEY}&lang=da`;

    Promise.all([axios.get(weatherUrl), axios.get(forecastUrl)])
      .then(([weatherResponse, forecastResponse]) =>
        Promise.all([weatherResponse.data, forecastResponse.data])
      )
      .then(([weatherData, forecastData]) => {
        setData({
          weather: weatherData,
          forecast: forecastData.list.slice(0, 6),
        });
        console.log(weatherData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });

    setLocation("");
  };

  const getDayOfWeek = (timestamp) => {
    const daysOfWeek = ["Søn", "Man", "Tirs", "ons", "Tors", "Fri", "lør"];
    const date = new Date(timestamp * 1000);
    return daysOfWeek[date.getDay()];
  };
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <main className="p-8 md:p-4 flex flex-col items-center">
      <form
        onSubmit={searchLocation}
        className="sticky text-gray-800 justify-center md:text-white md:bg-opacity-30 md:flex md:flex-col md:justify-center md:space-y-4 w-[14rem] mx-auto mb-[2rem] md:w-[15rem]"
      >
        <input
          className="bg-white bg-opacity-80 p-4 md:p-8 rounded-[2rem]"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Enter location"
          type="text"
          name=""
          id=""
        />
      </form>

      {loading ? (
        <div className="text-gray-800">Loading...</div>
      ) : data ? (
        <>
          <section className="bg-gray-500 bg-opacity-30 p-8 w-full rounded-full text-white text-center md:flex md:flex-col md:items-center md:space-y-4">
            <h1 className="text-3xl font-bold">{data.weather.name}</h1>
            <img
              src={`http://openweathermap.org/img/wn/${data.weather.weather[0].icon}@2x.png`}
              alt="weather-icon"
              className="mx-auto"
            />
            <p className="text-xl">
              Temp: {data.weather.main.temp.toFixed()}&#176;C
            </p>
            <p>{data.weather.weather[0].description}</p>
          </section>
          <section className="bg-gray-500 bg-opacity-30 p-4 rounded-md text-white mt-4 md:flex md:flex-wrap md:justify-center">
            <div className="overflow-x-auto whitespace-nowrap">
              <div className="">
                {data.forecast.map((forecast) => (
                  <div
                    key={forecast.dt}
                    className="w-1/2 md:w-1/3 lg:w-1/6 p-2 text-center inline-block items-center"
                  >
                    <p className="text-sm text-white">
                      {getDayOfWeek(forecast.dt)}
                    </p>
                    <p className="text-sm text-white">
                      {new Date(forecast.dt * 1000).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <img
                      className="mx-auto"
                      src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                      alt=""
                    />
                    <p className="text-lg">
                      {forecast.main.temp.toFixed(0)}&#176;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className=" flex gap-[2rem] mt-5 bg-gray-500 bg-opacity-30 p-4 rounded-md text-white text-center md:flex md:flex-col md:items-center md:space-y-4">
            <div className="text-white">
              <p className="text-xl md:text-2xl">
                {data.weather.wind.speed}km/h
              </p>
              <p>Wind</p>
            </div>
            <div className="text-white">
              <p className="text-xl md:text-2xl">
                {data.weather.main.humidity} %
              </p>
              <p>Humidity</p>
            </div>
            <div className="text-white">
              <p className="text-xl md:text-2xl">
                {formatTime(data.weather.sys.sunrise)}
              </p>
              <p>sunset</p>
            </div>
            <div className="text-white">
              <p className="text-xl md:text-2xl">
                {formatTime(data.weather.sys.sunset)}
              </p>
              <p>sunset</p>
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="bg-gray-500 bg-opacity-30 p-8 w-full rounded-full text-white text-center md:flex md:flex-col md:items-center md:space-y-4">
            <h1 className="text-3xl font-bold">
              {Weather ? Weather.name : "No weather data available"}
            </h1>
            <img
              src={`http://openweathermap.org/img/wn/${Weather.weather[0].icon}@2x.png`}
              alt="weather-icon"
              className="mx-auto"
            />
            <p className="text-xl">
              Temp: {Weather.main.temp.toFixed()}&#176;C
            </p>
            <p>{Weather.weather[0].description}</p>
          </section>
          <section className="bg-gray-500 bg-opacity-30 p-4 rounded-md text-white mt-4 md:flex md:flex-wrap md:justify-center">
            <div className="overflow-x-auto whitespace-nowrap">
              {Forecast.map((forecast) => (
                <div
                  key={forecast.dt}
                  className="w-1/2 md:w-1/3 lg:w-1/6 p-2 text-center inline-block items-center"
                >
                  <p className="text-sm text-white">
                    {getDayOfWeek(forecast.dt)}
                  </p>
                  <p className="text-sm text-white">
                    {new Date(forecast.dt * 1000).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <img
                    className="mx-auto"
                    src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                    alt=""
                  />
                  <p className="text-lg">
                    {forecast.main.temp.toFixed(0)}&#176;
                  </p>
                </div>
              ))}
            </div>
          </section>
          <section className=" flex gap-[2rem] mt-5 bg-gray-500 bg-opacity-30 p-4 rounded-md text-white text-center md:flex md:flex-col md:items-center md:space-y-4">
            <div className="text-white">
              <p className="text-xl md:text-2xl">{Weather.wind.speed}km/h</p>
              <p>Wind</p>
            </div>
            <div className="text-white">
              <p className="text-xl md:text-2xl">{Weather.main.humidity} %</p>
              <p>Humidity</p>
            </div>
            <div className="text-white">
              <p className="text-xl md:text-2xl">
                {formatTime(Weather.sys.sunrise)}
              </p>
              <p>sunset</p>
            </div>
            <div className="text-white">
              <p className="text-xl md:text-2xl">
                {formatTime(Weather.sys.sunset)}
              </p>
              <p>sunset</p>
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default Searchside;
