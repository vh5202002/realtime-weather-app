import React, { useState } from "react";
import styled from "styled-components";
import { availableLocations } from "../utils/helpers";

const WeatherSettingWrapper = styled.div`
  position: relative;
  box-sizing: border-box;
  padding: 20px;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background: ${({ theme }) => theme.foregroundColor};
`;

const Title = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 30px;
`;

const StyledLabel = styled.label`
  display: block;
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 15px;
`;

const StyledSelect = styled.select`
  display: block;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.textColor};
  outline: none;
  width: 100%;
  max-width: 100%;
  color: ${({ theme }) => theme.textColor};
  font-size: 16px;
  padding: 7px 10px;
  -webkit-appearance: none;
  -moz-appearance: none;
  box-shadow: none;
  outline: 0;
  margin-bottom: 40px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BackBtn = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  user-select: none;
  margin: 0;
  letter-spacing: 0.3px;
  line-height: 1;
  overflow: visible;
  text-transform: none;
  border: 1px solid transparent;
  background-color: transparent;
  height: 35px;
  width: 80px;
  border-radius: 5px;
  font-size: 14px;
  color: ${({ theme }) => theme.textColor};
  border-color: ${({ theme }) => theme.textColor};

  &:focus {
    outline: 0;
    box-shadow: none;
  }
  &::-moz-focus-inner {
    padding: 0;
    border-style: none;
  }
`;

const SaveBtn = styled(BackBtn)`
  color: white;
  background-color: #40a9f3;
  border-color: transparent;
`;

const WeatherSetting = ({
  cityName,
  handleCurrentPageChange,
  handleCurrentCityChange,
}) => {
  const [locationName, setLocationName] = useState(cityName);

  const handleChange = (e) => {
    setLocationName(e.target.value);
  };

  const handlePageChange = () => {
    handleCurrentPageChange("WeatherCard");
  };

  // localStorage with expiry
  const setWithExpiry = () => {
    let oneDay = 24 * 60 * 60 * 1000;
    const now = new Date();
    const data = {
      cityName: locationName,
      expiry: now.getTime() + oneDay,
    };
    localStorage.setItem("storedData", JSON.stringify(data));
  };

  const handleSave = () => {
    handleCurrentCityChange(locationName);
    handleCurrentPageChange("WeatherCard");
    setWithExpiry();
  };

  return (
    <WeatherSettingWrapper>
      <Title>設定</Title>
      <StyledLabel htmlFor="location">地區</StyledLabel>
      <StyledSelect
        id="location"
        name="location"
        onChange={handleChange}
        value={locationName}
      >
        {availableLocations.map(({ cityName }) => (
          <option value={cityName} key={cityName}>
            {cityName}
          </option>
        ))}
      </StyledSelect>
      <ButtonGroup>
        <BackBtn onClick={handlePageChange}>返回</BackBtn>
        <SaveBtn onClick={handleSave}>儲存</SaveBtn>
      </ButtonGroup>
    </WeatherSettingWrapper>
  );
};

export default WeatherSetting;
