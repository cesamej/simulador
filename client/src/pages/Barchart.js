import React, { Component } from "react";
import createPlotlyComponent from 'react-plotlyjs';
import Plotly from 'plotly.js/dist/plotly-cartesian';
const PlotlyComponent = createPlotlyComponent(Plotly);

class Barchart extends Component {

    render() {

        var annotations = [];
        if(this.props.data.totalesPorPeriodo !== undefined){
            for (let index = 0; index < this.props.data.totalesPorPeriodo.length; index++) {
            
                annotations.push({ 
                                    x: parseInt(this.props.data.rendimiento) + parseInt(this.props.data.montoAhorrado) + 40000,
                                    y: this.props.data.meses[index],
                                    text: this.props.data.totalesPorPeriodo[index],
                                    xanchor: 'center',
                                    yanchor: 'bottom',
                                    showarrow: false,
                                    font: {'size': 13, 'color': 'rgba(131, 75, 152, 1)'}})    
            }
        }
        
        var montoahorradoText = [];
        if(this.props.data.montoAhorrado!== undefined){
            for (let index = 0; index < this.props.data.montoAhorrado.length; index++) {
                montoahorradoText.push("$" + roundToTwo(this.props.data.montoAhorrado[index]).toLocaleString());
            }
        }
        var rendimientoText = [];
        if(this.props.data.rendimiento!== undefined){
            for (let index = 0; index < this.props.data.rendimiento.length; index++) {
                rendimientoText.push("$" + roundToTwo(this.props.data.rendimiento[index]).toLocaleString());
            }
        }
        function roundToTwo(num) {
            return +(Math.round(num + "e+2")  + "e-2");
        }
        

        var trace1 = {
            x: this.props.data.montoAhorrado,
            y: this.props.data.meses,
            name: 'Monto ahorrado',
            type: 'bar',
            marker:{
                color:'rgba(131, 75, 152, 1)',
                opacity: 0.6,
            },
            text: montoahorradoText,
            orientation: 'h'
        };

        var trace2 = {
            x: this.props.data.rendimiento,
            y: this.props.data.meses,
            name: 'Rendimiento',
            type: 'bar',
            marker:{
                color: 'rgba(0, 126, 180, 1)',
                opacity: 0.6,
            },
            text: rendimientoText,
            orientation: 'h'
        };

        var data = [trace1, trace2];

        

        let layout = {                     // all "layout" attributes: #layout
            title: 'Proyección Inversión',  // more about "layout.title": #layout-title
            barmode: 'stack',
            // xaxis: {                  // all "layout.xaxis" attributes: #layout-xaxis
            //     title: 'Meses'         // more about "layout.xaxis.title": #layout-xaxis-title
            // },
            // xaxis: {'fixedrange':true},
            // yaxis: {'fixedrange':true}
            annotations: annotations,
            showlegend : true,
            legend : {
                orientation:"h",
                yanchor:"bottom",
                y:1,
                xanchor:"right",
                x:1
            },
            
        };
        // , 'zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d' 
        let config = {
            showLink: false,
            displayModeBar: true,
            modeBarButtonsToRemove: ['sendDataToCloud', 'autoScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian', 'lasso2d', 'select2d'],
            displaylogo: false, 
            showTips: false 
        };
        
        return (
            <div>
                <PlotlyComponent className="whatever" data={data} layout={layout} config={config} />
            </div>
            
        );
    }
}

export default Barchart;