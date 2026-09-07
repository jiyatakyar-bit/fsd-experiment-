import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Calendar from "./Calendar";
import "./Calendar.css";


// =====================================================
// INITIAL CALENDAR EVENTS
// =====================================================

const initialEvents = [
  {
    id: 1,
    title: "Design review",
    day: "Mon",
    time: "10:00",
    type: "Meeting",
  },
  {
    id: 2,
    title: "Ship v2.3",
    day: "Mon",
    time: "16:00",
    type: "Deadline",
  },
  {
    id: 3,
    title: "1:1 with Sam",
    day: "Tue",
    time: "09:30",
    type: "Personal",
  },
  {
    id: 4,
    title: "Write proposal",
    day: "Wed",
    time: "13:00",
    type: "Focus block",
  },
  {
    id: 5,
    title: "Sprint planning",
    day: "Thu",
    time: "11:00",
    type: "Meeting",
  },
  {
    id: 6,
    title: "Client demo",
    day: "Fri",
    time: "15:00",
    type: "Meeting",
  },
  {
    id: 7,
    title: "Grocery run",
    day: "Sat",
    time: "10:00",
    type: "Personal",
  },
  {
    id: 8,
    title: "Portfolio review",
    day: "Sun",
    time: "18:00",
    type: "Focus block",
  },
];


// =====================================================
// APP COMPONENT
// =====================================================

