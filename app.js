let inventario = JSON.parse(localStorage.getItem("inventario")) || [];
let ganancias = parseFloat(localStorage.getItem("ganancias")) || 0;
let recuperado = parseFloat(localStorage.getItem("recuperado")) || 0;

document.getElementById("ganancias").innerText = ganancias.toFixed(2);
document.getElementById("recuperado").innerText = recuperado.toFixed(2);

function guardarDatos() {
    localStorage.setItem("inventario", JSON.stringify(inventario));
    localStorage.setItem("ganancias", ganancias);
    localStorage.setItem("recuperado", recuperado);
}

function agregarArticulo() {
    const nombre = document.getElementById("nombre").value.trim();
    const costo = parseFloat(document.getElementById("costo").value);
    const precio = parseFloat(document.getElementById("precio").value);

    if (!nombre || isNaN(costo) || isNaN(precio)) {
        alert("Completa todos los campos correctamente.");
        return;
    }

    const articulo = { nombre, costo, precio, vendido: false };
    inventario.push(articulo);
    guardarDatos();
    mostrarInventario();
    document.getElementById("nombre").value = "";
    document.getElementById("costo").value = "";
    document.getElementById("precio").value = "";
}

function mostrarInventario() {
    const tbody = document.querySelector("#inventario tbody");
    tbody.innerHTML = "";

    inventario.forEach((item, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${item.nombre}</td>
            <td>$${item.costo.toFixed(2)}</td>
            <td>$${item.precio.toFixed(2)}</td>
            <td class="${item.vendido ? 'vendido' : ''}">${item.vendido ? 'Vendido' : 'Disponible'}</td>
            <td>${item.vendido ? '' : `<button onclick="vender(${index})">Vender</button>`}</td>
        `;
        tbody.appendChild(fila);
    });
}

function vender(index) {
    const item = inventario[index];
    if (!item.vendido) {
        item.vendido = true;
        ganancias += item.precio - item.costo;
        recuperado += item.costo;
        guardarDatos();
        mostrarInventario();
        document.getElementById("ganancias").innerText = ganancias.toFixed(2);
        document.getElementById("recuperado").innerText = recuperado.toFixed(2);
    }
}

function exportarCSV() {
    let csv = "Nombre,Costo,Precio,Vendido\\n";
    inventario.forEach(item => {
        csv += `${item.nombre},${item.costo},${item.precio},${item.vendido}\\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "inventario_iconic.csv";
    a.click();
    URL.revokeObjectURL(url);
}

function importarCSV() {
    const archivo = document.getElementById("importarArchivo").files[0];
    if (!archivo) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const lineas = e.target.result.split("\\n").slice(1);
        inventario = [];
        ganancias = 0;
        recuperado = 0;
        lineas.forEach(linea => {
            const [nombre, costo, precio, vendido] = linea.split(",");
            if (nombre && costo && precio) {
                const item = {
                    nombre: nombre.trim(),
                    costo: parseFloat(costo),
                    precio: parseFloat(precio),
                    vendido: vendido.trim() === "true"
                };
                inventario.push(item);
                if (item.vendido) {
                    ganancias += item.precio - item.costo;
                    recuperado += item.costo;
                }
            }
        });
        guardarDatos();
        mostrarInventario();
        document.getElementById("ganancias").innerText = ganancias.toFixed(2);
        document.getElementById("recuperado").innerText = recuperado.toFixed(2);
    };
    reader.readAsText(archivo);
}

mostrarInventario();
