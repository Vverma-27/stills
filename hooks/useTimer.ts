import { useEffect, useState } from "react";

const useTimer = (seconds: number, verificationId: string) => {
  const [timer, setTimer] = useState(seconds);
  useEffect(() => {
    if (!verificationId) return;
    console.log("🚀 ~ file: PhoneForm.tsx ~ line 49 ~ id ~ timer", "v changed");
    setTimer(seconds);
    const id = setInterval(() => {
      setTimer((timer) => {
        if (timer <= 0) {
          clearInterval(id);
          return 0;
        }
        return timer - 1;
      });
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [verificationId]);
  return [timer];
};
export default useTimer;
