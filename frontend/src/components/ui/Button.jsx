// Button — shared base button (T1.0). All styling comes from styles/tokens.css
// (.ui-button*). Never restyle this per page; add a variant here instead.

const VARIANTS = ['primary', 'secondary', 'ghost', 'danger'];
const SIZES = ['sm', 'md', 'lg'];

export default function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  type = 'button',
  className = '',
  children,
  ...props
}) {
  const safeVariant = VARIANTS.includes(variant) ? variant : 'primary';
  const safeSize = SIZES.includes(size) ? size : 'md';

  const classes = [
    'ui-button',
    `ui-button--${safeVariant}`,
    `ui-button--${safeSize}`,
    block ? 'ui-button--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
