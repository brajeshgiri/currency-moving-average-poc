import React, { Component } from 'react';
import generateChart from "../utilities/utils"
import "./LineChart.css";

class LineChart extends Component {
  constructor(props) {
    super(props);
    this.update = null;
  }

  componentDidMount() {
    this.update = generateChart(this.props.id);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      const data = this.props.data.map((d, i) => ({ x: i, y: d }));
      this.update(data);
    }
  }

  shouldComponentUpdate(nextProps) {
    return false;
  }

  render() {
    return <div id={this.props.id}></div>

  }
}

export default LineChart;