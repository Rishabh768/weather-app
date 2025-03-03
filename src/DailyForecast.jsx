import React from 'react'

const DailyForecast = ({data}) => {

    function dateConvert(dt) {
        const date = new Date(dt * 1000);
        let hours = date.getHours();
        const am_pm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        const minutes = "0" + date.getMinutes();
        const formattedTime = hours + ":" + minutes.slice(-2) + " " + am_pm;
        return formattedTime;
      }

      const time=dateConvert(data.dt);

  return (
    <div className='rounded-xl w-48 flex-shrink-0  bg-opacity-20 bg-black  text-center p-4 mt-4'>
    <p className='text-xl font-semibold mb-3'>{time}</p>
      <div className='flex justify-center '>

    <img className='w-full h-full  text-center mb-3' 
    src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
    alt="weather icon" />
    </div>

     <p className='font-bold text-lg'>Temp:  {Math.floor(data.main.temp - 273.15)}<sup>0</sup>C</p>
     <p className='text-lg capitalize'>{data.weather[0].description}</p>
  </div>
  )
}

export default DailyForecast