
import React, { useState, useEffect } from "react";
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Barchart from "./Barchart";
import Select from "react-select";
import CurrencyInput from 'react-currency-input-field';
import Slider from '@mui/material/Slider';
import '../css/Simulador.css';
import {FloatingWhatsApp} from "react-floating-whatsapp";
import logo from '../images/LogotipoGannaMas-3448807.png';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsappIcon from '@mui/icons-material/WhatsApp';
import imginvierte from '../images/gannainvierte.jpg';
import imgOndas from '../images/pincelondas.jpg';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { purple } from '@mui/material/colors';
import { height } from "@mui/system";


function Simulador() {

    const [details, setDetails] = useState({
        txtPlanClasico: "", txtPlanClasicoBeneficio: "", txtPlanClasicoCondiciones: "",
        txtPlanPro: "", txtPlanProBeneficio: "", txtPlanProCondiciones: "", 
        txtPlanMaster: "", txtPlanMasterBeneficio: "", txtPlanMasterCondiciones: "", 
        txtVigencia: "", txtCondiciones: "",
        txtAmount1: "", txtAmount2: "", txtAmount3: "", txtAmount4: "", txtAmount5: "",
        txtAmountDonate : ""
      });
    
     ///DropDown PLAN
    const planlist = [
        {
            value:0,
            label:"Plan Clásico",
            condiciones:details.txtPlanClasicoCondiciones,
            beneficio: details.txtPlanClasicoBeneficio,
            porcentajeFijo: details.txtPlanClasico
        },
        {
            value:1,
            label:"Plan Pro",
            condiciones:details.txtPlanProCondiciones,
            beneficio: details.txtPlanProBeneficio,
            porcentajeFijo: details.txtPlanPro
        },
        {
            value:2,
            label:"Plan Master",
            condiciones:details.txtPlanMasterCondiciones,
            beneficio: details.txtPlanMasterBeneficio,
            porcentajeFijo: details.txtPlanMaster
        }
    ];
    const [planDetails, setPlandetails] = useState(planlist.condiciones);
    const [planValue, setplanValue] = useState(planlist.value);
    
    const planHandler = e =>{
        setPlandetails(e.condiciones);
        setplanValue(e.value);
    }
    ////////////////////

    ///INPUT FIELD CURRENCY
    const [errorMessage, setErrorMessage] = useState('');
    const [className, setClassName] = useState('');
    const [rawValue, setRawValue] = useState ('0');

    const validateValue = value => {
        //console.log(value);
        const rawValue = value === undefined ? 'undefined' : value;
        setRawValue(rawValue || ' ');

        if (!value) {
            setClassName('');
        } else if (Number.isNaN(Number(value))) {
            setErrorMessage('Por favor inserte una cantidad válida');
            setClassName('is-invalid');
        } 
        else if (Number(value)<50000) {
            setErrorMessage('Se recomienda un monto mínimo de $50,000');
            setClassName('is-invalid');
        }
        else {
            setErrorMessage('');
            setClassName('is-valid');
        }
    };
    ////////////////////

    ///INPUT FIELD SLIDER
    const [months, setMonths] = useState("9");
    const monthsHandler = e =>{
        setMonths(e.target.value);
    }
    function valuetext(value) {
        return `${value}`;
      }
    ////////////////////

    //LABELS AND CALC
    const [results, setResults] = useState({
        rendimiento: "0", bonificacion: "0", rendimientoTotal: "0",
        porcentajeRendimiento : "0", porcentajeRendimientoMensual: "0",
        ayuda : "0"
      });
    
    const simular = () =>{
        
        const porcentajeFijo = planValue === undefined ? planlist[0].porcentajeFijo: planlist[planValue].porcentajeFijo;
        const beneficio = planValue === undefined ? planlist[0].beneficio: planlist[planValue].beneficio;
        const monto = rawValue === undefined ? 0 : rawValue;

        let result = multipleCalc(1, porcentajeFijo, beneficio, monto);
        let rendimiento = result[0][0]; 
        let bonificacion= result[0][1]; 
        let rendimientoTotal= result[0][2]; 
        let porcentajeRendimiento = result[0][3]; 
        let porcentajeRendimientoMensual = result[0][4];  
        let ayuda = result[0][5]; 


        setResults({
            rendimiento: Number.isNaN(rendimiento) ? 0: roundToTwo(rendimiento).toLocaleString(), 
            bonificacion: Number.isNaN(bonificacion) ? 0: roundToTwo(bonificacion).toLocaleString(), 
            rendimientoTotal: Number.isNaN(rendimientoTotal) ? 0: roundToTwo(rendimientoTotal).toLocaleString(),
            porcentajeRendimiento : Number.isNaN(porcentajeRendimiento) ? 0: roundToTwo(porcentajeRendimiento).toLocaleString(), 
            porcentajeRendimientoMensual: Number.isNaN(porcentajeRendimientoMensual) ? 0: roundToTwo(porcentajeRendimientoMensual).toLocaleString(),
            ayuda : Number.isNaN(ayuda) ? 0: roundToTwo(ayuda).toLocaleString()
        });

        if(rendimiento===0 || Number.isNaN(rendimiento)){
            setDataBarra({
                meses:[""],
                rendimiento: [], 
                montoAhorrado: []});
        }else{
            let periodos = months/9;
            
            let multipleResult = multipleCalc(periodos+5, porcentajeFijo, beneficio, monto);
            let mesesBarra = [];
            let rendimientoBarra = [];
            let montoAhorradoBarra = [];
            let totalesPorPeriodoBarra = [];
            for (let index = 0; index < multipleResult.length; index++) {
                mesesBarra.push(9*(index+1) + " meses");
                rendimientoBarra.push(roundToTwo(multipleResult[index][2]));
                montoAhorradoBarra.push(roundToTwo(multipleResult[index][6]));
                totalesPorPeriodoBarra.push("$"+ (roundToTwo(parseInt(multipleResult[index][2]) + parseInt(multipleResult[index][6]))).toLocaleString() );
            }
            setDataBarra({
                meses: mesesBarra.reverse(),
                rendimiento: rendimientoBarra.reverse(), 
                montoAhorrado: montoAhorradoBarra.reverse(),
                totalesPorPeriodo : totalesPorPeriodoBarra.reverse()});
        }
    }

    function multipleCalc(periodos, porcentajeFijo, beneficio, monto){

        let result = [];
        for (let index = 0; index < periodos; index++) {
            let rendimiento = monto * porcentajeFijo / 100; 
            let porcentajeMontos = details.txtAmount1;
            if(monto>=50000 && monto<=149999 ){
                porcentajeMontos=details.txtAmount2;
            }
            if(monto>=150000 && monto<=349999 ){
                porcentajeMontos=details.txtAmount3;
            }
            if(monto>=350000 && monto<=1999999 ){
                porcentajeMontos=details.txtAmount4;
            }
            if(monto>=2000000){
                porcentajeMontos=details.txtAmount5;
            }
            rendimiento = rendimiento * porcentajeMontos / 100;
            let bonificacion= rendimiento * beneficio / 100;
            let rendimientoTotal= bonificacion + rendimiento;
            let porcentajeRendimiento=rendimientoTotal/monto*100;
            let porcentajeRendimientoMensual=porcentajeRendimiento/9;
            let ayuda=rendimientoTotal * details.txtAmountDonate/100;
            result.push([rendimiento, bonificacion, rendimientoTotal, 
                porcentajeRendimiento, porcentajeRendimientoMensual, ayuda, monto]);
            monto= parseInt(monto) + parseInt(rendimientoTotal);
        }
       
        return  result;
    }

    function roundToTwo(num) {
        return +(Math.round(num + "e+2")  + "e-2");
    }
    
    const [dataBarra, setDataBarra] = useState({
        meses:[], rendimiento: [], montoAhorrado: []
      });
    
    useEffect(() => {
        simular();
    }, [rawValue, planValue, months]);
    
    ////////////////////
    useEffect(() => {
        //Axios.get("http://localhost/apisimulador/simuladorui_get.php").then((response) => {
        Axios.get("https://apisimulador.gannamas.mx/simuladorui_get.php").then((response) => {

          let screenconfigParam = JSON.parse(response.data)
          //let screenconfigParam = JSON.parse(response.data[0]['screenconfig'])
          //console.log(screenconfigParam);
          setDetails({
            txtPlanClasico: screenconfigParam['txtPlanClasico']['porcentajeFijo'],
            txtPlanClasicoBeneficio: screenconfigParam['txtPlanClasico']['bonificacion'],
            txtPlanClasicoCondiciones: replaceLine(screenconfigParam['txtPlanClasico']['condiciones']),
            txtPlanPro: screenconfigParam['txtPlanPro']['porcentajeFijo'],
            txtPlanProBeneficio: screenconfigParam['txtPlanPro']['bonificacion'],
            txtPlanProCondiciones: replaceLine(screenconfigParam['txtPlanPro']['condiciones']),
            txtPlanMaster: screenconfigParam['txtPlanMaster']['porcentajeFijo'],
            txtPlanMasterBeneficio: screenconfigParam['txtPlanMaster']['bonificacion'],
            txtPlanMasterCondiciones: replaceLine(screenconfigParam['txtPlanMaster']['condiciones']),
            txtVigencia: replaceLine(screenconfigParam['txtVigencia']['value']),
            txtCondiciones: replaceLine(screenconfigParam['txtCondiciones']['value']),
            txtAmount1: screenconfigParam['txtAmount1']['value'],
            txtAmount2: screenconfigParam['txtAmount2']['value'],
            txtAmount3: screenconfigParam['txtAmount3']['value'],
            txtAmount4: screenconfigParam['txtAmount4']['value'],
            txtAmount5: screenconfigParam['txtAmount5']['value'],
            txtAmountDonate: screenconfigParam['txtAmountDonate']['value'],
          });
        })
      }, [])

      const replaceLine = (text) => {
        return text.replace(/##/g, "\n");
      }

      const ColorButton = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText(purple[500]),
        backgroundColor: purple[500],
        '&:hover': {
          backgroundColor: purple[700],
        },
      }));
     
    return (
        <div>
            <div className="row">
                <img src={imgOndas} className="ondas"  alt="gannamassimulador"></img>
            </div>
            <div className="row text-center p-4 simulador">
                <h1 className="title">Simula tu inversión en Ganna + con causa</h1>
            </div>
            <div className="row ps-5 pe-5 pb-5 pt-4 header">
                <div className="col-md-2">
                </div>
                <div className="col-md-4 pe-3">
                    <div className="row text-center pt-4 pb-4">
                        <label className="labelTitleBlue">Calcula tus Rendimientos</label>
                    </div>
                    <div className="row pb-3">
                        <label className="labelInstrucciones">Solo ingresas el monto a invertir y seleccionas el plan Gannador deseado para saber el rendimiento a recibir.</label>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <label>Monto Inicial:</label>
                        </div>
                        <div className="col-md-8">
                            <CurrencyInput
                                id="validation-example-2-field"
                                placeholder="$0"
                                allowDecimals={false}
                                className={`form-control ${className}`}
                                onValueChange={validateValue}
                                prefix={'$'}
                                step={10}
                            />
                        </div>
                        <label className="labelError">{errorMessage}</label>
                    </div>

                    <div className="row mt-2">
                        <div className="col-md-4">
                            <label>Plan:</label>
                        </div>
                        <div className="col-md-8">
                            <Select name="planlist" 
                            options={planlist} 
                             onChange={planHandler} 
                             defaultValue={planlist[0] || 'Select'}></Select>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-md-4">
                        </div>
                        <div className="col-md-8">
                            <label className="labelCondiciones">{planDetails || planlist[0].condiciones}</label>
                        </div>
                    </div>
                    
                    <div className="row mt-3 divPurple text-center">
                        <label className="labelWitheBold">Simulador primer periodo</label>
                    </div>
                    <div className="row mt-2">
                        <div className="col-md-9">
                            <label className="labelBlue">Rendimiento Pesos MXN:</label>
                        </div>
                        <div className="col-md-3 text-right">
                            <label className="labelBlue" style={{ width:"100%" ,  display: "inline-block", textAlign: "right", fontWeight:"bold"}}>${results.rendimiento || "0"}</label>    
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-9">
                            <label className="labelBlue">Bonificación Especial ***</label>
                        </div>
                        <div className="col-md-3 text-right">
                            <label className="labelBlue" style={{ width:"100%" ,  display: "inline-block", textAlign: "right", fontWeight:"bold"}} >${results.bonificacion || "0"}</label>    
                        </div>
                    </div>
                    <div className="row divPurple">
                        <div className="col-md-9">
                            <label className="labelWithe">Rendimiento Total *</label>
                        </div>
                        <div className="col-md-3 text-right">
                            <label className="labelWithe" style={{ width:"100%" ,  display: "inline-block", textAlign: "right", fontWeight:"bold"}}>${results.rendimientoTotal || "0"}</label>    
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-9">
                            <label className="labelPurple">% Rendimiento *</label>
                        </div>
                        <div className="col-md-3 text-right">
                            <label className="labelPurple" style={{ width:"100%" ,  display: "inline-block", textAlign: "right", fontWeight:"bold"}}>{results.porcentajeRendimiento || "0"}%</label>    
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-9">
                            <label className="labelPurple">% Rendimiento Mensual*</label>
                        </div>
                        <div className="col-md-3 text-right">
                            <label className="labelPurple" style={{ width:"100%" ,  display: "inline-block", textAlign: "right", fontWeight:"bold"}}>{results.porcentajeRendimientoMensual || "0"}%</label>    
                        </div>
                    </div>
                    <div className="row divPurpleLight">
                        <div className="col-md-9">
                            <label className="labelPurple">Ayuda para el Pequeño Gannador que donará Ganna +</label>
                        </div>
                        <div className="col-md-3">
                            <label className="labelPurple" style={{ width:"100%" ,  display: "inline-block", textAlign: "right", fontWeight:"bold"}}>${results.ayuda}</label>    
                        </div>
                    </div>
                    <div className="row pt-5">
                        <div className="col-md-4">
                            <label  className="form-label">Proyección meses:**</label>
                        </div>
                        <div className="col-md-8">
                            {/* <input id="meses" className="form-range" type="range" /> 
                                                <output>9</output>
                            */}
                            <Slider
                                aria-label="Temperature"
                                defaultValue={9}
                                getAriaValueText={valuetext}
                                valueLabelDisplay="auto"
                                step={9}
                                marks
                                min={9}
                                max={90}
                                onChange={monthsHandler}
                            />
        
                        </div>
                    </div>
                    
                </div>
                <div className="col-md-4 ps-3">
                    <div className="row text-center pb-2">
                        <label className="labelTitleBlue">Ahorra + Invierte + Ganna +</label>
                    </div>
                    <div className="row text-center p-4">
                        <img src={imginvierte}  alt="invierte"/>
                    </div>
                    <div className="row">
                        <label name="txtCondiciones" className="labelNotas">{details.txtCondiciones}</label>
                    </div>
                    <div className="p-3 text-end">
                        <label className="labelVigencia">{details.txtVigencia}</label> 
                    </div>
                </div>
                <div className="col-md-2">
                </div>
                
            </div>
            <div className="row simulador p-3">
                <div className="col-md-2">
                </div>
                <div className="col-md-8">
                    <Barchart data={dataBarra} />
                </div>
                <div className="col-md-2">
                </div>
              
                
            </div>
            <div className="row text-center mt-4 ms-5 me-5">
                <div className="col-md-12">
                <ColorButton variant="contained" 
                    href="https://api.whatsapp.com/send?phone=525575818041&text=Hola%2C%20me%20interesan%20los%20servicios%20de%20inversiones%20Ganna%20%2B%20con%20causa%20y%20Seguros.%20Me%20proporcionan%20m%C3%A1s%20info%20por%20favor." 
                    target="_blank"
                    style={{minWidth: '80px', minHeight: '50px',  textTransform: 'none'}}>
                    ¿Quieres Invertir? Contacta a uno de nuestros asesores.</ColorButton>
                </div>
               
            </div>
            <div className="row text-center  ms-5 me-5">
                <div className="col-md-12">
                <img src={logo} className="logo"  alt="logogannamas"></img>
                </div>
               
            </div>
            <div className="row text-center ms-5 me-5">
                <p>
                    <a  href="https://gannamas.mx/"  style={{ textDecoration: 'none'}} ><span className="menu-footer menu-blue "> Inicio  </span></a> . 
                    <a href="https://gannamas.mx/ganna-con-causa" style={{ textDecoration: 'none'}}><span className="menu-footer menu-purple"> Seguros </span></a> . 
                    <a href="tel:5588517873" style={{ textDecoration: 'none'}}><span className="menu-footer menu-blue"> Contactanos </span></a> . 
                    <a href="https://api.whatsapp.com/send?phone=525575818041&amp;text=Hola%2C%20me%20interesan%20los%20servicios%20de%20inversiones%20Ganna%20%2B%20con%20causa%20y%20Seguros.%20Me%20proporcionan%20m%C3%A1s%20info%20por%20favor." style={{ textDecoration: 'none'}}><span className="menu-footer menu-purple"> WhatsApp </span></a> . 
                    <a href="https://gannamas.mx/aviso-de-privacidad" style={{ textDecoration: 'none'}}><span className="menu-footer menu-blue"> Aviso de Privacidad </span> </a>
                </p>  
            </div>
            <div className="row text-center ms-5 me-5">
                <p><a href="https://www.facebook.com/gannamass/"><FacebookIcon sx={{ fontSize: 35  }}></FacebookIcon></a> <span>   </span> 
                <a href="https://www.instagram.com/gannamass/"><InstagramIcon sx={{ fontSize: 35  }}></InstagramIcon></a></p>
            </div>
            <div className="row ms-5 me-5">
                <div className="col-md-2"></div>
                <div className="col-md-8">
                    <p className="footer-p"><span className="footer-text">⁽¹⁾ Esta proyección tiene la finalidad de orientar sobre posibles resultados y no debe ser entendida como un indicador de rendimientos garantizados, cifras antes de impuestos.
                    </span></p><p className="footer-p"><span className="footer-text">⁽²⁾ El plazo es un promedio estimado.
                    </span></p><p className="footer-p"><span className="footer-text">⁽³⁾ El pequeño Gannador o Fundaciones deben cumplir ciertos requisitos para su registro y poder recibir la ayuda de Ganna + con causa.
                    </span></p><p className="footer-p"><span className="footer-text">⁽⁴⁾ La ayuda que se entrega es independiente a los rendimientos que recibe el inversionista y la absorbe Ganna + con causa.</span></p>
                </div>
                <div className="col-md-2"></div>
            </div>
            
           
            {/* <FloatingWhatsApp 
            phoneNumber="+52557581 8041"
            accountName="Ganna +"
            allowEsc
            allowClickAway
            notification
            notificationSound
            statusMessage=""
            chatMessage="Hola, te interesan los servicios de inversiones Ganna + con causa y Seguros."
            avatar={logo}/> */}
    
<a href="https://api.whatsapp.com/send?phone=525575818041&amp;text=Hola%2C%20me%20interesan%20los%20servicios%20de%20inversiones%20Ganna%20%2B%20con%20causa%20y%20Seguros.%20Me%20proporcionan%20m%C3%A1s%20info%20por%20favor." className="float" target="_blank">
<i className="my-float"><WhatsappIcon sx={{ fontSize: 45  }}></WhatsappIcon></i> 

</a>
        </div>
    );
}

export default Simulador;
