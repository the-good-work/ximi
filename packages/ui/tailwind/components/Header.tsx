import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { FaCalendar, FaHouse, FaUser, FaV } from "react-icons/fa6";

const Header: React.FC<{
  roomName?: string;
  identity?: string;
  version: string;
}> = ({ roomName = "-", identity = "-", version }) => {
  const [date, setDate] = useState(new Date());

  const updateTime = useCallback(() => {
    setDate(() => new Date());
  }, []);

  useEffect(() => {
    const id = window.setInterval(updateTime, 1000);
    return () => {
      window.clearInterval(id);
    };
  }, [updateTime]);

  return (
    <div
      className={`sticky flex items-center justify-between w-full px-2 py-1 border-b bg-bg border-brand text-text
				[&>ul]:flex [&>ul]:list-none [&>ul]:gap-4 [&>ul]:text-xs
				[&>ul>li]:flex [&>ul>li]:gap-2 [&>ul>li]:items-center
				[&>ul>li_svg]:fill-accent`}
    >
      <ul>
        <li>
          <img src="/ximi-icon.png" className="w-6 h-6" />
        </li>
        <li>
          <FaHouse /> {roomName}
        </li>
        <li>
          <FaUser /> {identity}
        </li>
      </ul>

      <ul>
        <li>
          <FaV /> {version}
        </li>
        <li>
          <FaCalendar /> {format(date, "EEE d MMM hh:mm:ss aa")}
        </li>
      </ul>
    </div>
  );
};

export { Header };
