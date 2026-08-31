import {
  Children,
  createContext,
  Fragment,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import type { SplitCompactMode, SplitOrientation } from './types';
import {
  defaultSizesFromPanes,
  parsePaneElement,
  redistributeHiddenPane,
  resizeAdjacentSizes,
} from './utils';
import styles from '@larose-ui/styles/components/SplitView/SplitView.module.css';

const STORAGE_PREFIX = 'larose-split-view';

interface SplitViewContextValue {
  showPane: (id: string) => void;
  hidePane: (id: string) => void;
  hiddenPanes: Array<{ id: string; label: string }>;
}

const SplitViewContext = createContext<SplitViewContextValue | null>(null);

export function useSplitView(): SplitViewContextValue {
  const context = useContext(SplitViewContext);
  if (!context) {
    throw new Error('useSplitView must be used within SplitView');
  }
  return context;
}

export interface SplitViewPaneProps {
  id: string;
  label?: string;
  children: ReactNode;
  minSize?: number;
  maxSize?: number;
  defaultSize?: number;
  collapsible?: boolean;
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  className?: string;
  'aria-label'?: string;
}

export function SplitViewPane(_props: SplitViewPaneProps): null {
  return null;
}

SplitViewPane.displayName = 'SplitViewPane';

export interface SplitViewProps {
  children: ReactNode;
  orientation?: SplitOrientation;
  compactMode?: SplitCompactMode;
  storageKey?: string;
  toolbar?: ReactNode;
  onSizesChange?: (sizes: number[]) => void;
  className?: string;
  'aria-label'?: string;
}

function loadState(
  storageKey: string | undefined,
  paneCount: number,
  fallbackSizes: number[],
  fallbackVisible: boolean[],
) {
  if (storageKey && typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(`${STORAGE_PREFIX}:${storageKey}`);
      if (raw) {
        const parsed = JSON.parse(raw) as { sizes?: number[]; visible?: boolean[] };
        if (parsed.sizes?.length === paneCount && parsed.visible?.length === paneCount) {
          return { sizes: parsed.sizes, visible: parsed.visible };
        }
      }
    } catch {
      // ignore invalid storage
    }
  }
  return { sizes: fallbackSizes, visible: fallbackVisible };
}

