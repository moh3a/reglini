import { TEXT_GRADIENT } from "~/config/design";

export const TitleXL = ({ title, emoji }: { title: string; emoji: string }) => {
  return (
    <div className="flex-col text-center mt-28">
      <div className="text-6xl font-extrabold select-none">
        <span className={TEXT_GRADIENT}>{title}</span> {emoji}
      </div>
    </div>
  );
};
