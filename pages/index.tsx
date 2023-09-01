import useSWR, { Fetcher } from "swr";
import Image from "next/image";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useState } from "react";

export const config = {
  ssr: false,
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const fetcher: Fetcher<any, any> = (
  input: RequestInfo | URL,
  init?: RequestInit
) => globalThis.fetch(input, init).then((res) => res.json());

interface ResponseData<T> {
    rows: T[];
}

type OrderByYearData = ResponseData<{ order_count: number; year: number }>;
// prettier-ignore
type AvgPriceByYearData = ResponseData<{ price: number; year: number; }>;
// prettier-ignore
type TopPriceByYearData = ResponseData<{ price: number; name: string; }>;
// prettier-ignore
type OrderByBrandYearData = ResponseData<{ name: string; order_count: number; }>;

function RankList({
  data,
  bg,
}: {
  bg: string;
  data: { value: number; name: string }[];
}) {
  return (
    <>
      {data.slice(0, 10).map((i, index, array) => (
        <div
          className="flex justify-between items-center my-1 text-sm relative"
          key={index}
        >
          <div
            className={`absolute top-0 left-0 h-full ${bg}`}
            style={{
              width:
                index === 0
                  ? "100%"
                  : `${(Number(i.value) / Number(array[0].value)) * 100}%`,
              maxWidth: "80%",
            }}
          />
          <div
            className="text-sm p-1 max-w-[80%] break-all truncate block hover:underline cursor-default z-10"
            title={i.name}
          >
            {i.name}
          </div>
          <div>{i.value.toLocaleString("en-US")}</div>
        </div>
      ))}
    </>
  );
}

const cloudflareUrl = 'https://tidb-serverless-edge.1136742008.workers.dev'
const netlifyUrl = 'https://tidb-serverless-edge.netlify.app'
const vercelUrl = 'https://tidb-serverless-edge.vercel.app'

export default function Home() {
  const [year, setYear] = useState("2017");
  const [edgeFunctionUrl, setEdgeFunctionUrl] = useState(vercelUrl)
  const { data: orderByYearData } = useSWR(
    `${edgeFunctionUrl}/api/total_order_per_year`,
    fetcher as Fetcher<OrderByYearData, string>
  );
  const { data: avgPriceByYearData } = useSWR(
    `${edgeFunctionUrl}/api/avg_price_per_year`,
    fetcher as Fetcher<AvgPriceByYearData, string>
  );
  const { data: orderByBrandYearData } = useSWR(
    `${edgeFunctionUrl}/api/order_by_brand_year?year=${year}`,
    fetcher as Fetcher<OrderByBrandYearData, string>
  );
  const { data: topPriceByYearData } = useSWR(
    `${edgeFunctionUrl}/api/price_by_brand_year?year=${year}`,
    fetcher as Fetcher<TopPriceByYearData, string>
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Car Sales Trend",
      },
    },
  };

  const labels = orderByYearData?.rows.map((i) => i.year);

  let borderColor1 = "rgb(53, 162, 235)"
  let borderColor2 = "rgb(255, 99, 132)"
  let backgroundColor1 = "rgba(53, 162, 235, 0.5)"
  let backgroundColor2 = "rgba(255, 99, 132, 0.5)"
  if (edgeFunctionUrl == cloudflareUrl) {
    borderColor1 = "rgb(205,133,63)"
    borderColor2 = "rgb(34,139,34)"
    backgroundColor1 = "rgba(205,133,63, 0.5)"
    backgroundColor2 = "rgba(34,139,34, 0.5)"
  }
  if (edgeFunctionUrl == netlifyUrl) {
    borderColor1 = "rgb(217, 77, 255)"
    borderColor2 = "rgb(139, 9, 255)"
    backgroundColor1 = "rgba(217, 77, 255, 0.5)"
    backgroundColor2 = "rgba(139, 9, 255, 0.5)"
  }

  const datasets = [
    {
      data: orderByYearData?.rows.map((i) => Number(i.order_count)),
      label: "Number of Orders",
      borderColor: borderColor1,
      backgroundColor: backgroundColor1,
    },
    {
      data: avgPriceByYearData?.rows.map((i) =>
        Math.round(Number(i.price) / 1000)
      ),
      label: "Average Selling Price (K)",
      borderColor: borderColor2,
      backgroundColor: backgroundColor2,
    },
  ];

  return (
    <div className="flex flex-col max-w-[780px] min-h-screen mx-auto gap-4 pt-8">
      <header className="text-center font-bold text-xl">
        <div className="font-bold text-xl">Insights into Automotive Sales</div>
        <div className="text-xs flex items-center">
          <span className="font-bold mr-1">Edge function</span>
          <select defaultValue={vercelUrl} onChange={(e) => setEdgeFunctionUrl(e.target.value)}>
            <option value={cloudflareUrl}>Cloudflare</option>
            <option value={netlifyUrl}>Netlify</option>
            <option value={vercelUrl}>Vercel</option>
          </select>
        </div>
      </header>
      <div className="shadow-xl bg-white rounded p-4 w-full ">
        <Line options={options} data={{ labels, datasets }} />
      </div>

      <div className="flex gap-4 flex-col md:flex-row md:min-h-[392px]">
        <div className="shadow-xl bg-white rounded p-4 flex-1 flex-shrink-0 md:w-[49%]">
          <header className="flex justify-between">
            <div className="font-bold">Top Brand</div>

            <div className="text-xs flex items-center">
              <span className="font-bold mr-1">Year:</span>
              <select value={year} onChange={(e) => setYear(e.target.value)}>
                {labels?.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </header>

          <div className="flex justify-between mt-3 mb-2 text-xs font-bold text-gray-500">
            <div>Name</div>
            <div>Order</div>
          </div>
          <RankList
            bg="bg-blue-50"
            data={
              orderByBrandYearData?.rows.slice(0, 10).map((i) => ({
                name: i.name,
                value: i.order_count,
              })) ?? []
            }
          />
        </div>

        <div className="shadow-xl bg-white rounded p-4 flex-1 flex-shrink-0 md:w-[49%]">
          <header className="flex justify-between">
            <div className="font-bold">Top Price</div>

            <div className="text-xs flex items-center">
              <span className="font-bold mr-1">Year:</span>
              <select value={year} onChange={(e) => setYear(e.target.value)}>
                {labels?.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </header>

          <div className="flex justify-between mt-3 mb-2 text-xs font-bold text-gray-500">
            <div>Name</div>
            <div>Price</div>
          </div>
          <RankList
            bg="bg-orange-50"
            data={
              topPriceByYearData?.rows.slice(0, 10).map((i) => ({
                name: i.name,
                value: Number(i.price),
              })) ?? []
            }
          />
        </div>
      </div>

      <footer className="flex items-center justify-center mt-4">
        <a
          className="flex gap-2"
          href="https://tidbcloud.com/?utm_source=dataservicedemo&utm_medium=referral"
          target="_blank"
          rel="noopener noreferrer"
          data-mp-event="Click TiDB Cloud Site Link"
        >
          Powered by{" "}
          <Image
            src="/tidb.svg"
            alt="TiDB Cloud Logo"
            width={138}
            height={24}
            priority
          />
        </a>
      </footer>
    </div>
  );
}
