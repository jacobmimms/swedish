import { useEffect, useState, useRef } from "react";

export default function TT({ children, text }) {
  const [isHovering, setIsHovering] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState("left");
  const [maxWidth, setMaxWidth] = useState("none");
  const wrapperRef = useRef(null);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const handleTap = () => {
    setIsHovering((prev) => !prev);
  };

  useEffect(() => {
    if (wrapperRef.current) {
      const { left, width } = wrapperRef.current.getBoundingClientRect();
      const midpoint = window.innerWidth / 2;
      // Determine the side of the screen the element is on
      const position = left + width / 2 < midpoint ? "right" : "left";
      setTooltipPosition(position);
      // Dynamically set maxWidth based on the tooltip's position and the viewport width
      const tooltipMaxWidth =
        position === "left"
          ? `${window.innerWidth - left - width - 20}px` // 20px for a little margin
          : `${window.innerWidth - left}px`;

      setMaxWidth(tooltipMaxWidth);
    }
  }, []);

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTap}
      className={`relative ttWrapper`}
      style={{ display: "inline-block" }} // Ensure the wrapper doesn't take up more space than necessary
    >
      {children}
      {isHovering && (
        <span
          className={`flex grow absolute p-1 bg-sky-200 text-sky-950 rounded-md text-sm shadow-sm shadow-gray-500 ${
            tooltipPosition === "left" ? "right-full mr-2" : "left-full ml-2"
          }`}
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            maxWidth: maxWidth,
            zIndex: 1000, // Ensure the tooltip is on top of everything else
          }}
        >
          {text}
        </span>
      )}
    </div>
  );
}
