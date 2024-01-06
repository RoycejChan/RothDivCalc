import style from "./rothCalc.module.css";
import { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import RothHero from "./hero/Rothhero";
import { useTheme } from "../../theme";
export default function RothCalc() {

  const { isDarkMode } = useTheme();


  let [startingBalance, setStartingBalance] = useState<number>(0);
  const [annualContribution, setAnnualContribution] = useState<number>(0);
  let [age, setAge] = useState<number>(0);
  const [retireAge, setRetireAge] = useState<number>(0);
  const [expectedRor, setExpectedRoR] = useState<number>(0);
  const [chartDataUpdated, setChartDataUpdated] = useState<boolean>(false);


  const [balance, setBalance] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);


  const canvasRef = useRef<HTMLCanvasElement | null>(null);


  useEffect(() => {
      const canvas = canvasRef.current;

      if (!canvas) {
        console.error('Canvas element not found');
        return;
      }

      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('Canvas context not available');
        return;
      }

      let chartInstance: any;

      const createChart = () => {
        chartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.map(entry => entry.age),
            datasets: [
              {
                label: 'Networth',
                data: data.map(entry => entry.balance),
              },
            ],
          },
        });
      };

      // Create chart
      createChart();

      return () => {
        if (chartInstance) {
          chartInstance.destroy();
        }
      };
    }, [data]);

  const handleCalculate = () => {
    let tempBalance: number = startingBalance;
  
    let newBalance: number = 0;
    let newAge: number = age;
  
    
    let netWorthData: any[] = [];
  
    // Calculate balance for each age until retirement age
    for (let i = age; i <= retireAge; i++) {
      tempBalance += annualContribution;
      tempBalance += tempBalance * (expectedRor / 100);
      newBalance = tempBalance;
  
      // Create a new netWorth object for the current age
      const netWorth = {
        balance: tempBalance,
        age: newAge,
      };
  
      netWorthData.push(netWorth);
      newAge++;
    }
  
    setBalance(newBalance);
    setChartDataUpdated(!chartDataUpdated); //rerender chart
    setData(netWorthData);
  
  };
  

  return (
    <>
    <RothHero/>
    <div className={`${isDarkMode ? style.darkModebg : style.lightModebg} pt-48 pb-20`}>
    <div
        id="rothContainer"
        className={`${style.rothContainer} p-8  flex border-t-4 border-blue-600 gap-2  rounded-xl shadow-2xl ${
          isDarkMode ? style.darkModepart : style.lightModepart
        }`}
      >      <div className={style.userInputs}>
        <h1 className="mb-5 text-lg font-extrabold">Roth IRA Calculator</h1>

        <div className={style.inputPair}>
        <span className={style.currencyCode}>$</span>
        <label htmlFor="startBalance">What's your starting balance?</label>
        <input type="number" name="startBalance" onChange={(e)=>setStartingBalance(parseInt(e.target.value))} />
        </div>

        <div className={style.inputPair}>
        <span className={style.currencyCode}>$</span>
        <label htmlFor="annualContribution">What's your annual contribution?</label>
        <input type="number" name="annualContribution" onChange={(e)=>setAnnualContribution(parseInt(e.target.value))}/ >
        </div>


        <div className={style.inputPair}>
          <label htmlFor="age">How old are you?</label>
          <input type="number" name="age" onChange={(e)=>setAge(parseInt(e.target.value))}/>
        </div>

        <div className={style.inputPair}>
          <label htmlFor="retirementAge">What age do you want to retire at?</label>
          <input type="number" name="retirementAge" onChange={(e)=>setRetireAge(parseInt(e.target.value))}/>
        </div>

        <div className={style.inputPair}>
        <span className={style.percentCode}>%</span>
          <label htmlFor="rateOfReturn">What's your expected rate of return?</label>
          <input type="number" name="rateOfReturn"  onChange={(e)=>setExpectedRoR(parseInt(e.target.value))}/>
        </div>

        <div className={style.inputPair}>
        <span className={style.percentCode}>%</span>
          <label htmlFor="taxRate">What will your marginal tax rate be?</label>
          <input type="number" name="taxRate" max={"2"} />
        </div> 




        <div className={`${style.maxContribution} flex flex-col justify-start font-bold text-lg gap-1`}>
          <h1 className="mb-2">Maximize Contributions?</h1>
          <div className={style.maxRadio}>
          <label htmlFor="yesMax">Yes</label>
          <input type="radio" id="yesMax" name="maxContribution"/>
          </div>
          <div className={style.maxRadio}>
          <label htmlFor="noMax">No</label>
          <input type="radio" id="noMax" name="maxContribution" />
          </div>
        </div>
        <button className="bg-blue-600 text-white p-5 px-8 rounded-md mt-2" onClick={handleCalculate}>Calculate</button>
      </div>
      <div className={style.rothGraph}>
          <div className={`${style.rothCalculation} m-8 p-10  text-center rounded-lg`}>
              <h1 className="text-2xl font-bold">Your estimated IRA Balance</h1>
              <h1 className={`${style.endBalance} text-4xl p-2 border-b-2 border-gray-400 w-2/5 mx-auto font-semibold`}>${Math.round(balance).toLocaleString()}</h1>
          </div>
          <canvas ref={canvasRef} id="rothCalcs" width="400" height="200" aria-label="Hello ARIA World" role="img">
  <p>Hello Fallback World</p>
</canvas>

      </div>
    </div>
</div>
    </>
  );
}
