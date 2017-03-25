import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import BarChart from '../components/BarChart';
import data from '../data';
import { mergeCompany } from '../ducks/stocks';
import { Map } from 'immutable';

// const yieldArray = stocks.getIn([stock, 5, 'Sparkline'], new List());

class View extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    stocks: PropTypes.object.isRequired,
    mergeCompany: PropTypes.func.isRequired
  };

  setCompany = (manipulableLine) => {
    const shortName = this.props.params.company;
    this.props.mergeCompany(shortName, {
      lsParams: manipulableLine
    });
  }

  render () {
    const { stocks } = this.props;
    const shortName = this.props.params.company;
    const staticStockData = data.get(shortName);
    const dynamicStockData = stocks.get(shortName, Map());

    const earnings = staticStockData.get('earnings');
    const originalLsFit = staticStockData.get('lsParams');

    const compbinedData = staticStockData.mergeDeep(dynamicStockData);
    const lsParams = compbinedData.get('lsParams');

    return (
      <div>
        <h1>
          <Link to='/stock-prediction'>Back</Link>
          {' ' + staticStockData.get('Name')}
        </h1>
        <BarChart
          width={400}
          height={400}
          bars={earnings.toJS()}
          line={originalLsFit.toJS()}
          manipulableLine={lsParams.toJS()}
          onChange={this.setCompany}
        />
        <hr />
        <Link to='/stock-prediction'>Back To Home View</Link>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    stocks: state.stockReducer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    mergeCompany: bindActionCreators(mergeCompany, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(View);
