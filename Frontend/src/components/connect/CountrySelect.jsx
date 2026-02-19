import React, { useMemo, useState } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";

const CountrySelect = ({ formData, setFormData }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Convert ISO code to flag emoji
  const getFlagEmoji = (countryCode) => {
    return countryCode
      .toUpperCase()
      .replace(/./g, (char) =>
        String.fromCodePoint(127397 + char.charCodeAt())
      );
  };

  // Prepare country list with flags
  const options = useMemo(() => {
    return countryList().getData().map((country) => ({
      value: country.label, // Store only country name in DB
      label: `${getFlagEmoji(country.value)} ${country.label}`, // Show flag + name
    }));
  }, []);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "8px",
      padding: "4px",
      borderColor: "#D1D5DB",
    }),
  };

  return (
    <div>
      <label className="block text-sm font-semibold mb-2">
        Country <span className="text-red-500">*</span>
      </label>

      <Select
        options={options}
        value={selectedCountry}
        onChange={(selected) => {
          setSelectedCountry(selected);
          setFormData({
            ...formData,
            country: selected.value, // Only country name saved
          });
        }}
        styles={customStyles}
        placeholder="Select your country"
        isSearchable
      />
    </div>
  );
};

export default CountrySelect;
