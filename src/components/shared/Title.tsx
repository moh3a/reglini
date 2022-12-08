const Title = ({ title }: { title: string }) => {
  return (
    <h1 className="font-extrabold text-4xl w-full text-center">
      <span className="uppercase bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-aliexpress">
        {title}
      </span>
    </h1>
  );
};

export default Title;