export function SplitView({
  children,
  orientation = 'horizontal',
  compactMode = 'side-by-side',
  storageKey,
  toolbar,
  onSizesChange,
  className,
  'aria-label': ariaLabel = 'Split view',
}: SplitViewProps) {
  const paneElements = useMemo(
    () =>
      Children.toArray(children).filter(
        (child): child is ReactElement<SplitViewPaneProps> =>
          isValidElement(child) && child.type === SplitViewPane,
      ),
    [children],
  );

  const paneConfigs = useMemo(
    () =>
      paneElements
        .map((child) => parsePaneElement(child))
        .filter((config): config is NonNullable<typeof config> => config !== null && config.id !== ''),
    [paneElements],
  );

  const fallbackSizes = useMemo(() => defaultSizesFromPanes(paneConfigs), [paneConfigs]);
  const fallbackVisible = useMemo(
    () => paneConfigs.map((pane) => pane.defaultVisible),
    [paneConfigs],
  );

  const [{ sizes, visible }, setLayout] = useState(() =>
    loadState(storageKey, paneConfigs.length, fallbackSizes, fallbackVisible),
  );

  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') return;
    window.localStorage.setItem(
      `${STORAGE_PREFIX}:${storageKey}`,
      JSON.stringify({ sizes, visible }),
    );
  }, [sizes, visible, storageKey]);

  useEffect(() => {
    onSizesChange?.(sizes);
  }, [onSizesChange, sizes]);

  const setPaneVisible = useCallback(
    (index: number, nextVisible: boolean, onVisibleChange?: (visible: boolean) => void) => {
      setLayout((current) => {
        const nextVisibleState = [...current.visible];
        nextVisibleState[index] = nextVisible;
        const nextSizes = nextVisible
          ? current.sizes
          : redistributeHiddenPane(current.sizes, index, nextVisibleState);
        return { sizes: nextSizes, visible: nextVisibleState };
      });
      onVisibleChange?.(nextVisible);
    },
    [],
  );

  const showPane = useCallback(
    (id: string) => {
      const index = paneConfigs.findIndex((pane) => pane.id === id);
      if (index < 0) return;
      const child = paneElements[index];
      setPaneVisible(index, true, child?.props.onVisibleChange);
    },
    [paneConfigs, paneElements, setPaneVisible],
  );

  const hidePane = useCallback(
    (id: string) => {
      const index = paneConfigs.findIndex((pane) => pane.id === id);
      if (index < 0 || !paneConfigs[index]?.collapsible) return;
      const child = paneElements[index];
      setPaneVisible(index, false, child?.props.onVisibleChange);
    },
    [paneConfigs, paneElements, setPaneVisible],
  );

  const hiddenPanes = useMemo(
    () =>
      paneConfigs
        .map((pane, index) => ({ id: pane.id, label: pane.label ?? pane.id, index }))
        .filter((pane) => !visible[pane.index] && paneConfigs[pane.index]?.collapsible),
    [paneConfigs, visible],
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const startResize = useCallback(
    (dividerIndex: number, startCoord: number, initialSizes: number[]) => {
      const mins = paneConfigs.map((pane) => pane.minSize);
      const maxes = paneConfigs.map((pane) => pane.maxSize);

      const moveHandler = (event: globalThis.MouseEvent) => {
        const host = containerRef.current;
        const total = host
          ? orientation === 'horizontal'
            ? host.getBoundingClientRect().width
            : host.getBoundingClientRect().height
          : 1;
        const deltaPx =
          orientation === 'horizontal' ? event.clientX - startCoord : event.clientY - startCoord;
        const deltaPercent = (deltaPx / Math.max(total, 1)) * 100;
        setLayout((current) => ({
          ...current,
          sizes: resizeAdjacentSizes(initialSizes, dividerIndex, deltaPercent, mins, maxes),
        }));
      };

      const onUp = () => {
        window.removeEventListener('mousemove', moveHandler);
        window.removeEventListener('mouseup', onUp);
      };

      window.addEventListener('mousemove', moveHandler);
      window.addEventListener('mouseup', onUp);
    },
    [orientation, paneConfigs],
  );

  const contextValue = useMemo(
    () => ({
      showPane,
      hidePane,
      hiddenPanes: hiddenPanes.map(({ id, label }) => ({ id, label })),
    }),
    [hiddenPanes, hidePane, showPane],
  );

  let dividerCount = 0;

  return (
    <SplitViewContext.Provider value={contextValue}>
      {toolbar}
      <div
        ref={containerRef}
        className={[styles.splitView, className].filter(Boolean).join(' ')}
        data-orientation={orientation}
        data-compact={compactMode === 'stack' ? 'stack' : undefined}
        role="group"
        aria-label={ariaLabel}
      >
        {paneElements.map((child, index) => {
          const config = paneConfigs[index];
          if (!config) return null;

          const controlledVisible = child.props.visible;
          const isVisible =
            controlledVisible !== undefined ? controlledVisible : (visible[index] ?? true);
          const paneSize = isVisible ? `${sizes[index] ?? 0}%` : '0%';
          const flexStyle =
            compactMode === 'stack'
              ? { flex: isVisible ? '1 1 auto' : '0 0 auto' }
              : orientation === 'horizontal'
                ? { flex: `0 0 ${paneSize}`, width: paneSize }
                : { flex: `0 0 ${paneSize}`, height: paneSize };

          const showDivider =
            compactMode !== 'stack' &&
            isVisible &&
            index < paneElements.length - 1 &&
            paneElements.slice(index + 1).some((_, nextIndex) => visible[index + 1 + nextIndex]);

          const fragment = (
            <Fragment key={config.id}>
              <section
                className={[styles.pane, child.props.className].filter(Boolean).join(' ')}
                style={flexStyle}
                data-hidden={isVisible ? undefined : 'true'}
                aria-label={child.props['aria-label'] ?? config.label ?? config.id}
                hidden={!isVisible}
              >
                <div className={styles.paneBody}>{child.props.children}</div>
              </section>
              {showDivider && (
                <div
                  className={styles.divider}
                  role="separator"
                  aria-orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'}
                  tabIndex={0}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    startResize(
                      dividerCount,
                      orientation === 'horizontal' ? event.clientX : event.clientY,
                      sizes,
                    );
                  }}
                  onKeyDown={(event) => {
                    const delta = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 2 : -2;
                    if (
                      event.key === 'ArrowRight' ||
                      event.key === 'ArrowLeft' ||
                      event.key === 'ArrowDown' ||
                      event.key === 'ArrowUp'
                    ) {
                      event.preventDefault();
                      setLayout((current) => ({
                        ...current,
                        sizes: resizeAdjacentSizes(
                          current.sizes,
                          dividerCount,
                          event.key === 'ArrowRight' || event.key === 'ArrowDown' ? delta : -delta,
                          paneConfigs.map((pane) => pane.minSize),
                          paneConfigs.map((pane) => pane.maxSize),
                        ),
                      }));
                    }
                  }}
                />
              )}
            </Fragment>
          );

          if (showDivider) dividerCount += 1;
          return fragment;
        })}
      </div>
    </SplitViewContext.Provider>
  );
}
