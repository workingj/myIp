import { useState, useEffect } from "react";
import Axios from "axios";
import "leaflet/dist/leaflet.css";
import Map from "./Map";

let data = 0;

const position = [51.505, -0.09];

function getTime(offset) {
  const date = new Date();
  let h = date.getUTCHours();
  const m = date.getUTCMinutes();
  const s = date.getUTCSeconds();

  return `${h + parseInt(offset)}:${m}:${s}`;
}

export default function App() {
  const wmip_api_key = import.meta.env.VITE_WHATSMYIPCOM_API_KEY;
  const gify_api_key = import.meta.env.VITE_GEOIPIFYORG_API_KEY;
  const cl_api_key = import.meta.env.VITE_COUNTRYLAYER_API_KEY;

  // const [myip, setMyip] = useState(0);
  const [geofy, setGeofy] = useState(0);
  const [cLayer, setCLayer] = useState(0);

  const position = [51.505, -0.09];

  function fetchCountryData(country) {
    try {
      Axios.get(`http://api.countrylayer.com/v2/alpha/${country}?access_key=${cl_api_key}`).then((res2) => {
        // console.log("RES 2:", res2.data);
        setCLayer(res2);
      });
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (data == 0) {
      // WHATS MY IP COM
      // https: Axios.get(
      //   `https://api.whatismyip.com/ip.php?key=${wmip_api_key}&output=json`
      //   ).then((res) => {
      //     data = res.data.ip_address;
      //     setMyip(res.data.ip_address)
      //   })
      // }

      // GEO IP IFY COM
      try {
        Axios.get(`https://geo.ipify.org/api/v2/country,city?apiKey=${gify_api_key}`).then((res) => {
          // console.log("RES 1:", res.data);
          fetchCountryData(res.data.location.country);
          setGeofy(res);
        });
      } catch (err) {
        console.error("ERROR:", err);
      }

      data = 1;
    }
  }, []);

  if (!cLayer) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      {console.log(cLayer)}
      <h2>{geofy.data.ip}</h2>
      <div id="data">
        <h3>Location</h3>
        <span>
          <b>Country: </b>
          {geofy.data.location.country}
        </span>
        <span>
          <b>Region: </b>
          {geofy.data.location.region}
        </span>
        <span>
          <b>City: </b>
          {geofy.data.location.city}
        </span>
        <span>
          <b>Latitude: </b>
          {geofy.data.location.lat}
        </span>
        <span>
          <b>Longitude: </b>
          {geofy.data.location.lng}
        </span>
        <span>
          <b>Postal Code: </b>
          {geofy.data.location.postalCode}
        </span>
        <span>
          <b>Timezone: </b>
          {geofy.data.location.timezone}
        </span>
        <span>
          <b>Time: </b>
          {getTime(geofy.data.location.timezone)}
        </span>
        <span>
          <b>Geoname-Id: </b>
          {geofy.data.location.geonameId}
        </span>

        <h3>Internet Service Provider</h3>
        <span>
          <b>ISP</b>
          {geofy.data.isp}
        </span>
        <h3>Country Data</h3>
        <span>
          <b>Name: </b>
          {cLayer.data.name}
        </span>
        <span>
          <b>Top-Level Domain: </b>
          {cLayer.data.topLevelDomain}
        </span>
        <span>
          <b>Alpha2 Code: </b>
          {cLayer.data.alpha2Code}
        </span>
        <span>
          <b>Alpha3 Code: </b>
          {cLayer.data.alpha3Code}
        </span>
        <span>
          <b>Calling Codes: </b>
          {cLayer.data.callingCodes}
        </span>
        <span>
          <b>Capital: </b>
          {cLayer.data.capital}
        </span>
        <span>
          <b>AltSpellings: </b>
          {cLayer.data.altSpellings.map((name) => {
            return <p key={name}>{name}</p>;
          })}
        </span>
        <span>
          <b>Region: </b>
          {cLayer.data.region}
        </span>
      </div>
      <div id="map">
        <Map location={geofy.data.location} />
      </div>
    </>
  );
}
