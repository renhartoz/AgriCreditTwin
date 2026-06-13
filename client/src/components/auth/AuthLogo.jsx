import { Link } from 'react-router-dom';

export default function AuthLogo({ size = 'default', className = '' }) {
  const sizes = {
    small: { img: 'w-8 h-8', text: 'text-lg' },
    default: { img: 'w-11 h-11', text: 'text-xl' },
    large: { img: 'w-14 h-14', text: 'text-2xl' },
  };

  const s = sizes[size] || sizes.default;

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2.5 font-mono font-bold tracking-wider no-underline ${className}`}
    >
      <img
        className={`${s.img} rounded-lg`}
        src="/logo.png"
        alt="AgriCredit Twin"
      />
      <span className={s.text}>
        <span className="text-[#78c2a4]">AgriCredit</span>
        <span className="text-primary">Twin</span>
      </span>
    </Link>
  );
}
