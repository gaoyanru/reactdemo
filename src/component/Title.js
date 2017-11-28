import React, { Component } from 'react'

const Title = function(props){
  var style = {
    background: 'rgb(103, 134, 149)',
    color: '#fff',
    lineHeight: '35px',
    fontSize:'18px',
    padding: '0 12px'
  }
  return (<div style={style}>{props.title}</div>)
}

export default Title;
