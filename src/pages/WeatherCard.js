import React from "react";
import styled from "styled-components";
import dayjs from "dayjs"; // 處理跨瀏覽器的問題，輕量時間處理套件
import { ReactComponent as AirFlowIcon } from "../images/airFlow.svg";
import { ReactComponent as RainIcon } from "../images/rain.svg";
import { ReactComponent as RefreshIcon } from "../images/refresh.svg";
import { ReactComponent as LoadingIcon } from "../images/loading.svg";
import { ReactComponent as CogIcon } from "../images/cog.svg";
import WeatherIcon from "../components/WeatherIcon";

const WeatherCardWrapper = styled.div`
  position: relative;
  box-sizing: border-box;
  padding: 20px 15px 30px 15px;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background: ${({ theme }) => theme.foregroundColor};
`;

const Cog = styled(CogIcon)`
  cursor: pointer;
  position: absolute;
  top: 30px;
  right: 15px;
  width: 15px;
  height: 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  display: flex;
  font-size: 96px;
  font-weight: 300;
  color: ${({ theme }) => theme.temperatureColor};
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
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Refresh = styled.div`
  position: absolute;
  display: inline-flex;
  align-items: flex-end;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  color: ${({ theme }) => theme.textColor};

  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }

  svg {
    cursor: pointer;
    margin-left: 10px;
    width: 15px;
    height: 15px;
    animation: rotate infinite 1.5s linear;
    animation-duration: ${({ isLoading }) => (isLoading ? "1.5s" : "0s")};
  }
`;

const WeatherCard = ({
  weatherElement,
  moment,
  fetchData,
  handleCurrentPageChange,
  cityName,
}) => {
  const {
    observationTime,
    description,
    windSpeed,
    temperature,
    rainPossibility,
    comfortability,
    isLoading,
    weatherCode,
  } = weatherElement;

  const handlePageChange = () => {
    handleCurrentPageChange("WeatherSetting");
  };

  return (
    <WeatherCardWrapper>
      <Cog onClick={handlePageChange} />
      <Location>{cityName}</Location>
      <Description>
        {description}
        {comfortability}
      </Description>
      <CurrentWeather>
        <Temperature>
          {Math.round(temperature)} <Celsius>°C</Celsius>
        </Temperature>
        <WeatherIcon weatherCode={weatherCode} moment={moment} />
      </CurrentWeather>
      <AirFlow>
        <AirFlowIcon /> {windSpeed} m/h
      </AirFlow>
      <Rain>
        <RainIcon /> {rainPossibility}%
      </Rain>
      <Refresh onClick={fetchData} isLoading={isLoading}>
        最後觀測時間：
        {new Intl.DateTimeFormat("zh-TW", {
          hour: "numeric",
          minute: "numeric",
        }).format(dayjs(observationTime))}
        {isLoading ? <LoadingIcon /> : <RefreshIcon />}
      </Refresh>
    </WeatherCardWrapper>
  );
};

export default WeatherCard;
