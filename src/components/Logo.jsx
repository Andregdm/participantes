// Logo — componente isolado para evitar prop drilling em MapComponent
import logoImg from "../assets/logo.png";
import { BRAND } from "./constants";

const Logo = ({ size = 80 }) => (
  <img
    src={logoImg}
    alt="Participantes di Buteco"
    width={size}
    height={size}
    className="logo-img"
    style={{
      width:  size,
      height: size,
      boxShadow: `0 0 0 4px ${BRAND.gold}55, 0 0 0 8px rgba(255,255,255,0.1), 0 8px 24px rgba(0,0,0,0.2)`,
    }}
  />
);

export default Logo;
