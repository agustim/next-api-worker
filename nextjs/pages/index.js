import { useEffect, useState } from "react";


export default function Home() {

  const [randomNumber, setRandomNumber] = useState(0);

  // Fetch /api/random-number and set the state with the response

  const fetchRandomNumber = async () => {
    const response = await fetch("/api/random-number");
    const data = await response.json();
    setRandomNumber(data.number);
  }

  useEffect(() => {
    fetchRandomNumber();
  }, []);

  return (
    <div>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">Random Number</h1>
        <p className="text-2xl">{randomNumber}</p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={fetchRandomNumber}
        >
          Generate new random number
        </button>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        &copy; {new Date().getFullYear()} Nobody
      </footer>
    </div>
  );
}
