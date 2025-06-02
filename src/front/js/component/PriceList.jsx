// import React from 'react';

// function PriceList({ history, predictions, currency }) {
//   return (
//     <div className="price-list">
//       <h2>Price Data</h2>
//       <div className="list-container">
//         <div>
//           <h3>Historical Prices</h3>
//           <ul>
//             {history.map(item => (
//               <li key={item.id}>
//                 {new Date(item.timestamp).toLocaleDateString()}: 
//                 <strong> ${item.price.toFixed(2)}</strong>
//               </li>
//             ))}
//           </ul>
//         </div>
        
//         {predictions.length > 0 && (
//           <div>
//             <h3>Predicted Prices</h3>
//             <ul>
//               {predictions.map((price, index) => {
//                 const date = new Date();
//                 date.setDate(date.getDate() + index + 1);
//                 return (
//                   <li key={index}>
//                     {date.toLocaleDateString()}: 
//                     <strong> ${price.toFixed(2)}</strong>
//                   </li>
//                 );
//               })}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default PriceList;


import React from 'react';

function PriceList({ history = [], predictions = [], currency }) {
  // Función para formatear el precio de manera segura
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return price.toFixed(2);
    }
    // Intentar convertir si es string
    const num = parseFloat(price);
    return isNaN(num) ? 'N/A' : num.toFixed(2);
  };

  // Función para obtener fecha de manera segura
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="price-list">
      <h2>Price Data ({currency})</h2>
      <div className="list-container">
        <div>
          <h3>Historical Prices</h3>
          <ul>
            {history.map((item, index) => (
              <li key={item.id || `hist-${index}`}>
                {formatDate(item.timestamp)}: 
                <strong> ${formatPrice(item.price)}</strong>
              </li>
            ))}
          </ul>
        </div>
        
        {predictions.length > 0 && (
          <div>
            <h3>Predicted Prices</h3>
            <ul>
              {predictions.map((item, index) => {
                // Manejar tanto objetos como valores directos
                const price = typeof item === 'object' ? item.price : item;
                const date = new Date();
                date.setDate(date.getDate() + index + 1);
                
                return (
                  <li key={item.id || `pred-${index}`}>
                    {date.toLocaleDateString()}: 
                    <strong> ${formatPrice(price)}</strong>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default PriceList;