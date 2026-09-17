import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '../css/proveedores.css'; 
import logoImg from '../assets/logo.png';

function Proveedores() {
    const [proveedores, setProveedores] = useState([]);
    const [proveedor, setProveedor] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [estado, setEstado] = useState("Activo");
    const [editando, setEditando] = useState(null);

const API = "http://localhost:5174";

    useEffect(() => {
        cargarProveedores();
    }, []);

    const cargarProveedores = async () => {
        try {
            const respuesta = await fetch(API);
            const datos = await respuesta.json();
            setProveedores(datos);
        } catch (error) {
            Swal.fire(
                "Error",
                "No se pudo conectar con la base de datos",
                "error"
            );
        }
    };

    const guardarProveedor = async () => {
        if (!proveedor || !telefono || !correo || !ciudad) {
            Swal.fire(
                "Campos incompletos",
                "Debe completar todos los campos",
                "warning"
            );
            return;
        }

        const datos = {
            proveedor,
            telefono,
            correo,
            ciudad,
            estado
        };

        try {
            if (editando) {
                await fetch(`${API}/${editando}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(datos)
                });

                Swal.fire(
                    "Actualizado",
                    "Proveedor actualizado correctamente",
                    "success"
                );
            } else {
                const ultimoId =
                    proveedores.length > 0
                        ? Math.max(
                              ...proveedores.map((p) => Number(p.id) || 0)
                          )
                        : 0;

                await fetch(API, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: ultimoId + 1,
                        ...datos
                    })
                });

                Swal.fire(
                    "Registrado",
                    "Proveedor registrado correctamente",
                    "success"
                );
            }

            limpiarFormulario();
            cargarProveedores();

            const modal = document.getElementById("modalProveedor");

            if (modal) {
                const instancia =
                    window.bootstrap.Modal.getInstance(modal);

                if (instancia) {
                    instancia.hide();
                }
            }
        } catch (error) {
            Swal.fire(
                "Error",
                "No se pudo guardar la información",
                "error"
            );
        }
    };

    const editarProveedor = (p) => {
        setEditando(p.id);
        setProveedor(p.proveedor);
        setTelefono(p.telefono);
        setCorreo(p.correo);
        setCiudad(p.ciudad);
        setEstado(p.estado);

        const modal = new window.bootstrap.Modal(
            document.getElementById("modalProveedor")
        );

        modal.show();
    };

    const eliminarProveedor = async (id) => {
        const confirmacion = await Swal.fire({
            title: "¿Eliminar proveedor?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        });

        if (!confirmacion.isConfirmed) {
            return;
        }

        try {
            await fetch(`${API}/${id}`, {
                method: "DELETE"
            });

            Swal.fire(
                "Eliminado",
                "Proveedor eliminado correctamente",
                "success"
            );

            cargarProveedores();
        } catch (error) {
            Swal.fire(
                "Error",
                "No se pudo eliminar el proveedor",
                "error"
            );
        }
    };

    const limpiarFormulario = () => {
        setProveedor("");
        setTelefono("");
        setCorreo("");
        setCiudad("");
        setEstado("Activo");
        setEditando(null);
    };

    const cerrarSesion = () => {
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    const activos = proveedores.filter(
        (p) => p.estado === "Activo"
    ).length;

    const pendientes = proveedores.filter(
        (p) => p.estado === "Pendiente"
    ).length;

    return (
        <>
            <div className="sidebar" id="sidebar">

                <div className="sidebar-header">
                    <button
                        className="btn-hamburger"
                        id="btnToggleSidebar"
                    >
                        <img src="/img/logo.png" alt="" />
                    </button>

                    <span className="menu-title">
                        Taller Batancourt
                    </span>
                </div>

                <hr className="sidebar-divider" />

                <div className="sidebar-menu">

                    <a
                        href="/proveedores"
                        className="menu-item active"
                    >
                        <span className="menu-icon">
                            <i className="fa-solid fa-people-group"></i>
                        </span>

                        <span className="menu-text">
                            Proveedores
                        </span>
                    </a>

                    <a
                        href="/Pro_Facturas"
                        className="menu-item"
                    >
                        <span className="menu-icon">
                            <i className="fa-solid fa-receipt"></i>
                        </span>

                        <span className="menu-text">
                            Facturas
                        </span>
                    </a>

                    <a
                        href="/Pro_Calificacion"
                        className="menu-item"
                    >
                        <span className="menu-icon">
                            <i className="fa-solid fa-ranking-star"></i>
                        </span>

                        <span className="menu-text">
                            Calificación
                        </span>
                    </a>

                    <a
                        href="#"
                        className="menu-item"
                        onClick={cerrarSesion}
                    >
                        <span className="menu-icon">
                            <i className="fa-solid fa-right-from-bracket"></i>
                        </span>

                        <span className="menu-text">
                            Salir
                        </span>
                    </a>

                </div>
            </div>

            <div
                className="main-content"
                id="mainContent"
            >

                <div className="cuadros mb-4">

                    <div className="encabezado shadow d-flex align-items-center gap-3 p-3">

                        <div>
                            <h2>
                                Gestión de Proveedores
                            </h2>

                            <h5>
                                Registro y validación de proveedores
                            </h5>
                        </div>

                    </div>

                </div>

                <div className="busquedar container-fluid px-0">

                    <div className="contenedor-cards row g-3 mb-4">

                        <div className="col-md-4">

                            <div className="card p-3">

                                <div className="header d-flex justify-content-between">

                                    <span>
                                        Total proveedores
                                    </span>

                                    <i className="fa-solid fa-people-line"></i>

                                </div>

                                <h2 className="mt-2">
                                    {proveedores.length}
                                </h2>

                                <p className="mb-0 small">
                                    Proveedores Registrados
                                </p>

                            </div>

                        </div>

                        <div className="col-md-4">

                            <div className="card p-3">

                                <div className="header d-flex justify-content-between">

                                    <span>
                                        Activos
                                    </span>

                                    <i className="fa-solid fa-user-check"></i>

                                </div>

                                <h2 className="mt-2 text-success">
                                    {activos}
                                </h2>

                                <p className="mb-0 small">
                                    Proveedores Activos
                                </p>

                            </div>

                        </div>

                        <div className="col-md-4">

                            <div className="card p-3">

                                <div className="header d-flex justify-content-between">

                                    <span>
                                        En revisión
                                    </span>

                                    <i className="fa-solid fa-code-compare"></i>

                                </div>

                                <h2 className="mt-2 text-warning">
                                    {pendientes}
                                </h2>

                                <p className="mb-0 small">
                                    Pendientes De Aprobación
                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="tabla-contenedor">

                        <div className="card shadow p-3">

                            <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center px-0 mb-3">

                                <h3 className="mb-0 text-white">
                                    Listado de Proveedores
                                </h3>

                                <button
                                    className="btn btn-registrar"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modalProveedor"
                                    onClick={limpiarFormulario}
                                >
                                    <i className="fa-solid fa-plus"></i>
                                    {" "}Registrar Proveedor
                                </button>

                            </div>

                            <div className="table-responsive">

                                <table
                                    id="tablaProveedores"
                                    className="table table-hover nowrap w-100"
                                >

                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Proveedor</th>
                                            <th>Teléfono</th>
                                            <th>Correo</th>
                                            <th>Ciudad</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {proveedores.map((p) => (

                                            <tr key={p.id}>

                                                <td>
                                                    {p.id}
                                                </td>

                                                <td>
                                                    {p.proveedor}
                                                </td>

                                                <td>
                                                    {p.telefono}
                                                </td>

                                                <td>
                                                    {p.correo}
                                                </td>

                                                <td>
                                                    {p.ciudad}
                                                </td>

                                                <td>
                                                    <span
                                                        className={
                                                            p.estado === "Activo"
                                                                ? "badge bg-success"
                                                                : p.estado === "Pendiente"
                                                                ? "badge bg-warning text-dark"
                                                                : "badge bg-danger"
                                                        }
                                                    >
                                                        {p.estado}
                                                    </span>
                                                </td>

                                                <td>

                                                    <button
                                                        className="btn btn-sm btn-warning me-2"
                                                        onClick={() =>
                                                            editarProveedor(p)
                                                        }
                                                    >
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() =>
                                                            eliminarProveedor(
                                                                p.id
                                                            )
                                                        }
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <div
                className="modal fade"
                id="modalProveedor"
                tabIndex="-1"
                aria-hidden="true"
            >

                <div className="modal-dialog modal-dialog-centered">

                    <div className="modal-content text-bg-dark border-secondary">

                        <div className="modal-header">

                            <h5
                                className="modal-title"
                            >
                                {editando
                                    ? "Editar Proveedor"
                                    : "Registrar Proveedor"}
                            </h5>

                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                data-bs-dismiss="modal"
                                onClick={limpiarFormulario}
                            ></button>

                        </div>

                        <div className="modal-body">

                            <form>

                                <div className="mb-2">

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Proveedor"
                                        value={proveedor}
                                        onChange={(e) =>
                                            setProveedor(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>

                                <div className="mb-2">

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Teléfono"
                                        value={telefono}
                                        onChange={(e) =>
                                            setTelefono(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>

                                <div className="mb-2">

                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Correo"
                                        value={correo}
                                        onChange={(e) =>
                                            setCorreo(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>

                                <div className="mb-2">

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ciudad"
                                        value={ciudad}
                                        onChange={(e) =>
                                            setCiudad(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>

                                <div className="mb-2">

                                    <select
                                        className="form-select"
                                        value={estado}
                                        onChange={(e) =>
                                            setEstado(
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="Activo">
                                            Activo
                                        </option>

                                        <option value="Pendiente">
                                            Pendiente
                                        </option>

                                        <option value="Inactivo">
                                            Inactivo
                                        </option>

                                    </select>

                                </div>

                            </form>

                        </div>

                        <div className="modal-footer">

                            <button
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={limpiarFormulario}
                            >
                                Cancelar
                            </button>

                            <button
                                className="btn btn-registrar"
                                onClick={guardarProveedor}
                            >
                                Guardar
                            </button>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}

export default Proveedores;

