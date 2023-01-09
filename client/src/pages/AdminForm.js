
import React, { useState, useEffect } from "react";
import '../css/Admin.css';
import Axios from "axios";
import Menu from "./Menu"
import logo from '../images/LogotipoGannaMas-3448807.png';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import imgOndas from '../images/pincelondas.jpg';

function AdminForm() {
  const [details, setDetails] = useState({
    txtPlanClasico: "", txtPlanClasicoBeneficio: "", txtPlanClasicoCondiciones: "",
    txtPlanPro: "", txtPlanProBeneficio: "", txtPlanProCondiciones: "",
    txtPlanMaster: "", txtPlanMasterBeneficio: "", txtPlanMasterCondiciones: "",
    txtVigencia: "", txtCondiciones: "",
    txtAmount1: "", txtAmount2: "", txtAmount3: "", txtAmount4: "", txtAmount5: "",
    txtAmountDonate : ""
  });

  const [refresh, setRefresh] = useState(true);
  const submitHandler = e => {
    e.preventDefault();

    console.log(details);
    let screenconfigParam = `{"txtPlanClasico": {"porcentajeFijo": "${details.txtPlanClasico}", 
                              "bonificacion" : "${details.txtPlanClasicoBeneficio}", 
                              "condiciones": "${details.txtPlanClasicoCondiciones}", "isVisible": "true"},
                              "txtPlanPro": {"porcentajeFijo": "${details.txtPlanPro}", 
                              "bonificacion" : "${details.txtPlanProBeneficio}", 
                              "condiciones": "${details.txtPlanProCondiciones}", "isVisible": "true"},
                              "txtPlanMaster": {"porcentajeFijo": "${details.txtPlanMaster}", 
                              "bonificacion" : "${details.txtPlanMasterBeneficio}", 
                              "condiciones": "${details.txtPlanMasterCondiciones}", "isVisible": "true"},
                              "txtCondiciones": {"value": "${details.txtCondiciones}", "isVisible": "true"}, 
                              "txtVigencia": {"value": "${details.txtVigencia}", "isVisible": "true"},
                              "txtAmount1": {"value": "${details.txtAmount1}", "isVisible": "false"},
                              "txtAmount2": {"value": "${details.txtAmount2}", "isVisible": "false"},
                              "txtAmount3": {"value": "${details.txtAmount3}", "isVisible": "false"},
                              "txtAmount4": {"value": "${details.txtAmount4}", "isVisible": "false"},
                              "txtAmount5": {"value": "${details.txtAmount5}", "isVisible": "false"},
                              "txtAmountDonate": {"value": "${details.txtAmountDonate}", "isVisible": "true"}
                              }`;
    Axios.post("https://apisimulador.gannamas.mx/simuladorui_update.php", {
      screenconfig: screenconfigParam
    }).then(response => {
      console.log(response);
      if(typeof response.data !== "string"){
        if(response.data.status === false){
          alert("Error Almacenando los datos: " + response.data.message);
        }else{
          alert("Cambios guardados correctamente!!"); 
        }
      }else{
        alert("Error guardados los datos, por favor contacte al administrador" + response.data );  
      }
    }).catch(error => {
      alert("Error guardados los datos, por favor contacte al administrador");
      console.log(error);
    });
    

  }

  useEffect(() => {
    getData();
  }, [refresh])

  const getData = () =>{ 
    let options = {
      method: 'GET',
      url: `https://apisimulador.gannamas.mx/simuladorui_get.php`,
      responseType: 'json',
      charset: 'utf-8',
      responseEncoding: 'utf-8'
  };

    Axios.request(options).then((response) => {
      let screenconfigParam = JSON.parse(response.data);
      console.log(screenconfigParam);
      setDetails({
        txtPlanClasico: screenconfigParam['txtPlanClasico']['porcentajeFijo'],
        txtPlanClasicoBeneficio: screenconfigParam['txtPlanClasico']['bonificacion'],
        txtPlanClasicoCondiciones: screenconfigParam['txtPlanClasico']['condiciones'],
        txtPlanPro: screenconfigParam['txtPlanPro']['porcentajeFijo'],
        txtPlanProBeneficio: screenconfigParam['txtPlanPro']['bonificacion'],
        txtPlanProCondiciones: screenconfigParam['txtPlanPro']['condiciones'],
        txtPlanMaster: screenconfigParam['txtPlanMaster']['porcentajeFijo'],
        txtPlanMasterBeneficio: screenconfigParam['txtPlanMaster']['bonificacion'],
        txtPlanMasterCondiciones: screenconfigParam['txtPlanMaster']['condiciones'],
        txtVigencia: screenconfigParam['txtVigencia']['value'],
        txtCondiciones: screenconfigParam['txtCondiciones']['value'],
        txtAmount1: screenconfigParam['txtAmount1']['value'],
        txtAmount2: screenconfigParam['txtAmount2']['value'],
        txtAmount3: screenconfigParam['txtAmount3']['value'],
        txtAmount4: screenconfigParam['txtAmount4']['value'],
        txtAmount5: screenconfigParam['txtAmount5']['value'],
        txtAmountDonate: screenconfigParam['txtAmountDonate']['value'],
      });
    })
  }

  return (
    <div className="Admin">
      <div className="row">
                <img src={imgOndas} className="ondas" alt="gannamassimulador"></img>
      </div>
      <Menu></Menu>
      <div className="row text-center p-3 simulador">
        <h1 className="title">Aministrador</h1>
      </div>
      <div className="row ps-5 pe-5 pb-5">
        <div className="col-md-12 mb-2 text-center divPurpleLight">
          <h4>Planes</h4>
        </div>
        <div className="col-md-2 divClasico p-2">
          <label className="divClasico">Plan Clásico</label>
        </div>
        <div className="col-md-3 divClasico p-2">
          <TextField className="form-control" type="number" name="txtPlanClasico" id="txtPlanClasico"
            onChange={e => setDetails({ ...details, txtPlanClasico: e.target.value })}
            value={details.txtPlanClasico}
            sx={{ m: 1, width: '20ch' }}
            variant="standard"
            label="Porcentaje Base"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }} />
        </div>
        <div className="col-md-3 divClasico p-2">
          <TextField className="form-control" type="number" name="txtPlanClasicoBeneficio" id="txtPlanClasicoBeneficio"
            onChange={e => setDetails({ ...details, txtPlanClasicoBeneficio: e.target.value })}
            value={details.txtPlanClasicoBeneficio}
            sx={{ m: 1, width: '20ch' }}
            variant="standard"
            label="Bonificación"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }} />
        </div>
        <div className="col-md-4 divClasico p-2">
          <TextField className="form-control" type="text" name="txtPlanClasicoCondiciones" id="txtPlanClasicoCondiciones"
            onChange={e => setDetails({ ...details, txtPlanClasicoCondiciones: e.target.value })}
            value={details.txtPlanClasicoCondiciones} 
            label="Condiciones"
            helperText="Utilize ## si desea agregar saltos de linea"
            multiline
            rows={2}
            size="small"/>
        </div>
        <div className="col-md-2 divPro p-2">
          <label className="divPro">Plan Pro</label>
        </div>
        <div className="col-md-3 divPro p-2">
          <TextField className="form-control" type="number" name="txtPlanPro" id="txtPlanPro"
            onChange={e => setDetails({ ...details, txtPlanPro: e.target.value })}
            value={details.txtPlanPro} 
            sx={{ m: 1, width: '20ch' }}
            variant="standard"
            label="Porcentaje Base"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}/>
        </div>
        <div className="col-md-3 divPro p-2">
          <TextField className="form-control" type="number" name="txtPlanProBeneficio" id="txtPlanProBeneficio"
            onChange={e => setDetails({ ...details, txtPlanProBeneficio: e.target.value })}
            value={details.txtPlanProBeneficio}
            sx={{ m: 1, width: '20ch' }}
            variant="standard"
            label="Bonificación"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }} />
        </div>
        <div className="col-md-4  divPro p-2">
          <TextField className="form-control" type="text" name="txtPlanProCondiciones" id="txtPlanProCondiciones"
            onChange={e => setDetails({ ...details, txtPlanProCondiciones: e.target.value })}
            value={details.txtPlanProCondiciones} 
            label="Condiciones"
            helperText="Utilize ## si desea agregar saltos de linea"
            multiline
            size="small"
            rows={2}/>
        </div>
        <div className="col-md-2 divClasico p-2">
          <label className="divMaster">Plan Master</label>
        </div>
        <div className="col-md-3 divMaster p-2">
          <TextField className="form-control" type="number" name="txtPlanMaster" id="txtPlanMaster"
            onChange={e => setDetails({ ...details, txtPlanMaster: e.target.value })}
            value={details.txtPlanMaster} 
            sx={{ m: 1, width: '20ch' }}
            variant="standard"
            label="Porcentaje Base"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}/>
        </div>
        <div className="col-md-3 divMaster p-2">
          <TextField className="form-control" type="number" name="txtPlanMasterBeneficio" id="txtPlanMasterBeneficio"
            onChange={e => setDetails({ ...details, txtPlanMasterBeneficio: e.target.value })}
            value={details.txtPlanMasterBeneficio} 
            sx={{ m: 1, width: '20ch' }}
            variant="standard"
            label="Bonificación"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}/>
        </div>
        <div className="col-md-4 divMaster p-2">
          <TextField className="form-control" type="text" name="txtPlanMasterCondiciones" id="txtPlanMasterCondiciones"
            onChange={e => setDetails({ ...details, txtPlanMasterCondiciones: e.target.value })}
            value={details.txtPlanMasterCondiciones} 
            label="Condiciones"
            helperText="Utilize ## si desea agregar saltos de linea"
            multiline
            size="small"
            rows={2}/>
        </div>
        <div className="col-md-12 mb-2 text-center mt-3 divPurpleLight">
          <h4>Porcentaje / Escala de montos</h4>
        </div>
        <div className="col-md-4 divRangos">
          <TextField className="form-control" type="number" name="txtAmount1" id="txtAmount1"
            onChange={e => setDetails({ ...details, txtAmount1: e.target.value })}
            value={details.txtAmount1} 
            sx={{ m: 1, width: '20ch' }}
            variant="standard"
            label="Monto base $0 a $49,999"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}/>
        </div>
        <div className="col-md-4 divRangos">
          <TextField className="form-control" type="number" name="txtAmount2" id="txtAmount2"
            onChange={e => setDetails({ ...details, txtAmount2: e.target.value })}
            value={details.txtAmount2} 
            sx={{ m: 1, width: '20ch' }}
            variant="standard"
            label="Monto base $50,000 a $149,999"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}/>
        </div>
        <div className="col-md-4 divRangos">
          <TextField className="form-control" type="number" name="txtAmount3" id="txtAmount3"
            onChange={e => setDetails({ ...details, txtAmount3: e.target.value })}
            value={details.txtAmount3}
            sx={{ m: 1, width: '20ch' }}
            variant="standard"
            label="Monto base $150,000 a $349,999"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }} />
        </div>
        <div className="col-md-4 divRangos">
          <TextField className="form-control" type="number" name="txtAmount4" id="txtAmount4"
            onChange={e => setDetails({ ...details, txtAmount4: e.target.value })}
            value={details.txtAmount4} 
            sx={{ m: 1, width: '20ch' }}
            variant="standard"
            label="Monto base $350,000 a $1,999,999"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}/>
        </div>
        <div className="col-md-4 divRangos">
          <TextField className="form-control" type="number" name="txtAmount5" id="txtAmount5"
            onChange={e => setDetails({ ...details, txtAmount5: e.target.value })}
            value={details.txtAmount5} 
            sx={{ m: 1, width: '20ch' }}
            variant="standard"
            label="Monto base $2,000,000 o más"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}/>
        </div>
        <div className="col-md-4 divPorcentaje">
          <TextField className="form-control" type="text" name="txtAmountDonate" id="txtAmountDonate"
            onChange={e => setDetails({ ...details, txtAmountDonate: e.target.value })}
            value={details.txtAmountDonate} 
            sx={{ m: 1, width: '20ch' }}
            variant="standard"
            label="Porcentaje dona Gananna +"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}/>
        </div>
        <div className="col-md-12 mb-2 text-center mt-3 divPurpleLight">
          <h4>Notas Comentarios</h4>
        </div>
        <div className="col-md-6">
          <TextField className="form-control" type="text" name="txtVigencia" id="txtVigencia"
            onChange={e => setDetails({ ...details, txtVigencia: e.target.value })}
            value={details.txtVigencia} 
            label="Vigencia"
            helperText="Utilize ## si desea agregar saltos de linea"
            multiline
            rows={3}/>
        </div>
        <div className="col-md-6">
          <TextField className="form-control" type="text" name="txtCondiciones" id="txtCondiciones"
            onChange={e => setDetails({ ...details, txtCondiciones: e.target.value })}
            value={details.txtCondiciones} 
            label="Condiciones"
            helperText="Utilize ## si desea agregar saltos de linea"
            multiline
            rows={3}/>
        </div>
        <div className="mt-4 text-center">
          <button className="btn btn-primary" onClick={submitHandler}>Guardar</button>
        </div>

      </div>
      <div className="row text-center  ps-5 pe-5">
        <div className="col-md-12">
          <img src={logo} className="logo" alt="logogannamas"></img>
        </div>
      </div>

    </div>
  );
}

export default AdminForm;
