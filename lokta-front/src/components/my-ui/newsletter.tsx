

const Newsletter = () => {
  return (
    <div className="py-10 px-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 text-center text-white rounded-lg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-lg mb-8">
            Join our subscribers list to get the latest news, updates and
            special offers delivered.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <input
              type="email"
              placeholder="Enter your Email Here"
              className="bg-white text-black px-6 py-3 rounded-full w-full md:w-80 focus:outline-none"
            />
            <button className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-full font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
