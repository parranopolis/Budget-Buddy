import { useContext, useEffect } from "react";
// import { monthlyCollectionContext } from "../Context/ExpensesContext";
import test from '../FirebaseCollectionData/NewExpensesStructure.json'
import { addDoc, collection} from "firebase/firestore";
import { db, auth } from "../../services/firebaseConfig";
import { doc, setDoc, writeBatch } from "firebase/firestore";


export function UploadRecords() {
  const uid = "";
  console.log(Object.keys(test[uid].expenses).length)
  console.log('________________')
  const SentInfo = async () => {
    const allTransactions = test[uid].expenses;
    
        const batch = writeBatch(db);
        let ops = 0;
        for (const transactionID in allTransactions) {
          const tx = allTransactions[transactionID]; // ✅ object

          const ref = doc(db, "newMonthlyExpenses", uid, "expenses", transactionID); // ✅ path

          batch.set(ref, {
            ...tx,
            id: transactionID, // or ref.id (same here)
            uid,               // optional
            amount: Number(tx.amount), // normalize
          });

          ops++;
          console.log(ops)
          if (ops >= 600) {
            await batch.commit();
            ops = 0;
          }
        }
// p5OGzU34FjPM35kJFx9Dhdix0Mp2
        if (ops > 0) await batch.commit();
      };

     return (
         <>
         <div className="text-4xl">Upload Records Page</div>
             {/* <form action=""> */}
             <button onClick={SentInfo}>Upload Record</button>
             {/* <input type="file" name="fileUpload" id="fileUpload" /> */}
             {/* <button type="submit" onClick={()=> UploadRecordsButton()}>Upload</button> */}
         {/* </form> */}
         </>
     )
}

async function importJson(data, collectionName, docummentId) {
      const expenseCollectionRef = collection(db, collectionName)
     console.log(collectionName);
     console.log(data);
     console.log(docummentId);
     try {
         await setDoc(doc(db, collectionName, docummentId), {
             ...data
         });
         console.log("Document successfully written!");
       } catch (e) {
         console.error("Error writing document: ", e);
       }
      try {
          await addDoc(expenseCollectionRef,{
              data
          })
      } catch (error) {
          console.log(error)
      }
}


//     async function setDocumentInNewCollection() {
      
    // }

//     setDocumentInNewCollection();

// src/MigrateExpenses.jsx
import React, { useState } from "react";
// import { auth, db } from "./firebase";
// import { Timestamp, writeBatch, serverTimestamp } from "firebase/firestore";

const BATCH_SIZE = 450;

// function toMonthKey(dateStr) {
//   return typeof dateStr === "string" && dateStr.length >= 7 ? dateStr.slice(0, 7) : "unknown";
// }

// function toTimestampUTC(dateStr) {
//   if (!dateStr || typeof dateStr !== "string" || dateStr.length !== 10) return null;
//   const d = new Date(`${dateStr}T00:00:00.000Z`);
//   if (Number.isNaN(d.getTime())) return null;
//   return Timestamp.fromDate(d);
// }

// async function readJsonFile(file) {
//   const text = await file.text();
//   return JSON.parse(text);
// }

// function isValidUidLike(s) {
//   // Firebase Auth UID suele ser string no vacío (28 chars aprox), pero mejor una validación suave:
//   return typeof s === "string" && s.trim().length >= 10 && !s.includes("/") && !s.includes("{");
// }

// export function UploadRecords() {
//   const [file, setFile] = useState(null);
//   const [running, setRunning] = useState(false);
//   const [logs, setLogs] = useState([]);
//   const [written, setWritten] = useState(0);
//   const [skipped, setSkipped] = useState(0);

//   const [skipEmptyDate, setSkipEmptyDate] = useState(true);
//   const [onlyMyUid, setOnlyMyUid] = useState(false);
//   const [destRoot, setDestRoot] = useState("newMonthlyIncomeV2");

//   const me = auth.currentUser?.uid || null;
//   const addLog = (m) => setLogs((p) => [...p, m]);

//   const migrate = async () => {
//     if (!file) return;

//     setRunning(true);
//     setLogs([]);
//     setWritten(0);
//     setSkipped(0);

//     try {
//       if (onlyMyUid && !me) {
//         throw new Error("No hay usuario autenticado. Inicia sesión o desactiva 'Solo mi UID'.");
//       }

//       addLog("Leyendo JSON...");
//       const data = await readJsonFile(file);

