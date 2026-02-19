import { Link } from 'react-router-dom';

const Button = ({ 
  children, 
  to, 
  href, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  className = '',
  ...props 
}) => {
  // Base styles applied to EVERY button
  const baseStyle = "inline-flex justify-center items-center px-6 py-2.5 rounded-md font-medium transition-colors duration-200 text-center";
  
  // Style variants (Primary is your dark green 'Donate' style)
  const variants = {
    primary: "bg-[#0B4D26] hover:bg-green-800 text-white shadow-sm",
    outline: "bg-transparent border border-gray-300 hover:border-white text-white",
  };

  const combinedClassName = `${baseStyle} ${variants[variant]} ${className}`;

  // If a 'to' prop is passed, render a React Router Link
  if (to) {
    return <Link to={to} className={combinedClassName} {...props}>{children}</Link>;
  }

  // If an 'href' prop is passed, render a standard <a> tag
  if (href) {
    return <a href={href} className={combinedClassName} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
  }

  // Otherwise, render a standard <button> (useful for forms)
  return (
    <button type={type} onClick={onClick} className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;