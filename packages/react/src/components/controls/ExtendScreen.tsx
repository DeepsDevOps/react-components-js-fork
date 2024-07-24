import * as React from 'react';
import { LayoutContext, useMaybeTrackRefContext } from '../../context';
// import { FocusToggleIcon, UnfocusToggleIcon } from '../../assets/icons';
import { FullScreen, ExitFullScreen } from '../../assets/icons/tl'
import { useFocusToggle } from '../../hooks';
import { FocusToggleProps } from './FocusToggle';

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

    const { mergedProps, inFocus } = useFocusToggle({
      trackRef: trackRef ?? trackRefFromContext,
      props,
    });

    React.useEffect(() => {
      if (inFocus) {
        console.log("In Focus Element");
        var element = document.getElementsByClassName("lk-focus-layout")[0] as HTMLElement;
        if (element) {
          element.classList.add("lk-focus-layout-extended");
        }
      } else {
        console.log("In Focus Element + remove layout extend");
        var element = document.getElementsByClassName("lk-focus-layout")[0] as HTMLElement;
        if (element) {
          element.classList.remove("lk-focus-layout-extended");
        }
      }
    }, [inFocus, document]);

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
