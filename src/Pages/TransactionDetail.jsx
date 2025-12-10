import {NavBarTest } from "../Components/NavBar";

export function TransactionDetail() {
    
    //arreglar el alto de la seccion verde (nombres y logo)
    // mover cerca de la barra de navegacion la seccion de totales (gasto, transacciones)
    // underline en los botones editar y borrar
    // funcionalidad de los botones editar y borrar
    // texto de botones al centro
    return (
        <>
            <main className="h-screen">
{/* 2F855A */}
{/* 4A5568 36% */}
                <section className="bg-[#2F855A] h-[25%] flex justify-between items-end-safe px-12 pb-8 text-white">
                    <div className="w-26 h-26 bg-[#4A5568] opacity-36 rounded-2xl">
                        <span></span>
                    </div>
                    <div className="">
                         <h4 className="text-xl text-right ">Food</h4> {/* Category */}
                         <h2 className="text-2xl text-right max-w-50 font-semibold">Sam&apos;s club gas</h2> {/* Merchand Name */}
                    </div>
                </section>
                <section className="w-4/5 m-auto mt-8 flex flex-col gap-8">
                    
                    <article className="flex justify-between items-center">
                        <span className="text-xl">12/12/2025</span>
                        <span className="text-5xl">$5,22</span>
                    </article>
                    <article className="text-center">
                        <div className="rounded-xl text-decoration-line h-10 bg-[rgba(74,85,104,0.36)] text-black">Edit</div>{/* Takes to edit page  */}
                        <div className="rounded-xl text-decoration-line h-10 bg-red-300 text-red-700 mt-4">Delete</div> {/* Delete de document, go back to the  previous page */}
                    </article>
                    <article className="flex justify-between">
                        <div className="">
                            <span className="text-xs">Total this month on this merchand</span><br/>
                            <span className="text-4xl">$300</span>
                        </div>
                        <div className="text-center">
                            <span className="text-xs">Total Transactions</span><br/>
                            <span className="text-4xl -center">5</span>
                        </div>
                    </article>
                </section>
            </main>
            <aside className="">                
                <NavBarTest />
            </aside>
        </>
    )
}