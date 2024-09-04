import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import "./Select.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faCheck,
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const fetchPosts = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

function Select({
  renderCustomItem,
  renderDisplayValue,
  filterFunction,
  sortFunction,
  selectedIcon = null,
  disabled = false,
  multiSelect = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(multiSelect ? [] : null);
  const [filterText, setFilterText] = useState("");
  const dropdownRef = useRef(null);

  const { data, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  const toggleDropdown = () => {
    if (!disabled) {
      if (!isOpen && filterFunction) {
        setFilterText("");
      }
      setIsOpen((prev) => !prev);
    }
  };

  const handleOptionClick = (option) => {
    if (multiSelect) {
      if (selectedOption.some((item) => item.id === option.id)) {
        setSelectedOption(
          selectedOption.filter((item) => item.id !== option.id),
        );
      } else {
        setSelectedOption([...selectedOption, option]);
      }
    } else {
      if (selectedOption?.id === option.id) {
        setSelectedOption(null);
        setFilterText("");
      } else {
        setSelectedOption(option);
        setFilterText(
          renderDisplayValue ? renderDisplayValue(option) : option.title,
        );
      }
      setIsOpen(false);
    }
    setFilterText("");
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setSelectedOption(multiSelect ? [] : null);
    }

    setFilterText(value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleRemoveOption = (option) => {
    setSelectedOption(selectedOption.filter((item) => item.id !== option.id));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const renderSelectedOptions = () => {
    if (multiSelect) {
      return selectedOption.map((option) => (
        <span key={option.id} className="selected-tag">
          {renderDisplayValue ? renderDisplayValue(option) : option.title}
          <FontAwesomeIcon
            icon={faTimes}
            className="remove-icon"
            onClick={() => handleRemoveOption(option)}
          />
        </span>
      ));
    }
    return selectedOption
      ? renderDisplayValue
        ? renderDisplayValue(selectedOption)
        : selectedOption.title
      : "";
  };

  return (
    <div
      className={`select-container ${disabled ? "disabled" : ""}`}
      ref={dropdownRef}
    >
      <span className="select-span">
        {filterFunction && (
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        )}
        <div
          className={`input-content ${multiSelect ? "multi-select" : ""} ${filterFunction ? "has-filter" : ""}`}
        >
          {multiSelect && renderSelectedOptions()}
          <input
            type="text"
            value={
              multiSelect
                ? filterText
                : filterFunction && filterText
                  ? filterText
                  : renderSelectedOptions()
            }
            onClick={toggleDropdown}
            onChange={filterFunction ? handleInputChange : undefined}
            readOnly={!filterFunction}
            className={`select-input ${filterFunction ? "search-input" : ""}`}
            placeholder={
              multiSelect && selectedOption.length === 0
                ? "Select options"
                : !multiSelect && !selectedOption
                  ? "Select best option"
                  : ""
            }
            disabled={disabled}
          />
        </div>
        {!filterFunction && (
          <FontAwesomeIcon icon={faChevronDown} className="arrow-icon" />
        )}
      </span>
      {isOpen && (
        <ul className="dropdown">
          {data
            ? data
                .filter((option) =>
                  filterFunction ? filterFunction(option, filterText) : true,
                )
                .sort(sortFunction ? sortFunction : () => 0)
                .map((option) => (
                  <li
                    key={option.id}
                    onClick={() => handleOptionClick(option)}
                    className={`dropdown-item ${
                      option.disabled ? "disabled-item" : ""
                    }`}
                    style={
                      option.disabled
                        ? { pointerEvents: "none", color: "#ccc" }
                        : {}
                    }
                  >
                    {renderCustomItem ? renderCustomItem(option) : option.title}
                    {(multiSelect
                      ? selectedOption.some((item) => item.id === option.id)
                      : selectedOption?.id === option.id) && (
                      <FontAwesomeIcon
                        icon={selectedIcon}
                        className="check-icon"
                      />
                    )}
                  </li>
                ))
            : null}
          {data && data.length === 0 && (
            <li className="dropdown-item no-results">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default Select;
