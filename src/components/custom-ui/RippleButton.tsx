"use client";

import { MouseEvent, useRef } from "react";
import "@/styles/ripple.css";

interface RippleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  disabled = false,
  className = "",
  onClick,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const button = buttonRef.current;
    if (!button) return;

    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${
      event.clientX - button.getBoundingClientRect().left - radius
    }px`;
    circle.style.top = `${
      event.clientY - button.getBoundingClientRect().top - radius
    }px`;
    circle.classList.add("ripple");

    const existingRipple = button.getElementsByClassName("ripple")[0];
    if (existingRipple) existingRipple.remove();

    button.appendChild(circle);
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return; // Ngừng xử lý khi button bị disable
    createRipple(event);
    if (onClick) onClick(event);
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled}
      className={`relative overflow-hidden rounded-lg p-2 ${className} ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      {...props}
    >
      <span
        className={`flex items-center justify-center gap-2 ${
          disabled ? "opacity-50" : ""
        }`}
      >
        {children}
      </span>
    </button>
  );
};

export default RippleButton;
