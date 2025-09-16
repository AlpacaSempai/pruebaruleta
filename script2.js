document.addEventListener("DOMContentLoaded", () => {
    let saldo = 1000;
    const ruleta = document.getElementById("ruleta");
    const girarBtn = document.getElementById("girar");
    const apostarBtn = document.getElementById("apostar");
    const resultado = document.getElementById("resultado");
    const saldoElem = document.getElementById("saldo");
  
    let apuestas = [];
    let rotacionAcumulada = 0;
    const spinDuration = 3000; // Duración en milisegundos
  
    // Usamos transición lineal para velocidad constante
    ruleta.style.transition = `transform ${spinDuration}ms linear`;
  
    // Función para girar la ruleta sin normalizar la rotación
    function girarRuleta() {
      // Generamos un número ganador (0 a 36)
      let numeroGanador = Math.floor(Math.random() * 37);
      // Calculamos los grados a girar: 5 vueltas completas más un extra según el número
      let grados = 360 * 5 + (numeroGanador * 9.72);
  
      // Acumulamos la rotación; cada giro recorre siempre la misma cantidad de grados
      rotacionAcumulada += grados;
      ruleta.style.transform = `rotate(${rotacionAcumulada}deg)`;
  
      // Tras spinDuration ms se muestra el resultado y se verifican las apuestas
      setTimeout(() => {
        resultado.innerText = `Número ganador: ${numeroGanador}`;
        verificarApuestas(numeroGanador);
      }, spinDuration);
    }
  
    // Función para verificar las apuestas
    function verificarApuestas(numeroGanador) {
      let colorGanador = obtenerColor(numeroGanador);
      let paridadGanadora = numeroGanador === 0 ? null : (numeroGanador % 2 === 0 ? "par" : "impar");
      let docenaGanadora = numeroGanador === 0 ? null : Math.ceil(numeroGanador / 12);
  
      apuestas.forEach(apuesta => {
        let ganancia = 0;
        switch (apuesta.tipo) {
          case "numero":
            if (apuesta.valor == numeroGanador) {
              ganancia = apuesta.cantidad * 36;
            }
            break;
          case "color":
            if (apuesta.valor === colorGanador) {
              ganancia = apuesta.cantidad * 2;
            }
            break;
          case "paridad":
            if (apuesta.valor === paridadGanadora) {
              ganancia = apuesta.cantidad * 2;
            }
            break;
          case "docena":
            if (apuesta.valor == docenaGanadora) {
              ganancia = apuesta.cantidad * 3;
            }
            break;
        }
        saldo += ganancia;
        if (ganancia > 0) {
          resultado.innerText += `\n¡Ganaste ${ganancia} créditos en la apuesta a ${apuesta.tipo}!`;
        }
      });
  
      saldoElem.innerText = saldo;
      apuestas = [];
    }
  
    // Función para obtener el color del número
    function obtenerColor(numero) {
      const rojos = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
      if (numero === 0) return "verde";
      return rojos.includes(numero) ? "rojo" : "negro";
    }
  
    // Registrar apuestas
    apostarBtn.addEventListener("click", () => {
      let numeroIngresado = parseInt(document.getElementById("numero").value);
      let cantidadNumero = parseInt(document.getElementById("cantidadNumero").value);
      let colorSeleccionado = document.getElementById("color").value;
      let cantidadColor = parseInt(document.getElementById("cantidadColor").value);
      let paridadSeleccionada = document.getElementById("paridad").value;
      let cantidadParidad = parseInt(document.getElementById("cantidadParidad").value);
      let docenaSeleccionada = document.getElementById("docena").value;
      let cantidadDocena = parseInt(document.getElementById("cantidadDocena").value);
  
      if (!isNaN(numeroIngresado) && numeroIngresado >= 0 && numeroIngresado <= 36 && cantidadNumero > 0 && cantidadNumero <= saldo) {
        apuestas.push({ tipo: "numero", valor: numeroIngresado, cantidad: cantidadNumero });
        saldo -= cantidadNumero;
      }
      if (colorSeleccionado && cantidadColor > 0 && cantidadColor <= saldo) {
        apuestas.push({ tipo: "color", valor: colorSeleccionado, cantidad: cantidadColor });
        saldo -= cantidadColor;
      }
      if (paridadSeleccionada && cantidadParidad > 0 && cantidadParidad <= saldo) {
        apuestas.push({ tipo: "paridad", valor: paridadSeleccionada, cantidad: cantidadParidad });
        saldo -= cantidadParidad;
      }
      if (docenaSeleccionada && cantidadDocena > 0 && cantidadDocena <= saldo) {
        apuestas.push({ tipo: "docena", valor: docenaSeleccionada, cantidad: cantidadDocena });
        saldo -= cantidadDocena;
      }
      
      saldoElem.innerText = saldo;
      resultado.innerText = `Apuestas registradas. ¡Gira la ruleta!`;
    });
  
    // Listener para girar la ruleta
    girarBtn.addEventListener("click", girarRuleta);
  });
  