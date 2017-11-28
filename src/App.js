import React, { Component } from 'react';
import LeftMenu from './container/LeftMenu'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
// import ContractManage from './pages/contract/manage';
import { connect } from 'react-redux'
const pagesMap = {
  'contract_manage' : 'contract/manage',
  'user_my': 'system/myInfo'
}
 

class App extends Component {
  render() {
    let funs = [];
    this.props.functions.forEach(f=>{
      funs = funs.concat(f.Children);
    });
    funs = funs.map(f=>{
      const key = f.FunctionKey.replace('main.','');
      try{
        if(pagesMap[key]){
          return {
            key: key,
            path:'/main/'+key,
            functions: f.Children,
            component: require('@/pages/' + pagesMap[key])
          }
        }else{
          return false
        }
        
      } catch(error) {
        return false
      }
    })
    funs = funs.filter(f=>!!f)
    const routers = funs.map((fun,index)=>{
      const Com = fun.component.default;
      return (<Route strict  path={fun.path} render={(args)=>(<Com {...args} functions={fun.functions}/>)} key={fun.key} />)
    })
    return (
      <div className="App" >
        <div className="App-header">
          <h4>
            <svg width="50" height="40" xmlns="http://www.w3.org/2000/svg" className="pull-left">
             <g>
              <g display="none" overflow="visible" y="0" x="0" height="100%" width="100%" id="canvasGrid">
               <rect fill="url(#gridpattern)" strokeWidth="0" y="0" x="0" height="100%" width="100%"/>
              </g>
             </g>
             <g>
              <title>Layer 1</title>
              <rect id="svg_1" height="40" width="16" y="-0.25" x="0" strokeWidth="0" fill="#c6181e"/>
              <rect id="svg_2" height="21" width="133" y="94" x="165.5" strokeWidth="0" fill="#c6181e"/>
              <rect id="svg_4" height="21" width="31" y="0" x="0" strokeOpacity="null" strokeWidth="0"  fill="#c6181e"/>
              <rect id="svg_5" height="19" width="16" y="21" x="35" strokeOpacity="null" strokeWidth="0"  fill="#c6181e"/>
             </g>
            </svg>
            <span data-v-62282f71="" className="title">噼里啪管理系统</span>
          </h4>
        </div>
        <Router>
          <div className="App-content">
            <LeftMenu/>
            <div style={{flex:1}}>
                {routers}
                <Route exact path="/main" render={props=>(<div> "hello" </div>)}/>
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    functions: JSON.parse(state.user.FunctionList),
  }
}
export default connect(
  mapStateToProps
)(App);