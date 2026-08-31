import {
  Children,
  isValidElement,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { useComponentDefaults } from '../theme/useComponentDefaults';
import styles from '@larose-ui/styles/components/Card/Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  style?: CSSProperties;
}

export interface CardSectionProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

function mergeClassName(...parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

function CardHeader({ children, className, style, ...props }: CardSectionProps) {
  return (
    <header className={mergeClassName(styles.header, className)} style={style} {...props}>
      {children}
    </header>
  );
}

function CardTitle({ children, className, style, ...props }: CardSectionProps) {
  return (
    <h3 className={mergeClassName(styles.title, className)} style={style} {...props}>
      {children}
    </h3>
  );
}

function CardDescription({ children, className, style, ...props }: CardSectionProps) {
  return (
    <p className={mergeClassName(styles.description, className)} style={style} {...props}>
      {children}
    </p>
  );
}

function CardContent({ children, className, style, ...props }: CardSectionProps) {
  return (
    <div className={mergeClassName(styles.body, className)} style={style} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ children, className, style, ...props }: CardSectionProps) {
  return (
    <footer className={mergeClassName(styles.footer, className)} style={style} {...props}>
      {children}
    </footer>
  );
}

const COMPOUND_TYPES = new Set([
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
]);

function isCompoundChild(child: ReactNode): boolean {
  return isValidElement(child) && COMPOUND_TYPES.has(child.type as typeof CardHeader);
}

function CardRoot(incomingProps: CardProps) {
  const {
    title,
    description,
    children,
    footer,
    padding = 'md',
    className,
    style,
    ...props
  } = useComponentDefaults('Card', incomingProps);

  const childArray = Children.toArray(children);
  const usesComposition = childArray.some(isCompoundChild);

  if (usesComposition) {
    return (
      <article
        className={mergeClassName(styles.card, className)}
        style={style}
        data-padding={padding}
        {...props}
      >
        {children}
      </article>
    );
  }

  return (
    <article
      className={mergeClassName(styles.card, className)}
      style={style}
      data-padding={padding}
      {...props}
    >
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      {children && <CardContent>{children}</CardContent>}
      {footer && <CardFooter>{footer}</CardFooter>}
    </article>
  );
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});
