import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState, useCallback } from "react";

const inter = Inter({ subsets: ["latin"] });

type Message = {
  role: string,
  content: string
}

export default function Home() {
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const handleApiCall = useCallback(async () => {
    const userMessage = {
      role: "user",
      content: newMessage
    }
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    const response = await fetch("/api/openai", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: newMessages }),
    });

    let data = await response.json();

    if (data.error) {
      console.error(data)
    } else {
      setApiResponse(data);
      // setNewMessage(''); // Clear the input field after successful submission
    }

  }, [messages, newMessage]);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(event.target.value);
  };

  // Cmd + Enter is equivalent to pressing "Submit"
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    console.log("keypress", event)
    if (event.metaKey && event.key === 'Enter') {
      handleApiCall();
    }
  }, [handleApiCall]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const SubmitButton = () => <button onClick={handleApiCall}
    className="mb-32 grid text-center">
    <div
      className="text-lg font-semibold group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
    >
      Enter
    </div>
  </button>

  return (
    <main
      className={`flex flex-col w-screen h-screen items-center ${inter.className} before:bg-gradient-radial after:bg-gradient-conic relative flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40`}
    >
      {/* Top header */}
      <div className="mb-4 z-10 w-full items-center justify-between font-mono text-sm flex border-b border-gray-300">
        <p className="flex px-4 pb-6 pt-6 backdrop-blur-2xl">
          AI Web App
        </p>
      </div>

      <div className="flex w-full px-10 z-20 h-4/5">
        <div className="w-1/2 h-4/5">
          <textarea
            className="w-full h-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
            rows={10}
            placeholder="Enter long text here..."
            value={newMessage}
            onChange={handleTextChange}
          ></textarea>
          <SubmitButton />
        </div>

        <div className="w-1/2 px-10 overflow-scroll h-4/5">
          {apiResponse}
        </div>
      </div>
    </main>
  );
}
