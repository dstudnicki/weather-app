import { useState } from "react";
import "./App.css";
import axios from "axios";
import clear from "./images/clear.jpg";
import cloudy from "./images/cloudy.jpg";
import rain from "./images/rain.jpg";
import sun from "./images/sun.png";
import cloud from "./images/cloud.png";
import rainy from "./images/rainy.png";
import locationIcon from "./images/location.png";
import { useEffect } from "react";

function App() {
    const [data, setData] = useState({});
    const [location, setLocation] = useState("");
    const [forecast, setForecast] = useState([]);
    const [weatherBackground, setWeatherBackground] = useState("");
    const [forecastIcons, setForecastIcons] = useState([]);
    const [showInfoData, setShowInfoData] = useState(false);
    const apiKey = process.env.REACT_APP_API_KEY;

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`;
    console.log(weatherUrl);

    const day = new Date().toLocaleString("en-us", { weekday: "long" });
    const year = new Date().getFullYear();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = monthNames[new Date().getMonth()];
    const dayOfMonth = new Date().getDate();

    const weatherImages = {
        Clear: clear,
        Clouds: cloudy,
        Rain: rain,
    };

    const forecastImages = {
        Clear: sun,
        Clouds: cloud,
        Rain: rainy,
    };

    useEffect(() => {
        setWeatherBackground(weatherImages.Clear);
    }, [weatherImages.Clear]);

    const searchLocationHandler = async (event) => {
        if (event.key === "Enter") {
            const weatherFetch = axios.get(weatherUrl).then((res) => {
                setData(res.data);
                const weatherData = res.data.weather[0].main;
                if (weatherImages.hasOwnProperty(weatherData)) {
                    setWeatherBackground(weatherImages[weatherData]);
                } else {
                    setWeatherBackground(weatherImages.Clear);
                }
            });
            const forecastFetch = axios.get(forecastUrl).then((res) => {
                const forecastData = res.data.list;
                const forecastIcons = forecastData.map((forecastItem) => {
                    const forecastWeather = forecastItem.weather[0].main;
                    return forecastImages.hasOwnProperty(forecastWeather) ? forecastImages[forecastWeather] : "";
                });
                setForecastIcons(forecastIcons);

                const highestTemperatures = {};

                for (let i = 0; i < forecastData.length; i++) {
                    const forecastItem = forecastData[i];
                    const date = new Date(forecastItem.dt * 1000);
                    const dayKey = date.toLocaleDateString("en-us", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                    });

                    if (!highestTemperatures[dayKey] || forecastItem.main.temp_max > highestTemperatures[dayKey]) {
                        highestTemperatures[dayKey] = forecastItem.main.temp_max;
                    }
                }

                const highestTempArray = Object.entries(highestTemperatures);
                const nextThreeDaysHighestTemp = highestTempArray.slice(0, 6);

                setForecast(nextThreeDaysHighestTemp);
            });
            await Promise.all([weatherFetch, forecastFetch]).then();

            setLocation("");
            setShowInfoData(true);
        }
    };

    return (
        <div className="app">
            <div className="weather-container" style={{ backgroundImage: `url(${weatherBackground})` }}>
                <div className="weather-container-top">
                    <h1>{day}</h1>
                    <section>
                        <img src={locationIcon} alt="locationIcon" /> {dayOfMonth} {month} {year}
                    </section>
                    <section>{data.name && data.sys ? `${data.name}, ${data.sys.country}` : ""}</section>
                </div>
                <div className="weather-container-bottom">
                    <p>{data.main && `${data.main.temp.toFixed()}°C`}</p>
                    <span>{data.weather && data.weather[0].main}</span>
                </div>
            </div>
            <div className="weather-container-info">
                <div className="info">
                    <input type="text" value={location} onChange={(event) => setLocation(event.target.value)} onKeyUp={searchLocationHandler} placeholder="Search Location" />
                    {showInfoData && (
                        <div className="info-data">
                            <div className="info-row">
                                <div className="info-label">PRESSURE</div>
                                <div className="info-value">{data.main && `${data.main.pressure}hPa`}</div>
                            </div>
                            <div className="info-row">
                                <div className="info-label">HUMIDITY</div>
                                <div className="info-value">{data.main && `${data.main.humidity}%`}</div>
                            </div>
                            <div className="info-row">
                                <div className="info-label">WIND SPEED</div>
                                <div className="info-value">{data.wind && `${data.wind.speed}m/s`}</div>
                            </div>
                        </div>
                    )}
                </div>
                <ul className="daily-container">
                    {forecast.map(([dayName, maxTemp], index) => (
                        <li key={index}>
                            <img src={forecastIcons[index]} alt="icon" />
                            <span id="day">
                                {new Date(dayName).toLocaleDateString("en-us", {
                                    weekday: "short",
                                })}
                            </span>
                            <span>{maxTemp.toFixed()}°C</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
