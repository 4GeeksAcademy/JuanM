// import React from "react";
// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
// import '../../styles/paypal.css'

// const Paypal= ( ) => {
//   const initialOptions = {
//     "client-id": "AZrKyZYmdN3Ohu5Sb2-Wl3tiUH9AR83sZ7Oog5cEGaiyMLFvQ4awE6rY1lgZW3nc0T0NZ44qfFS_UCRH",
//     currency: "USD",
//     intent: "capture",
//   };

//   return (
//     <>
//     <div className="payment-container">
//       <PayPalScriptProvider options={initialOptions}>
//         <PayPalButtons 
//           style={{ layout: "vertical" }}
//           createOrder={(data, actions) => {
//             return actions.order.create({
//               purchase_units: [
//                 {
//                   amount: {
//                     value: "100.00", // Monto del pago
//                     breakdown: {
//                       item_total: {
//                         currency_code: "USD",
//                         value: "100.00",
//                       },
//                     },
//                   },
//                   items: [
//                     {
//                       name: "Producto Ejemplo",
//                       unit_amount: {
//                         currency_code: "USD",
//                         value: "100.00",
//                       },
//                       quantity: "1",
//                     },
//                   ],
//                 },
//               ],
//             });
//           }}
//           onApprove={(data, actions) => {
//             return actions.order.capture().then((details) => {
//               // Aquí puedes manejar el pago exitoso
//               console.log("Pago completado:", details);
//               alert(`Pago completado por ${details.payer.name.given_name}`);
//             });
//           }}
//           onError={(err) => {
//             console.error("Error en el pago:", err);
//             alert("Ocurrió un error al procesar el pago");
//           }}
//         />
//       </PayPalScriptProvider>
//     </div>
//     </>
//   );
// }

// export default Paypal;


import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import '../../styles/paypal.css'

const Paypal = () => {
  const navigate = useNavigate(); // Obtén la función de navegación
  const initialOptions = {
    "client-id": "AZrKyZYmdN3Ohu5Sb2-Wl3tiUH9AR83sZ7Oog5cEGaiyMLFvQ4awE6rY1lgZW3nc0T0NZ44qfFS_UCRH",
    currency: "USD",
    intent: "capture",
  };

  return (
    <>
      <div className="payment-container">
        <PayPalScriptProvider options={initialOptions}>
          <PayPalButtons 
            style={{ layout: "vertical" }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: "100.00",
                      breakdown: {
                        item_total: {
                          currency_code: "USD",
                          value: "100.00",
                        },
                      },
                    },
                    items: [
                      {
                        name: "Producto Ejemplo",
                        unit_amount: {
                          currency_code: "USD",
                          value: "100.00",
                        },
                        quantity: "1",
                      },
                    ],
                  },
                ],
              });
            }}
            onApprove={(data, actions) => {
              return actions.order.capture().then((details) => {
                console.log("Pago completado:", details);
                alert(`Pago completado por ${details.payer.name.given_name}`);
                // Redirige a la página de inversiones después del pago exitoso
                navigate("/inversiones"); 
              });
            }}
            onError={(err) => {
              console.error("Error en el pago:", err);
              alert("Ocurrió un error al procesar el pago");
            }}
          />
        </PayPalScriptProvider>
      </div>
    </>
  );
}

export default Paypal;




