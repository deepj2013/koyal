import { useState, useEffect } from "react";

export default function CountdownTimer({ seconds = 60 }) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      setTimeLeft(0); 
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(prevTime - 1, 0)); // Prevent negative values
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return <>{timeLeft > 0 ? timeLeft : 0} seconds</>;
}
