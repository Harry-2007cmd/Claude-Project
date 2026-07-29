// Card — shared surface container (T1.0). Styling lives in styles/tokens.css
// (.ui-card*). Used for post cards, ride cards, place cards and bottom sheets.
//
// `interactive` renders a <button> so clickable cards stay keyboard-accessible;
// pass `as` to render a different element (e.g. "section", "li").

const PADDINGS = ['none', 'sm', 'md'];

export default function Card({
  padding = 'md',
  interactive = false,
  as,
  className = '',
  children,
  ...props
}) {
  const safePadding = PADDINGS.includes(padding) ? padding : 'md';
  const Element = as || (interactive ? 'button' : 'div');

  const classes = [
    'ui-card',
    `ui-card--pad-${safePadding}`,
    interactive ? 'ui-card--interactive' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const typeProp = Element === 'button' ? { type: 'button' } : {};

  return (
    <Element className={classes} {...typeProp} {...props}>
      {children}
    </Element>
  );
}
