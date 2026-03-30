import test from '../FirebaseCollectionData/NewExpensesStructure.json'
import { db } from "../../services/firebaseConfig";


// export function UploadRecords() {
//   const uid = "";
//   const SentInfo = async () => {
//     const allTransactions = test[uid].expenses;
    
//         const batch = writeBatch(db);
//         let ops = 0;
//         for (const transactionID in allTransactions) {
//           const tx = allTransactions[transactionID]; // ✅ object

//           const ref = doc(db, "newMonthlyExpenses", uid, "expenses", transactionID); // ✅ path

//           batch.set(ref, {
//             ...tx,
//             id: transactionID, // or ref.id (same here)
//             uid,               // optional
//             amount: Number(tx.amount), // normalize
//           });

//           ops++;
//           console.log(ops)
//           if (ops >= 600) {
//             await batch.commit();
//             ops = 0;
//           }
//         }
//         if (ops > 0) await batch.commit();
//       };

//      return (
//          <>
//          <div className="text-4xl">Upload Records Page</div>
//              {/* <form action=""> */}
//              <button onClick={SentInfo}>Upload Record</button>
//              {/* <input type="file" name="fileUpload" id="fileUpload" /> */}
//              {/* <button type="submit" onClick={()=> UploadRecordsButton()}>Upload</button> */}
//          {/* </form> */}
//          </>
//      )
// }