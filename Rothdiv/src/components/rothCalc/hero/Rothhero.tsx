import style from "./hero.module.css"

export default function RothHero() {
    return (
    <div className={`${style.hero} bg-black text-white flex flex-col text-center p-24 gap-9 `}>

        <h1 className="text-7xl">Roth IRA Calculator</h1>
        <p className="text-2xl">Creating & Contributing to a Roth IRA is one of the best investment vehicles anyone can have for their retirement savings.
            Although there is no tax deductions for contributions unlike a 401k, all future earning are sheltered from taxes under current USA tax laws.
            If you meet the qualifiations to contribute to one, the Roth IRA can be the best tool you have for a financially healthy retirement.
        </p>
        <p className="pt-10">Disclaimer:The investment information provided in this table is for informational and general educational purposes only and should not be construed as investment or financial advice. 
             Investment decisions should be based on an evaluation of your own personal financial situation, needs, risk tolerance and investment objectives. 
             Investing involves risk including the potential loss of principal.</p>
    </div>
    
    )
}