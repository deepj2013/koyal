import React, { useState, useRef, useEffect } from "react";

const Dropdown = ({ label, options = [], onChange, value }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    onChange?.(option.value);
    setIsOpen(false);
  };

  // Close dropdown on outside click
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
  }, []);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div className="relative inline-block text-left w-full" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex justify-between items-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
        onClick={toggleDropdown}
      >
        <span className="mr-2">{selected ? selected.text : label}</span>
        <svg
          className="w-5 h-5 ml-2 -mr-1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1 max-h-60 overflow-auto">
            {options.map((option, index) => (
              <button
                key={index}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                onClick={() => handleSelect(option)}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
