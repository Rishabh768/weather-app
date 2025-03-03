import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import DailyForecast from "./DailyForecast";

function App() {

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const [data, setData] = useState({
    temperature: "",
    feels_like: "",
    main:"",
    wind_speed: "",
    visibility: "",
    time :"",
  
  });
  const [fiveday, setFiveday] = useState([]);

  function getPositon() {
    navigator.geolocation.getCurrentPosition((position) => {
      getCurrentWeather(position.coords.latitude, position.coords.longitude);
      getHourlyForecast(position.coords.latitude, position.coords.longitude);
    });
  }

  useEffect(() => {
    getPositon();
  }, []);

  async function getCurrentWeather(lat, long) {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}`
      );
      const { main, weather, wind, visibility, dt, name } = response.data;

      let temp = Math.floor(main.temp - 273.15);
      let feels_like = Math.floor(main.feels_like - 273.15);

      function dateConvert(dt) {
        const date = new Date(dt * 1000);
        let hours = date.getHours();
        const am_pm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        const minutes = "0" + date.getMinutes();
        const formattedTime = hours + ":" + minutes.slice(-2) + " " + am_pm;
        return formattedTime;
      }
      
      setData({
        temperature: temp,
        feels_like,
        main: weather[0].main,
        wind_speed: wind.speed,
        visibility: visibility,
        time: dateConvert(dt),
        name: name,
      });
      
    } catch (error) {
      console.log(error);
    }
  }

  function getHourlyForecast(lat, long) {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&cnt=7&appid=${API_KEY}`
      )
      .then((res) => {
        setFiveday(res.data.list);
      })
      .catch((err) => console.log(err));
  }

  return (
    <div>
      <section className="text-3xl text-center p-8">{data.name}</section>

      <div className="flex justify-center">
        <div className="border-2 font-bold rounded-full w-64 h-64 flex gap-2 items-center flex-col justify-center">
          <p className="text-6xl ">
            {data.temperature}
            <sup>0</sup>C
          </p>
          <p className="text-3xl">{data.main}</p>
        </div>
      </div>
      <p className="text-center mt-4 ">Updated as of {data.time}</p>
      <div className="flex justify-around mt-4 px-4 font-semibold">
        <p>Feel's like: {data.feels_like} <sup>0C</sup></p>
        <p>Wind: {data.wind_speed} m/s</p>
        <p>Visibility: {data.visibility / 1000} km</p>
      </div>

      <div className="mt-10">
        <h1 className="text-2xl text-center">Hourly Forecast</h1>
        <div className="flex overflow-x-auto  px-4 space-x-4 ">
          {fiveday?.map((item) => (
            <DailyForecast data={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
