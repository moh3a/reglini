const Title = ({ title, center }: { title: string; center?: boolean }) => {
  return (
    <h1 className={`font-extrabold text-4xl w-full${center && "text-center"} `}>
      <span className="uppercase bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-aliexpress">
        {title}
      </span>
    </h1>
  );
};

export default Title;
