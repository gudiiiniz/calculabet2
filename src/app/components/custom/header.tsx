import Link from "next/link";

export default function Header() {
  return (
    <header className="mx-50 my-10 flex flex-row gap-20 justify-center">
      <div>
        <p className="font-bold text-5xl text-green-700">Calcula Bet</p>
        <p className="text-gray-300/90 mx-2">Calculadora de apostas seguras</p>
      </div>

      <Link className="my-5" href={""}>
        Calculadora simples
      </Link>

      <Link className="my-5" href={""}>
        Calculadora avançada
      </Link>
      <Link className="my-5" href={""}>
        Converter Back/Lay
      </Link>
    </header>
  );
}
