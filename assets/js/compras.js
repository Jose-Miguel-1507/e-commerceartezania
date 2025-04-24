let cantidad = 1;

function cambiarCantidad(valor) {
  cantidad += valor;
  if (cantidad < 1) cantidad = 1;
  document.getElementById("cantidad").innerText = cantidad;
  actualizarPrecio();
}

function actualizarPrecio() {
  const precioUnitario = 40000;
  const envio = 1000;
  const iva = Math.round((precioUnitario * cantidad) * 0.13);
  const total = precioUnitario * cantidad + envio + iva;

  document.getElementById("precio-producto").innerText = `$${precioUnitario * cantidad}`;
  document.getElementById("total").innerText = `$${total}`;
}



// Ejecutar al inicio
actualizarPrecio();
