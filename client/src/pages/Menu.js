import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';

const cookies = new Cookies();

class Menu extends Component {
    cerrarSesion=()=>{
        cookies.remove('id', {path: "/"});
        cookies.remove('name', {path: "/"});
        cookies.remove('username', {path: "/"});
        window.location.href='./login';
    }

    componentDidMount() {
        if(!cookies.get('username')){
            window.location.href="./login";
        }
    }

    render() {
        // console.log('id: '+ cookies.get('id'));
        // console.log('name: '+cookies.get('name'));
        // console.log('username: '+cookies.get('username'));
        return (
            <div className='row simulador pe-5 ps-5' >
                <div className='col-10'>
                </div>
                <div className='col-2 mt-2'>
                    <button className="btn btn-secondary" onClick={() => this.cerrarSesion()}>Cerrar Sesión</button>
                </div>
                
            </div>

        );
    }
}

export default Menu;