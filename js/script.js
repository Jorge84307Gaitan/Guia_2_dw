document.addEventListener('DOMContentLoaded', () => {
    const btnBonsais = document.getElementById('btnBonsais');
    const btnProductos = document.getElementById('btnProductos');
    const seccionBonsais = document.getElementById('bonsais');
    const listaBonsais = document.getElementById('listaBonsais');
    const tituloSeccion = document.getElementById('tituloSeccion'); 

    const productos = [
        {
            nombre: "Junípero Nana",
            imagen: "img/JuniperoAdulto.jpeg",
            descripcion: "Junípero con una edad aproximada de 7 años, se recomienda podarlo para poder mantener su forma.",
            precio: 80000 
        },
        {
            nombre: "Bonsái de Junípero Joven",
            imagen: "img/JuniperoJoven.jpeg",
            descripcion: "Junípero joven de aproximadamente 2 años. Necesita luz solar abundante.",
            precio: 45000
        },
        {
            nombre: "Portulacaria Afra",
            imagen: "img/PortulacariaAfra.jpeg",
            descripcion: "Ideal para quienes buscan un bonsái tradicional fácil de cuidar. Edad: 2 años.",
            precio: 50000
        }
    ];

    const fertilizante = {
        nombre: "Fertilizante Orgánico",
        imagen: "img/fertilizante.jpeg",
        descripcion: "Fertilizante natural para bonsáis que mejora el crecimiento y la salud de tus plantas.",
        precio: 15000
    };

    const otrasPlantas = {
        nombre: "Lirio Amazónico",
        imagen: "img/LirioAmazonico.jpeg",
        descripcion: "Planta acuática hermosa y fácil de cuidar, perfecta para ambientes húmedos y acuarios.",
        precio: 35000
    };

    const carrito = [];

    function mostrarProductos() {
        listaBonsais.innerHTML = '';
        productos.forEach((producto, index) => {
            const div = document.createElement('div');
            div.classList.add('bonsai-item');
            div.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}" />
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <p><strong>Precio: $${producto.precio.toLocaleString()}</strong></p>
                <button class="btn-comprar" data-index="${index}">Comprar</button>
            `;
            listaBonsais.appendChild(div);
        });

        const botonesComprar = document.querySelectorAll('.btn-comprar');
        botonesComprar.forEach(boton => {
            boton.addEventListener('click', agregarAlCarrito);
        });
    }

    function agregarAlCarrito(e) {
        const index = e.target.getAttribute('data-index');

        let productoSeleccionado;

        if (index === "-1") {
            productoSeleccionado = fertilizante;
        } else {
            productoSeleccionado = productos[index];
        }

        carrito.push(productoSeleccionado);
        actualizarCantidadCarrito();

        Swal.fire({
            icon: 'success',
            title: '¡Agregado al carrito!',
            text: `Has agregado: ${productoSeleccionado.nombre}`,
            showConfirmButton: false,
            timer: 1800,
            timerProgressBar: true,
            position: 'top-end',
            toast: true,
            background: '#d4edda',
            color: '#155724',
            iconColor: '#28a745',
            showClass: { popup: 'animate__animated animate__fadeInRight' },
            hideClass: { popup: 'animate__animated animate__fadeOutRight' }
        });
    }

    function actualizarCantidadCarrito() {
        const cantidadSpan = document.getElementById('cantidadCarrito');
        cantidadSpan.textContent = carrito.length;
    }

    function agruparCarrito() {
        const agrupado = {};
        carrito.forEach(producto => {
            if (agrupado[producto.nombre]) {
                agrupado[producto.nombre].cantidad++;
            } else {
                agrupado[producto.nombre] = {...producto, cantidad: 1};
            }
        });
        return Object.values(agrupado);
    }

    function eliminarProducto(nombre) {
        const index = carrito.findIndex(p => p.nombre === nombre);
        if (index > -1) {
            carrito.splice(index, 1);
            actualizarCantidadCarrito();
            mostrarCarrito();
        }
    }

    function mostrarCarrito() {
        if (carrito.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'El carrito está vacío',
                text: 'Agrega productos para poder verlos aquí.'
            });
            return;
        }

        const agrupado = agruparCarrito();

        let htmlProductos = '';
        agrupado.forEach(producto => {
            htmlProductos += `
                <p>
                    <strong>${producto.nombre}</strong> - Cantidad: ${producto.cantidad} - Precio unitario: $${producto.precio.toLocaleString()}
                    <button class="swal2-confirm btn-eliminar" data-nombre="${producto.nombre}" style="margin-left:10px; background:#dc3545; border:none; color:white; padding:3px 7px; border-radius:3px; cursor:pointer;">
                        Eliminar 1
                    </button>
                </p>
            `;
        });

        const total = agrupado.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

        htmlProductos += `
            <hr />
            <p><strong>Total: $${total.toLocaleString()}</strong></p>
            <button id="btnConfirmarCompra" class="swal2-confirm swal2-styled" style="margin-top:10px;">
                Confirmar compra
            </button>
        `;

        Swal.fire({
            title: 'Productos en tu carrito',
            html: htmlProductos,
            showConfirmButton: false,
            width: '500px',
            padding: '1.5em',
            didOpen: () => {
                const btnsEliminar = Swal.getHtmlContainer().querySelectorAll('.btn-eliminar');
                btnsEliminar.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const nombre = btn.getAttribute('data-nombre');
                        eliminarProducto(nombre);
                    });
                });

                const btnConfirmar = Swal.getHtmlContainer().querySelector('#btnConfirmarCompra');
                btnConfirmar.addEventListener('click', mostrarFormularioCompra);
            }
        });
    }

    function mostrarFormularioCompra() {
        Swal.fire({
            title: 'Formulario de compra',
            html: `
                <input id="nombreCliente" class="swal2-input" placeholder="Nombre completo" />
                <input id="direccionEnvio" class="swal2-input" placeholder="Dirección de envío" />
                <select id="metodoPago" class="swal2-select">
                    <option value="" disabled selected>Método de pago</option>
                    <option value="tarjeta">Tarjeta de crédito</option>
                    <option value="efectivo">Efectivo contra entrega</option>
                </select>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Enviar',
            preConfirm: () => {
                const nombre = Swal.getPopup().querySelector('#nombreCliente').value.trim();
                const direccion = Swal.getPopup().querySelector('#direccionEnvio').value.trim();
                const metodo = Swal.getPopup().querySelector('#metodoPago').value;

                if (!nombre || !direccion || !metodo) {
                    Swal.showValidationMessage('Por favor, completa todos los campos');
                    return false;
                }

                return { nombre, direccion, metodo };
            }
        }).then(result => {
            if (result.isConfirmed) {
                carrito.length = 0; 
                actualizarCantidadCarrito();

                Swal.fire({
                    icon: 'success',
                    title: 'Compra confirmada',
                    html: `
                        <p>Gracias por tu compra, <strong>${result.value.nombre}</strong>.</p>
                        <p>Enviaremos tus productos a: <strong>${result.value.direccion}</strong>.</p>
                        <p>Método de pago: <strong>${result.value.metodo}</strong>.</p>
                    `
                });
            }
        });
    }

    const carritoBtn = document.getElementById('carrito');
    if (carritoBtn) {
        carritoBtn.addEventListener('click', mostrarCarrito);
    }

    btnBonsais.addEventListener('click', () => {
        tituloSeccion.textContent = 'Bonsáis Disponibles';
        mostrarProductos();
        seccionBonsais.style.display = 'block';
        seccionBonsais.scrollIntoView({ behavior: 'smooth' });
    });

    btnProductos.addEventListener('click', () => {
        tituloSeccion.textContent = 'Fertilizantes'; 
        listaBonsais.innerHTML = `
            <div class="bonsai-item">
                <img src="${fertilizante.imagen}" alt="${fertilizante.nombre}" />
                <h3>${fertilizante.nombre}</h3>
                <p>${fertilizante.descripcion}</p>
                <p><strong>Precio: $${fertilizante.precio.toLocaleString()}</strong></p>
                <button class="btn-comprar" data-index="-1">Comprar</button>
            </div>
        `;

        seccionBonsais.style.display = 'block';
        seccionBonsais.scrollIntoView({ behavior: 'smooth' });

        const botonComprar = listaBonsais.querySelector('.btn-comprar');
        botonComprar.addEventListener('click', agregarAlCarrito);
    });

    const btnOtrasPlantas = document.getElementById('btnOtrasPlantas');
    if (btnOtrasPlantas) {
        btnOtrasPlantas.addEventListener('click', () => {
            tituloSeccion.textContent = 'Otras Plantas';
            listaBonsais.innerHTML = `
                <div class="bonsai-item">
                    <img src="${otrasPlantas.imagen}" alt="${otrasPlantas.nombre}" />
                    <h3>${otrasPlantas.nombre}</h3>
                    <p>${otrasPlantas.descripcion}</p>
                    <p><strong>Precio: $${otrasPlantas.precio.toLocaleString()}</strong></p>
                    <button class="btn-comprar" data-index="otras">Comprar</button>
                </div>
            `;
            seccionBonsais.style.display = 'block';
            seccionBonsais.scrollIntoView({ behavior: 'smooth' });

            const botonComprar = listaBonsais.querySelector('.btn-comprar');
            botonComprar.addEventListener('click', () => {
                carrito.push(otrasPlantas);
                actualizarCantidadCarrito();

                Swal.fire({
                    icon: 'success',
                    title: '¡Agregado al carrito!',
                    text: `Has agregado: ${otrasPlantas.nombre}`,
                    showConfirmButton: false,
                    timer: 1800,
                    position: 'top-end',
                    toast: true,
                    background: '#d4edda',
                    color: '#155724',
                    iconColor: '#28a745',
                    showClass: { popup: 'animate__animated animate__fadeInRight' },
                    hideClass: { popup: 'animate__animated animate__fadeOutRight' }
                });
            });
        });
    }

    actualizarCantidadCarrito();
});
