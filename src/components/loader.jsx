import React from 'react';

const Loader = () => {
  return (
    <div className="loader">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loader;
// // src/Loader.jsx
// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';

// const Loader = () => {
//   const [showWord, setShowWord] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowWord(true);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className="loader">
//       {!showWord ? (
//         <div className="spinner"></div>
//       ) : (
//         <div className="word-container">
//           <motion.span
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1, duration: 0.5 }}
//           >
//             O
//           </motion.span>
//           <motion.span
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3, duration: 0.5 }}
//           >
//             M
//           </motion.span>
//           <motion.span
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5, duration: 0.5 }}
//           >
//             A
//           </motion.span>
//           <motion.span
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.7, duration: 0.5 }}
//           >
//             Y
//           </motion.span>
//           <motion.span
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.9, duration: 0.5 }}
//           >
//             A
//           </motion.span>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Loader;
