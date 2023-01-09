import React, { Component } from "react";
import '../css/Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import md5 from 'md5';
import Cookies from 'universal-cookie';
import logo from '../images/LogotipoGannaMas-3448807.png';
import '../css/Admin.css';
import imgOndas from '../images/pincelondas.jpg';

//const baseUrl = "http://localhost:3002/api/usuarios";
const baseUrl = "https://apisimulador.gannamas.mx/usuarios_get.php";
const cookies = new Cookies();

class Login extends Component {

    state = {
        form: {
            username: '',
            password: ''
        }
    }

    handleChange = async e => {
        await this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });

    }
    iniciarSesion = async () => {
        await axios.get(baseUrl, { params: { username: this.state.form.username, password: md5(this.state.form.password) } })
            .then(response => {
                console.log(response);
                return response.data;
            })
            .then(response => {
                console.log(response);
                if (response !== null) {
                    var respuesta = response;
                    cookies.set('id', respuesta.id, { path: "/" });
                    cookies.set('name', respuesta.name, { path: "/" });
                    cookies.set('username', respuesta.username, { path: "/" });
                    alert(`Bienvenido ${respuesta.name}`);
                    window.location.href = "./adminform";
                } else {
                    alert('El usuario o la contraseña no son correctos');
                }
            })
            .catch(error => {
                console.log(error);
            })

    }

    componentDidMount() {
        if (cookies.get('username')) {
            window.location.href = "./Adminform";
        }
    }

    render() {
        return (
            <div>
                <div className="row">
                    <img src={imgOndas} className="ondas"  alt="gannamassimulador"></img>
                </div>
                <div className="row text-center p-4 simulador">
                    <h1 className="title">Acceso administrador</h1>
                </div>
                <div className="row text-center p-4 divPurple">
                    <div className="col-md-4"></div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <label className="textpurpleLight">Usuario: </label>
                            <br />
                            <input
                                type="text"
                                className="form-control"
                                name="username"
                                onChange={this.handleChange}
                            />
                            <br />
                            <label className="textpurpleLight">Contraseña: </label>
                            <br />
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                onChange={this.handleChange}
                            />
                            <br />
                            <button className="btn btn-primary" onClick={() => this.iniciarSesion()}>Iniciar Sesión</button>
                        </div>

                    </div>
                    <div className="col-md-4"></div>
                </div>

                <div className="row text-center  ms-5 me-5">
                    <div className="col-md-12">
                        <img src={logo} className="logo" alt="logogannamas"></img>
                    </div>
                </div>
            </div>

        )
    }
}

export default Login;