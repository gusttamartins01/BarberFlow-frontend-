import { useState, type ReactNode } from "react";

type isProps = {
  title: string,
  content: string
  children: ReactNode
}

const Card = (props: isProps) => {
  const [sum, setSum] = useState(0)
  return (
    <div className="border-4 border-gray-800 p-10 rounded-2xl flex flex-col justify-center items-center gap-5">
      <h1 className="text-2xl text-gray-200 font-bold animate-pulse">
        {props.title}
      </h1>

      <p className="text-lg text-gray-200 font-semibold animate-bounce">
        {props.content}
      </p>

      <span className="text-md text-gray-200 font-medium animate-ping">
        {props.children}
      </span>

      <button
        type="button"
        onClick={() => setSum(sum + 1)}
        className="bg-blue-600 py-2 px-8 rounded-2xl text-gray-200"
      >
        Sum <span className="text-amber-600 font-medium">{sum}</span>
      </button>

    </div>
  )
}

export default function App() {

  return (

    <div className="w-full h-screen bg-gray-950 flex items-center justify-center">
      <Card
        title="REACT BASIC"
        content="HELLO WORLD!"
      >
        JOTAPE IS IF ELSE
      </Card>
    </div>
  )
}