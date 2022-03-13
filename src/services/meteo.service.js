import axios from "axios"

const lat = '43.902293';
const long = '5.292936';
const apiKey = '51be65d0f9ad5949f8a3c024a96ed6ee';

const convertKelvinToCentigrade = (kelvin) => {
    if (!kelvin) return null;
    return Math.round(kelvin - 273.15);
}

export const getRoussillonMeteo = async () => {
    const meteoUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`;

    return axios.get(meteoUrl).then(response => {
        if (!response || !response.data || !response.data.main || !response.data.main.temp) return null;
        return convertKelvinToCentigrade(response.data.main.temp);
    })
}