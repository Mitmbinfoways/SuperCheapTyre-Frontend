import React, { useEffect, useRef, useState } from "react"

export default function SearchableSingleSelect({
    options,
    onChange,
    value,
    placeholder = "Select an option",
    selectStyle = "",
    optionStyle = "",
    className = "",
    disabled = false,
    defaultValue,
    ...props
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [finalValue, setFinalValue] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const dropdownRef = useRef(null)
    const searchInputRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus()
        }
        if (!isOpen) {
            setSearchTerm("")
        }
    }, [isOpen])

    const isPrimitive = (val) => {
        if (val === null) return
        return !(typeof val === "object" || typeof val === "function")
    }

    const normalizedOptions = options.map((opt) =>
        isPrimitive(opt) ? { value: opt, label: opt } : opt
    )

    const filteredOptions = normalizedOptions.filter(opt =>
        opt.label.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )

    const renderValue = () => {
        const selectedOption = normalizedOptions.find((opt) => opt.value === value)
        return selectedOption ? selectedOption.label : defaultValue || placeholder
    }

    useEffect(() => {
        setFinalValue(!value ? defaultValue : value)
    }, [value, defaultValue])

    return (
        <div className={`relative w-full ${className}`} ref={dropdownRef}>
            <div
                className={`w-full p-2 backdrop-blur-lg bg-white/30 cursor-pointer flex items-center justify-between ${selectStyle} ${disabled ? "!bg-gray-100/50" : ""}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className="truncate pr-2">{renderValue()}</span>
                <svg
                    className={`w-5 h-5 text-gray-950 transition-transform -mx-4 sm:mx-0 flex-shrink-0 ${isOpen ? "transform rotate-180" : ""
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-[#e5e2ea] border border-white/20 rounded-xl shadow-lg overflow-hidden flex flex-col max-h-64">
                    <div className="p-2 border-b border-gray-300 bg-[#e5e2ea]">
                        <input
                            ref={searchInputRef}
                            type="text"
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ED1C24] text-black bg-white"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div className="overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={`group px-4 py-2 hover:bg-red-500/80 cursor-pointer transition-all duration-200 ${optionStyle}`}
                                    onClick={() => {
                                        onChange(option.value)
                                        setIsOpen(false)
                                    }}
                                >
                                    <span
                                        className={`${finalValue === option.value ? "font-semibold" : ""
                                            } text-black group-hover:text-white`}
                                    >
                                        {option.label}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-gray-500 text-sm">No results found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
