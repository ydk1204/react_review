import { useEffect, useLayoutEffect, useState } from 'react';

function App() {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  const [usd, setUsd] = useState();
  const [search, setSearch] = useState("");
  const [resultCoin, setResultCoin] = useState([]);
  const [filterCoin, setFilterCoin] = useState([]);

  const changeUsd = (e) => setUsd(e.target.value);
  const changeSearch = (e) => setSearch(e.target.value);

  const matchCoin = (e) => {
    e.preventDefault();
    setFilterCoin([]);
    setFilterCoin(coins.filter((coin) => coin.quotes.USD.price <= usd));
  }

  const searchCoin = (e) => {
    e.preventDefault();
    setResultCoin(coins.filter(coin => coin.name.toLowerCase() === search));
  }

  useEffect(() => {
    fetch("https://api.coinpaprika.com/v1/tickers").then((res) => res.json()).then((json) => {
      setCoins(json);
      setLoading(false);
    });
  }, [])

  return (
    <div>
      <form onSubmit={matchCoin}>
        <input onChange={changeUsd} value={usd} type="text" placeholder="보유 중인 달러를 입력해주세요." />
        <button>확인</button>
      </form>
      <h2>입력 달러 금액 : <strong>{usd}</strong> usd</h2>
      <h2>구매 가능 코인! {loading ? "" : `(${filterCoin.length})`}</h2>
      {loading ? <strong>Loading...</strong> : 
        filterCoin.length !== 0 &&
        <select>
          {filterCoin&& filterCoin.map((coin, index) => (
            <option key={index}>
              {coin.name} ({coin.symbol}) : ${coin.quotes.USD.price} USD
            </option>
          ))}
        </select>
      }
      <hr />
      <h2>코인 검색</h2>
      <form onSubmit={searchCoin}>
        <input onChange={changeSearch} value={search} type="text" placeholder="원하는 코인 이름을 입력해주세요." />
        <button>확인</button>
      </form>
      {resultCoin.map((coin, index) => (
        <h3 key={index}>{coin.name} ({coin.symbol}) : ${coin.quotes.USD.price} USD</h3>
      ))}
    </div>
  );
}

export default App;
