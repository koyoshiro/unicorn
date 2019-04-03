import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {

    constructor(prop){
        super();
    }

    render () {
      
      const { actions,dispatch } = phxA.VIEW_MODEL;
      const { count,result } = phxA.VIEW_MODEL.state;
  
      return (<React.Wrapper>
        <span>{count}</span>
        <span>{result}</span>
        <div>
          <button onClick={() => dispatch(actions.add)}>add</button>
          <button onClick={() => dispatch(actions.minus)}>minus</button>
          <button onClick={() => dispatch(actions.asyncAdd)}>async</button>
          <button onClick={() => dispatch(actions.asyncRequire)}>async</button>
  
        </div>
      </React.Wrapper>);
    }
  }
  
  ReactDOM.render(<App />, document.getElementById('root'));