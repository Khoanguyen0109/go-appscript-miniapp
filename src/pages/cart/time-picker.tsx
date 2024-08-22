import React, { FC, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import { selectedDeliveryTimeState } from "state";
import { displayDate, displayHalfAnHourTimeRange } from "utils/date";
import { matchStatusBarColor } from "utils/device";
import { Picker } from "zmp-ui";

export const TimePicker: FC = () => {
  const minHour = 23;

  const [date, setDate] = useState(+new Date());
  const [time, setTime] = useState(+new Date());
  const [deliveryTime, setDeliveryTime] = useRecoilState(
    selectedDeliveryTimeState
  );

  const availableDates = useMemo(() => {
    const days: Date[] = [];
    const today = new Date();
    const hour = today.getHours();

    const startDate = hour >= minHour ? 1 : 0;
    for (let i = startDate; i < 5; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      days.push(nextDay);
    }
    return days;
  }, []);

  const availableTimes = useMemo(() => {
    const times: Date[] = [];
    let now = new Date();
    const hour = now.getHours();
    let time = new Date();
    let endTime = new Date();
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (hour >= minHour) {
      time = new Date(tomorrow);
      endTime = new Date(tomorrow);
    }

    if (now.getDate() === new Date(date).getDate() && hour < minHour) {
      // Starting time is the current time rounded up to the nearest 30 minutes
      const minutes = Math.ceil(now.getMinutes() / 30) * 30;
      time.setHours(now.getHours());
      time.setMinutes(minutes);
    } else {
      // Starting time is 7:00
      time.setHours(0);
      time.setMinutes(0);
    }
    time.setSeconds(0);
    time.setMilliseconds(0);
    endTime.setHours(minHour);
    endTime.setMinutes(59);
    endTime.setSeconds(0);
    endTime.setMilliseconds(0);
    while (time <= endTime) {
      times.push(new Date(time));
      time.setMinutes(time.getMinutes() + 30);
    }
    return times;
  }, [date]);
  console.log("availableTimes", availableTimes);
  return (
    <Picker
      mask
      maskClosable
      onVisibilityChange={(visible) => {
        // console.log("onVisibilityChange called with:", visible);
        matchStatusBarColor(visible);
        if (!visible) {
          const newDate = new Date(date);
          const hours = new Date(time).getHours();
          const minutes = new Date(time).getMinutes();
          newDate.setHours(hours);
          newDate.setMinutes(minutes);
          setDeliveryTime(newDate.getTime());
        }
      }}
      inputClass="border-none bg-transparent text-sm text-primary font-medium text-md m-0 p-0 h-auto"
      placeholder="Chọn thời gian nhận hàng"
      title="Thời gian nhận hàng"
      value={{
        date,
        time: availableTimes.find((t) => +t === time)
          ? time
          : +availableTimes?.[0],
      }}
      formatPickedValueDisplay={({ date, time }) => {
        // console.log("formatPickedValueDisplay called with:", { date, time });
        return date && time
          ? `${displayHalfAnHourTimeRange(new Date(time.value))}, ${displayDate(
              new Date(date.value)
            )}`
          : `Chọn thời gian`;
      }}
      onChange={({ date, time }) => {
        // console.log("onChange called with:", { date, time });
        if (date) {
          setDate(+date.value);
        }
        if (time) {
          setTime(+time.value);
        }
      }}
      data={[
        {
          options: availableDates.map((date) => {
            const option = {
              displayName: displayDate(date, true),
              value: +date,
            };
            // console.log("Date option:", option);
            return option;
          }),
          name: "date",
        },
        {
          options: availableTimes.map((time) => {
            const option = {
              displayName: displayHalfAnHourTimeRange(time),
              value: +time,
            };
            // console.log("Time option:", option);
            return option;
          }),
          name: "time",
        },
      ]}
    />
  );
};
