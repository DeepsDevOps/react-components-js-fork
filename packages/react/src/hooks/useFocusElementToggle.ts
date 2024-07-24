import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
import { setupFocusToggle, isTrackReferencePinned } from '@livekit/components-core';
import { useEnsureTrackRef, useMaybeLayoutContext } from '../context';
import { mergeProps } from '../mergeProps';
import * as React from 'react';

/** @public */
export interface UseFocusToggleProps {
  trackRef?: TrackReferenceOrPlaceholder;
  props: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

/**
 * The `useFocusToggle` hook is used to implement the `FocusToggle` or your custom implementation of it.
 * The `TrackReferenceOrPlaceholder` is used to register a onClick handler and to identify the track to focus on.
 *
 * @example
 * ```tsx
 * const { mergedProps, inFocus } = useFocusToggle({ trackRef, props: yourButtonProps });
 * return <button {...mergedProps}>{inFocus ? 'Unfocus' : 'Focus'}</button>;
 * ```
 * @public
 */
export function useFocusElementToggle({ trackRef, props }: UseFocusToggleProps) {
  const trackReference = useEnsureTrackRef(trackRef);

  const layoutContext = useMaybeLayoutContext();
  const { className } = React.useMemo(() => setupFocusToggle(), []);

  const inFocus: boolean = React.useMemo(() => {
    return isTrackReferencePinned(trackReference, layoutContext?.pinElement.state);
  }, [trackRef, layoutContext?.pinElement.state]);

  const mergedProps = React.useMemo(
    () =>
      mergeProps(props, {
        className,
        onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          // Call user defined on click callbacks.
          props.onClick?.(event);

          // Set or clear focus based on current focus state.
          if (inFocus) {
            var element = document.getElementsByClassName("lk-focus-layout")[0] as HTMLElement;
            if (element) {
              element.classList.remove("lk-focus-layout-extended");
            }
            
            layoutContext?.pinElement.dispatch?.({
              msg: 'clear_pin',
            });
          } else {
            var element = document.getElementsByClassName("lk-focus-layout")[0] as HTMLElement;
            if (element) {
              element.classList.add("lk-focus-layout-extended");
            }
            
            layoutContext?.pinElement.dispatch?.({
              msg: 'set_pin',
              trackReference,
            });
          }
        },
      }),
    [props, className, trackRef, inFocus, layoutContext?.pinElement],
  );

  return { mergedProps, inFocus };
}
