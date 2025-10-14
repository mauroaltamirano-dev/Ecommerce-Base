/* Desarrollar con TDD una suma de nums */

/* con el desarrollo orientado a pruebas, el primero paso es definir la funcion que necestio desarrollar VACIA*/

const sumarNumeros = (...nums) => {
  if (nums.length === 0) {
    return 0;
  }

  const hayNoNum = nums.some((num) => typeof num !== "number");
  if (hayNoNum) {
    return null;
  }

  const sumatoria = nums.reduce((acc, val) => acc + val);
  return sumatoria;
};

/*el segundo paso es definir las pruebas */

// T1: devuelve null si algun num no es numerico
const test1 = () => {
  const resultado = sumarNumeros("1", "casa");
  if (resultado === null) {
    console.log("TEST 1: ok");
  } else {
    console.log("TEST 1: no");
  }
};
// T2: devuelve 0 si no recibe parametros
const test2 = () => {
  const resultado = sumarNumeros();
  if (resultado === 0) {
    console.log("TEST 2: ok");
  } else {
    console.log("TEST 2: no");
  }
};
// T3: devuelve correctamente la suma de dos nums
const test3 = () => {
  const resultado = sumarNumeros(10, 5);
  if (resultado === 15) {
    console.log("TEST 3: ok");
  } else {
    console.log("TEST 3: no");
  }
};
// T4: devuelve correctamente la suma de cualquier cantidad de nums
const test4 = () => {
  const resultado = sumarNumeros(10, 100, 15, 0.5);
  if (resultado === 125.5) {
    console.log("TEST 4: ok");
  } else {
    console.log("TEST 4: no");
  }
};
test1();
test2();
test3();
test4();
