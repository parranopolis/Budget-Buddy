import { PropTypes } from "prop-types";


Categories.propTypes= {
    categoriesData : PropTypes.array,
    callback : PropTypes.func,
    formData : PropTypes.object
    
}

// export function Categories({categoriesData,callback, formData}){
//     return (
//         <>
//         <span className="text-3xl w-18 shrink-0 snap-start h-18 rounded-full relative flex items-center justify-center bg-category">+ </span>
//         {/* // onClick={() => setShowModal(showModal === true ? false : true)}>+ </span> */}

//         {categoriesData.map((cat) => {
//                   const isActive = formData.field === cat;
//                   return (
//                     <button
//                       key={cat}
//                       type="button"
//                       data-value={cat}
//                       onClick={callback}
//                       className={[
//                         "w-18 shrink-0 snap-start h-18 rounded-full relative flex items-center justify-center",
//                         "bg-category",
//                         isActive
//                           ? "active-category-button ring-4 ring-white/70 shadow-lg scale-105"
//                           : "opacity-80 hover:opacity-100",
//                       ].join(" ")}
//                     >
//                       {cat}
//                     </button>
//                   );
//                 })}
//         </>
//     )
// }

export function Categories({ categoriesData, callback, formData }) {
  return (
    <>
      {categoriesData.map((cat) => {
        // Buscamos si el nombre actual coincide con el valor en formData
        const isActive = formData.field === cat.name;

        return (
          <button
            key={cat.name}
            type="button"
            data-value={cat.name} // Seguimos usando el nombre para el estado
            onClick={callback}
            style={{ backgroundColor: cat.color }} // Aplicamos el color aquí
            className={[
              "w-18 shrink-0 snap-start h-18 rounded-full relative flex flex-col items-center justify-center text-white transition-all",
              isActive
                ? "active-category-button ring-4 ring-offset-2 ring-blue-400 shadow-xl scale-110 z-10"
                : "opacity-80 hover:opacity-100 hover:scale-105",
            ].join(" ")}
          >
            <span className="text-xl">{cat.icon}</span>
            <span className="text-[10px] font-bold uppercase truncate w-full px-1">
              {cat.name}
            </span>
          </button>
        );
      })}
    </>
  );
}
