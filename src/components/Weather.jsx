import React, { useEffect, useRef, useState } from 'react';
import Swal from "sweetalert2";
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';

const Weather = () => {
    const inputRef = useRef();
    const [weatherData, setWeatherData] = useState(false);

    const allIcons = {
        "01d": clear_icon,
        "o1n": clear_icon,
        "02d": cloud_icon,
        "o2n": cloud_icon,
        "03d": cloud_icon,
        "o3n": cloud_icon,
        "04d": drizzle_icon,
        "o4n": drizzle_icon,
        "09d": rain_icon,
        "o9n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon,
    };

    const search = async (city) => {
        if (city.trim() === "") {
            Swal.fire("Please Enter City Name");
            return;
        }
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                Swal.fire(data.message);
                return;
            }

            console.log(data);
            const icon = allIcons[data.weather[0].icon] || clear_icon;
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon
            });

        } catch (error) {
            setWeatherData(false);
            console.error("Error in fetching weather data");
        }
    };

    useEffect(() => {
        search("Faisalabad");
    }, []);

    return (
        <div className='weather'>
            <div className="search-bar">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter city name"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            search(inputRef.current.value);
                        }
                    }}
                />
                <img src={search_icon} onClick={() => search(inputRef.current.value)} alt="Search" />
            </div>

            {weatherData ? (
                <>
                    <img src={weatherData.icon} alt="Weather" className='weather-icon' />
                    <p className='temperature'>{weatherData.temperature}°C</p>
                    <p className='location'>{weatherData.location}</p>
                    <div className="weather-data">
                        <div className="col">
                            <img src={humidity_icon} alt="Humidity" />
                            <div>
                                <p>{weatherData.humidity}%</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className="col">
                            <img src={wind_icon} alt="Wind" />
                            <div>
                                <p>{weatherData.windSpeed} km/h</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default Weather;
