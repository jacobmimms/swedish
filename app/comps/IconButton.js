import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function IconButton({ icon, ...props }) {
  return (
    <button {...props}>
      <FontAwesomeIcon icon={icon} />
    </button>
  );
}
