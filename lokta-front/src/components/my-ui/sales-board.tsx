type Props = {
  boardImage: string;
};

const SalesBoard = ({ boardImage }: Props) => {
  return (
    <div className="container mx-auto px-4 py-6 flex justify-center">
      <div className="w-full lg:w-9.5/10">
        <img
          src={boardImage}
          alt="Cyber Monday Sale"
          className="w-full h-auto max-h-[500px] object-fill"
        />
      </div>
    </div>
  );
};

export default SalesBoard;
