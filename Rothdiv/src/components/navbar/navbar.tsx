import style from "./navbar.module.css"
import { Link } from "react-router-dom"
import { useTheme } from "../../theme"
export default function NavBar () {
    const {toggleTheme} = useTheme();
    return (
        
        <>
            <div className={`flex justify-around p-4 items-center text-1xl ${style.navBar} `}>
                <h1>RothDivCalc</h1>

                <ul className="flex gap-5">
                    <li className="hover:text-red-500"><Link to="/">Roth IRA Calculator</Link></li>
                    <li className="hover:text-red-500"><Link to="/divCalc">Dividend Calculator</Link></li>
                </ul>
                <div className="flex gap-5">
                <button onClick={toggleTheme}>🔦</button>
                <a href="https://github.com/RoycejChan/RothDivCalc" target="_blank" className="fas fa-github">
                <button className="border-2 p-2 px-10 rounded-full hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 hover:border-black">
                    Github
                </button>
                </a>
                </div>
            </div>


                  
        </>
    )
}