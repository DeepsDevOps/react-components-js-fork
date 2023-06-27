import * as React from 'react';
import { LayoutContextProvider } from '../components/layout/LayoutContextProvider';
import { RoomAudioRenderer } from '../components/RoomAudioRenderer';
import { ControlBar } from './ControlBar';
import { FocusLayout, FocusLayoutContainer } from '../components/layout/FocusLayout';
import { GridLayout } from '../components/layout/GridLayout';
import type { WidgetState } from '@livekit/components-core';
import { isEqualTrackRef, isTrackReference, log } from '@livekit/components-core';
import { ShareLink } from './ShareLink';
import { Users } from './Users';
import { ConnectionStateToast } from '../components/Toast';
// import type { MessageFormatter } from '../components/ChatEntry';
import { RoomEvent, Track } from 'livekit-client';
import { useTracks } from '../hooks/useTracks';
import { usePinnedTracks } from '../hooks/usePinnedTracks';
import { CarouselLayout } from '../components/layout/CarouselLayout';
import { useCreateLayoutContext } from '../context/layout-context';
import { ParticipantTile } from '../components';
import { Toast } from '../components';
import { UserToggle } from '../components/controls/UserToggle';
import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
import { WhiteBoard } from '../components/WhiteBoard';

/**
 * @public
 */
export interface VideoConferenceProps extends React.HTMLAttributes<HTMLDivElement> {
  // chatMessageFormatter?: MessageFormatter;
  showShareButton: boolean;
  showParticipantButton: boolean;
  leaveButton: string;
}

/**
 * This component is the default setup of a classic LiveKit video conferencing app.
 * It provides functionality like switching between participant grid view and focus view.
 *
 * @remarks
 * The component is implemented with other LiveKit components like `FocusContextProvider`,
 * `GridLayout`, `ControlBar`, `FocusLayoutContainer` and `FocusLayout`.
 *
 * @example
 * ```tsx
 * <LiveKitRoom>
 *   <VideoConference />
 * <LiveKitRoom>
 * ```
 * @public
 */
export function VideoConference({
  showShareButton,
  showParticipantButton,
  leaveButton,
  ...props
}: VideoConferenceProps) {
  const [widgetState, setWidgetState] = React.useState<WidgetState>({
    showChat: null,
  });
  const lastAutoFocusedScreenShareTrack = React.useRef<TrackReferenceOrPlaceholder | null>(null);

  const [waiting, setWaiting] = React.useState<string | null>(null); // Used to show toast message
  const [waitingRoomCount, setWaitingRoomCount] = React.useState<number>(0);

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { updateOnlyOn: [RoomEvent.ActiveSpeakersChanged] },
  );

  const widgetUpdate = (state: WidgetState) => {
    log.debug('updating widget state', state);
    setWidgetState(state);
  };

  const updateCount = (count: number) => {
    log.debug('count ', count);
    setWaitingRoomCount(count);
  };

  const setWaitingMessage = (message: string) => {
    if (showParticipantButton) {
      setWaiting(message);
    }
  };

  const layoutContext = useCreateLayoutContext();
  const screenShareTracks = tracks
    .filter(isTrackReference)
    .filter((track) => track.publication.source === Track.Source.ScreenShare);

  const focusTrack = usePinnedTracks(layoutContext)?.[0];
  const carouselTracks = tracks.filter((track) => !isEqualTrackRef(track, focusTrack));

  React.useEffect(() => {
    if (waiting) {
      // Remove toast message after 2 second
      setTimeout(() => {
        setWaiting(null);
      }, 3000);
    }
  }, [waiting]);

  React.useEffect(() => {
    // If screen share tracks are published, and no pin is set explicitly, auto set the screen share.
    if (screenShareTracks.length > 0 && lastAutoFocusedScreenShareTrack.current === null) {
      log.debug('Auto set screen share focus:', { newScreenShareTrack: screenShareTracks[0] });
      layoutContext.pin.dispatch?.({ msg: 'set_pin', trackReference: screenShareTracks[0] });
      lastAutoFocusedScreenShareTrack.current = screenShareTracks[0];
    } else if (
      lastAutoFocusedScreenShareTrack.current &&
      !screenShareTracks.some(
        (track) =>
          track.publication.trackSid ===
          lastAutoFocusedScreenShareTrack.current?.publication?.trackSid,
      )
    ) {
      log.debug('Auto clearing screen share focus.');
      layoutContext.pin.dispatch?.({ msg: 'clear_pin' });
      lastAutoFocusedScreenShareTrack.current = null;
    }
  }, [
    screenShareTracks.map((ref) => ref.publication.trackSid).join(),
    focusTrack?.publication?.trackSid,
  ]);

  return (
    <div className="lk-video-conference" {...props}>
      <LayoutContextProvider
        value={layoutContext}
        // onPinChange={handleFocusStateChange}
        onWidgetChange={widgetUpdate}
      >
        <div className="lk-video-conference-inner">
          {!focusTrack ? (
            <div className="lk-grid-layout-wrapper">
              <GridLayout tracks={tracks}>
                <ParticipantTile />
              </GridLayout>
            </div>
          ) : (
            <div className="lk-focus-layout-wrapper">
              <FocusLayoutContainer>
                <CarouselLayout tracks={carouselTracks}>
                  <ParticipantTile />
                </CarouselLayout>
                {/* {focusWhiteboard && <WhiteBoard participant={focusTrack} />} */}
                {focusTrack && <FocusLayout track={focusTrack} />}
              </FocusLayoutContainer>
            </div>
          )}
          <ControlBar
            controls={{
              chat: false,
              sharelink: showShareButton,
              users: showParticipantButton,
              leaveButton: leaveButton,
            }}
            waitingRoomCount={waitingRoomCount}
            screenShareTracks={screenShareTracks.length}
          />
        </div>
        <ShareLink style={{ display: widgetState.showChat == 'show_invite' ? 'flex' : 'none' }} />
        <Users
          style={{ display: widgetState.showChat == 'show_users' ? 'flex' : 'none' }}
          onWaitingRoomChange={updateCount}
          setWaiting={setWaitingMessage}
        />
        {waiting ? (
          <Toast className="lk-toast-connection-state">
            <UserToggle>{waiting}</UserToggle>
          </Toast>
        ) : (
          <></>
        )}
      </LayoutContextProvider>
      <RoomAudioRenderer />
      <ConnectionStateToast />
    </div>
  );
}
