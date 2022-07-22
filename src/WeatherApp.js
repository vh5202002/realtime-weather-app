import React, { useState, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
//載入SVG圖 並當成ReactComponent使用
import { ReactComponent as AirFlowIcon } from "./images/airFlow.svg";
import { ReactComponent as RainIcon } from "./images/rain.svg";
import { ReactComponent as RefreshIcon } from "./images/refresh.svg";
import { ReactComponent as LoadingIcon } from "./images/loading.svg";
import WeatherIcon from "./WeatherIcon.js";

//定義帶有styled的component
const Container = styled.div`
  background-color: #ededed;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: 0 1px 3px 0 #999999;
  background-color: ${(props) =>
    props.theme === "white" ? "#f9f9f9" : "#212121"};
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: ${(props) => (props.theme === "white" ? "#212121" : "#fcfcfc")};
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: ${(props) => (props.theme === "white" ? "#828282" : "#dadada")};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: ${(props) => (props.theme === "white" ? "#212121" : "#fcfcfc")};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 300;
  color: ${(props) => (props.theme === "white" ? "#828282" : "#dadada")};
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${(props) => (props.theme === "white" ? "#828282" : "#dadada")};

  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    animation: rotate infinite 1.5s linear;
    /* 取得傳入的 props 並根據它來決定動畫要不要執行 */
    animation-duration: ${({ isLoading }) => (isLoading ? "1.5s" : "0s")};
  }
  /* 定義旋轉的動畫效果，為 rotate */
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;
const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 300;
  color: ${(props) => (props.theme === "white" ? "#828282" : "#dadada")};

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const WhiteOrDarkButton = styled.div`
  position: absolute;
  right: 15px;
  top: 50px;
  align-items: center;
  font-size: 14px;
  background: ${(props) => (props.theme === "white" ? "#828282" : "#e0e0e0")};
  color: ${(props) => (props.theme === "white" ? "#e0e0e0" : "#828282")};
  cursor: pointer;
  transition: all 0.5s;
  border-radius: 5px;
  padding: 5px;

  &:hover {
    font-weight: bold;
    background: ${(props) => (props.theme === "white" ? "#e0e0e0" : "#828282")};
    color: ${(props) => (props.theme === "white" ? "#828282" : "#e0e0e0")};
  }
`;

//時間情境判斷 根據時間替換早(晚)天氣圖片
let nowTime = getNowTime().substr(11, 8);
let dayOrNight =
  nowTime >= "05:30:00" && nowTime <= "17:30:00" ? "day" : "night";

function getNowTime() {
  let oTime = new Date();
  let sYear = oTime.getFullYear();
  let sMonth = oTime.getMonth() + 1;
  let sDate = oTime.getDate();
  let sHours = oTime.getHours();
  let sMinutes = oTime.getMinutes();
  let sSeconds = oTime.getSeconds();
  if (sMonth < 10) {
    sMonth = "0" + sMonth;
  }
  if (sDate < 10) {
    sDate = "0" + sDate;
  }
  if (sHours < 10) {
    sHours = "0" + sHours;
  }
  if (sMinutes < 10) {
    sMinutes = "0" + sMinutes;
  }
  if (sSeconds < 10) {
    sSeconds = "0" + sSeconds;
  }
  return (
    sYear +
    "-" +
    sMonth +
    "-" +
    sDate +
    " " +
    sHours +
    ":" +
    sMinutes +
    ":" +
    sSeconds
  );
}

//使用上述的styled-component 組件
const WeatherApp = () => {
  //定義使用useSatae相關資料
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    updateTime: new Date(),
    locationName: "",
    humid: 0,
    temperature: 0,
    windSpeed: 0,
    description: "",
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: "",
    isLoading: true
  });

  // 樣式切換
  const [theme, setTheme] = useState(dayOrNight === "day" ? "white" : "dark");

  const handleChangeWhiteOrDark = () => {
    if (theme === "white") {
      setTheme("dark");
    }

    if (theme === "dark") {
      setTheme("white");
    }
  };

  //透過 async 函式搭配 Promise.all 去等待資料回來 all為多個promise同時執行後統一回傳資料
  //使用 useCallback 並將回傳的函式取名為 fetchData
  const fetchData = useCallback(() => {
    //把原本的 fetchData 改名為 fetchingData 放到 useCallback 的函式內
    const fetchingData = async () => {
      const [currentWeather, weatherForecast] = await Promise.all([
        fetchCurrentWeather(),
        fetchWeatherForecast()
      ]);
      //當載入完成後 loading狀態就為false
      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
        isLoading: false
      });
    };
    //透過prevState取得上一次資料的狀態 在更新一次loading狀態
    setWeatherElement((prevState) => ({
      ...prevState,
      isLoading: true
    }));

    //呼叫 fetchingData
    fetchingData();
    //因為 fetchingData 沒有相依到 React 組件中的資料狀態，所以 dependencies 陣列中不帶入元素
  }, []);
  //透過 useCallback 回傳的函式放到 useEffect 的 dependencies 中
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  //定義handle方法，並Call 中央氣象局的API
  const fetchCurrentWeather = () => {
    //加上 return 直接把 fetch API 回傳的 Promise 回傳出去
    return fetch(
      "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-9BAF0D41-4564-489B-9DE6-F2445CEA6974&locationName=臺中"
    )
      .then((response) => response.json())
      .then((data) => {
        //console.log("---data---", data);
        //取出API相關的資料
        const locationData = data.records.location[0];
        //取出風速（WDSD）、氣溫（TEMP）和濕度（HUMD）的資料
        //再使用reduce(陣列求合 類似加總) includes(陣列中是否有包含想要的元素 有則true)
        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            if (["WDSD", "TEMP", "HUMD"].includes(item.elementName)) {
              neededElements[item.elementName] = item.elementValue;
            }
            return neededElements;
          },
          {}
        ); //--end weatherElements
        //使用useState。setCurrentWeather來改變狀態
        //把取得的資料內容回傳出去，而不是在這裡 setWeatherElement
        return {
          observationTime: locationData.time.obsTime,
          locationName: locationData.locationName,
          temperature: weatherElements.TEMP,
          windSpeed: weatherElements.WDSD,
          humid: weatherElements.HUMD
        };
      });
  };
  //↓36小時天氣預報
  const fetchWeatherForecast = () => {
    //加上 return 直接把 fetch API 回傳的 Promise 回傳出去
    return fetch(
      "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-9BAF0D41-4564-489B-9DE6-F2445CEA6974&format=JSON&locationName=%E8%87%BA%E4%B8%AD%E5%B8%82"
    )
      .then((response) => response.json())
      .then((data) => {
        //console.log("---36hr data---", data);
        //取出API相關的資料
        const locationData = data.records.location[0];

        //再使用reduce(陣列求合 類似加總) includes(陣列中是否有包含想要的元素 有則true)
        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            if (["Wx", "PoP", "CI"].includes(item.elementName)) {
              neededElements[item.elementName] = item.time[0].parameter;
            }
            return neededElements;
          },
          {}
        ); //--end weatherElements
        //把取得的資料內容回傳出去，而不是在這裡 setWeatherElement
        return {
          description: weatherElements.Wx.parameterName,
          weatherCode: weatherElements.Wx.parameterValue,
          rainPossibility: weatherElements.PoP.parameterName,
          comfortability: weatherElements.CI.parameterName
        };
      });
  };

  return (
    <Container>
      <WeatherCard theme={theme}>
        <Location theme={theme}>{weatherElement.locationName}</Location>
        <Description theme={theme}>
          {weatherElement.description} {weatherElement.comfortability}
        </Description>
        <CurrentWeather>
          <Temperature theme={theme}>
            {/* 溫度四捨五入 */}
            {Math.round(weatherElement.temperature)}
            <Celsius>°C</Celsius>
          </Temperature>
          <WeatherIcon
            currentWeatherCode={weatherElement.weatherCode}
            moment={dayOrNight}
          />
        </CurrentWeather>
        <AirFlow theme={theme}>
          <AirFlowIcon />
          {weatherElement.windSpeed} 米/小時
        </AirFlow>
        <Rain theme={theme}>
          <RainIcon />
          {/* 針對濕度進行四捨五入 */}
          {Math.round(weatherElement.rainPossibility)} %
        </Rain>
        {/* 將isLoading資料狀態透過prpos傳入Styled Componment */}
        <Refresh
          theme={theme}
          onClick={fetchData}
          isLoading={weatherElement.isLoading}
        >
          最後觀測時間：
          {new Intl.DateTimeFormat("zh-TW", {
            hour: "numeric",
            minute: "numeric"
          }).format(new Date(weatherElement.observationTime))}
          {""}
          {weatherElement.isLoading ? <LoadingIcon /> : <RefreshIcon />}
        </Refresh>
        <WhiteOrDarkButton theme={theme} onClick={handleChangeWhiteOrDark}>
          {theme === "white" ? "深色模式" : "淺色模式"}
        </WhiteOrDarkButton>
      </WeatherCard>
    </Container>
  );
};

export default WeatherApp;
