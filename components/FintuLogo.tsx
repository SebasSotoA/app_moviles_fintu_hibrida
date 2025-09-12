import React from "react";
import FintuLogoHomeIcon from "../assets/icons/fintu-logo-home.svg";

interface FintuLogoProps {
  size?: number;
  color?: string;
}

const FintuLogo: React.FC<FintuLogoProps> = ({
  size = 50,
  color,
}) => {
  return (
    <FintuLogoHomeIcon
      width={size}
      height={size}
      color={color}
    />
  );
};

export default FintuLogo;