//       let batch = writeBatch(db);
//       let opsInBatch = 0;

//       let localWritten = 0;
//       let localSkipped = 0;

//       const flush = async () => {
//         if (opsInBatch === 0) return;
//         await batch.commit();
//         localWritten += opsInBatch;
//         opsInBatch = 0;
//         setWritten(localWritten);
//         addLog(`✅ Batch commit. Total escritos: ${localWritten}`);
//         batch = writeBatch(db);
//       };

//       addLog("Migrando...");

//       for (const [topKey, txMap] of Object.entries(data)) {
//         if (!txMap || typeof txMap !== "object") continue;

//         for (const [txId, tx] of Object.entries(txMap)) {
//           if (!tx || typeof tx !== "object") {
//             localSkipped++;
//             continue;
//           }

//           const dateStr = String(tx.date ?? "");
//           if (skipEmptyDate && !dateStr) {
//             localSkipped++;
//             continue;
//           }

//           // uid: preferimos el topKey si parece uid; si no, usamos tx.uid
//           const uidCandidate = isValidUidLike(topKey) ? topKey : tx.uid;
//           const uid = typeof uidCandidate === "string" ? uidCandidate.trim() : "";

//           if (!isValidUidLike(uid)) {
//             localSkipped++;
//             if (localSkipped < 20) {
//               addLog(`⚠️ Saltado tx=${txId}: uid inválido. topKey="${topKey}" tx.uid="${tx.uid}"`);
//             }
//             continue;
//           }

//           if (onlyMyUid && uid !== me) {
//             localSkipped++;
//             continue;
//           }

//           const monthKey = toMonthKey(dateStr);
//           const dateTs = toTimestampUTC(dateStr);

//           // ✅ ruta siempre correcta: collection/doc/collection/doc/collection/doc
//           const ref = doc(db, destRoot, uid, "months", monthKey, "income", txId);

//           batch.set(
//             ref,
//             {
//               ...tx,
//               id: txId,
//               uid,
//               dateStr,
//               date: dateTs,
//               monthKey,
//               migratedAt: serverTimestamp(),
//             },
//             { merge: true }
//           );

//           opsInBatch++;
//           if (opsInBatch >= BATCH_SIZE) await flush();
//         }
//       }

//       await flush();

//       setSkipped(localSkipped);
//       addLog(`🎉 Terminado. Escritos: ${localWritten} | Saltados: ${localSkipped}`);
//     } catch (e) {
//       console.error(e);
//       addLog(`❌ Error: ${e?.message || String(e)}`);
//     } finally {
//       setRunning(false);
//     }
//   };

//   return (
//     <div style={{ padding: 16, maxWidth: 900 }}>
//       <h2>Migración JSON → Firestore</h2>

//       <div style={{ display: "grid", gap: 10 }}>
//         <label>
//           Archivo JSON:
//           <input
//             type="file"
//             accept="application/json"
//             disabled={running}
//             onChange={(e) => setFile(e.target.files?.[0] || null)}
//           />
//         </label>

//         <label>
//           Colección destino (root):
//           <input
//             style={{ width: "100%" }}
//             disabled={running}
//             value={destRoot}
//             onChange={(e) => setDestRoot(e.target.value)}
//           />
//         </label>

//         <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
//           <input
//             type="checkbox"
//             disabled={running}
//             checked={skipEmptyDate}
//             onChange={(e) => setSkipEmptyDate(e.target.checked)}
//           />
//           Saltar transacciones con <code>date</code> vacío
//         </label>

//         <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
//           <input
//             type="checkbox"
//             disabled={running}
//             checked={onlyMyUid}
//             onChange={(e) => setOnlyMyUid(e.target.checked)}
//           />
//           Solo migrar mi UID (auth.currentUser.uid = <code>{me ?? "null"}</code>)
//         </label>

//         <button disabled={!file || running} onClick={migrate}>
//           {running ? "Migrando..." : "Iniciar migración"}
//         </button>

//         <div style={{ display: "flex", gap: 16 }}>
//           <div><b>Escritos:</b> {written}</div>
//           <div><b>Saltados:</b> {skipped}</div>
//         </div>

//         <pre style={{ background: "#0b1020", color: "#d6e2ff", padding: 12, borderRadius: 8, overflow: "auto" }}>
//           {logs.join("\n")}
//         </pre>
//       </div>
//     </div>
//   );
// }
