import React  from "react";
import Chart from 'chart.js'

export default class DonutChart extends React.Component{
    constructor(props){
        super(props);
        this.goal = props.cost;
        this.chartRef = React.createRef();
        this.project_data = props.data;
        if(props.data === null){
            this.project_data = {};
        }
        

        this.data= {
           "datasets":[{
               data: [],
               backgroundColor: []
           }],
           "labels": [],
           
        };
    }

    componentWillReceiveProps(nextProps) {
        this.goal = nextProps.cost;
        this.chartRef = React.createRef();
        this.project_data = nextProps.data;

        this.data= {
            "datasets":[{
                data: [],
                backgroundColor: []
            }],
            "labels": [],
            
         };  
         
      }

    componentDidMount(){
        
        var total = 0;
        var hidden_amount = 0;

        Object.keys(this.project_data).forEach((key, index) => {
            total += this.project_data[key].amount;
            if((this.project_data[key].anon)){
                hidden_amount += (this.project_data[key].amount);
            }
            else{
                this.data["datasets"][0]["data"].push(this.project_data[key].amount);
                this.data["datasets"][0]["backgroundColor"].push(this.getRandomColor());
                this.data["labels"].push(key);
            } 
        })
        if(hidden_amount){
            this.data["datasets"][0]["data"].push(hidden_amount);
            this.data["datasets"][0]["backgroundColor"].push("#000");
            this.data["labels"].push("HIDDEN");
        }
    
       
        if(total < this.goal){
            this.data["datasets"][0]["data"].push(this.goal - total);
            this.data["labels"].push("REMAINING")
        }
        const myChartRef = this.chartRef.current.getContext("2d");

        new Chart(myChartRef, {
            type: "doughnut",
            data: this.data,
        })
    }
    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

    render(){
        return <canvas ref={this.chartRef} id="donutChart" />
    }
}