const STOOQ_BASE_URL = "https://stooq.com/q/d/l/?i=d";

const UA_HEADER = {
  "User-Agent": "RocketScreenerBot/1.0"
};

export async function fetchHistoricalClose(ticker: string, asOfISO: string) {
  if (!ticker) return null;
  const yahoo = await fetchFromYahoo(ticker, asOfISO);
  if (yahoo) return yahoo;
  return fetchFromStooq(ticker, asOfISO);
}

async function fetchFromYahoo(ticker: string, asOfISO: string) {
  try {
    const target = new Date(asOfISO);
    const end = Math.floor(target.getTime() / 1000) + 86400; // include day after
    const start = Math.max(0, end - 86400 * 365 * 5); // 5-year window
    const symbol = ticker.trim().toUpperCase();
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${start}&period2=${end}&interval=1d`;
    const res = await fetch(url, { headers: UA_HEADER, cache: "no-store" });
    if (!res.ok) {
      console.warn("yahoo price fetch failed", res.status);
      return null;
    }
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    const timestamps: number[] = result?.timestamp || [];
    const closes: number[] = result?.indicators?.quote?.[0]?.close || [];
    if (!timestamps?.length || !closes?.length) return null;
    const targetTime = new Date(asOfISO).getTime();
    for (let i = timestamps.length - 1; i >= 0; i--) {
      const ts = timestamps[i];
      const close = closes[i];
      if (!ts || !Number.isFinite(close)) continue;
      const rowTime = ts * 1000;
      if (rowTime <= targetTime) {
        const date = new Date(rowTime).toISOString().slice(0, 10);
        return { date, close: Number(close.toFixed(2)) };
      }
    }
    return null;
  } catch (error) {
    console.warn("yahoo price fetch error", error);
    return null;
  }
}

async function fetchFromStooq(ticker: string, asOfISO: string) {
  try {
    const symbol = ticker.trim().toLowerCase().replace(/[^a-z0-9]/g, "") + ".us";
    const url = `${STOOQ_BASE_URL}&s=${symbol}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.error("stooq price fetch failed", res.status);
      return null;
    }
    const text = await res.text();
    const rows = text
      .trim()
      .split(/\r?\n/)
      .filter((line) => line && !line.startsWith("Date"));
    if (!rows.length) return null;
    const targetTime = new Date(asOfISO).getTime();
    let chosen: { date: string; close: number } | null = null;
    let chosenTime = -Infinity;
    for (const row of rows) {
      const [date, , , , close] = row.split(",");
      if (!date || !close) continue;
      const closeNum = Number(close);
      if (!Number.isFinite(closeNum)) continue;
      const rowTime = new Date(date).getTime();
      if (rowTime <= targetTime && rowTime > chosenTime) {
        chosenTime = rowTime;
        chosen = { date, close: closeNum };
      }
    }
    return chosen;
  } catch (error) {
    console.error("stooq price fetch error", error);
    return null;
  }
}
