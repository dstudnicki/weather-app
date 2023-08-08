import { useState } from "react";
import "./App.css";
import cloudy from "./images/cloudy.jpg";
import axios from "axios";

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=d55ae5d42dba3e342a98346e90f794b1`;

  const day = new Date().toLocaleString("en-us", { weekday: "long" });
  const year = new Date().getFullYear();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[new Date().getMonth()];
  const dayOfMonth = new Date().getDate();

  const searchLocationHandler = (event) => {
    if (event.key === "Enter") {
      axios.get(url).then((res) => {
        setData(res.data);
      });
      setLocation("");
    }
  };

  return (
    <div className="app">
      <div className="weather-container">
        <div className="weather-container-top">
          <h1>{day}</h1>
          <section>
            {dayOfMonth} {month} {year}
          </section>
          <section>
            {data.name && data.sys ? `${data.name}, ${data.sys.country}` : ""}
          </section>
        </div>
        <div className="weather-container-bottom">
          <p>{data.main && `${data.main.temp.toFixed()}°C`}</p>
          <div>{data.weather && data.weather[0].main}</div>
        </div>
      </div>
      <div className="weather-container-info">
        <div>
          <input
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            onKeyUp={searchLocationHandler}
            placeholder="Enter location"
          />
          <div>{data.main && `Pressure ${data.main.pressure}`}</div>
          <div>{data.main && `Humidity ${data.main.humidity}`}</div>
          <div>{data.wind && `Wind speed ${data.wind.speed}`}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