function App() {

  // -----------------------------
  // Calendar state
  // -----------------------------

  const [events, setEvents] = useState(initialEvents);


  // -----------------------------
  // Optimization switches
  // -----------------------------

  const [memoEnabled, setMemoEnabled] = useState(true);

  const [callbackEnabled, setCallbackEnabled] =
    useState(true);

  const [memoFilterEnabled, setMemoFilterEnabled] =
    useState(true);

  const [clockEnabled, setClockEnabled] =
    useState(true);


  // -----------------------------
  // Live clock
  // -----------------------------

  const [clock, setClock] = useState(
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  );


  // -----------------------------
  // Render monitor
  // -----------------------------

  const [renderCounts, setRenderCounts] =
    useState({});

  const [totalRenders, setTotalRenders] =
    useState(0);


  // ===================================================
  // LIVE CLOCK
  // ===================================================

  useEffect(() => {

    if (!clockEnabled) {
      return;
    }

    const interval = setInterval(() => {

      setClock(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );

    }, 450);


    return () => {
      clearInterval(interval);
    };

  }, [clockEnabled]);


  // ===================================================
  // useMemo DEMONSTRATION
  // ===================================================

  /*
   * The calendar events are filtered through a
   * memoized calculation.
   *
   * With useMemo enabled:
   * the calculation is reused until events change.
   *
   * This avoids unnecessary recalculation when
   * unrelated state such as the clock changes.
   */

  const memoizedEvents = useMemo(() => {

    return events.filter(() => true);

  }, [events]);


  /*
   * When useMemo is disabled, perform the same
   * calculation directly on every App render.
   */

  const normalEvents = events.filter(() => true);


  const visibleEvents = memoFilterEnabled
    ? memoizedEvents
    : normalEvents;


  // ===================================================
  // DRAG AND DROP HANDLER
  // ===================================================

  /*
   * useCallback keeps this function reference stable.
   */

  const memoizedMoveEvent = useCallback(
    (id, newDay) => {

      setEvents((currentEvents) => {

        return currentEvents.map((event) => {

          if (event.id === id) {

            return {
              ...event,
              day: newDay,
            };

          }

          return event;

        });

      });

    },
    []
  );


  /*
   * Normal function when useCallback is disabled.
   *
   * A new function is created whenever App renders.
   */

  const normalMoveEvent = (id, newDay) => {

    setEvents((currentEvents) => {

      return currentEvents.map((event) => {

        if (event.id === id) {

          return {
            ...event,
            day: newDay,
          };

        }

        return event;

      });

    });

  };


  // Choose which handler Calendar receives

  const moveEvent = callbackEnabled
    ? memoizedMoveEvent
    : normalMoveEvent;


  // ===================================================
  // RENDER TRACKING
  // ===================================================

  /*
   * This callback is intentionally memoized.
   *
   * It records how many times each card renders.
   */

  const handleRender = useCallback((id) => {

    setRenderCounts((current) => {

      return {
        ...current,
        [id]: (current[id] || 0) + 1,
      };

    });

    setTotalRenders((current) => current + 1);

  }, []);


  // ===================================================
  // RESET COUNTERS
  // ===================================================

  const resetCounters = () => {

    setRenderCounts({});

    setTotalRenders(0);

  };


  // ===================================================
  // UI
  // ===================================================

  return (

    <div className="app">


      {/* =============================================
          HEADER
      ============================================== */}

      <header className="top-header">

        <div className="eyebrow">
          UNIT 1 · EXPERIMENT 4 · LIVE DEMO
        </div>


        <h1>
          Interactive Calendar
        </h1>


        <p>
          Drag events between days, then flip the
          switches below to see, in real time, what
          React.memo, useCallback, and useMemo actually
          do to re-renders.
        </p>

      </header>



      {/* =============================================
          OPTIMIZATION CONTROL PANEL
      ============================================== */}

      <section className="control-panel">


        {/* TOP THREE CONTROLS */}

        <div className="control-row">


          {/* React.memo */}

          <Toggle
            enabled={memoEnabled}
            setEnabled={setMemoEnabled}
            title="React.memo on cards"
            description="Skip card re-renders when its own props haven't changed."
          />


          {/* useCallback */}

          <Toggle
            enabled={callbackEnabled}
            setEnabled={setCallbackEnabled}
            title="useCallback for handlers"
            description="Keep drag handlers referentially stable so memo isn't fooled."
          />


          {/* useMemo */}

          <Toggle
            enabled={memoFilterEnabled}
            setEnabled={setMemoFilterEnabled}
            title="useMemo for agenda filter"
            description="Cache the filtered list; recompute only when events or day change."
          />

        </div>



        {/* BOTTOM CONTROL */}

        <div className="control-bottom">


          {/* Live clock */}

          <Toggle
            enabled={clockEnabled}
            setEnabled={setClockEnabled}
            title="Live clock"
            description="Ticks every 450ms to simulate unrelated state elsewhere in the app."
          />


          {/* Reset */}

          <button
            className="reset-button"
            onClick={resetCounters}
          >
            Reset counters
          </button>

        </div>

      </section>



      {/* =============================================
          MAIN CONTENT
      ============================================== */}

      <main className="main-layout">


        {/* ===========================================
            CALENDAR
        ============================================ */}

        <section className="calendar-section">


          <div className="section-title-row">


            <h2>
              WEEK VIEW
            </h2>


            {/* Legend */}

            <div className="legend">

              <span className="legend-item meeting">
                Meeting
              </span>

              <span className="legend-item deadline">
                Deadline
              </span>

              <span className="legend-item focus">
                Focus block
              </span>

              <span className="legend-item personal">
                Personal
              </span>

            </div>

          </div>



          {/* Calendar component */}

          <Calendar
            events={visibleEvents}
            onMove={moveEvent}
            onRender={handleRender}
            memoEnabled={memoEnabled}
            callbackEnabled={callbackEnabled}
          />

        </section>



        {/* ===========================================
            RENDER MONITOR
        ============================================ */}

        <aside className="monitor">


          <h2>
            RENDER MONITOR
          </h2>



          {/* Summary */}

          <div className="monitor-summary">


            <div>

              <strong>
                {totalRenders}
              </strong>

              <span>
                total renders logged
              </span>

            </div>



            <div>

              <strong>
                {Object.keys(renderCounts).length}/8
              </strong>

              <span>
                cards that have rendered
              </span>

            </div>


          </div>



          {/* Individual render counters */}

          <div className="render-list">


            {initialEvents.map((event) => {

              const count =
                renderCounts[event.id] || 0;


              return (

                <div
                  className="render-item"
                  key={event.id}
                >


                  <div className="render-name">
                    {event.title}
                  </div>


                  <div className="render-bar">

                    <div
                      className="render-fill"
                      style={{
                        width: `${Math.min(
                          count * 15,
                          100
                        )}%`,
                      }}
                    />

                  </div>


                  <span className="render-number">
                    {count}
                  </span>


                </div>

              );

            })}


          </div>



          {/* Monitor explanation */}

          <p className="monitor-note">

            React.memo is ON — only the card whose data
            actually changed should light up.

          </p>

        </aside>


      </main>



      {/* =============================================
          LIVE CLOCK DISPLAY
      ============================================== */}

      {clockEnabled && (

        <div className="clock">
          {clock}
        </div>

      )}

    </div>
  );
}



// =====================================================
// TOGGLE COMPONENT
// =====================================================

function Toggle({
  enabled,
  setEnabled,
  title,
  description,
}) {

  return (

    <div className="toggle-container">


      <button
        className={`switch ${
          enabled ? "active" : ""
        }`}
        onClick={() => setEnabled(!enabled)}
        aria-label={title}
      >

        <span />

      </button>



      <div>

        <h3>
          {title}
        </h3>

        <p>
          {description}
        </p>

      </div>

    </div>
  );
}


// =====================================================
// EXPORT
// =====================================================

export default App;