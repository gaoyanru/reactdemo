import React from 'react'
import style from '@/config/style'
console.log(style.bgColorPrimary)
const Title = function(props){
  const s = {
    background: style.bgColorPrimary,
    color: '#fff',
    lineHeight: '35px',
    fontSize:'18px',
    padding: '0 12px'
  }
  return (<div style={s}>{props.title}</div>)
}

export default Title;
