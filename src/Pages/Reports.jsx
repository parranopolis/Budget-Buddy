import { NavBarTest } from "../Components/NavBar";
import { AnalyzedData } from "../Components/Records";

export function Reports (){
    return(
    //   <section className="bg-main py-8 px-8 flex flex-col gap-8 shadow"><section/>
    <>
        <main className="m-8">
            <h3 className='text-3xl font-medium pb-8'>Analysis</h3>
            <section className="flex flex-col gap-8 mt-4">
            
                 <article className="border-Cborder border rounded-lg bg-bg-form px-4 py-2 w-full flex justify-between text-2xl font-extralight">
                        <span className="isActive">1W</span>
                        <span>1M</span>
                        <span>6M</span>
                        <span>1Y</span>
                        <span>5Y</span>
                    </article>
                <article className="w-full bg-[rgba(129_230_217_/_0.43)] h-42 rounded-2xl px-4 pt-2">
                                                {/* <div className="w-full px-4"><canvas id="acquisitions"></canvas></div> */}
                                                {/* <ChartActivity/> */}
                </article>
                <AnalyzedData/>
                <article className="flex flex-col gap-4 text-xl font-extralight">
                    <div className="flex justify-between">
                        <span>Ganado:</span><span>$ 3293,17</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Gastado:</span>
                        <span>$ 2123,87</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Restante:</span><span>$ 1169,30</span>
                    </div>
                </article>
                {/* Este deberia estar completamente al fondo, justo arriba de la barra de navegacion */}
                <article className="">
                    En este Periodo Gastaste 30% de tu ingreso neto
                </article>
            </section>
            
        </main>
        <aside>
                <NavBarTest/>
        </aside>
    </>
    )
}