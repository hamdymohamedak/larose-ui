import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { DRAG_START_THRESHOLD_PX } from '@larose-ui/tokens';
import {
  appendDragItem,
  buildDropResult,
  createDragSession,
  findDropTarget,
  moveDragSession,
  zonesFromElements,
  type DragItem as CoreDragItem,
} from '@larose-ui/primitives';
import type { DragItem, DragSession, DropResult, DropTargetState } from './types';
import { DragPreviewLayer } from './DragPreview';

export interface DropZoneRegistration<T = unknown> {
  id: string;
  accepts?: string | string[];
  canDrop?: (items: DragItem<T>[]) => boolean;
  onDrop: (result: DropResult<T>) => void | Promise<void>;
  element: HTMLElement | null;
}

interface DragDropContextValue<T = unknown> {
  session: DragSession<T> | null;
  target: DropTargetState | null;
  registerZone: (zone: DropZoneRegistration<T>) => () => void;
  beginPointerDrag: (
    item: DragItem<T>,
    pointerId: number,
    x: number,
    y: number,
    element: HTMLElement,
  ) => void;
  addItemToSession: (item: DragItem<T>) => void;
  updatePointer: (x: number, y: number) => void;
  endPointer: (x: number, y: number, optionKey: boolean) => Promise<void>;
  cancelPointer: () => void;
}

const DragDropContext = createContext<DragDropContextValue | null>(null);

export function useDragDropContext<T = unknown>(): DragDropContextValue<T> {
  const ctx = useContext(DragDropContext);
  if (!ctx) {
    throw new Error('DragDrop components must be used within DragDropProvider');
  }
  return ctx as DragDropContextValue<T>;
}

export interface DragDropProviderProps {
  children: ReactNode;
}

export function DragDropProvider({ children }: DragDropProviderProps) {
  const [session, setSession] = useState<DragSession | null>(null);
  const [target, setTarget] = useState<DropTargetState | null>(null);
  const [revertPreview, setRevertPreview] = useState(false);
  const zonesRef = useRef<Map<string, DropZoneRegistration>>(new Map());
  const sessionRef = useRef<DragSession | null>(null);
  sessionRef.current = session;

  const registerZone = useCallback((zone: DropZoneRegistration) => {
    zonesRef.current.set(zone.id, zone);
    return () => {
      zonesRef.current.delete(zone.id);
    };
  }, []);

  const findTarget = useCallback((x: number, y: number, items: CoreDragItem[]) => {
    return findDropTarget(
      zonesFromElements(
        Array.from(zonesRef.current.values()).map((zone) => ({
          id: zone.id,
          accepts: zone.accepts,
          canDrop: zone.canDrop
            ? (coreItems: CoreDragItem[]) => zone.canDrop!(coreItems as DragItem[])
            : undefined,
          element: zone.element,
        })),
      ),
      x,
      y,
      items,
    );
  }, []);

  const beginPointerDrag = useCallback(
    (item: DragItem, pointerId: number, x: number, y: number, _element: HTMLElement) => {
      setRevertPreview(false);
      setSession(createDragSession(item, pointerId, x, y));
      setTarget(null);
    },
    [],
  );

  const addItemToSession = useCallback((item: DragItem) => {
    setSession((current) => (current ? appendDragItem(current, item) : current));
  }, []);

  const updatePointer = useCallback(
    (x: number, y: number) => {
      setSession((current) => {
        if (!current) return current;
        setTarget(findTarget(x, y, current.items));
        return moveDragSession(current, x, y);
      });
    },
    [findTarget],
  );

  const endPointer = useCallback(
    async (x: number, y: number, optionKey: boolean) => {
      const current = sessionRef.current;
      if (!current) return;

      const hit = findTarget(x, y, current.items);
      const zone = hit ? zonesRef.current.get(hit.zoneId) : undefined;

      if (!hit?.valid || !zone) {
        setRevertPreview(true);
        window.setTimeout(() => {
          setSession(null);
          setTarget(null);
          setRevertPreview(false);
        }, 220);
        return;
      }

      await zone.onDrop(buildDropResult(current, zone.id, optionKey));

      setSession(null);
      setTarget(null);
    },
    [findTarget],
  );

  const cancelPointer = useCallback(() => {
    setSession(null);
    setTarget(null);
    setRevertPreview(false);
  }, []);

  const value = useMemo<DragDropContextValue>(
    () => ({
      session,
      target,
      registerZone,
      beginPointerDrag,
      addItemToSession,
      updatePointer,
      endPointer,
      cancelPointer,
    }),
    [
      session,
      target,
      registerZone,
      beginPointerDrag,
      addItemToSession,
      updatePointer,
      endPointer,
      cancelPointer,
    ],
  );

  return (
    <DragDropContext.Provider value={value}>
      {children}
      <DragPreviewLayer session={session} revert={revertPreview} />
    </DragDropContext.Provider>
  );
}

export { DRAG_START_THRESHOLD_PX };
