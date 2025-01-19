import React, { useEffect, useRef } from "react";
import "./app.css";

function DatePicker() {
  const years = [];
  for (let y = 1900; y <= 2030; y++) {
    years.push(y);
  }

  const months = [
    "كانون الثاني",
    "شباط",
    "آذار",
    "نيسان",
    "أيار",
    "حزيران",
    "تموز",
    "آب",
    "أيلول",
    "تشرين الأول",
    "تشرين الثاني",
    "كانون الأول",
  ];

  const selectedYear = 2000;
  const selectedMonth = 4;
  const selectedDay = 4;

  const yearRef = useRef(null);
  const monthRef = useRef(null);
  const dayRef = useRef(null);

  const getDaysInMonth = (year, monthIndex) => {
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  const daysInSelectedMonth = getDaysInMonth(selectedYear, selectedMonth);

  const handleInfiniteScroll = (ref, items) => {
    const element = ref.current;
    const itemHeight = 40;
    const totalHeight = itemHeight * items.length;

    if (element.scrollTop + element.offsetHeight >= element.scrollHeight) {
      element.scrollTop -= totalHeight;
    } else if (element.scrollTop <= 0) {
      element.scrollTop += totalHeight;
    }
  };

  const handleWheelScroll = (event, ref, items) => {
    const element = ref.current;
    const itemHeight = 40;

    event.preventDefault();

    const direction = event.deltaY > 0 ? 1 : -1;

    element.scrollTop += direction * itemHeight;

    handleInfiniteScroll(ref, items);
  };

  const handleScroll = (ref, items) => {
    handleInfiniteScroll(ref, items);
  };

  const handleDone = () => {
    const year = getCenteredValue(yearRef, years);
    const month = getCenteredValue(monthRef, months);
    const day = getCenteredValue(
      dayRef,
      Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1)
    );

    alert(`Selected date: ${year}-${months.indexOf(month) + 1}-${day}`);
  };

  const getCenteredValue = (ref, items) => {
    const element = ref.current;
    if (!element) return null;

    const scrollTop = element.scrollTop;
    const itemHeight = 40;
    const containerHeight = element.offsetHeight;

    const centeredIndex =
      Math.round(
        (scrollTop + containerHeight / 2 - itemHeight / 2) / itemHeight
      ) % items.length;
    return items[centeredIndex];
  };

  useEffect(() => {
    const daysArray = Array.from(
      { length: daysInSelectedMonth },
      (_, i) => i + 1
    );

    if (yearRef.current) {
      yearRef.current.addEventListener("wheel", (event) =>
        handleWheelScroll(event, yearRef, years)
      );
      yearRef.current.addEventListener("scroll", () =>
        handleScroll(yearRef, years)
      );
    }

    if (monthRef.current) {
      monthRef.current.addEventListener("wheel", (event) =>
        handleWheelScroll(event, monthRef, months)
      );
      monthRef.current.addEventListener("scroll", () =>
        handleScroll(monthRef, months)
      );
    }

    if (dayRef.current) {
      dayRef.current.addEventListener("wheel", (event) =>
        handleWheelScroll(event, dayRef, daysArray)
      );
      dayRef.current.addEventListener("scroll", () =>
        handleScroll(dayRef, daysArray)
      );
    }

    return () => {
      if (yearRef.current) {
        yearRef.current.removeEventListener("wheel", (event) =>
          handleWheelScroll(event, yearRef, years)
        );
        yearRef.current.removeEventListener("scroll", () =>
          handleScroll(yearRef, years)
        );
      }

      if (monthRef.current) {
        monthRef.current.removeEventListener("wheel", (event) =>
          handleWheelScroll(event, monthRef, months)
        );
        monthRef.current.removeEventListener("scroll", () =>
          handleScroll(monthRef, months)
        );
      }

      if (dayRef.current) {
        dayRef.current.removeEventListener("wheel", (event) =>
          handleWheelScroll(event, dayRef, daysArray)
        );
        dayRef.current.removeEventListener("scroll", () =>
          handleScroll(dayRef, daysArray)
        );
      }
    };
  }, [daysInSelectedMonth, years]);

  useEffect(() => {
    if (yearRef.current) {
      const yearIndex = years.indexOf(selectedYear);
      yearRef.current.scrollTop = yearIndex * 40;
    }
    if (monthRef.current) {
      monthRef.current.scrollTop = selectedMonth * 40;
    }
    if (dayRef.current) {
      dayRef.current.scrollTop = (selectedDay - 1) * 40;
    }
  }, [selectedYear, selectedMonth, selectedDay, years]);

  return (
    <div className="pos">
      <div className="date-picker-container snap-y">
        <div className="active snap-y">
          <div className="picker-row"></div>
          <div ref={yearRef} className="picker-column snap-center">
            {years.concat(years).map((year, index) => (
              <div key={index} className={`picker-item`}>
                {year}
              </div>
            ))}
          </div>
          <div ref={monthRef} className="picker-column snap-center">
            {months.concat(months).map((monthName, index) => (
              <div key={index} className={`picker-item`}>
                {monthName}
              </div>
            ))}
          </div>
          <div ref={dayRef} className="picker-column snap-center">
            {Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1)
              .concat(
                Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1)
              )
              .map((day, index) => (
                <div key={index} className={`picker-item`}>
                  {day}
                </div>
              ))}
          </div>
        </div>
      </div>
      <button className="done-button" onClick={handleDone}>
        تم
      </button>
    </div>
  );
}

export default DatePicker;