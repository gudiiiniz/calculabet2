import Link from "next/link";

export default function Header() {
  return (
    <header className="mx-30 my-10 flex flex-row gap-10 justify-center">
      <div>
        <p className="font-bold text-5xl text-green-700">Calcula Bet</p>
        <p className="text-gray-300/80 mx-2">Calculadora de apostas seguras</p>
      </div>

      <Link className="my-5 bg-zinc-900 border rounded-3xl h-10 flex items-center px-4" href={"/calculator"}>
        Calculadora simples
      </Link>

      <Link className="my-5 bg-zinc-900 border rounded-3xl h-10 flex items-center px-4" href={"/advanced-calculator"}>
        Calculadora avançada
      </Link>
      <Link className="my-5 bg-zinc-900 border rounded-3xl h-10 flex items-center px-4" href={"/converter"}>
        Converter Back/Lay
      </Link>
    </header>
  );
}
