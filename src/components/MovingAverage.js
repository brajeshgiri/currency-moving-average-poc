import React, { memo } from 'react';
import './MovingAverage.css';
import LineChart from "./LineChart";
import createSocketConnection from "../utilities/socket";

const Select = memo(({ currencies, onChange }) => (
    <select onChange={onChange} id="currency">
        {currencies.map(currency => {
            return <option value={currency.value} key={currency.value}>{currency.text}</option>
        })}
    </select>
));

class MovingAverage extends React.Component {

    constructor(props) {
        super(props);
        this.socket = null;
        this.state = {
            data: [],
            movingAverage: 0,
            currentValue: 0,
            percentage: 0
        }
    }

    componentDidMount() {
        const { currencies } = this.props;
        this.setState({ currencies });
        this.sendMessage({ target: { value: currencies[0].value } })

    }

    addMessage = currentValue => {
        const data = [...this.state.data, currentValue];
        if (data.length > 10) {
            data.shift();
        }
        const sum = data.reduce((a, b) => a + b);
        const movingAverage = sum / data.length;
        const percentage = (((movingAverage - currentValue) * 100) / currentValue).toFixed(2);
        this.setState(state => ({ data, movingAverage, currentValue, percentage }))
    }


    sendMessage = e => {
        if (this.socket) {
            this.socket.close();
        }
        this.setState({ data: [], movingAverage: 0, currentValue: 0, percentage: 0 });

        const value = e.target.value;
        if (value) {
            createSocketConnection(socket => {
                this.socket = socket;
                socket.send(JSON.stringify({ "currencyPair": value }));
            }, this.addMessage);
        }
    }


    render() {
        const { movingAverage, currentValue, percentage, data } = this.state;
        const { id, currencies } = this.props;
        const boxColorStyle = {
            "backgroundColor": movingAverage < currentValue ? 'red' : 'green',
            "filter": `brightness(${10 * Math.abs(percentage) + 50}%)`
        }
        return (
            <div className="ma-container" style={boxColorStyle}>
                <div className="ma-current-val">
                    <div className="ma-currency">
                        <Select currencies={currencies} onChange={this.sendMessage} ></Select>
                    </div>
                    <div className="ma-avg-value">{movingAverage.toFixed(4)}</div>
                </div>
                <div className="ma-percentage">
                    <span> {Number(percentage) >= 0 ? `+${percentage}` : percentage}%</span>
                </div>
                <div className="col-md-11 ma-chart">
                    <LineChart data={data} id={id}></LineChart>
                </div>
            </div>)
    }

}

export default MovingAverage;
