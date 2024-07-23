import * as React from 'react';
import { LayoutContext, useMaybeTrackRefContext } from '../../context';
import { FocusToggleIcon, UnfocusToggleIcon } from '../../assets/icons';
import { useFocusToggle } from '../../hooks';
import { FocusToggleProps } from './FocusToggle';

/**
 * The `FocusToggle` puts the `ParticipantTile` in focus or removes it from focus.
 * @remarks
 * This component needs to live inside `LayoutContext` to work properly.
 *
 * @example
 * ```tsx
 * <ParticipantTile>
 *   <FocusToggle />
 * </ParticipantTile>
 * ```
 * @public
 */
export const ExtendScreen = /* @__PURE__ */ React.forwardRef<HTMLButtonElement, FocusToggleProps>(
  function FocusToggle({ trackRef, ...props }: FocusToggleProps, ref) {
    const trackRefFromContext = useMaybeTrackRefContext();

    const { mergedProps, inFocus } = useFocusToggle({
      trackRef: trackRef ?? trackRefFromContext,
      props,
    });

    React.useEffect(() => {
      if (inFocus) {
        var element = document.getElementsByClassName("lk-focus-layout")[0] as HTMLElement;
        if (element) {
          element.classList.add("lk-focus-layout-extended");
        }
      } else {
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
                <UnfocusToggleIcon />
              ) : (
                <FocusToggleIcon />
              )}
            </button>
          )
        }
      </LayoutContext.Consumer>
    );
  },
);
