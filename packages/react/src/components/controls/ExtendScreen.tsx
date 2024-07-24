import * as React from 'react';
import { LayoutContext, useMaybeTrackRefContext } from '../../context';
import { FullScreen, ExitFullScreen } from '../../assets/icons/tl'
import { FocusToggleProps } from './FocusToggle';
import { useFocusElementToggle } from '../../hooks/useFocusElementToggle';

/**
 * The `ExtendScreen` puts the `ParticipantTile` in full width or removes it from full width.
 * @remarks
 * This component needs to live inside `LayoutContext` to work properly.
 *
 * @example
 * ```tsx
 * <ParticipantTile>
 *   <ExtendScreen />
 * </ParticipantTile>
 * ```
 * @public
 */
export const ExtendScreen = /* @__PURE__ */ React.forwardRef<HTMLButtonElement, FocusToggleProps>(
  function ExtendScreen({ trackRef, ...props }: FocusToggleProps, ref) {
    const trackRefFromContext = useMaybeTrackRefContext();

    const { mergedProps, inFocus } = useFocusElementToggle({
      trackRef: trackRef ?? trackRefFromContext,
      props,
    });

    return (
      <LayoutContext.Consumer>
        {(layoutContext) =>
          layoutContext !== undefined && (
            <button ref={ref} {...mergedProps}>
              {props.children ? (
                props.children
              ) : inFocus ? (
                <ExitFullScreen />
              ) : (
                <FullScreen />
              )}
            </button>
          )
        }
      </LayoutContext.Consumer>
    );
  },
);
