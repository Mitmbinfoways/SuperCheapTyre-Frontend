import clsx from "clsx";

const Badge = ({ label, color = "gray", size = "sm", customClass = "" }) => {
  const colorClasses = {
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-[#FFC107] text-white",
    blue: "bg-blue-100 text-blue-800",
    gray: "bg-gray-100 text-gray-800",
    purple: "bg-purple-100 text-purple-800",
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center font-medium rounded-full",
        color !== "custom" ? colorClasses[color] : "",
        sizeClasses[size],
        customClass
      )}
    >
      {label}
    </span>
  );
};

export default Badge;
