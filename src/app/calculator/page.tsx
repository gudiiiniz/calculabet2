"use client";
import { useState, useEffect} from "react";

export default function Calculator() {
  const [totalBet, setTotalBet] = useState("");
  const [bets, setBets] = useState([
    { id: 1, stake: "", odds: "", return: 0, profit: 0, isManual: false },
    { id: 2, stake: "", odds: "", return: 0, profit: 0, isManual: false },
  ]);
  const [profitPercent, setProfitPercent] = useState(0);

  const calculateDistribution = () => {
    const total = parseFloat(totalBet) || 0;
    if (total === 0) return;

    //pega as odds validas
    const oddsArray = bets.map((bet) =>
      Math.max(parseFloat(bet.odds) || 1.01, 1.01)
    );

    //calcula a soma inversa
    const inverseSum = oddsArray.reduce((sum, odd) => sum + 1 / odd, 0);

    //calcula cada stake individualmente
    const stakes = oddsArray.map((odd) => total / odd / inverseSum);

    //soma o total das stakes
    const totalDistributed = stakes.reduce((sum, stake) => sum + stake, 0);

    //atualiza o estado das apostas
    setBets((prevBets) =>
      prevBets.map((bet, index) => {
        const newStake = stakes[index];
        const newReturn = newStake * oddsArray[index];
        const newProfit = newReturn - totalDistributed;

        return {
          ...bet,
          stake: newStake.toFixed(2),
          return: newReturn,
          profit: newProfit,
          isManual: false,
        };
      })
    );

    //calcula o lucro minimo
    const minProfit = Math.min(
      ...stakes.map((stake, i) => stake * oddsArray[i] - totalDistributed)
    );
    const percentage = totalDistributed
      ? (minProfit / totalDistributed) * 100
      : 0;
    setProfitPercent(percentage);
  };

  //recalcula quando o usuario edita manualmente a stake
  const updateFromManualStake = () => {
    const manualBets = bets.filter((bet) => bet.isManual);
    if (manualBets.length === 0) return calculateDistribution();

    //usa a primeira aposta manual como referencia
    const manualBet = manualBets[0];
    const manualStake = parseFloat(manualBet.stake) || 0;
    const manualOdds = Math.max(parseFloat(manualBet.odds) || 1.01, 1.01);

    //recalcula baseado na stake manual
    const oddsArray = bets.map((bet) =>
      Math.max(parseFloat(bet.odds) || 1.01, 1.01)
    );
    const inverseSum = oddsArray.reduce((sum, odd) => sum + 1 / odd, 0);
    const newTotal = manualStake * inverseSum * manualOdds;
    setTotalBet(newTotal.toFixed(2));

    //recalcula todas as stakes baseado no novo total
    const stakes = oddsArray.map((odd) => newTotal / odd / inverseSum);
    const totalDistributed = stakes.reduce((sum, stake) => sum + stake, 0);

    setBets((prevBets) =>
      prevBets.map((bet, index) => {
        const newStake = stakes[index];
        const newReturn = newStake * oddsArray[index];
        const newProfit = newReturn - totalDistributed;

        return {
          ...bet,
          stake: newStake.toFixed(2),
          return: newReturn,
          profit: newProfit,
          isManual: false,
        };
      })
    );

    const minProfit = Math.min(
      ...stakes.map((stake, i) => stake * oddsArray[i] - totalDistributed)
    );
    const percentage = totalDistributed
      ? (minProfit / totalDistributed) * 100
      : 0;
    setProfitPercent(percentage);
  };

  //atualiza uma aposta especifica
  const updateBet = (id: number, field: string, value: any) => {
    setBets((prev) =>
      prev.map((bet) => {
        if (bet.id === id) {
          const updatedBet = { ...bet, [field]: value };

          //se editou a stake manualmente, marca como manual
          if (field === "stake") {
            updatedBet.isManual = true;
          }

          return updatedBet;
        }
        return bet;
      })
    );
  };

  //adiciona linha
  const addRow = () => {
    if (bets.length < 10) {
      const newId = Math.max(...bets.map((b) => b.id)) + 1;
      setBets((prev) => [
        ...prev,
        {
          id: newId,
          stake: "",
          odds: "",
          return: 0,
          profit: 0,
          isManual: false,
        },
      ]);
    }
  };

  //remove linha
  const removeRow = () => {
    if (bets.length > 1) {
      setBets((prev) => prev.slice(0, -1));
    }
  };

  //limpa todos os campos
  const clearAll = () => {
    setTotalBet("");
    setBets((prev) =>
      prev.map((bet) => ({
        ...bet,
        stake: "",
        odds: "",
        return: 0,
        profit: 0,
        isManual: false,
      }))
    );
    setProfitPercent(0);
  };

  //effects para recalcular automaticamente
  useEffect(() => {
    const timer = setTimeout(() => {
      const hasManualBets = bets.some((bet) => bet.isManual);
      if (hasManualBets) {
        updateFromManualStake();
      } else {
        calculateDistribution();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [totalBet, bets]);

  return (
    <div className="flex mt-20 bg-zinc-900/50 rounded-2xl w-130 mx-auto flex-col items-center p-6">
      <div className="flex flex-row items-center gap-4 mb-6">
        <p className="text-2xl font-semibold">Total:</p>
        <input
          type="number"
          placeholder="0.00"
          value={totalBet}
          onChange={(e) => setTotalBet(e.target.value)}
          className="w-32 px-3 py-2 rounded bg-zinc-800 text-white text-center text-lg"
          step="0.01"
          min="0"
        />
      </div>

      <div className="w-100">
        {/* Header */}
        <div className="font-bold grid grid-cols-4 bg-green-900/50 px-6 py-4 rounded-t-2xl">
          <p className="text-center">STAKE</p>
          <p className="text-center">ODDS</p>
          <p className="text-center">RETORNO</p>
          <p className="text-center">LUCRO</p>
        </div>

        {/* Bet Rows */}
        <div className="bg-zinc-950/40 rounded-b-2xl">
          {bets.map((bet, index) => (
            <div
              key={bet.id}
              className={`grid grid-cols-4 px-6 py-4 ${
                index !== bets.length - 1 ? "border-b border-zinc-700" : ""
              }`}
            >
              <div className="flex justify-center">
                <input
                  type="number"
                  placeholder="0.00"
                  value={bet.stake}
                  onChange={(e) => updateBet(bet.id, "stake", e.target.value)}
                  className="w-20 px-2 py-1 rounded bg-zinc-800 text-white text-center transition-all duration-300"
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="flex justify-center">
                <input
                  type="number"
                  placeholder=""
                  value={bet.odds}
                  onChange={(e) => updateBet(bet.id, "odds", e.target.value)}
                  className="w-20 px-2 py-1 rounded bg-zinc-800 text-white text-center"
                  step="0.01"
                  min="1.01"
                />
              </div>
              <p className="text-center py-2 transition-all duration-300">
                {bet.return.toFixed(2)}
              </p>
              <p className="text-center text-green-400 py-2 transition-all duration-300">
                {bet.profit.toFixed(2)}
              </p>
              <div className="flex justify-center"></div>
            </div>
          ))}
        </div>
        {/*porcentagem*/}
        <div className=" bg-green-400/10 rounded-2xl mt-6 h-15 flex items-center justify-center border border-green-300/50">
          <p
            className={`text-xl font-bold ${
              profitPercent > 0
                ? "text-green-400"
                : profitPercent < 0
                ? "text-white"
                : "text-white"
            }`}
          >
            Porcentagem: {profitPercent.toFixed(2)}%
          </p>
        </div>

        {/*botoes*/}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={removeRow}
            disabled={bets.length >= 10}
            className="px-4 py-2 bg-red-600/50 text-white rounded hover:bg-red-900/50 disabled:opacity-50 font-medium"
          >
            -
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 font-medium"
          >
            Limpar
          </button>
          <button
            onClick={addRow}
            disabled={bets.length >= 10}
            className="px-4 py-2 bg-green-600/50 text-white rounded hover:bg-green-700/50 disabled:opacity-50 font-medium"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
