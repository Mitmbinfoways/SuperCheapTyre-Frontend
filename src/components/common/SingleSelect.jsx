import React, { useEffect, useRef, useState } from "react"

export default function SingleSelect({
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
    const dropdownRef = useRef(null)

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

    const isPrimitive = (val) => {
        if (val === null) return
        return !(typeof val === "object" || typeof val === "function")
    }

    const normalizedOptions = options.map((opt) =>
        isPrimitive(opt) ? { value: opt, label: opt } : opt
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
                <span>{renderValue()}</span>
                <svg
                    className={`w-5 h-5 text-gray-950 transition-transform ${isOpen ? "transform rotate-180" : ""
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
                <div className="absolute z-50 w-full mt-1 backdrop-blur-lg bg-[#e5e2ea]/80 border border-white/20 rounded-xl shadow-lg">
                    {normalizedOptions.map((option) => (
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
                    ))}
                </div>
            )}
        </div>
    )
}