import { useState } from "react";
import "./App.css";
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
    <div className="App">
      <div>
        <input
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyUp={searchLocationHandler}
          placeholder="Enter location"
        />
        <div>{day}</div>
        <div>
          {dayOfMonth} {month} {year}
        </div>
        <div>
          {data.name && data.sys ? `${data.name}, ${data.sys.country}` : ""}
        </div>
      </div>
      <div>
        <div>{data.main && `${data.main.temp.toFixed()}°C`}</div>
        <div>{data.weather && data.weather[0].main}</div>
      </div>
      <div>
        <div>{data.main && `Pressure ${data.main.pressure}`}</div>
        <div>{data.main && `Humidity ${data.main.humidity}`}</div>
        <div>{data.wind && `Wind speed ${data.wind.speed}`}</div>
      </div>
    </div>
  );
}

export default App;
