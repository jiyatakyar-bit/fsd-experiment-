import React, { memo, useCallback, useEffect } from "react";

const days = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];


// =====================================================
// EVENT CARD
// =====================================================

function EventCard({
  event,
  onDragStart,
  onRender,
}) {

  // Count this card's render
  useEffect(() => {
    onRender(event.id);
  }, [event.id, event.day, onRender]);

  return (
    <div
      className={`event-card ${event.type
        .toLowerCase()
        .replace(" ", "-")}`}
      draggable
      onDragStart={(e) =>
        onDragStart(e, event.id)
      }
    >

      <span className="event-time">
        {event.time}
      </span>

      <span className="event-title">
        {event.title}
      </span>

    </div>
  );
}


// =====================================================
// MEMOIZED VERSION
// IMPORTANT: This is OUTSIDE Calendar
// =====================================================

const MemoizedEventCard = memo(EventCard);


// =====================================================
// CALENDAR
// =====================================================

function Calendar({
  events,
  onMove,
  onRender,
  memoEnabled,
  callbackEnabled,
}) {

  // useCallback version
  const memoizedDragStart = useCallback(
    (event, id) => {
      event.dataTransfer.setData(
        "eventId",
        id.toString()
      );
    },
    []
  );


  // Normal version when useCallback is OFF
  const normalDragStart = (event, id) => {
    event.dataTransfer.setData(
      "eventId",
      id.toString()
    );
  };


  // Select which handler to use
  const handleDragStart = callbackEnabled
    ? memoizedDragStart
    : normalDragStart;


  const handleDragOver = (event) => {
    event.preventDefault();
  };


  const handleDrop = (event, day) => {

    event.preventDefault();

    const id = Number(
      event.dataTransfer.getData("eventId")
    );

    if (!id) return;

    onMove(id, day);
  };


  return (
    <div className="calendar">

      {days.map((day) => {

        const dayEvents = events.filter(
          (event) => event.day === day
        );

        return (
          <div
            className="day-column"
            key={day}
            onDragOver={handleDragOver}
            onDrop={(event) =>
              handleDrop(event, day)
            }
          >

            <div className="day-name">
              {day}
            </div>

            <div className="events">

              {dayEvents.map((event) => {

                /*
                 * IMPORTANT:
                 * MemoizedEventCard is defined OUTSIDE
                 * Calendar, so React can actually
                 * preserve the component between renders.
                 */

                const Card = memoEnabled
                  ? MemoizedEventCard
                  : EventCard;

                return (
                  <Card
                    key={event.id}
                    event={event}
                    onDragStart={handleDragStart}
                    onRender={onRender}
                  />
                );

              })}

            </div>

          </div>
        );
      })}

    </div>
  );
}


export default memo(Calendar);