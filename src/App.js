import React from 'react';
import './App.css';
import axios from 'axios';
import MovingAverage from './components/MovingAverage';
import { CURRECY_TYPE_URI } from './utilities/uriConstants';
class App extends React.Component {
    state = {
        currencies: []
    }

    componentDidMount() {
        axios.get(CURRECY_TYPE_URI).then(res => {
            const currencies = res.data.map(curr => {
                return {
                    value: curr.currency_name,
                    text: `${curr.currency_name.substring(0, 3)}/${curr.currency_name.substring(3, curr.length)}`
                }
            })
            this.setState({ currencies });
        });
    }
    render() {
        const { currencies } = this.state;
        if (currencies.length === 0) {
            return "Loading";
        }

        return <div className="div-table">
            <div className="div-table-row">
                <div className="div-table-col">
                    <MovingAverage id="char1" currencies={currencies} />
                </div>
                <div className="div-table-col">
                    <MovingAverage id="char2" currencies={currencies} />
                </div>
            </div>
            <div className="div-table-row">
                <div className="div-table-col">
                    <MovingAverage id="char3" currencies={currencies} />
                </div>
                <div className="div-table-col">
                    <MovingAverage id="char4" currencies={currencies} />
                </div>
            </div>
        </div>
    }
}

export default App;
