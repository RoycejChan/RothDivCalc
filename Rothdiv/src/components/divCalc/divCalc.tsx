import { useEffect, useState, useRef } from "react";
import style from "./divCalc.module.css"
import { GoArrowDown } from "react-icons/go";
import Chart from 'chart.js/auto';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useTheme } from "../../theme";
interface YearlyResult {
  year: number;
  principal: number;
  annualDividend: number;
  afterDripValue: number;
  principalIncrease: number;
  annualContribution: number;
  cummulativeDividends: number;
  totalContribution: number;
}

export default function DivCalc() {
  const { isDarkMode } = useTheme();

  const portfolioCharts = useRef<HTMLDivElement | null>(null);

    const [ticker,setTicker] = useState<string>("");
    const [tickerData, setTickerData] = useState<any>();
    
    const [tickerYield, setTickerYield] = useState<number>(0.0);
    const [dividendFrequencyString, setDividendFrequencyString] = useState<string>("None");
    const [divPayout, setDivPayout] = useState<number>(0);
    const [companyName, setCompanyName] = useState<string>("");

    const [calcPositionBtn, allowCalc] = useState<boolean>(false);

    // Individual state for each input
    const [startingPrincipal, setStartingPrincipal] = useState<number>(0);
    const [isTaxableAccount, setIsTaxable] = useState<boolean>(true);
    const [dividendTaxRate, setDividendTaxRate] = useState<number>(0.0);
    const [expectedAnnualDividendIncrease, setExpectedAnnualDividendIncrease] = useState<number>(0);
    const [annualContribution, setAnnualContribution] = useState<number>(0);
    const [expectedAnnualPriceAppreciation, setExpectedAnnualPriceAppreciation] = useState<number>(0);
    const [isDripEnabled, setIsDripEnabled] = useState<boolean>(true);
    const [yearInvested, setYearInvested] = useState<number>(0);
    const [stockPrice, setStockPrice] = useState<number>(0);

    const [calcChart, setCalcChart] = useState<YearlyResult[]>([]);

    const [calculator, setCalculator] = useState<boolean>(false);
    const [calculated, isCalulated] = useState<boolean>(false);
    const [scrollToCharts, setScrollToCharts] = useState(false);


    useEffect(() => {
      if (calculated && portfolioCharts.current && scrollToCharts) {
        setTimeout(() => {
          const chartsRef = portfolioCharts.current;
          if (chartsRef) {
            chartsRef.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
        setScrollToCharts(false); // Reset the scroll trigger
      }
    }, [calculated, scrollToCharts]);
    const search = async () => {

      if (ticker == "") {
        setTickerYield(0.0);
        setDividendFrequencyString("None");
        setDivPayout(0.0)
        allowCalc(false);
        alert("Please enter a ticker Symbol")
        return;
      }

        console.log(ticker);
        try {
          const response = await fetch(`https://rothdivcalcbackend.onrender.com/?ticker=${ticker}`);
          const data = await response.json();
          setTickerData(data);
          console.log(data);
          setCalculator(false);
          isCalulated(false);
        } catch (error) {
          setCompanyName("Company Not found or No Dividend 😟");
          setTickerYield(0.0);
          setDividendFrequencyString("None");
          setDivPayout(0.0)
          console.error('Error:', error);
          allowCalc(false);
          setCalculator(false);
          isCalulated(false);
          setStockPrice(0);
          
        }
      };

      useEffect(()=>{
           if (tickerData && tickerData.dividend) {
        let annualDividend = tickerData.dividend.divPayout * tickerData.dividend.divFrequency;
        let dividendYield = (annualDividend / tickerData.price) * 100
        setTickerYield(dividendYield)
        setDivPayout(tickerData.dividend.divPayout);
        setCompanyName(tickerData.details.name);
        isCalulated(false);
        allowCalc(true);
            if (tickerData.dividend.divFrequency == 1) {
                setDividendFrequencyString("Annually")
            } else if (tickerData.dividend.divFrequency == 2) {
                setDividendFrequencyString("Bi-Annualy")
            } else if (tickerData.dividend.divFrequency == 4) {
                setDividendFrequencyString("quarterly")
            } else if (tickerData.dividend.divFrequency == 12) {
                setDividendFrequencyString("Monthly")
            } else {
                setStockPrice(0);
                setTickerYield(0.0);
                setDividendFrequencyString("None");
                console.log("No dividend information available");
                allowCalc(false)
                isCalulated(false);
              }

              setStockPrice(tickerData.price);

            }},[tickerData])
            
const calculate = () => {
              isCalulated(true);
              setScrollToCharts(true);
              setCalcChart([]);
              function percentageToDecimal(percentage:number) {
                return percentage / 100;
              }
              

          if (yearInvested <= 0  || startingPrincipal <= 0) {
            alert('Starting Principal and Years Invested are Required');
            isCalulated(false);
            return;
          }
// starting = 10,000
// investmentValue(total) = 10,000
//annual contribution = 5,000
//years = 20
//est annaul price appreciation = 8%
//est annual div increase = 5%
// iterate through x years invested
        //for each year, 
            //annual dividend income = investmentvalue * (divYield/100)
            //if taxable account (brokerage) :
            //afterTaxDividendIncome = annualDividendIncome * (1 - dividendTaxRate / 100); //*subtract annual with tax
            //if not taxable account (roth) :
            //dont take taxdividendincome into account
            // totalAfterTaxDividendIncome += afterTaxDividendIncome; //* Add to the current year
            // totalDividendIncome += annualDividendIncome; //*Add to total


            //.05 = 5% for this example
            //est annual div increase = newDiv = currentDiv * (1+ .05) //*increase annual dividend by estimate
            //est annual price increase = newPrice = currentPrice * (1 +.05) //*increase annual price by estimate
            
            //total shares owned = stock price * totalInvestment
            //total dividends annually = (dividendPayout * dividendFrequency) * sharesOwned 

            //if drip:
                //add total dividends annually to += investmentValue
            //else:
                //don't add dividends to total

            // add+ annual contribution to += investmentValue

    let totalInvestment:number = startingPrincipal;

    let totalDividendsEarned:number = 0;
    let annualDividend;
    let totalContribution = 0;
    let totalDividendContributions = 0;

    let afterDripValue = isDripEnabled ? 0 : totalInvestment;

    for ( let i=0 ; i <= yearInvested; i++) {


        let sharesOwned = totalInvestment / stockPrice;
        // let dividendYield = totalInvestment * (tickerYield/100)
        let annualDividends = divPayout * sharesOwned;
        if (isTaxableAccount) {
             annualDividends *= (1 - dividendTaxRate / 100);
        } 
        annualDividend = annualDividends
        totalDividendsEarned +=annualDividends;

        //Yearly increases
        let estNewDivInc = divPayout * (1 + percentageToDecimal(expectedAnnualDividendIncrease))
        let estNewPriceApp = stockPrice * (1 + percentageToDecimal(expectedAnnualPriceAppreciation))
        setExpectedAnnualDividendIncrease(estNewDivInc)
        setExpectedAnnualPriceAppreciation(estNewPriceApp)
        totalInvestment += annualContribution
        // DRIP
        if (isDripEnabled) {
            afterDripValue += totalInvestment;
            totalInvestment +=annualDividends;

        }
        totalContribution += annualContribution;
        totalDividendContributions += annualDividends
        

        let yearlyResult = {
            year: i,
            principal: totalInvestment,
            annualDividend: annualDividend,
            afterDripValue: (totalInvestment + annualDividend),
            principalIncrease: afterDripValue ? (totalInvestment + afterDripValue) : totalInvestment,
            annualContribution: annualContribution,
            cummulativeDividends: totalDividendContributions,
            totalContribution: totalContribution
        }
        setCalcChart((prevCalcChart) => [...prevCalcChart, yearlyResult]);
    }

    }

    const handleDripChange = (e:any) => {
        setIsDripEnabled(e.target.id === 'Dripyes');
        console.log(isDripEnabled)
      };

      const handleTaxAccountChange = (e:any) => {
        setIsTaxable(e.target.id === 'Taxyes');
        console.log(isTaxableAccount)
      };
      const canvasRefStockValue = useRef<HTMLCanvasElement | null>(null);
  const canvasRefDividend = useRef<HTMLCanvasElement | null>(null);
      useEffect(() => {
        const canvasStockValue = canvasRefStockValue.current;
    
        if (!canvasStockValue) {
          console.error('Canvas element for stock value not found');
          return;
        }
    
        const ctxStockValue = canvasStockValue.getContext('2d');
    
        if (!ctxStockValue) {
          console.error('Canvas context for stock value not available');
          return;
        }
    
        let chartStockValue: any;
    
        const createChartStockValue = () => {
          chartStockValue = new Chart(ctxStockValue, {
            type: 'line',
            data: {
              labels: calcChart.map((year) => year.year),
              datasets: [
                {
                  label: 'Portfolio Balance',
                  data: calcChart.map((year) => year.principal),
                },
              ],
            },
          });
        };

        // Create chart for stock value
        createChartStockValue();
    
        return () => {
          if (chartStockValue) {
            chartStockValue.destroy();
          }
        };
      }, [calcChart]);
    
      useEffect(() => {
        const canvasDividend = canvasRefDividend.current;
    
        if (!canvasDividend) {
          console.error('Canvas element for dividend not found');
          return;
        }
    
        const ctxDividend = canvasDividend.getContext('2d');
    
        if (!ctxDividend) {
          console.error('Canvas context for dividend not available');
          return;
        }
    
        let chartDividend: any;
    
        const createChartDividend = () => {
          chartDividend = new Chart(ctxDividend, {
            type: 'line',
            data: {
              labels: calcChart.map((annDiv) => annDiv.year),
              datasets: [
                {
                  label: 'Annual Dividend',
                  data: calcChart.map((annDiv) => annDiv.annualDividend),
                },
              ],
            },
          });
        };
    
        // Create chart for dividend
        createChartDividend();
    
        return () => {
          if (chartDividend) {
            chartDividend.destroy();
          }
        };
      }, [calcChart]);



     //unsortable and type number 
      const columns: readonly GridColDef[] = [
        { field: 'Year', headerName: 'Year', width: 160, sortable:false},
        { field: 'Principal', headerName: 'Principal', width: 160, sortable:false},
        { field: 'AnnualDividend', headerName: 'Annual Dividend', width: 160, sortable:false},
        {field: 'AfterDRIPValue',headerName: 'After DRIP Value',width: 160, sortable:false},
        {field: 'PrincipalIncrease',headerName: 'Principal Increase', width: 160, sortable:false},
        { field: 'AnnualContribution', headerName: 'Annual Contribution', width: 160, sortable:false},
        { field: 'CumulativeDividends', headerName: 'Cummulative Dividends', width: 160, sortable:false},
        { field: 'TotalContribution', headerName: 'Total Contribution', width: 160, sortable:false},

      ];

const rows: any[] = calcChart.map((year: any) => ({
  id: year.year,
  Year: year.year.toLocaleString('en-US'),
  Principal: parseFloat(year.principal).toLocaleString('en-US', { maximumFractionDigits: 3 }),
  AnnualDividend: parseFloat(year.annualDividend).toLocaleString('en-US', { maximumFractionDigits: 2 }),
  AfterDRIPValue: parseFloat(year.afterDripValue).toLocaleString('en-US', { maximumFractionDigits: 2 }),
  PrincipalIncrease: parseFloat(year.principalIncrease).toLocaleString('en-US', { maximumFractionDigits: 2 }),
  AnnualContribution: parseFloat(year.annualContribution).toLocaleString('en-US', { maximumFractionDigits: 2 }),
  CumulativeDividends: parseFloat(year.cummulativeDividends).toLocaleString('en-US', { maximumFractionDigits: 2 }),
  TotalContribution: parseFloat(year.totalContribution).toLocaleString('en-US', { maximumFractionDigits: 2 }),
}));
        
const positionInputsContainer = useRef<HTMLDivElement | null>(null);
 
useEffect(() => {
  if (calculator && positionInputsContainer.current) {
    positionInputsContainer.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [calculator]);











    return (
        <div className={`${isDarkMode ? style.darkModebg : style.lightModebg}`}>
             <style>
      {`
        body {
          background-color: ${isDarkMode ? '#000' : '#fff'}; /* Set background color */
          margin: 0; /* Reset margin to 0 */
          padding: 0; /* Reset padding to 0 */
        }
      `}
    </style>
{/* HEADER */}
        <div className={`${style.header} font-bold`}>
            <h1 className={`${style.headerLines} text-4xl font-bold`}>    
                 Calculator
            </h1>
            <h1 className="text-5xl">Dividend Calculator</h1>
        </div>


{/* SEARCH BAR */}
        <div className={`${style.searchInput} ${isDarkMode ? style.darkModeSearchBar : ''} flex justify-center text-center`}>
            <input type="text" maxLength={5} 
            onChange={(e)=>setTicker(e.target.value.toUpperCase())}
            placeholder="Search ..." className= {`p-5 text-4xl uppercase font-bold text-center ml-24`}/>
            <button onClick={()=>search()}>🔍</button>
        </div>

{/* SEARCH RESULTS */}
        <div className={`${style.searchResults} flex flex-col items-center justify-center mt-10`}>
               
            {/* COMPANY NAME */}
                {tickerData && 'details' in tickerData && (
            <h1 className="text-5xl font-bold">{companyName}</h1>
        )}
           <div className={`${style.dividendStats} mt-10 flex flex-col gap-2`}>
            <h1 className={style.dividendName}>
                Dividend Stats
            </h1>
                <div className={`${style.dividendBoxes} flex gap-8`}>
                    <div className={`${style.dividendBoxDetails}`}>
                        <h1>Yield</h1>
                        <p>{tickerYield.toFixed(2)}%</p>
                    </div>
                    <div className={`${style.dividendBoxDetails}`}>
                        <h1>Stock Price</h1>
                        <p>{stockPrice.toFixed(2)}$</p>
                    </div>
                    <div className={`${style.dividendBoxDetails}`}>
                        <h1>Ammount</h1>
                        <h1>${divPayout || 0}</h1>
                    </div>  
                    <div className={`${style.dividendBoxDetails}`}>
                        <h1>Frequency</h1>
                        <h1>{dividendFrequencyString}</h1>
         </div>     
                </div>            
            </div>
            {calcPositionBtn ? (
            <button className={`${style.scrollToCalcBtn} mt-14 font-bold flex items-center gap-1 border px-3 py-1 border-red-400 hover:bg-red-400 hover:text-white `} onClick={()=>setCalculator((prev)=>!prev)}>Calculate A Position <GoArrowDown/></button> 
            ) : (
                <div className='mt-16'>

                </div>
                )
            }
        </div>






{/* POSITION INPUT CONTAINER */}


{calculator ?

<>
        <div className={`${style.positionInputsContainer} 
        ${isDarkMode ? style.darkModepart : style.lightModepart} mt-4`} id="positionInputsContainer" ref={positionInputsContainer}>
        <div className={style.inputPair}>
        <span className={style.currencyleft}>$</span>

    <label htmlFor="StartingPrincipal">Starting Principal:</label>
    <input type="number" name="StartingPrincipal" placeholder='0' onChange={(e)=>setStartingPrincipal(parseInt(e.target.value))}/>
</div>
<div className={style.inputPair}>
<span className={style.currencyRight}>%</span>
    <label htmlFor="AnnualDividendYield">Annual Dividend Yield:</label>
    <input type="number" name="AnnualDividendYield" placeholder="0.0"  value={tickerYield.toFixed(2)} readOnly/>
</div>
<div className={style.inputPair}>
    <label htmlFor="TaxableAccount">Taxable Account:</label>

        <div className={style.pillButton}>
            <input type="radio" id="Taxyes" name="Taxchoice" checked={isTaxableAccount} onChange={handleTaxAccountChange}/>
            <label htmlFor="Taxyes">Yes</label>

            <input type="radio" id="Taxno" name="Taxchoice" checked={!isTaxableAccount} onChange={handleTaxAccountChange}/>
            <label htmlFor="Taxno">No</label>
        </div>

</div>
<div className={style.inputPair}>
<span className={style.currencyRight}>%</span>
    <label htmlFor="DividendTaxRate">Dividend Tax Rate:</label>
    <input type="number" name="DividendTaxRate" placeholder="0.0" onChange={(e)=>setDividendTaxRate(parseInt(e.target.value))}/>
</div>
<div className={style.inputPair}>
<span className={style.currencyRight}>% (per year)</span>
    <label htmlFor="ExpectedAnnualDividendIncrease">Expected Annual Dividend Increase:</label>
    <input type="number" name="ExpectedAnnualDividendIncrease" placeholder="10.0" onChange={(e)=>setExpectedAnnualDividendIncrease(parseInt(e.target.value))}/>
</div>
<div className={style.inputPair}>
    <label htmlFor="DividendPaymentFrequency">Dividend Payment Frequency:</label>
    <input type="string" name="DividendPaymentFrequency" value={dividendFrequencyString.toUpperCase()} readOnly/>
</div>
<div className={style.inputPair}>
<span className={style.currencyleft}>$</span>
    <label htmlFor="AnnualContribution">Annual Contribution:</label>
    <input type="number" name="AnnualContribution" placeholder="20,000" onChange={(e)=>setAnnualContribution(parseInt(e.target.value))}/>
</div>
<div className={style.inputPair}>
<span className={style.currencyRight}>% (per year)</span>
    <label htmlFor="ExpectedAnnualPriceAppreciation">Expected Annual Price Appreciation:</label>
    <input type="number" name="ExpectedAnnualPriceAppreciation" placeholder="10.0" onChange={(e)=>setExpectedAnnualPriceAppreciation(parseInt(e.target.value))}/>
</div>
<div className={style.inputPair}>
    <label htmlFor="DRIP">DRIP:</label>
    <div className={style.pillButton}>
        <input
          type="radio"
          id="Dripyes"
          name="Dripchoice"
          checked={isDripEnabled}
          onChange={handleDripChange}
        />
        <label htmlFor="Dripyes">Yes</label>

        <input
          type="radio"
          id="Dripno"
          name="Dripchoice"
          checked={!isDripEnabled}
          onChange={handleDripChange}
        />
        <label htmlFor="Dripno">No</label>
      </div>
    </div>
<div className={style.inputPair}>

<span className={style.currencyRight}>years</span>
    <label htmlFor="YearInvested">Year Invested:</label>
    <input type="number" name="YearInvested" placeholder="20" onChange={(e)=>setYearInvested(parseInt(e.target.value))}/>
</div>
<button className={`${style.CalculateDivPosition} rounded-full p-2 font-bold `} onClick={()=>calculate()}>Calculate</button>

        </div>
        </>
                : 
                <></> 
                }
      {calculated ?
      <>      
        <div className={`${style.portfolioCharts} mb-16 `} ref={portfolioCharts}>
        <canvas ref={canvasRefStockValue} id="divCalcsStockValue"  aria-label="Stock Value Chart" role="img" className={` ${isDarkMode ? style.darkModeCharts : style.lightModeCharts}`}>
          <p>Hello Fallback World</p>
        </canvas>

        <canvas ref={canvasRefDividend} id="divCalcsDividend"  aria-label="Dividend Chart" role="img" className={`${isDarkMode ? style.darkModeCharts : style.lightModeCharts}`}>
          <p>Hello Fallback World</p>
        </canvas>
        </div>
        <div style={{ height: 400, width: '75%'}} className={`mx-auto ${style.dataTable} ${isDarkMode ? style.darkModeCharts : style.lightModeCharts}`}>
      <DataGrid
        rows={rows}
        columns={columns}
                initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 20 },
          },
        }}
        pageSizeOptions={[20,30]}
        sx={{
          color: `${isDarkMode ? 'white' : 'black'}`,
          padding:'2rem',
          border:'none',
          fontSize:'1rem',
        }}
      />
    </div>

            <p className="italic text-gray-400 w-8/12 my-6 text-center mx-auto">Disclaimer: This is NOT an investing recommendation. You can lose your invested capital.
               I am not a financial professional of any kind. The calculator published should NOT be used 
               as basis for financial planning. Before making any investing or financial decisions, contact 
               an appropriate professional. All content here is for entertainment purposes only. I am not 
               responsible for the accuracy of any the results of the calculator.</p>
               </>
                : 
                <></> 
                }     
        </div>
    )
}