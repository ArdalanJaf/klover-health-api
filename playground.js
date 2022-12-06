// function cleanUnavailability(payload) {
//   const arraySpreader = (arr) => {
//     // if (arr.length < 2) return 'id = ' + arr[0];
//     let output = "";
//     arr.map((id, i) => {
//       output += `${i > 0 ? " OR" : ""} id = ${id}`;
//     });
//     return output;
//   };
//   return `DELETE FROM unavailability
//               WHERE${arraySpreader(payload)};`;
// }

// let array = [12, 23, 41];

// let results = cleanUnavailability(array);
// console.log(results);

const time = 1670198400000;
let t = new Date(time);
console.log(t.toUTCString());
