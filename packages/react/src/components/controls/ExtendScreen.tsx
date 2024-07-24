import * as React from 'react';
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
  function ExtendScreen() {
    const [inFocus, setInFocus] = React.useState(false);
    function toggleSide() {
      if (inFocus) {
        var element = document.getElementsByClassName("lk-carousel")[0];
        element.classList.remove("display-none");

        var element2 = document.getElementsByClassName("lk-focus-layout")[0];
        element2.classList.remove("lk-focus-layout-extended");
        setInFocus(false);
      } else {
        var element = document.getElementsByClassName("lk-carousel")[0];
        element.classList.add("display-none");

        var element2 = document.getElementsByClassName("lk-focus-layout")[0];
        element2.classList.add("lk-focus-layout-extended");
        setInFocus(true);
      }
    }

    return (
      <button onClick={toggleSide} className="lk-button" aria-pressed="false" data-lk-unread-msgs="0" style={{ position: 'absolute', bottom: "0%", top: "61%", zIndex: 999999, width: "fit-content", height: "fit-content" }}>{inFocus ? "Show" : "Hide"}</button>
    );
  },
);
