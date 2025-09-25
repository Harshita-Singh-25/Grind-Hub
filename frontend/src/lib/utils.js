export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}


// // Format message time utility function
// export const formatMessageTime = (timestamp) => {
//   const date = new Date(timestamp);
//   const now = new Date();
//   const diffInHours = (now - date) / (1000 * 60 * 60);

//   if (diffInHours < 24) {
//     return date.toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   } else if (diffInHours < 48) {
//     return 'Yesterday';
//   } else {
//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric'
//     });
//   }
// };

// // Other utility functions can be added here
// export const formatDate = (date) => {
//   return new Date(date).toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
//   });
// };